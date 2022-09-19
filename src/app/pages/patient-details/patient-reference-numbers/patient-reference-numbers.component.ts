import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { PatientService } from 'src/app/shared/services/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogTemplateComponent } from 'src/app/shared/components/dialog/dialog-template.component';
import { environment } from 'src/environments/environment';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';

@Component({
  selector: 'app-patient-reference-numbers',
  templateUrl: './patient-reference-numbers.component.html',
  styleUrls: ['patient-reference-numbers.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})

@AutoUnsubscribe
export class PatientReferenceNumbersComponent extends GridBase implements OnInit {
  @Input() patientId: string;
  @Input() siteId: string;

  @Output() referenceChanged = new EventEmitter()

  selectedRecord: any;
  action: string;

  showPanel = false;
  selectedReferenceNo: string;
  controllerUrl: string;

  constructor(
    private patientService: PatientService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private appMessage: AppMessagesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getPatientReferenceNumbers();
  }

  getPatientReferenceNumbers() {
    if (this.patientId != undefined) {
      this.controllerUrl = `${environment.baseurl}/patientReferenceNumbers/`;
      this.setupDataSource({
        key: 'referenceNumberId',
        loadParamsCallback: () => [
          { name: 'patientId', value: this.patientId },
        ],
      });
    }
  }

  saved(e) {
    if (e.success) {
      if (this.action == "Add") {
        this.snackBar.open("Reference number added", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
      }
      if (this.action == "Edit") {
        this.snackBar.open("Reference number updated", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
      }
    }
    if (e.errors) {
      this.snackBar.open(e.errors[0], "Close", {
        panelClass: "badge-danger",
        duration: 3000,
      });
    }
    this.action = "";
    this.referenceChanged.emit();
    this.getPatientReferenceNumbers();
  }

  public add() {
    this.action = "Add";
    this.selectedRecord = { id: 0, patientId: this.patientId };
  }

  public editClicked(e) {
    this.action = "Edit";
    this.selectedRecord = { id: e.data.referenceNumberId };
  }

  deleteClicked(e) {
    const callback = () => {
      this.spinnerService.start();
      this.subscription.add(this.patientService.deletePatientReferenceNumber(e.data.referenceNumberId)
        .subscribe(data => {

          this.snackBar.open('Patient Reference Number deleted successfully', 'Close', {
            panelClass: 'badge-success',
            duration: 3000
          });
          this.showPanel = false;
          this.referenceChanged.emit();
          this.getPatientReferenceNumbers();
          this.spinnerService.stop();
        },
          error => {
            this.snackBar.open('An error occurred', 'Close', {
              panelClass: 'badge-danger',
              duration: 3000
            });
            this.spinnerService.stop();
          }));
    }

    this.appMessage.showDeleteConfirmation(callback, "Are you sure you want to delete this reference number?");
  }
}
