import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { AppointmentListViewModel, AppointmentService } from 'src/app/shared/services/appointment.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-preferences-appointment-locations',
  templateUrl: './preferences-appointment-locations.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
  styleUrls: ['./preferences-appointment-locations.component.scss']
})
export class PreferencesAppointmentLocationsComponent extends GridBase implements OnInit {
  locations: AppointmentListViewModel[];
  selectedRecord: any;
  showInactive = false;

  constructor(
    public appInfo: AppInfoService,
    private changeDetectorRef: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private appMessages: AppMessagesService,
    private appointmentService: AppointmentService,
  ) { 
    super();
  }

  ngOnInit() {
    this.getAppointmentLocations();
  }

  getAppointmentLocations() {
    this.subscription.add(
      this.appointmentService.getAppointmentLocations(null,this.showInactive).subscribe(value => {
        this.locations = value;

        this.dataGrid.instance.endCustomLoading();
      }))
  }

  public addClicked() {
    this.selectedRecord = { id: 0 };
  }

  public editClicked(e) {
    this.selectedRecord = { id: e.data.locationId };
  }

  public deleteClicked(e) {
    const text = 'Are you sure you want to delete this appointment location?'

    const callback = () => {
      this.spinnerService.start();
      this.appointmentService.deleteAppointmentLocation(e.row.data.locationId).subscribe(x => {
        this.spinnerService.stop();
        this.snackBar.open('Appointment type deleted successfully', "Close", {
          panelClass: "badge-success",
          duration: 3000,
        }
        );
        this.getAppointmentLocations();
      },
        (e) => {
          this.snackBar.open(e.error.errors, 'Close', {
            panelClass: 'badge-danger',
            duration: 3000,
          });
          this.spinnerService.stop();
        });
    };
    this.appMessages.showDeleteConfirmation(callback, text);
  }

  refreshDataGrid() {
    this.getAppointmentLocations()
    this.changeDetectorRef.detectChanges();
  }

  checkboxChanged(e) {
    this.showInactive = e.checked;
    this.refreshDataGrid();
  }
}
