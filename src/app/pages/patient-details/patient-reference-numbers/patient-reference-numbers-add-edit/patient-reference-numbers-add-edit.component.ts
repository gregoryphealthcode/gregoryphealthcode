import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { AppInfoService, ReferenceNumberTypes } from 'src/app/shared/services';
import { SitesService } from 'src/app/shared/services/sites.service';

@Component({
  selector: 'app-patient-reference-numbers-add-edit',
  templateUrl: './patient-reference-numbers-add-edit.component.html',
  styleUrls: ['./patient-reference-numbers-add-edit.component.scss']
})
export class PatientReferenceNumbersAddEditComponent extends PopupReactiveFormBase implements OnInit {
  referenceNumberTypes: ReferenceNumberTypes[] = [];

  protected controllerName = "patientReferenceNumbers";
  protected onOpened = (data) => {
    this.getReferenceNumberTypes();
    this.setup(data);
  };

  constructor(
    private siteService: SitesService,    public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit() {
    this.setupForm();
  }

  getReferenceNumberTypes() {
    this.siteService.getPatientReferenceNumberTypes().subscribe(data => {
      this.referenceNumberTypes = data;
    });
  }

  private setupForm() {
    this.editForm = new FormGroup({
      referenceNumberId: new FormControl(null),
      patientId: new FormControl(null),
      refNoType: new FormControl(null, Validators.required),
      refNoValue: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
    });
  }
}
