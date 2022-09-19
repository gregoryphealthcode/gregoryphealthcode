import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Guid from 'devextreme/core/guid';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { PatientService } from 'src/app/shared/services/patient.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-patient-lifestyle',
  templateUrl: './patient-lifestyle.component.html',
  styleUrls: ['./patient-lifestyle.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' },
})

export class PatientLifestyleComponent extends GridBase implements OnInit {
  @Input() category: string;
  @Input() patientId: Guid;

  @Output() updated = new EventEmitter();

  isEdit = false;
  showPanel = false;
  showPopup: boolean;
  dataPointId: Guid;

  constructor(
    private patientService: PatientService,
    private snackBar: MatSnackBar,
    private appMessages: AppMessagesService, public appInfo: AppInfoService

  ) {
    super();
  }

  onSuccessfullySaved = (x) => {
    this.updated.emit();
  }

  ngOnInit(): void {
    if (this.patientId != undefined) {
      this.controllerUrl = `${environment.baseurl}/patientDataPoints/`;
      this.setupDataSource({
        key: 'dataPointId',
        loadParamsCallback: () => [
          { name: 'patientId', value: this.patientId },
          { name: 'category', value: this.category },
        ],
      });
    }
  }

  add() {
    this.isEdit = false;
    this.showPopup = true;
  }

  editClicked(e) {
    this.isEdit = true;
    this.dataPointId = e.data.dataPointId;
    this.showPopup = true;
  }

  deleteClicked(e) {
    const text = 'Are you sure you want to delete this?'

    const callback = () => {
      this.patientService.deletePatientDataPoint(e.data.dataPointId).subscribe(x => {
        if (x.success) {
          this.snackBar.open('Data point deleted successfully', 'Close', {
            panelClass: 'badge-success',
            duration: 3000,
          });
          this.updated.emit();
          this.refreshData();
        }
        else {
          this.snackBar.open(x.errors[0], 'Close', {
            panelClass: 'badge-danger',
            duration: 3000,
          });
        }
      })
    };

    this.appMessages.showDeleteConfirmation(callback, text);
  }

  closePopup(e) {
    this.showPopup = false;
    this.isEdit = false;
    if (e) {
      this.snackBar.open('Data point added successfully', 'Close', {
        panelClass: 'badge-success',
        duration: 3000,
      });
      this.updated.emit();
      this.refreshData()
    }
  }
}
