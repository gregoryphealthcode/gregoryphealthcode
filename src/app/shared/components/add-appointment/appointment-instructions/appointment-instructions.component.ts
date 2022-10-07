import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppointmentInstructionsViewModel, AppointmentService } from 'src/app/shared/services/appointment.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-appointment-instructions',
  templateUrl: './appointment-instructions.component.html',
  styleUrls: ['./appointment-instructions.component.scss']
})
export class AppointmentInstructionsComponent extends SubscriptionBase implements OnInit {
  @Input() appointmentId: string;

  appointmentInstructionsId: string;
  editMode: any;
  isNew: boolean;
  updateGrid: boolean;
  instructions: AppointmentInstructionsViewModel[];
  appointmentInstructions: AppointmentInstructionsViewModel;

  constructor(
    private appointmentService: AppointmentService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
  ) {
    super()
  }

  ngOnInit() {
    this.getAppointmentInstructions();
  }

  addNewInstructions() {
    this.editMode = true;
    this.isNew = true;    
  }

  instructionsAddedHandler() {
    this.editMode = false;
    this.updateGrid = true;
    this.snackBar.open("Instructions added", "Close", {
      panelClass: "badge-success",
      duration: 3000,
    });
    this.getAppointmentInstructions();
  }

  getAppointmentInstructions() {
    this.appointmentService.getAppointmentInstructions(this.appointmentId).subscribe(data => {
      this.instructions = data;
    });
  }

  removeInstructions(e) {
    this.spinnerService.start();
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
      this.spinnerService.stop();
    });
  }

  editInstuctions(e) {
    this.appointmentInstructions = new AppointmentInstructionsViewModel();
    this.appointmentInstructions.appointmentInstructionsId = e.appointmentInstructionsId;
    this.appointmentInstructions.title = e.title;
    this.appointmentInstructions.text = e.text;
    this.appointmentInstructions.isDirections = e.isDirections;
    this.isNew = false;
    this.editMode = true;
  }
}