import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridBase } from 'src/app/shared/base/grid.base';
import { DialogTemplateComponent } from 'src/app/shared/components/dialog/dialog-template.component';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-preferences-appointment-instructions',
  templateUrl: './preferences-appointment-instructions.component.html',
  styleUrls: ['./preferences-appointment-instructions.component.scss']
})
export class PreferencesAppointmentInstructionsComponent extends GridBase implements OnInit {
  selectedRecord: any;

  constructor(
    private appointmentService: AppointmentService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit() {
    this.getAppointmentInstructions();
  }

  getAppointmentInstructions() {
    this.controllerUrl = `${environment.baseurl}/lluAppointmentInstructions/`;
    this.setupDataSource({
      key: 'id',
      /* loadParamsCallback: () => [        
      ], */
    });
  }

  public addClicked() {
    this.selectedRecord = { id: 0 };
  }

  public editClicked(e) {
    this.selectedRecord = { id: e.data.id };
  }

  deleteClicked(e) {
    const dialogRef = this.dialog.open(DialogTemplateComponent, {
      width: '250px',
      data: {
        title: 'Are you sure?',
        message: 'Are you sure you want to delete this item?',
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.spinnerService.start();
        this.subscription.add(this.appointmentService.deleteInstructions(e.data.id).subscribe(data => {
          if (data.success) {
            this.snackBar.open('Appointment instructions deleted', 'Close', {
              panelClass: 'badge-success',
              duration: 3000,
            });
          }
          else {
            this.snackBar.open(data.errors[0], 'Close', {
              panelClass: 'badge-danger',
              duration: 3000,
            });
          }
          this.spinnerService.stop();
          this.getAppointmentInstructions();
        }));
      }
    });
  }
}