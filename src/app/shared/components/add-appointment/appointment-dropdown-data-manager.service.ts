import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { merge } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SpecialistViewModel } from '../../models/SpecialistViewModel';
import { SubSpeciality } from '../../models/SubSpeciality';
import { PatientDetails } from '../../services';
import { AppointmentListViewModel, AppointmentService, AppointmentTypes, TemplateListItem } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';
import { PatientStatus, TranslatorLanguages, UserService } from '../../services/user.service';
import { WaitingListService } from '../../services/waiting-list-service';
import { SitesStore } from '../../stores/sites.store';

@Injectable()
export class AppointmentDropdownDataManagerService {
  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private waitingListService: WaitingListService,
    private siteStore: SitesStore) { }

  patient = new PatientDetails();
  patientName: string;
  onStop = false;
  isOnWaitingList = false;
  selectedSpecialistDisplayName: string;
  patientStatus: PatientStatus[] = [];
  translatorLanguages: TranslatorLanguages[] = [];
  appointmentOwnerTypes: AppointmentTypes[] = [];
  locations: AppointmentListViewModel[] = [];
  letterTemplates: TemplateListItem[] = [];
  emailTemplates: TemplateListItem[] = [];
  smsTemplates: TemplateListItem[] = [];
  letterDefault = false;
  emailDefault = false;
  smsDefault = false;
  owners: SpecialistViewModel[];
  appointmentTypes: AppointmentTypes[] = [];

  public setup() {
    this.getPatientStatus();
    this.getTranslatorLanguages();
  }

  public getTemplates$(editForm) {
    return this.appointmentService.getConfirmationTemplates().pipe(
      tap((data) => {
        if (data.useDefaultConfirmationEmail)
          this.emailDefault = true;

        if (data.useDefaultConfirmationLetter)
          this.letterDefault = true;

        if (data.useDefaultConfirmationSms)
          this.smsDefault = true;

        this.letterTemplates = data.letterTemplates;
        this.emailTemplates = data.emailTemplates;
        this.smsTemplates = data.smsTemplates;

        if (
          data.defaultLetterConfirmation &&
          !this.getFormPropertyValue("letterTemplateId", editForm)
        ) {
          this.setFormPropertyValue(
            "letterTemplateId",
            data.defaultLetterConfirmation, editForm
          );
        }

        if (
          data.defaultEmailConfirmation &&
          !this.getFormPropertyValue("emailTemplateId", editForm)
        ) {
          this.setFormPropertyValue(
            "emailTemplateId",
            data.defaultEmailConfirmation, editForm
          );
        }

        if (
          data.defaultSmsConfirmation &&
          !this.getFormPropertyValue("smsTemplateId", editForm)
        ) {
          this.setFormPropertyValue(
            "smsTemplateId",
            data.defaultSmsConfirmation, editForm
          );
        }
      })
    );
  }

  public getAppointmentTypes$(sessionId?: string) {
    return this.appointmentService.getTypesForAppointments(sessionId).pipe(
      tap((value) => {
        this.appointmentTypes = value;
      })
    );
  }

  public getAppointmentOwners$() {
    return this.userService.getConsultantsForSite().pipe(
      tap((x) => {
        this.owners = x
        this.owners.sort(function (a, b) {
          if (a.displayName < b.displayName) return -1;
          if (a.displayName > b.displayName) return 1;
          return 0;
        });
      })
    );
  }

  public setSpecialistName(id) {
    this.selectedSpecialistDisplayName = this.owners.find((x) => x.id === id).displayName;
  }

  public getAppointmentOwnerTypes$(ownerId) {
    return this.appointmentService.getAppointmentTypes(ownerId).pipe(
      tap((x) => {
        this.appointmentOwnerTypes = x;
      })
    );
  }

  public getLocations$(ownerId: string) {
    return this.appointmentService
      .getAppointmentLocationsForOwner(ownerId)
      .pipe(
        tap((value) => {
          this.locations = value;
        })
      );
  }

  public getPatient$(patientId) {
    return this.patientService
      .getBasicPatientDetails(patientId)
      .pipe(
        tap((data) => {
          this.patientName =
            data.lastName.toUpperCase() + ", " + data.firstName + " " + data.title;
          this.patient = new PatientDetails();
          this.patient.gender = data.gender;
          this.patient.birthDate = data.birthDate;

          this.patient.firstName = data.firstName;
          this.patient.lastName = data.lastName;
          this.patient.birthDate = data.birthDate;
          this.patient.patientId = data.patientId;
          this.patient.title = data.title;
          this.patient.gender = data.gender;
          this.patient.patientAddressesString = data.patientAddressesString;

          this.patient.age = this.calculate_age(new Date(data.birthDate));
        }),
        switchMap(() =>
          merge(this.getPatientBalance(patientId), this.checkIfPatientOnwaitingList(patientId))
        )
      );
  }

  private getFormPropertyValue(controlName: string, editForm: FormGroup) {
      return editForm?.controls[controlName]?.value; 
  }

  private setFormPropertyValue(controlName: string, value: any, editForm: FormGroup) {
    editForm.controls[controlName].patchValue(value);
  }

  private calculate_age(dob) {
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }

  private getPatientBalance(patientId) {
    return this.patientService
      .getPatientBalance(patientId)
      .pipe(
        tap((val) => {
          this.onStop = val.onStop;
        })
      );
  }

  public checkIfPatientOnwaitingList(patientId) {
    return this.waitingListService
      .isPatientOnWaitingList(patientId)
      .pipe(
        tap((value) => {
          this.isOnWaitingList = value;
        })
      );
  }

  private getPatientStatus() {
    this.userService.getPatientStatus().subscribe((value) => {
      this.patientStatus = value;
    });
  }

  private getTranslatorLanguages() {
    this.userService.getTranslatorTypes().subscribe((value) => {
      this.translatorLanguages = value;
    });
  }
}
