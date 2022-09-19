import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Guid from 'devextreme/core/guid';
import { GridBase } from 'src/app/shared/base/grid.base';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientAllergyService } from 'src/app/shared/services/patient-allergy.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';

@Component({
  selector: 'app-patient-allergies',
  templateUrl: './patient-allergies.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
})
export class PatientAllergiesComponent extends GridBase implements OnInit {
  @Input() patientId: Guid;

  @Output() updated = new EventEmitter();

  selectedRecord: any;
  action: string;

  constructor(
    private patientAllergyService: PatientAllergyService,
    private spinner: SpinnerService,
    private snackBar: MatSnackBar,
    private appMessages: AppMessagesService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getPatientAllergies();
  }

  getPatientAllergies() {
    if (this.patientId != undefined) {
      this.controllerUrl = `${environment.baseurl}/patientAllergies/`;
      this.setupDataSource({
        key: 'id',
        loadParamsCallback: () => [
          { name: 'patientId', value: this.patientId },
        ],
      });
    }
  }

  saved(e) {
    if (e.success) {
      if (this.action == "Add") {
        this.snackBar.open("Allergy added", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
      }
      if (this.action == "Edit") {
        this.snackBar.open("Allergy edited", "Close", {
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
    this.updated.emit();
    this.getPatientAllergies();
  }

  public add() {
    this.action = "Add";
    this.selectedRecord = { id: 0, patientId: this.patientId };
  }

  public editClicked(e) {
    this.action = "Edit";
    this.selectedRecord = { id: e.data.id };
  }

  public deleteClicked(e) {
    const text = 'Are you sure you want to delete this allergy?'

    const callback = () => {
      this.spinner.start();
      this.patientAllergyService.deletePatientAllergy(e.data.id).subscribe(
        (x) => {
          this.spinner.stop();
          this.snackBar.open("Allergy deleted", "Close", {
            panelClass: "badge-success",
            duration: 3000,
          }
          );
          this.updated.emit();
          this.refreshData();
        },
        (e) => {
          this.spinner.stop(); this.appMessages.showApiErrorNotification(e)
        }
      );
    };

    this.appMessages.showDeleteConfirmation(callback, text);
  }
}