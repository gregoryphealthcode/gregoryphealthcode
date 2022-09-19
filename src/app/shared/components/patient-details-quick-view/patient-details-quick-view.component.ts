import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { Address } from '../../services/contact.service';
import { PatientService, PatientBalanceViewModel, PatientMainInsurerViewModel, BasicPatientDetailsViewModel } from '../../services/patient.service';
import { forkJoin } from 'rxjs';
import { AppointmentService, AppointmentViewModel } from '../../services/appointment.service';
import { PatientTelecom, PatientReferenceNumber, AppInfoService } from '../../services';
import { Router } from '@angular/router';
import { UserStore } from '../../stores/user.store';

@Component({
  selector: 'app-patient-details-quick-view',
  templateUrl: './patient-details-quick-view.component.html',
  styleUrls: ['./patient-details-quick-view.component.scss']
})
export class PatientDetailsQuickViewComponent implements OnInit {
  colour = 'primary';
  @Output() addAppointment = new EventEmitter<any>();
  @Output() addToWaitingList = new EventEmitter<any>();
  @Output() patientSelected = new EventEmitter<string>();
  @Output() createInvoice = new EventEmitter<any>();
  @Output() medSecAddToSpecialist = new EventEmitter<any>();

  @Input() showAddAppointment: boolean = true;
  @Input() showNewInvoice: boolean = true
  @Input() showTopButtons = true;
  public medSecView = false;
  @Input() compactMode: boolean;
  @Input() showAvatar = true;
  @Input() set patient(value: any) {
    if (value) {
      this._patient = value;
      this.patientId = value.patientId;
      this.getData();
    }
  }
  get patient() { return this._patient; }
  hideButtons = false;
  _patient: any;

  public primaryAdress: Address;
  public billingAdress: Address;
  public patientBalance: PatientBalanceViewModel = new PatientBalanceViewModel();
  public insurer: PatientMainInsurerViewModel;
  public telecoms: PatientTelecom[] = [];
  public referenceNumbers: PatientReferenceNumber[] = [];
  public nextApt: AppointmentViewModel = new AppointmentViewModel();
  public patientDetails: BasicPatientDetailsViewModel;
  public showPrimaryAddress = true;
  public balance: string;
  public warningNoteCount;

  private patientId: string;
  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    public appInfo: AppInfoService,
    private cd: ChangeDetectorRef,
    private userStore: UserStore) { }

  ngOnInit() {
    this.medSecView = this.userStore.isMedSecUser();
  }

  onPatientSelected() {
    this.patientSelected.emit(this.patientId);
  }

  private getData() {
    forkJoin([
      this.patientService.getPatientBalance(this.patientId),
      this.patientService.getPatientTelecoms(this.patientId),
      this.patientService.getPatientReferenceNumbers(this.patientId),
      this.patientService.getAddresses(this.patientId),
      this.appointmentService.getNextAppointment(this.patientId),
      this.patientService.getPatientMainInsurer(this.patientId),
      this.patientService.getBasicPatientDetails(this.patientId)
    ]).subscribe(([balance, telecoms, referenceNumbers, address, nextApt, insurer, patient]) => {
      this.telecoms = telecoms;
      this.patientBalance = balance;
      this.referenceNumbers = referenceNumbers;
      this.setAddresses(address);
      this.nextApt = nextApt;
      this.insurer = insurer;
      this.patientDetails = patient;
      this.cd.markForCheck();
    });

    this.patientService.getNotes(this.patientId).subscribe(notes => {
      this.warningNoteCount = notes.filter(x => x.warning).length;
    });
  }

  private setAddresses(addresses: Address[]) {
    if (addresses.length == 0) {
      this.billingAdress = null;
      this.primaryAdress = null;
    }
    else {
      for (const i in addresses) {
        if (addresses[i].billingAddress === true) {
          this.billingAdress = addresses[i];
          break;
        }
      }

      for (const i in addresses) {
        if (addresses[i].primaryAddress === true) {
          this.primaryAdress = addresses[i];
          break;
        }
      }
    }
  }

  showMenu() {
    if (this.hideButtons === true) {
      this.hideButtons = false;
    }
    else {
      this.hideButtons = true;
    }
  }
}
