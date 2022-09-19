import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-preferences-appointment-sessions',
  templateUrl: './preferences-appointment-sessions.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
  styleUrls: ['./preferences-appointment-sessions.component.scss']
})
export class PreferencesAppointmentSessionsComponent extends GridBase implements OnInit {
  gridDataSource: any[] = [];
  selectedRecord: any;

  constructor(
    public appInfo: AppInfoService,
    private changeDetectorRef: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private appMessages: AppMessagesService,
    private appointmentService: AppointmentService
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
    return cellInfo.row.data.backgroundColour;
  }

  ngOnInit() {
    this.getAppointmentSessions();
  }

  getAppointmentSessions() {
    this.controllerUrl = `${environment.baseurl}/appointmentSession/`;
    this.setupDataSource({
      key: 'sessionId',
      loadParamsCallback: () => [
        
      ],
    });
  }

  public addClicked() {
    this.selectedRecord = { id: '00000000-0000-0000-0000-000000000000' };
  }

  public editClicked(e) {
    this.selectedRecord = { id: e.data.sessionId };
  }

  public deleteClicked(e) {
    const text = 'Are you sure you want to delete this appointment session?'

    const callback = () => {
      this.spinnerService.start();
      this.appointmentService.deleteSession(e.row.data.sessionId).subscribe(x => {
        this.spinnerService.stop();
        this.snackBar.open('Appointment session deleted successfully', "Close", {
          panelClass: "badge-success",
          duration: 3000,
        }
        );
        this.refreshDataGrid();
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
    this.getAppointmentSessions()
    this.changeDetectorRef.detectChanges();
  }
}