import { DatePipe } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetInvoicePayorResponseModel, InvoiceAddEditService } from 'src/app/pages/accounts/invoice-add-edit/invoice-add-edit.service';
import { AppointmentTypesService } from 'src/app/pages/preferences/preferences-appointments/appointment-types.service';
import { requiredIfValidator } from '../../helpers/form-helper';
import { AppInfoService } from '../../services';
import { AppointmentInstructionsViewModel, AppointmentService, AppointmentSlotModel, AppointmentTypes, AppointmentViewModel, GetAppointmentResponseModel, TemplateListItem } from '../../services/appointment.service';
import { PatientDetailsResponseModelNew, PatientService, WaitingListModel } from '../../services/patient.service';
import { TranslatorLanguages, UserService, AppointmentStatusModel } from '../../services/user.service';
import { WaitingListEntryModel, WaitingListService } from '../../services/waiting-list-service';
import { SitePracticeHoursService, WorkDayInputModel } from '../../services/site-practice-hours.service';
import { ReactiveFormBase } from '../../base/reactiveForm.base';
import { forkJoin, } from 'rxjs';
import { pairwise } from 'rxjs/operators';
import { SpinnerService } from '../../services/spinner.service';
import { AppointmentAddEditStoreService } from './appointment-add-edit-store.service';
import { InvoiceServicesStoreService } from '../invoice-services-select/invoice-services-store.service';
import { AppMessagesService } from '../../services/app-messages.service';
import { InvoiceAddEditStoreService } from 'src/app/pages/accounts/invoice-add-edit/invoice-add-edit-store.service';
import { AuthService } from '../../services/auth.service';
import { UserStore } from '../../stores/user.store';

@Component({
  selector: 'app-appointment-popup-add-edit',
  templateUrl: './appointment-popup-add-edit.component.html',
  styleUrls: ['./appointment-popup-add-edit.component.scss'],
  providers: [AppointmentAddEditStoreService, InvoiceServicesStoreService, InvoiceAddEditService, InvoiceAddEditStoreService]
})
export class AppointmentPopupAddEditComponent extends ReactiveFormBase implements OnInit {
  @Input() get patientId(): string {
    return this._patientId;
  }
  set patientId(value: string) {
    this._patientId = value;
    if (value) {
      this.getPatientDetails();
    }
  }

  @Input() get appointmentId(): string {
    return this._appointmentId;
  }
  set appointmentId(value: string) {
    this._appointmentId = value;
    if (value)
      this.isNew = false;
  }

  @Input() waitingListId: string;

  @Input() get fromSession(): boolean {
    return this._fromSession;
  }
  set fromSession(value: boolean) {
    this._fromSession = value;
  }

  @Input() get startDate(): Date {
    return this._startDate;
  }
  set startDate(value: Date) {
    this._startDate;
    if (value) {
      if (new Date(value) < new Date())
        this.pastAppointment = true;
    }
  }

  @Input() ownerId: string;
  @Input() locationId: string;

  @Output() closed = new EventEmitter();
  @Output() waitingListUpdate = new EventEmitter();

  private _patientId;
  private _appointmentId;
  private _fromSession;
  private _startDate;

  isNew = true;
  isEditing = false
  pastAppointment = false;
  sessionBooking = true;
  patient: PatientDetailsResponseModelNew = null;
  appointment: GetAppointmentResponseModel = null;
  waitingListEntry: WaitingListEntryModel;
  waitingList: WaitingListModel[] = [];

  appointmentTypes: AppointmentTypes[] = [];
  appointmentStatuses: AppointmentStatusModel[] = [];

  practitioners: { ownerId: string; ownerName: string }[] = [];
  locations: { locationId: string; locationName: string }[] = [];

  slots: AppointmentSlotModel[] = [];
  workDays: WorkDayInputModel[] = [];

  translatorRequired = false;
  confirmationLetter = false;
  confirmationSMS = false;
  confirmationEmail = false;
  onStop = false;
  onWaitingList = false;

  startDateTime = null;
  dateFormat = "dd/MM/yyyy";

  showPatientWaitingListPopUp = false;

  today = new Date();
  first = null;
  firstSlot = true;

  day1Label = "";
  day1Slots: AppointmentSlotModel[] = [];
  day2Label = "";
  day2Slots: AppointmentSlotModel[] = [];
  day3Label = "";
  day3Slots: AppointmentSlotModel[] = [];
  day4Label = "";
  day4Slots: AppointmentSlotModel[] = [];
  day5Label = "";
  day5Slots: AppointmentSlotModel[] = [];
  day6Label = "";
  day6Slots: AppointmentSlotModel[] = [];
  day7Label = "";
  day7Slots: AppointmentSlotModel[] = [];
  selectedSlot = null;
  slotIndex = null;

  letterTemplates: TemplateListItem[] = [];
  emailTemplates: TemplateListItem[] = [];
  smsTemplates: TemplateListItem[] = [];
  translatorLanguages: TranslatorLanguages[] = [];

  showEditPayor = false;
  payorInvalid = false;
  relatedPayors: GetInvoicePayorResponseModel[] = [];
  payorDetails: GetInvoicePayorResponseModel;

  selectedRecord: any;
  appointmentInstructions: AppointmentInstructionsViewModel;
  instructions: AppointmentInstructionsViewModel[];
  addingInstructions = false;

  constructor(
    public appInfo: AppInfoService,
    private patientService: PatientService,
    private waitingListService: WaitingListService,
    private userService: UserService,
    private appointmentService: AppointmentService,
    private appointmentTypesService: AppointmentTypesService,
    private datepipe: DatePipe,
    private sitePracticeHoursService: SitePracticeHoursService,
    private dataService: InvoiceAddEditService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    public store: AppointmentAddEditStoreService,
    private appMessage: AppMessagesService,
    public userStore: UserStore,
    public authService: AuthService,
  ) {
    super();
  }

  protected httpRequest = x => {
    this.spinnerService.start();
    if (this.isNew) {
      return this.appointmentService.bookAppointment(x);
    }
    else {
      return this.appointmentService.updateAppointment(x);
    }
  }

  protected onSuccessfullySaved = () => {
    if (this.waitingListId) {
      this.waitingListService.removeFromWaitingList(this.waitingListId).subscribe(() => {
        this.waitingListUpdate.emit();
        this.spinnerService.stop();
        this.saved.emit();
      });
    }
    else {
      this.spinnerService.stop();
      this.saved.emit();
    }
  };

  ngOnInit() {
    this.spinnerService.start();
    if (this.startDate)
      this.first = new Date(this.startDate);
    else
      this.first = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 0, 0, 0);

    while (this.first.getDay() != 1) {
      this.first = new Date(this.first.getFullYear(), this.first.getMonth(), this.first.getDate() - 1, 0, 0, 0);
    }

    this.locations.push({
      locationId: '00000000-0000-0000-0000-000000000000',
      locationName: "All Locations",
    });

    this.practitioners.push({
      ownerId: '00000000-0000-0000-0000-000000000000',
      ownerName: "All Practitioners",
    });

    this.setupForm();
    this.getAppointmentStatuses();
    this.getInfo();

    if (this.waitingListId) {
      this.sessionBooking = true;
    }

    this.subscription.add(this.editForm.get('statusId').valueChanges
      .pipe(pairwise()).subscribe(([prev, next]: [any, any]) => {
        if (next && prev != next && !this.submitting) {
          this.appointmentService.updateAppointmentStatus(this.appointmentId, next).subscribe(y => {
            if (y.success)
              this.appMessage.showSuccessSnackBar('Appointment Status Updated');
            else
              this.appMessage.showFailedSnackBar(y.errors[0]);
          },
            e => {
              this.appMessage.showApiErrorNotification(e);
            });
        }
      }));

    this.subscription.add(this.editForm.get('appointmentTypeId').valueChanges.subscribe(x => {
      if (x && !this.submitting && (this.isNew || (this.isEditing && !this.isNew))) {
        if (this.appointment)
          this.editForm.patchValue({ duration: this.appointment.durationMinutes });
        else {
          let duration = this.appointmentTypes.find(y => y.appointmentTypeId == x)?.duration;
          this.editForm.patchValue({ duration: duration });
        }

        this.first = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 0, 0, 0);

        while (this.first.getDay() != 1) {
          this.first = new Date(this.first.getFullYear(), this.first.getMonth(), this.first.getDate() - 1, 0, 0, 0);
        }

        this.editForm.patchValue({ ownerId: '00000000-0000-0000-0000-000000000000' });
        this.editForm.patchValue({ locationId: '00000000-0000-0000-0000-000000000000' });

        if (!this.waitingListEntry)
          this.getSlots(this.sessionBooking);
      }
    }));

    this.subscription.add(this.editForm.get('duration').valueChanges
      .pipe(pairwise()).subscribe(([prev, next]: [any, any]) => {
        if (next && !this.submitting && this.selectedSlot) {
          const callback = () => { }

          const callbackNegative = () => {
            this.editForm.patchValue({ duration: prev });
          }

          let slots = this.slots.filter(y => new Date(y.startDate) > new Date(this.editForm.get('startDateTime').value));
          let end = new Date(new Date(this.getFormPropertyValue('startDateTime')).getTime() + (next * 60000));
          if (slots.find(y => new Date(y.endDate) <= end && this.checkAppointmentsNow(y))) {
            if (this.sessionBooking)
              this.appMessage.showInfoConfirmationModal("Appointment Conflict", "Duration overlaps with another appointment.", callbackNegative);
            else
              this.appMessage.showAskForConfirmationModal("Appointment Conflict", "Duration overlaps with another appointment. Are you sure you want to continue?", callback, callbackNegative);
          }
        }
        if (next && !this.submitting && !this.selectedSlot) {
          this.getSlots(this.sessionBooking);
        }
      }))

    this.subscription.add(this.editForm.get('ownerId').valueChanges.subscribe(x => {
      if (x && x != '00000000-0000-0000-0000-000000000000' && !this.submitting && (this.isNew || (this.isEditing && !this.isNew))) {
        this.getSlots(this.sessionBooking);
      }
    }));

    this.subscription.add(this.editForm.get('locationId').valueChanges.subscribe(x => {
      if (x && x != '00000000-0000-0000-0000-000000000000' && !this.submitting && (this.isNew || (this.isEditing && !this.isNew))) {
        this.getSlots(this.sessionBooking);
      }
    }));

    this.subscription.add(this.editForm.get('payorId').valueChanges.subscribe(x => {
      if (x) {
        this.payorDetails = this.relatedPayors.find(y => y.payorId == x);
        this.editForm.patchValue({ payorType: this.payorDetails?.type })
        this.payorInvalid = this.payorDetails?.invalid;
      }
    }));

    this.subscription.add(this.editForm.get('sessionBooking').valueChanges.subscribe(x => {
      if (x != null) {
        this.sessionBooking = x;
        this.getSlots(this.sessionBooking);
      }
    }))
  }

  setupForm() {
    this.editForm = new FormGroup({
      siteId: new FormControl(null),
      appointmentId: new FormControl(null),
      sessionId: new FormControl(null),
      waitingListId: new FormControl(null),
      patientId: new FormControl(null, Validators.required),
      statusId: new FormControl(null, requiredIfValidator(() => !this.isNew)),
      appointmentTypeId: new FormControl(null, Validators.required),
      duration: new FormControl(null, Validators.required),
      ownerId: new FormControl(null, Validators.required),
      locationId: new FormControl(null, Validators.required),
      startDateTime: new FormControl(null, Validators.required),
      endDateTime: new FormControl(null),
      description: new FormControl(null, Validators.maxLength(100)),
      earlierSlot: new FormControl(false),
      priority: new FormControl(false),
      translatorNeeded: new FormControl(false),
      translatorLanguage: new FormControl(null, requiredIfValidator(() => this.translatorRequired)),
      confirmationLetter: new FormControl(false),
      confirmationText: new FormControl(false),
      confirmationEmail: new FormControl(false),
      letterTemplateId: new FormControl(null, requiredIfValidator(() => this.confirmationLetter)),
      smsTemplateId: new FormControl(null, requiredIfValidator(() => this.confirmationSMS)),
      emailTemplateId: new FormControl(null, requiredIfValidator(() => this.confirmationEmail)),
      payorId: new FormControl(null),
      payorType: new FormControl(null),
      sessionBooking: new FormControl(this.sessionBooking),
    });
  }

  getAppointmentStatuses() {
    this.userService.getAppointmentStatuses().subscribe(data => {
      this.appointmentStatuses = data.filter(x => x.status != 'Reserved');
      this.appointmentStatuses.sort(function (a, b) {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
      });
      this.appointmentStatuses.forEach(element => {
        element.status = element.status.replace(/([A-Z])/g, ' $1').trim();
      })
    })
  }

  getInfo() {
    forkJoin([
      this.appointmentTypesService.getAppointmentTypes(),
      this.appointmentService.getAppointmentOwners(),
      this.appointmentService.getAppointmentLocations(),
      this.sitePracticeHoursService.getCurrentSitePracticeHours(),
      this.appointmentService.getConfirmationTemplates(),
      this.userService.getTranslatorTypes(),
    ]).subscribe(([appointmentTypes, appointmentOwners, appointmentLocations, practiceHours, templates, translatorLanguages]) => {
      this.spinnerService.stop();
      this.appointmentTypes = appointmentTypes;
      this.getAppointmentPractitioners(appointmentOwners);
      this.getAppointmentLocations(appointmentLocations);

      if (this.ownerId && this.sessionBooking)
        this.editForm.patchValue({ ownerId: this.ownerId });
      else
        this.editForm.patchValue({ ownerId: '00000000-0000-0000-0000-000000000000' });

      if (this.locationId && this.sessionBooking)
        this.editForm.patchValue({ locationId: this.locationId });
      else
        this.editForm.patchValue({ locationId: '00000000-0000-0000-0000-000000000000' });

      this.workDays = practiceHours.workDays;
      this.getTemplates(templates);
      this.translatorLanguages = translatorLanguages;
      if (this.appointmentId) {
        this.getAppointmentDetails();
      }
      if (this.waitingListId)
        this.getWaitingListEntry();
    })
  }

  showWaitingList() {
    this.showPatientWaitingListPopUp = !this.showPatientWaitingListPopUp;
    if (this.showPatientWaitingListPopUp)
      this.getWaitingList();
  }

  getWaitingList() {
    this.patientService.getPatientWaitingListEntries(this.getFormPropertyValue('patientId')).subscribe(data => {
      this.waitingList = data;
    })
  }

  newPatient(myPatientId) {
    this.loadPatient(myPatientId);
  }

  loadPatient(myPatientId) {
    this.editForm.patchValue({ patientId: myPatientId });
    this.getPatientDetails();
  }

  editPatient() {
    this.patient = null;
    this.editSlot();
  }


  getPatientDetails() {
    this.patientService.getPatientDetails(this.patientId ? this.patientId : this.getFormPropertyValue('patientId')).subscribe(data => {
      this.patient = data;
      this.editForm.patchValue({ patientId: this.patient.patientId });
      this.getPayors();
    });
  }

  getAppointmentDetails() {
    this.appointmentService.getAppointment(this.appointmentId).subscribe(data => {
      this.appointment = data;
      this.populateForm(data);
      this.editForm.patchValue({ appointmentId: this.appointmentId });
      this.getAppointmentInstructions();
    });
  }

  waitingListSelected(e) {
    this.showPatientWaitingListPopUp = false;
    this.waitingListId = e.data.id;
    this.getWaitingListEntry();
  }

  getWaitingListEntry() {
    this.waitingListService.getWaitingListDetails(this.waitingListId).subscribe(data => {
      this.waitingListEntry = data;
      this.sessionBooking = true;
      this.patientId = data.patientId;
      this.getPatientDetails();
      this.populateForm(data);

      setTimeout(() => { this.editSlot() }, 2000);
    });
  }

  getAppointmentPractitioners(appointmentOwners) {
    this.practitioners.splice(1);

    let tempPractitioners = [];

    appointmentOwners.forEach(element => {
      tempPractitioners.push({ ownerId: element.ownerId, ownerName: element.ownerName });
    });

    tempPractitioners.sort(function (a, b) {
      if (a.ownerName < b.ownerName) return -1;
      if (a.ownerName > b.ownerName) return 1;
      return 0;
    });
    tempPractitioners.forEach(el => {
      if (this.practitioners.find(x => x.ownerId == el.ownerId) == null) {
        this.practitioners.push({
          ownerId: el.ownerId,
          ownerName: el.ownerName,
        })
      }
    })
  }

  getAppointmentLocations(appointmentLocations) {
    this.locations.splice(1);

    let tempLocations = [];

    appointmentLocations.forEach(element => {
      tempLocations.push({ locationId: element.locationId, locationName: element.locationName });
    });

    tempLocations.sort(function (a, b) {
      if (a.locationName < b.locationName) return -1;
      if (a.locationName > b.locationName) return 1;
      return 0;
    });
    tempLocations.forEach(el => {
      if (this.locations.find(x => x.locationId == el.locationId) == null) {
        this.locations.push({
          locationId: el.locationId,
          locationName: el.locationName,
        })
      }
    })
  }

  getSlots(sessionBooking: boolean) {
    if (this.getFormPropertyValue('patientId') == null || this.slotIndex || this.getFormPropertyValue('appointmentTypeId') == null || (this.sessionBooking == false && (this.getFormPropertyValue('locationId') == '00000000-0000-0000-0000-000000000000' || this.getFormPropertyValue('ownerId') == '00000000-0000-0000-0000-000000000000')))
      return;

    this.spinnerService.start();
    this.appointmentService.getAvailableSlots(sessionBooking, this.editForm.get('appointmentTypeId').value, this.editForm.get('duration').value, this.first, this.editForm.get('ownerId').value, this.editForm.get('locationId').value).subscribe(data => {
      this.slots = data;

      if (this.slots.length > 0) {
        let day = new Date(this.first);
        let last = new Date(this.first.getFullYear(), this.first.getMonth(), this.first.getDate() + 7, 23, 59, 59);

        while (this.slots.filter(y => new Date(y.startDate) >= day && new Date(y.endDate) <= last).length == 0) {
          day.setDate(day.getDate() + 7);
          last.setDate(day.getDate() + 6);
        }
        this.first = new Date(day);

        if ((this.locationId && this.slots.filter(y => y.locationId == this.locationId).length == 0) && this.sessionBooking)
          this.editForm.patchValue({ locationId: '00000000-0000-0000-0000-000000000000' });

        if ((this.ownerId && this.slots.filter(y => y.ownerId == this.ownerId).length == 0) && this.sessionBooking)
          this.editForm.patchValue({ ownerId: '00000000-0000-0000-0000-000000000000' });

        if (this.slots) {
          for (let i = 0; i < 7; i++) {
            if (i != 0)
              day.setDate(day.getDate() + 1);
            let next = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1, 0, 0, 0);

            this['day' + (i + 1) + 'Label'] = this.datepipe.transform(day, 'EEE dd/MM/yyyy');
            if (this.sessionBooking)
              this['day' + (i + 1) + 'Slots'] = this.slots.filter(x => new Date(x.startDate) >= new Date(day) && new Date(x.startDate) < new Date(next) && x.appointmentsNow.length == 0);
            else
              this['day' + (i + 1) + 'Slots'] = this.slots.filter(x => new Date(x.startDate) >= new Date(day) && new Date(x.startDate) < new Date(next));

            if (!this.isNew) {
              let slot = this['day' + (i + 1) + 'Slots'].findIndex(x => { return x.startDate == this.getFormPropertyValue('startDateTime') });
              if (slot >= 0) {
                this.slotIndex = "col" + (i + 1) + "-" + slot;
              }
            }
          }
        }
      }

      this.spinnerService.stop();

      if (this.sessionBooking) {
        this.getAppointmentLocations(this.slots);
        this.getAppointmentPractitioners(this.slots);
      }
    })
  }

  slotSelected(col: number, row: number, slot: any) {
    this.slotIndex = "col" + col + "-" + row;

    const callback = () => {
      if (!this.sessionBooking) {
        this.editForm.patchValue({
          startDateTime: slot.startDate,
          endDateTime: new Date(new Date(slot.startDate).getTime() + this.getFormPropertyValue('duration') * 60000),
          duration: this.getFormPropertyValue('duration'),
        })
      }
      else {
        this.editForm.patchValue({
          locationId: slot.locationId,
          ownerId: slot.ownerId,
          sessionDayId: slot.sessionId,
          startDateTime: slot.startDate,
          endDateTime: new Date(new Date(slot.startDate).getTime() + this.getFormPropertyValue('duration') * 60000),
          duration: this.getFormPropertyValue('duration'),
        })
      }

      this.selectedSlot = slot;

      this.processSlot(this.selectedSlot);
    }

    let slots = this.slots.filter(x => new Date(x.startDate) >= new Date(slot.startDate) && new Date(x.endDate) <= new Date(new Date(slot.startDate).getTime() + this.getFormPropertyValue('duration') * 60000))
    let appointmentsNow = false
    slots.forEach(s => {
      if (this.checkAppointmentsNow(s)) {
        appointmentsNow = true;
        return;
      }
    });

    if (appointmentsNow)
      this.appMessage.showDeleteConfirmation(callback, "This appointment will overlap with another appointment. Are you sure you want to book?", "Appointment Conflict");
    else
      callback();
  }

  processSlot(slot) {
    let appointmentDetails = new AppointmentViewModel();
    appointmentDetails.patientId = this.editForm.get('patientId').value;
    appointmentDetails.locationId = this.editForm.get('locationId').value;
    appointmentDetails.ownerId = this.editForm.get('ownerId').value;
    appointmentDetails.description = this.editForm.get('description').value;
    if (this.sessionBooking)
      appointmentDetails.sessionDayId = slot.sessionId;
    appointmentDetails.startDate = new Date(new Date(slot.startDate).getTime() - (new Date(slot.startDate).getTimezoneOffset() * 60000));
    appointmentDetails.endDate = new Date(new Date((new Date(slot.startDate).getTime() + this.getFormPropertyValue('duration') * 60000)).getTime() - (new Date(slot.startDate).getTimezoneOffset() * 60000));
    appointmentDetails.durationMinutes = this.getFormPropertyValue('duration');
    appointmentDetails.appointmentTypeId = this.editForm.get('appointmentTypeId').value;

    if (!this.isNew) {
      this.getAppointmentInstructions();
    }
    else {
      this.appointmentService.reserveAppointment(appointmentDetails).subscribe(x => {
        if (x.success) {
          this.isEditing = false;
          this.editForm.patchValue({ appointmentId: x.data.id });
          this.getAppointmentInstructions();

          this.store.setServicesStore(this.getFormPropertyValue('appointmentId'), this.getFormPropertyValue('ownerId'), this.getFormPropertyValue('startDateTime'), this.getFormPropertyValue('endDateTime'));
        }
        if (x.errors) {
          this.selectedSlot = null;
        }
      },
        e => {
          this.selectedSlot = null;
          this.slotIndex = null;
          this.appMessage.showFailedSnackBar(e);
        })
    }
  }

  editSlot() {
    this.isEditing = true;
    this.selectedSlot = null;
    this.appointment = null;
    this.waitingListEntry = null;

    if (this.isNew && this.getFormPropertyValue('appointmentId')) {
      this.appointmentService.unreserveAppointment(this.getFormPropertyValue('appointmentId')).subscribe(x => {
        this.editForm.patchValue({ appointmentId: null });
        this.getSlots(this.sessionBooking);
      });
    }
    else
      this.getSlots(this.sessionBooking);
  }

  getAppointmentDescription() {
    return this.appointmentTypes.find(x => x.appointmentTypeId == this.getFormPropertyValue('appointmentTypeId'))?.description;
  }

  prevClicked() {
    this.first = new Date(this.first.getFullYear(), this.first.getMonth(), this.first.getDate() - 7, 0, 0, 0);
    if (this.first <= this.today)
      this.firstSlot = true;
    this.getSlots(this.sessionBooking);
  }

  nextClicked() {
    this.firstSlot = false;
    this.first = new Date(this.first.getFullYear(), this.first.getMonth(), this.first.getDate() + 7, 0, 0, 0);
    this.getSlots(this.sessionBooking);
  }

  getTemplates(data) {
    this.letterTemplates = data.letterTemplates;
    this.emailTemplates = data.emailTemplates;
    this.smsTemplates = data.smsTemplates;

    if (data.useDefaultConfirmationEmail) {
      this.editForm.patchValue({
        confirmationEmail: true,
        emailTemplateId: data.defaultEmailConfirmation,
      })
    }

    if (data.useDefaultConfirmationLetter) {
      this.editForm.patchValue({
        confirmationLetter: true,
        letterTemplateId: data.defaultLetterConfirmation,
      })
    }

    if (data.useDefaultConfirmationSms) {
      this.editForm.patchValue({
        confirmationSms: true,
        smsTemplateId: data.defaultSmsConfirmation,
      })
    }
  }

  getTranslatorLanguages() {
    this.userService.getTranslatorTypes().subscribe((value) => {
      this.translatorLanguages = value;
    });
  }

  getPayors(payorId?: any | null) {
    this.dataService.getPayors(this.getFormPropertyValue('patientId')).subscribe(data => {
      this.relatedPayors = data;
      this.relatedPayors.sort(function (a, b) {
        if (a.displayName < b.displayName) return -1;
        if (a.displayName > b.displayName) return 1;
        return 0;
      })

      if (payorId && payorId?.data && payorId.data.patientInsurerId)
        payorId = payorId.data.patientInsurerId;

      if (payorId)
        this.editForm.patchValue({ payorId: payorId });

      if (this.payorDetails) {
        this.payorDetails = this.relatedPayors.find(y => y.payorId == this.payorDetails.payorId);
      }
    })
  }

  public addedPayor(payorId) {
    this.getPayors(payorId);
  }

  addAppointmentInstructions() {
    this.addingInstructions = true;
    this.selectedRecord = { id: '00000000-0000-0000-0000-000000000000', appointmentId: this.getFormPropertyValue('appointmentId') };
  }

  getAppointmentInstructions() {
    this.appointmentService.getAppointmentInstructions(this.getFormPropertyValue('appointmentId')).subscribe(data => {
      this.instructions = data;
    });
  }

  removeInstructions(e) {
    this.appointmentService.deleteAppointmentInstructions(e.appointmentInstructionsId).subscribe(x => {
      if (x.success) {
        this.snackBar.open("Instructions updated", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
        this.getAppointmentInstructions();
      }
      else {
        this.snackBar.open(e.errors[0], "Close", {
          panelClass: "badge-danger",
          duration: 3000,
        });
      }
    });
  }

  editInstuctions(e) {
    this.selectedRecord = { id: e.appointmentInstructionsId };
  }

  addToWaitingList() {
    var model = {
      patientId: this.getFormPropertyValue('patientId'),
      appointmentTypeId: this.getFormPropertyValue('appointmentTypeId'),
      locationId: this.getFormPropertyValue('locationId'),
      ownerId: this.getFormPropertyValue('ownerId'),
      notes: this.getFormPropertyValue('description'),
      priority: this.getFormPropertyValue('priority'),
    }

    this.waitingListService.addToWaitingList(model).subscribe(x => {
      if (x.success) {
        this.waitingListUpdate.emit();
        this.closeForm();
      }
    })
  }

  closeForm() {
    if (this.isNew && this.getFormPropertyValue('appointmentId'))
      this.appointmentService.unreserveAppointment(this.getFormPropertyValue('appointmentId')).subscribe();

    //  this.unselectSite();
    this.closed.emit();
  }

  // private unselectSite(callback?) {
  //   if (this.userStore.isMedSecUser()) {
  //     this.subscription.add(
  //       this.authService.unselectSite().subscribe(() => {
  //         if (callback) {
  //           callback();
  //         }
  //       })
  //     );
  //   }
  // }

  serviceAddedHandler() {
    this.editForm.markAsDirty();
  }

  getOwnerName() {
    let owner = this.practitioners.find(x => x.ownerId == this.getFormPropertyValue('ownerId'));
    return owner.ownerName;
  }

  getLocationName() {
    return this.locations.find(x => x.locationId == this.getFormPropertyValue('locationId'))?.locationName;
  }

  checkAppointmentsNow(slot) {
    if (slot.appointmentsNow.length > 0 && slot.appointmentsNow.includes(this.getFormPropertyValue('appointmentId')))
      return false;
    if (slot.appointmentsNow.length > 0)
      return true;
    return false;
  }

  firstDateChanged(e) {
    this.first = new Date(e.value);
    while (this.first.getDay() != 1) {
      this.first = new Date(this.first.getFullYear(), this.first.getMonth(), this.first.getDate() - 1, 0, 0, 0);
    }

    if (this.first <= this.today)
      this.firstSlot = true;
    else
      this.firstSlot = false;

    this.getSlots(this.sessionBooking);
  }
}