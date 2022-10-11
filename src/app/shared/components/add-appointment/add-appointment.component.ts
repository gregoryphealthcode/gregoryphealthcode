import { Component, OnInit, Input, Output, EventEmitter, } from "@angular/core";
import { AppointmentService, AppointmentStatus, AppointmentViewModel, GluAppointmentPatientStatusEnum, GluAppointmentStatus, } from "../../services/appointment.service";
import { GenericViewModel } from "../../services/user.service";
import { SoonerAppointment } from "../appointments/appointments.component";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { switchMap, tap } from "rxjs/operators";
import { EMPTY, merge, } from "rxjs";
import { ReactiveFormBase } from "../../base/reactiveForm.base";
import { FormBuilder, Validators } from "@angular/forms";
import { AppMessagesService } from "../../services/app-messages.service";
import { DocumentsService } from "../../services/documents.service";
import { AppointmentAddEditStoreService } from "./appointment-add-edit-store.service";
import { AppointmentDropdownDataManagerService } from "./appointment-dropdown-data-manager.service";
import { AppointmentFormChangesService } from "./appointment-form-changes.service";
import { InvoiceServicesStoreService } from "../invoice-services-select/invoice-services-store.service";
import { InvoiceAddEditService } from "src/app/pages/accounts/invoice-add-edit/invoice-add-edit.service";
import { AppInfoService } from "../../services";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-add-appointment-form",
  templateUrl: "./add-appointment.component.html",
  styleUrls: ["./add-appointment.component.scss"],
  host: { class: "d-flex flex-column bg-white modal-lg-width" },
  providers: [AppointmentAddEditStoreService, AppointmentDropdownDataManagerService,
    AppointmentFormChangesService, InvoiceServicesStoreService, InvoiceAddEditService]
})
@AutoUnsubscribe
export class AddAppointmentFormComponent extends ReactiveFormBase implements OnInit {
  constructor(
    private appointmentService: AppointmentService,
    private documentsService: DocumentsService,
    private formBuilder: FormBuilder,
    private messages: AppMessagesService,
    public store: AppointmentAddEditStoreService,
    public dropdownData: AppointmentDropdownDataManagerService,
    private formChangesListener: AppointmentFormChangesService,
    public appInfo: AppInfoService,
    private dialog: MatDialog
  ) {
    super();
  }

  @Input() appointmentDataItem: AppointmentViewModel = new AppointmentViewModel();

  @Output() closed = new EventEmitter();
  @Output() saved = new EventEmitter();

  dnaReasonDisabled = true;
  showPatientWaitingListPopUp: boolean;
  showSlotsPopUp: boolean;
  showAddedToWaitingList: boolean;
  appointmentTypeId: string;
  selectedType: any;
  errorMessage: string;
  dnaReasons: GenericViewModel[] = [];
  sitePZEnabled = false;
  fromSession: boolean;
  fromPatient: boolean;
  noSession: boolean;
  slotSelected: boolean = false;
  addToWaitingList = false;
  showComplete = false;
  patientStatusId: GluAppointmentPatientStatusEnum;
  statusId: GluAppointmentStatus;
  soonerAppointment: SoonerAppointment[] = [
    {
      text: "No",
      id: false,
    },
    {
      text: "Yes",
      id: true,
    },
  ];

  protected httpRequest = (x) => {
    if (x.addToWaitingList == null)
      x.addToWaitingList = false;

    if (x.statusId == AppointmentStatus.Reserved) {
      return this.appointmentService.bookAppointment(x);
    }
    if (x.statusId == AppointmentStatus.Booked) {
      return this.appointmentService.updateAppointment(x);
    }
    return EMPTY;
  }

  ngOnInit(): void {
    this.addToSubscription(
      this.store.errorMessage$.pipe(tap(x => this.errorMessage = x))
    )

    this.addToSubscription(
      this.store.showAddedToWaitingList$.pipe(tap(x => this.showAddedToWaitingList = x))
    )

    this.setForm();
    this.store.setup(this.editForm);
    this.dropdownData.setup();
    this.formChangesListener.setup();

    this.isNew = !this.appointmentDataItem.appointmentId;
    if (this.appointmentDataItem.appointmentId) {
      this.onEdit(this.appointmentDataItem);
    } else {
      this.onAdd(this.appointmentDataItem);
    }

    this.onSuccessfullySaved = (x) => {
      if (x.data?.letterId) {
        this.subscription.add(
          this.documentsService
            .editLetter(x.data.letterId)
            .subscribe(() => this.saved.emit(x))
        );
      } else {
        this.saved.emit(x);
      }
    };
  }

  get showMainDetails() {
    return this.getFormPropertyValue("appointmentId");
  }

  get canBeCompleted() {
    const startDate = new Date(this.getFormPropertyValue("startDate"));
    return startDate.getTime() < new Date().getTime();
  }

  public apptTypeChanged(e) {
    if (e) {
      const duration = this.dropdownData.appointmentTypes.find(
        (x) => x.appointmentTypeId == e
      ).duration;
      this.setFormPropertyValue("durationMinutes", duration);
    }
  }

  private onEdit(appointmentDataItem,) {
    this.store.getAppointment(appointmentDataItem.appointmentId)
      .pipe(
        switchMap((x) =>
          merge(
            this.dropdownData.getPatient$(x.patientId),
            this.dropdownData.getAppointmentOwnerTypes$(x.ownerId)
          )
        )
      )
      .subscribe();

    this.addToSubscription(merge(
      this.dropdownData.getTemplates$(this.editForm),
    ))
  }

  private onAdd(appointmentDataItem) {
    this.fromSession = !!appointmentDataItem.sessionId;
    this.fromPatient = !this.fromSession && !appointmentDataItem.ownerId;
    this.noSession = !this.fromPatient && !this.fromSession;
    this.showSlotsPopUp = !this.noSession;

    const patientId = appointmentDataItem.patientId;

    this.addToSubscription(merge(
      this.dropdownData.getTemplates$(this.editForm),
      this.dropdownData.getPatient$(patientId)
    ))

    if (!patientId) { throw 'Please provide a patientId!' }

    //from diary, no session
    if (this.noSession) {
      this.formChangesListener.listenToLocationIdChanges();
      this.dropdownData
        .getAppointmentOwnerTypes$(appointmentDataItem.ownerId)
        .pipe(
          tap(() => this.editForm.reset(appointmentDataItem))
        )
        .subscribe();
    } else {
      this.addToSubscription(
        this.dropdownData.getAppointmentTypes$(appointmentDataItem.sessionId));
      this.editForm.reset(appointmentDataItem);
    }
  }

  private setForm() {
    this.editForm = this.formBuilder.group({
      siteId: [undefined],
      ownerId: [undefined],
      ownerName: [undefined],
      locationId: [undefined, Validators.required],
      patientId: [undefined, Validators.required],
      startDate: [undefined, Validators.required],
      endDate: [undefined, Validators.required],
      durationMinutes: [undefined, Validators.required],
      appointmentTypeId: [undefined, Validators.required],
      realAppointmentTypeId: [undefined],
      description: [undefined],
      sessionId: [undefined],
      sessionDayId: [undefined],
      locationName: [undefined],
      costCentre: [undefined],
      isNFG: [undefined],
      addToWaitingList: [false],
      translatorNeeded: [undefined],
      translatorLanguage: [undefined],
      patientStatusId: [undefined],
      appointmentId: [undefined],
      statusId: [undefined],
      confirmationLetter: [undefined],
      confirmationText: [undefined],
      confirmationEmail: [undefined],
      letterTemplateId: [undefined],
      smsTemplateId: [undefined],
      emailTemplateId: [undefined],
      payorId: [undefined],
    });
  }

  public slotSelectedHandler(item: AppointmentViewModel) {
    this.showSlotsPopUp = false;
    this.slotSelected = true;
    if (item.appointmentId) {
      return;
    } // existing appointment, prevent dbl booking

    this.setFormPropertyValue("locationId", item.locationId);
    this.setFormPropertyValue("sessionDayId", item.sessionId);
    this.setFormPropertyValue("ownerId", item.ownerId);
    this.setFormPropertyValue("appointmentTypeId", item.appointmentTypeId);
    this.setFormPropertyValue("realAppointmentTypeId", item.realAppointmentTypeId)
    this.setFormPropertyValue("startDate", item.startDate);

    this.subscription.add(
      this.dropdownData.getAppointmentOwnerTypes$(item.ownerId).subscribe()
    )

    this.editForm.markAsTouched();
    this.editForm.markAsDirty();
  }

  public patientWaitingListClosed() {
    this.showPatientWaitingListPopUp = false;
    const patientId = this.getFormPropertyValue('patientId');
    this.subscription.add(this.dropdownData.checkIfPatientOnwaitingList(patientId).subscribe());
  }

  public book() {
    if (!this.dropdownData.isOnWaitingList) {
      this.submitForm();
      return;
    }

    const title = "Waiting list";
    const text =
      "Patient is currently on the waiting list. Would you like to see the list?";
    const yesCallback = () => (this.showPatientWaitingListPopUp = true);
    const noCallback = () => this.submitForm();

    this.messages.showAskForConfirmationModal(
      title,
      text,
      yesCallback,
      noCallback
    );
  }

  complete() {
    this.patientStatusId = this.getFormPropertyValue("patientStatusId");
    this.statusId = this.getFormPropertyValue("statusId");

    if (this.statusId !== GluAppointmentStatus.Booked) {
      return;
    }

    this.showComplete = true;
  }

  savedHandler(e) {
    if (e)
      this.messages.showSuccessSnackBar("Appointment completed and invoice created");
    else
      this.messages.showSuccessSnackBar("Appointment completed, invoice not created");
    this.saved.emit();
  }

  cancel() {
    if (this.isNew)
      this.store.unreserveAppointment();
    this.closed.emit();
  }

  waitingListHandler() {
    this.closed.emit();
  }

  public getPatientStatusDescription() {
    if (!this.dropdownData.patientStatus || this.dropdownData.patientStatus.length === 0) { return '' };

    const patientStatusId = this.getFormPropertyValue("patientStatusId");

    if (!patientStatusId) { return '' };

    return this.dropdownData.patientStatus.find((x) => x.uniqueNo === patientStatusId)
      .description;
  }

  edit() {
    this.showSlotsPopUp = true;
    this.slotSelected = false;

    this.setFormPropertyValue("locationId", null);
    this.setFormPropertyValue("sessionId", null);
    this.setFormPropertyValue("ownerId", null);
    this.setFormPropertyValue("appointmentId", null);
    this.setFormPropertyValue("appointmentTypeId", null);
    this.setFormPropertyValue("realAppointmentTypeId", null)
    this.setFormPropertyValue("startDate", null);

    this.store.unreserveAppointment();
  }

  payorSelectedHandler() {
    this.editForm.markAsDirty();
  }

  serviceAddedHandler() {
    this.editForm.markAsDirty();
  }

  validateDuration() {
    if (this.getFormPropertyValue('durationMinutes') === null) {
      this.setFormPropertyValue("durationMinutes", 1);
    }
    return true;
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
}
