import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { requiredIfValidator } from 'src/app/shared/helpers/form-helper';
import { AppInfoService } from 'src/app/shared/services/app-info.service';

@Component({
  selector: 'app-reference-numbers-add-edit',
  templateUrl: './reference-numbers-add-edit.component.html',
  styleUrls: ['./reference-numbers-add-edit.component.scss']
})
export class ReferenceNumbersAddEditComponent extends PopupReactiveFormBase implements OnInit {
  autoIncrement = false;

  protected controllerName = "patientReferenceNumberTypes";
  public activeRecord = true;
  protected onOpened = (data) => {
    this.setupForm();
    this.setup(data);
  };

  constructor(public appInfo: AppInfoService) { super() }

  ngOnInit() {  
    
  }

  private setupForm() {
    this.editForm = new FormGroup({
      id: new FormControl(null),
      numberType: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
      description: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      alwaysAdd: new FormControl(null, null),
      numericOnly: new FormControl(null, null),
      autoIncrement: new FormControl(null, null),
      nextNumber: new FormControl(null, requiredIfValidator(() => this.autoIncrement)),
      prefix: new FormControl(null, Validators.maxLength(5)),
      suffix: new FormControl(null, Validators.maxLength(5)),
      active: new FormControl(this.activeRecord, null)
    });

    this.subscription.add(this.editForm.get('autoIncrement').valueChanges.subscribe(x => {
      this.autoIncrement = x;
      this.editForm.get('nextNumber').updateValueAndValidity();
    }))
  }
}
