import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { DuplicatePatientDetails } from 'src/app/shared/services/patient.service';
import { Router } from '@angular/router';
import { AppInfoService, PatientDetailsModel } from 'src/app/shared/services';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-duplicate-patient-popup',
  templateUrl: './duplicate-patient-popup.component.html',
  styleUrls: ['./duplicate-patient-popup.component.scss']
})
export class DuplicatePatientPopupComponent implements OnInit {
  @Output()
  public confirmAdd = new EventEmitter<any>();
  @Output()
  public closeDuplicate = new EventEmitter<any>();

  @Input()
  get possibleDuplicates(): PatientDetailsModel[] {
    return this._possibleDuplicates;
  }
  set possibleDuplicates(value: PatientDetailsModel[]) {
    this._possibleDuplicates = value;
  }
  private _possibleDuplicates: PatientDetailsModel[];

  @Input()
  get duplicateDetails(): PatientDetailsModel {
    return this._duplicateDetails;
  }
  set duplicateDetails(value: PatientDetailsModel){
    this._duplicateDetails = value;
  }
  private _duplicateDetails: PatientDetailsModel;

  public selectedPossibleDuplicate: DuplicatePatientDetails;

  @Input()
  get displayDuplicates(): boolean {
    return this._displayDuplicates;
  }
  set displayDuplicates(value: boolean){
    this._displayDuplicates = value;
  }
  private _displayDuplicates;

  constructor(private router: Router,public appInfo: AppInfoService, public spinnerService: SpinnerService) { }

  ngOnInit() {
    
  }

  onPossDuplicateFocusedRowChanged(e) {
    this.selectedPossibleDuplicate = e.row.data;
  }

  mapDuplicateshown() {}

  openExisting() {
    this.displayDuplicates = false;
    this.spinnerService.stop();
    this.router.navigate([`/patient-details/${ this.selectedPossibleDuplicate.patientId.toString()}`]);
  }

}
