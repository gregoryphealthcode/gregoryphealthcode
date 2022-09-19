import { NgModule, Component, Input, ChangeDetectorRef, } from "@angular/core";
import {
  DxFormModule, DxButtonModule, DxPopupModule, DxBoxModule, DxCheckBoxModule, DxDataGridModule,
  DxContextMenuModule, DxSwitchModule, DxToolbarModule,
} from "devextreme-angular";
import { CommonModule } from "@angular/common";
import { AppInfoService } from "src/app/shared/services";
import { ViewDiaryModule } from "src/app/shared/components/diary/view-diary.module";
import { AppointmentsControlModule } from "src/app/shared/components/appointments/appointments.module";
import * as moment from "moment";
import {
  AppointmentService,
  AppointmentViewModel,
} from "src/app/shared/services/appointment.service";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { GridBase } from "src/app/shared/base/grid.base";
import { GridSearchTextBoxModule } from "src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { PipesModule } from "src/app/shared/pipes/pipes.module";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AppMessagesService } from "src/app/shared/services/app-messages.service";
import { SpinnerService } from "src/app/shared/services/spinner.service";
import { AppointmentPopupAddEditModule } from "src/app/shared/components/appointment-popup-add-edit/appointment-popup-add-edit.module";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: "app-patient-appointments",
  templateUrl: "./patient-appointments.component.html",
  styleUrls: ["./patient-appointments.component.scss"],
})
@AutoUnsubscribe
export class PatientAppointmentsComponent extends GridBase {
  @Input()
  get patientId(): string {
    return this._patientId;
  }
  set patientId(value: string) {
    this._patientId = value;
    if (value) {
      this.getAppointments();
    }
  }

  private _patientId: string;

  appointmentId: string;
  showAppointmentPopup: boolean;
  appointmentDataItem: AppointmentViewModel;
  appointmentsDataSource: AppointmentViewModel[] = [];

  constructor(
    public appInfo: AppInfoService,
    private appointmentService: AppointmentService,
    private changeDetection: ChangeDetectorRef,
    private spinner: SpinnerService,
    private snackBar: MatSnackBar,
    private appMessages: AppMessagesService,
  ) {
    super();
  }

  public calculateAgo(e) {
    try {
      const d = e.startDate;
      const myTimeAgo: string = moment(d).fromNow();
      return myTimeAgo;
    } catch (e) {
      return "";
    }
  }

  update() {
    this.getAppointments();
  }

  editAppointment(e) {
    this.appointmentId = e.data.appointmentId;
    this.showAppointmentPopup = true;
  }

  getAppointments() {
    this.subscription.add(
      this.appointmentService
        .getAppointmentsForPatient(this.patientId)
        .subscribe((data) => {
          this.dataGrid.instance.endCustomLoading();
          this.appointmentsDataSource = data;
          this.changeDetection.detectChanges();
        })
    );
  }

  closedHandler() {
    this.appointmentId = null;
    this.showAppointmentPopup = false;
  }

  newAppointment() {
    this.showAppointmentPopup = true;
  }

  refreshDataGrid() {
    this.getAppointments();
  }

  public cancelClicked(e) {
    const text = 'Are you sure you want to cancel this appointment?'

    const callback = () => {
      this.spinner.start();
      this.appointmentService.cancelAppointment(e.data.appointmentId).subscribe(
        (x) => {
          this.spinner.stop();
          this.snackBar.open("Appointment cancelled", "Close", {
            panelClass: "badge-success",
            duration: 3000,
          }
          );
          this.refreshDataGrid();
        },
        (e) => {
          this.spinner.stop(); this.appMessages.showApiErrorNotification(e)
        }
      );
    };

    this.appMessages.showDeleteConfirmation(callback, text);
  }
}

@NgModule({
  declarations: [PatientAppointmentsComponent],
  imports: [
    DxDataGridModule,
    DxBoxModule,
    DxButtonModule,
    DxContextMenuModule,
    DxCheckBoxModule,
    CommonModule,
    DxFormModule,
    DxSwitchModule,
    DxToolbarModule,
    DxPopupModule,
    ViewDiaryModule,
    AppointmentsControlModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    DirectivesModule,
    GridSearchTextBoxModule,
    AppButtonModule,
    PipesModule,
    AppointmentPopupAddEditModule
  ],
  exports: [PatientAppointmentsComponent],
})
export class PatientAppointmentsdModule { }
