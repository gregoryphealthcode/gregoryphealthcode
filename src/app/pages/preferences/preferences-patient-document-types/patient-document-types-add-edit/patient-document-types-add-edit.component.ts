import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';

@Component({
  selector: 'app-patient-document-types-add-edit',
  templateUrl: './patient-document-types-add-edit.component.html',
  styleUrls: ['./patient-document-types-add-edit.component.scss']
})
export class PatientDocumentTypesAddEditComponent extends PopupReactiveFormBase implements OnInit {
  constructor(public appInfo: AppInfoService) {
    super()
  }

  protected controllerName = "patientDocumentType";
  protected onOpened = (data) => {
    this.setupForm();
    this.setup(data);
    if (this.isNew)
      this.patch();
  };

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    this.editForm = new FormGroup({
      patientDocumentTypeId: new FormControl(undefined),
      description: new FormControl(undefined, [Validators.required, Validators.maxLength(200)]),
      active: new FormControl(false),
    });
  }

  patch() {
    this.editForm.patchValue({ patientDocumentTypeId: null });
    this.editForm.patchValue({ active: true });
  }
}