import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { Location } from '@angular/common';
import { AppointmentTypes } from 'src/app/shared/services/appointment.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentTypesService } from '../../preferences-appointments/appointment-types.service';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';

@Component({
  selector: 'app-preferences-appointment-types',
  templateUrl: './preferences-appointment-types.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
  styleUrls: ['./preferences-appointment-types.component.scss']
})
@AutoUnsubscribe
export class PreferencesAppointmentTypesComponent extends GridBase implements OnInit {
  gridDataSource: AppointmentTypes[] = [];
  selectedRecord: any;

  constructor(
    public appInfo: AppInfoService,
    private changeDetectorRef: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private appMessages: AppMessagesService,
    private appointmentTypesService: AppointmentTypesService
  ) {
    super();

  }

  onToolbarPreparing(e) {
    console.log('toolbar preparing');
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
          onClick: this.refreshDataGrid.bind(this)
        }
      });
  }

  getBackgroundColour(cellInfo) {
    return cellInfo.data.backgroundColour;
  }

  ngOnInit() {
    this.getAppointmentTypes();
  }

  getAppointmentTypes() {
    this.subscription.add(this.appointmentTypesService.getAppointmentTypes().subscribe(data => {
      this.gridDataSource = data;

      this.dataGrid.instance.endCustomLoading();
    }
    ));
  }

  public addClicked() {
    this.selectedRecord = { id: 0 };
  }

  public editClicked(e) {
    this.selectedRecord = { id: e.data.appointmentTypeId };
  }

  public deleteClicked(e) {
    const text = 'Are you sure you want to delete this appointment type?'

    const callback = () => {
      this.spinnerService.start();
      this.appointmentTypesService.delete(e.row.data.appointmentTypeId).subscribe(x => {
        this.spinnerService.stop();
        this.snackBar.open('Appointment type deleted successfully', "Close", {
          panelClass: "badge-success",
          duration: 3000,
        }
        );
        this.getAppointmentTypes();
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
    this.getAppointmentTypes()
    this.changeDetectorRef.detectChanges();
  }
}