import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { thickness } from 'devexpress-reporting/scopes/reporting-chart-internal';
import { AddPatientRequestInsurerDto, AppInfoService } from 'src/app/shared/services';
import { AutoPopModel } from 'src/app/shared/services/billing.service';
import { PatientInsurerViewModel } from 'src/app/shared/services/patient.service';

@Component({
  selector: 'app-new-patient-insurers',
  templateUrl: './new-patient-insurers.component.html',
  styleUrls: ['./new-patient-insurers.component.scss']
})
export class NewPatientInsurersComponent implements OnInit {
  @Input() isNewPatient: boolean;

  @Input() get autoPopInsurer(): PatientInsurerViewModel {
    return this._autoPopInsurer;
  }
  set autoPopInsurer(value: PatientInsurerViewModel) {
    this._autoPopInsurer = value;
    this.addAutoPopInsurer(value)
      ;
  }

  @Output() insurersChange = new EventEmitter<AddPatientRequestInsurerDto[]>();

  public set insurers(value: AddPatientRequestInsurerDto[]) {
    this._insurers = value;
    this.insurersChange.emit(value);
  }
  public get insurers() { return this._insurers; }
  private _insurers: AddPatientRequestInsurerDto[] = [];
  private _autoPopInsurer: PatientInsurerViewModel;

  public showAddEditInsurer: boolean;
  public viewModel: AddPatientRequestInsurerDto;
  public isNewInsurer: boolean;


  constructor(public appInfo: AppInfoService) { }

  ngOnInit() {
    if (!this.autoPopInsurer)
      this.insurers = [];
  }

  addAutoPopInsurer(data) {
    if (data) {
      let model = new AddPatientRequestInsurerDto();
      model.insurerId = data.insurerId;
      model.insurerName = data.insurerName;
      model.isPrimary = true;

      this.saveInsurerHandler(model);
    }
  }

  openAddInsurerPopup() {
    this.viewModel = new AddPatientRequestInsurerDto();
    this.showAddEditInsurer = true;
    this.isNewInsurer = true;
  }

  editInsurer(model: AddPatientRequestInsurerDto) {
    this.viewModel = model;
    this.showAddEditInsurer = true;
    this.isNewInsurer = false;
  }

  removeInsurer(model: AddPatientRequestInsurerDto) {
    this.insurers = this.insurers.filter(x => x.insurerId !== model.insurerId);
  }

  saveInsurerHandler(model: AddPatientRequestInsurerDto) {
    if (model.isPrimary) {
      this.insurers.forEach(x => x.isPrimary = false);
    }
    this.showAddEditInsurer = false;
    let existingInsurerIndex = this.insurers.findIndex(x => x.insurerId === model.insurerId);

    if (existingInsurerIndex === -1) {
      this.insurers.push(model);
      return;
    }

    this.insurers[existingInsurerIndex] = model;

  }
}
