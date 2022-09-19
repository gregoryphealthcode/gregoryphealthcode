import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { debug } from "console";
import { ReactiveFormBase } from "src/app/shared/base/reactiveForm.base";
import { requiredIfValidator } from "src/app/shared/helpers/form-helper";
import { GenericResponse } from "src/app/shared/models/GenericResponseModel";
import { SpecialistViewModel } from "src/app/shared/models/SpecialistViewModel";
import { AppMessagesService } from "src/app/shared/services/app-messages.service";
import {
  AppointmentListViewModel, AppointmentService, AppointmentTypes, RecurrenceWindowTypes,
  SessionDataModel, SessionTypes, UnavailableTypes,
} from "src/app/shared/services/appointment.service";
import { UserService } from "src/app/shared/services/user.service";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";

@Component({
  selector: "app-session-details",
  templateUrl: "./session-details.component.html",
  styleUrls: ["./session-details.component.scss"],
})
@AutoUnsubscribe
export class SessionDetailsComponent extends ReactiveFormBase implements OnInit {
  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService,
    private appMessags: AppMessagesService
  ) {
    super();
  }

  @Input() ownerSelected: SpecialistViewModel;
  @Input() location: AppointmentListViewModel;
  @Input() startDate: Date;
  @Input() sessionData: SessionDataModel;

  @Output() close = new EventEmitter();
  @Output() savedSession = new EventEmitter();

  public syncingEbookingData = false;
  appointmentTypes: AppointmentTypes[] = [];
  sessionTypes: SessionTypes[];
  unavailableTypes: UnavailableTypes[];
  windowDurations: RecurrenceWindowTypes[];

  isUnavailable = false;
  isRecurring = false;
  showRepeat = false;
  eBooking = false;

  protected httpRequest = (x) => {
    if (x.eBooking) {
      this.syncingEbookingData = true;
    }

    if (x.recurrenceRule != null)
      x.recurrenceRule = x.recurrenceRule.rRule?.toString()?.trim().replace("RRULE:", "");

    if (this.isNew) {
      return this.appointmentService.addAppointmentSession(x);
    }
    else {
      return this.appointmentService.updateAppointmentSession(x);
    }
  }

  onSuccessfullySaved = (x: GenericResponse) => {
    this.syncingEbookingData = false;
    if (x.errors && x.errors.length > 0) {
      this.appMessags.showApiWarningNotification(x)
    }
    this.savedSession.emit();
  }

  ngOnInit() {
    if (this.sessionData == null)
      this.isNew = true;
    else
      this.isNew = false;

    this.getAppointmentTypes();
    this.getSessionTypes();
    this.getWindowDurations();

    this.setupForm();

    this.subscription.add(
      this.editForm.get("unavailableTypeId").valueChanges.subscribe((val) => {
        this.isUnavailable = val;
        this.editForm.get('appointmentTypeIds').updateValueAndValidity({ emitEvent: false });
        this.editForm.get('sessionTypeId').updateValueAndValidity({ emitEvent: false });
      })
    )
  }

  getAppointmentTypes() {
    this.appointmentService
      .getAppointmentTypes(this.ownerSelected.id.toString())
      .subscribe((value) => {
        this.appointmentTypes = value;
      });
  }

  getSessionTypes() {
    this.appointmentService.getSessionTypes().subscribe((value) => {
      this.sessionTypes = value;
    });
  }

  getWindowDurations() {
    const window: RecurrenceWindowTypes[] = [];
    window.push({ description: "5", id: 5 });
    window.push({ description: "10", id: 10 });
    window.push({ description: "14", id: 14 });
    window.push({ description: "21", id: 21 });
    window.push({ description: "30", id: 30 });
    window.push({ description: "60", id: 60 });
    window.push({ description: "90", id: 90 });
    window.push({ description: "120", id: 120 });
    window.push({ description: "365", id: 365 });

    this.windowDurations = window;
  }

  setupForm() {
    this.editForm = new FormGroup({
      recurrenceRule: new FormControl(null, null),
      repeat: new FormControl(null, null),
      eBooking: new FormControl(null, null),
      description: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      startDateTime: new FormControl(null, [Validators.required]),
      endDateTime: new FormControl(null, [Validators.required]),
      sessionTypeId: new FormControl(null, requiredIfValidator(() => !this.isUnavailable)),
      appointmentTypeIds: new FormControl(null, requiredIfValidator(() => !this.isUnavailable)),
      recurrenceWindow: new FormControl(null, null),
      unavailableTypeId: new FormControl(null, null),
      ownerId: new FormControl(null, null),
      locationId: new FormControl(null, null),
      sessionId: new FormControl(null, null),
    });

    if (this.isNew) {
      this.editForm.patchValue({ ownerId: this.ownerSelected.id });
      this.editForm.patchValue({ locationId: this.location.id });
    }



    if (!this.isNew)
      this.populateForm(this.sessionData.sessionId);

    if (this.startDate) {
      this.editForm.patchValue({ startDateTime: this.startDate });
      var endDate = new Date(this.startDate);
      endDate.setHours(endDate.getHours() + 1);
      this.editForm.patchValue({ endDateTime: endDate });
    }
  }

  populateForm(id) {
    this.appointmentService.getAppointmentSessionDetails(id).subscribe(x => {
     
      super.populateForm(x);
      if (x.recurrenceRule) {
        this.showRepeat = true;
      }
    })
  }

  /*
  showSessionOverlapMessage(val) {
    var result = JSON.parse(val);
    const text = `Session Overlap`;
    this.appMessage.showInfoConfirmationModal(
      `This session overlaps with a session (${result.Description}) at ${result.LocationName}`,
      text,
      () => {
        this.spinnerService.stop();
      },
      () => {}
    );
    return;
  }

  deleteSession() {
    const text = `Are you sure you want to delete this session?`;
    this.appMessage.showAskForConfirmationModal(
      `Delete ${this.sessionData.description}`,
      text,
      () => this.confirmDelete(this.sessionId),
      () => {}
    );
    return;
  }

  confirmDelete(uniqueNo) {
    this.spinnerService.start();
    this.subscription.add(
      this.appointmentService.deleteSession(uniqueNo).subscribe(
        (data) => {
          if (data.isSuccess) {
            showSuccessSnackbar(
              this.snackBar,
              `${this.sessionData.description} Type Deleted`
            );
            this.savedSession.emit();
            this.spinnerService.stop();
          } else {
            showErrorSnackbarWithMessage(this.snackBar, data.message);
            this.spinnerService.stop();
          }
        },
        (error) => {
          showErrorSnackbar(this.snackBar);
          this.spinnerService.stop();
        }
      )
    );
  } */
}
