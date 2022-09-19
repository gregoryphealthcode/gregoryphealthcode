import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import DataSource from 'devextreme/data/data_source';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { AllergyModel, AllergySeverityModel, AllergyTypeModel, PatientAllergyService } from 'src/app/shared/services/patient-allergy.service';

@Component({
  selector: 'app-patient-allergies-add-edit',
  templateUrl: './patient-allergies-add-edit.component.html',
  styleUrls: ['./patient-allergies-add-edit.component.scss']
})
export class PatientAllergiesAddEditComponent extends PopupReactiveFormBase implements OnInit {
  allergies: AllergyModel[];
  types: AllergyTypeModel[];
  severities: AllergySeverityModel[];
  source: DataSource;

  protected controllerName = "patientAllergies";
  protected onOpened = (data) => {
    this.getDropdownData();
    this.setup(data);
  };

  constructor(
    private patientAllergyService: PatientAllergyService, public appInfo: AppInfoService
  ) {
    super()
  }

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    this.editForm = new FormGroup({
      id: new FormControl(undefined),
      patientId: new FormControl(undefined),
      allergyCode: new FormControl(undefined, Validators.required),
      allergyTypeId: new FormControl(undefined, Validators.required),
      allergySeverityId: new FormControl(undefined, Validators.required),
      notes: new FormControl(undefined, Validators.maxLength(500)),
    });
  }

  private getDropdownData() {
    this.patientAllergyService.getAllergies().subscribe(x => {
      this.allergies = x;
      this.source = new DataSource({
        store: {
          data: this.allergies,
          type: 'array',
        },
        paginate: true,
        pageSize: 50,
      })
    });
    this.patientAllergyService.getAllergySeverity().subscribe(y => {
      this.severities = y;
    });
    this.patientAllergyService.getAllergyIntolerance().subscribe(z => {
      this.types = z;
    });
  }
}
