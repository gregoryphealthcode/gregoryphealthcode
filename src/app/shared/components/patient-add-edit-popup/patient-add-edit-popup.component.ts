import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddPatientBase } from 'src/app/shared/components/patient-add-edit-popup/add-patient-base';
import { AppInfoService } from '../../services';
import { PatientService } from '../../services/patient.service';
import { SitesService } from '../../services/sites.service';
import { SpinnerService } from '../../services/spinner.service';
import { SitesStore } from '../../stores/sites.store';
import { Router } from "@angular/router";
import { AutoPopModel } from '../../services/billing.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-patient-add-edit-popup',
  templateUrl: './patient-add-edit-popup.component.html',
  styleUrls: ['./patient-add-edit-popup.component.scss']
})
export class PatientAddEditPopupComponent extends AddPatientBase {
  constructor(
    siteService: SitesService,
    siteStore: SitesStore,
    snackBar: MatSnackBar,
    public spinnerService: SpinnerService,
    public appInfo: AppInfoService,
    public router: Router,
    patientService: PatientService,
    formBuilder: FormBuilder,
    userSite: UserService,
  ) {
    super(siteService, siteStore, snackBar, spinnerService, appInfo, router, patientService, formBuilder, userSite);
  }

  @Input() get autoPopDetails(): AutoPopModel {
    return this._autoPopDetails;
  }
  set autoPopDetails(value: AutoPopModel) {
    this._autoPopDetails = value;
    this.populateForm(value);
  }

  @Output() patientSelected = new EventEmitter();
  @Output() closePopup = new EventEmitter();

  private _autoPopDetails
  public maxDate = new Date();

  afterSaved = (x) => {
    this.patientSelected.emit(x.data.patientId);
    this.spinnerService.stop();
  }

  isNumber(value) {
    return Number(value);
  }

  cancel() {
    this.closePopup.emit();
  }
}
