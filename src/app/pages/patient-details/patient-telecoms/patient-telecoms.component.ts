import { Component, OnDestroy, OnInit, Input, } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { SitesService } from 'src/app/shared/services/sites.service';
import { PatientService } from 'src/app/shared/services/patient.service';
import { AppInfoService, PatientTelecom, TelecomTypes, } from 'src/app/shared/services';
import { FormGroup, } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogTemplateComponent } from 'src/app/shared/components/dialog/dialog-template.component';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';

@Component({
  selector: 'app-patient-telecoms',
  templateUrl: './patient-telecoms.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
})
@AutoUnsubscribe
export class PatientTelecomsComponent extends SubscriptionBase implements OnDestroy, OnInit {
  @Input() siteId: string;
  @Input() patientId: string;

  showPopup: boolean;
  telecoms: PatientTelecom[] = [];
  form: FormGroup;
  isNew = false;
  showPanel = false;
  telecomId: string;
  telecomTypes: TelecomTypes[] = [];

  constructor(
    private siteService: SitesService,
    private patientService: PatientService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    public appInfo: AppInfoService,
    private appMessage: AppMessagesService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.patientId !== undefined) {
      this.getPatientTelecoms();
    }
  }

  getPatientTelecoms() {
    this.subscription.add(
      this.patientService.getPatientTelecoms(this.patientId).subscribe((data) => {
        this.telecoms = data;
      })
    );
  }

  private edit(data: any) {
    this.isNew = false;
    this.telecomId = data;
    this.showPopup = true;
  }

  onFocusedRowChanged(e) {
    this.isNew = false;
    this.showPanel = true;
    this.telecomId = e.row.data.telecomId;
  }

  editClicked(e) {
    this.isNew = false;
    this.telecomId = e.row.data.telecomId;
    this.showPopup = true;
  }

  add() {
    this.isNew = true;
    this.showPanel = true;
    this.showPopup = true;
  }

  hidePopup() {
    this.showPopup = false;
  }

  telecomSaved() {
    this.showPopup = false;
    this.snackBar.open('Telecom added successfully', 'Close', {
      panelClass: 'badge-success',
      duration: 3000,
    });
    this.getPatientTelecoms();
  }

  deleteClicked(e) {
    const callback = () => {
      this.spinnerService.start();
      this.patientService.deletePatientTelecom(e.row.data.telecomId).subscribe(
        (data) => {
          this.snackBar.open('Telecom deleted successfully', 'Close', {
            panelClass: 'badge-success',
            duration: 3000,
          });
          this.showPanel = false;
          this.getPatientTelecoms();
          this.spinnerService.stop();
          this.hidePopup();
        },
        (error) => {
          this.snackBar.open('An error occurred', 'Close', {
            panelClass: 'badge-danger',
            duration: 3000,
          });
          this.spinnerService.stop();
        }
      );
    }

    this.appMessage.showDeleteConfirmation(callback, "Are you sure you want to delete this patient telecom?");
  }
}