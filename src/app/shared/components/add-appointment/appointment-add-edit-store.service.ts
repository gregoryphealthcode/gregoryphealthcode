import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BehaviorSubject, EMPTY } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { GetInvoicePayorResponseModel } from "src/app/pages/accounts/invoice-add-edit/invoice-add-edit.service";
import { toIsoString } from "../../helpers/date-format";
import { AppMessagesService } from "../../services/app-messages.service";
import { AppointmentService, GetAppointmentResponseModel, GluAppointmentPatientStatusEnum, GluAppointmentStatus, WaitingListModel, } from "../../services/appointment.service";
import { InvoiceServicesStoreService, ServiceParentEntityType } from "../invoice-services-select/invoice-services-store.service";

@Injectable()
export class AppointmentAddEditStoreService {
  private appointmentId = new BehaviorSubject<string>(undefined);
  public appointmentId$ = this.appointmentId.asObservable();

  private appointmentPayor = new BehaviorSubject<GetInvoicePayorResponseModel>(undefined);
  public appointmentPayor$ = this.appointmentPayor.asObservable();

  private errorMessage = new BehaviorSubject<string>(undefined);
  public errorMessage$ = this.errorMessage.asObservable();

  private showAddedToWaitingList = new BehaviorSubject<boolean>(undefined);
  public showAddedToWaitingList$ = this.showAddedToWaitingList.asObservable();

  public get payorIsInEditMode() { return this._payorIsInEditMode; }
  private _payorIsInEditMode = true;

  private editForm: FormGroup;

  constructor(
    private appMessages: AppMessagesService,
    private appointmentService: AppointmentService,
    private servicesStore: InvoiceServicesStoreService
  ) { }

  public setup(editForm: FormGroup) {
    this.editForm = editForm;
  }

  private setServicesStore() {
    this.servicesStore.setParentEntityType(ServiceParentEntityType.Appointment);
    this.servicesStore.setParentEntityId(this.appointmentId.value);

    const appointmentDetails: GetAppointmentResponseModel = this.editForm.getRawValue();
    this.servicesStore.setDefaultOwnerId(appointmentDetails.ownerId);
    this.servicesStore.setDefaultStartDate(appointmentDetails.startDate);
    this.servicesStore.setDefaultEndDate(appointmentDetails.endDate);
  }

  unreserveAppointment() {
    const appointmentData = this.getModelFromForm();
    if (!appointmentData.startDate) return;
    if (!appointmentData.appointmentId) return;
    if (appointmentData)
      return this.appointmentService.unreserveAppointment(appointmentData.appointmentId).subscribe();
  }

  reserveAppointment() {
    if (this.getFormPropertyValue("appointmentId")) { //apointment already reserved
      return;
    }

    const appointmentData = this.getModelFromForm();
    appointmentData.statusId = GluAppointmentStatus.Reserved;

    return this.appointmentService.reserveAppointment(appointmentData).pipe(
      tap(
        (value) => {
          if (value.success) {
            this.appointmentId.next(value.data.id);
            this.setFormPropertyValue("appointmentId", value.data.id);
            this.setFormPropertyValue(
              "statusId",
              GluAppointmentStatus.Reserved
            );

            if (value.data.appointmentOverlap) {
              this.errorMessage.next("This appoinment overlaps with another appointment.  You can still book this appointment");
            }

            this.setServicesStore();
          }
        },
        (error) => {
          this.setFormPropertyValue("startDate", undefined);
          this.appMessages.showApiErrorNotification(error)
        }
      )
    );
  }

  public editPayor() {
    this._payorIsInEditMode = true;
  }

  public getAppointment(appointmentId: string) {
    let appointment;
    return this.appointmentService.getAppointment(appointmentId).pipe(
      tap((value) => {
        this.appointmentId.next(appointmentId);
        value.startDate = new Date(value.startDate);
        value.endDate = new Date(value.endDate);
        this.editForm.reset(value);
        this.setServicesStore();
        if (value.payor) {
          this.appointmentPayor.next(value.payor);
          this._payorIsInEditMode = false;
        }
        appointment = value;
      }),
      switchMap(() => this.servicesStore.getAll()),
      map(() => appointment)
    );
  }

  private getModelFromForm(): any {
    const record = this.editForm.getRawValue();
    for (const key in record) {
      if (record.hasOwnProperty(key) && record[key] instanceof Date) {
        record[key] = toIsoString(record[key]);
      }
    }
    return record;
  }

  public getFormPropertyValue(controlName: string) {
    return this.getFormControl(controlName).value;
  }

  public getFormControl(controlName: string) {
    return this.editForm.controls[controlName];
  }

  public setFormPropertyValue(controlName: string, value: any) {
    this.editForm.controls[controlName].patchValue(value);
  }

  public addToWaitingList$() {
    const title = "Add to waiting list";
    const text = "Are you sure you also want to add patient to waiting list?";
    return this.appMessages.showAskForConfirmationModal$(title, text).pipe(
      switchMap((x) => {
        if (x.value) {
          const waitingListVM = new WaitingListModel();
          waitingListVM.ownerId = this.getFormPropertyValue("ownerId");
          waitingListVM.patientId = this.getFormPropertyValue("patientId");
          waitingListVM.locationId = this.getFormPropertyValue("locationId");
          waitingListVM.appointmentTypeId = this.getFormPropertyValue("realAppointmentTypeId");
          waitingListVM.appointmentOwnerTypeId = this.getFormPropertyValue("appointmentTypeId");

          return this.appointmentService.addToWaitingList(waitingListVM);
        } else {
          this.setFormPropertyValue("addToWaitingList", false);
          return EMPTY;
        }
      }),
      tap(() => (this.showAddedToWaitingList.next(true)))
    ),
      catchError((e) => {
        this.setFormPropertyValue("addToWaitingList", false);
        return EMPTY;
      });
  }

  public reserveAppoitnment() { }

  public bookAppointment() { }

  public completeAppointment(patientStatusId: GluAppointmentPatientStatusEnum, createInvoice: boolean) {
    const request = {
      appointmentId: this.appointmentId.value,
      patientStatusId: patientStatusId,
      createInvoice: !!createInvoice
    }

    return this.appointmentService.completeAppointment(request);
  }

  public cancelAppointment() { }

  public setPayor(appointmentPayor) {
    appointmentPayor.appointmentId = this.appointmentId.value;
    this.appointmentService.setPayor(appointmentPayor).subscribe(
      () => {
        this.appointmentPayor.next(appointmentPayor);
        this._payorIsInEditMode = false;
      },
      (e) => this.appMessages.showApiErrorNotification(e)
    );
  }
}
