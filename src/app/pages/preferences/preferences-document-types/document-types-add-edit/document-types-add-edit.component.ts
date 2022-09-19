import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';

@Component({
  selector: 'app-document-types-add-edit',
  templateUrl: './document-types-add-edit.component.html',
  styleUrls: ['./document-types-add-edit.component.scss']
})
export class DocumentTypesAddEditComponent extends PopupReactiveFormBase implements OnInit {
  constructor(public appInfo: AppInfoService) {
    super()
  }

  protected controllerName = "documentType";
  protected onOpened = (data) => {
    this.setup(data);
    if (this.isNew)
      this.patch();
  };

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    this.editForm = new FormGroup({
      id: new FormControl(undefined),
      description: new FormControl(undefined, [Validators.required, Validators.maxLength(200)]),
      active: new FormControl(undefined),
    });
  }

  patch() {
    this.editForm.patchValue({ id: null });
    this.editForm.patchValue({ active: true });
  }
}