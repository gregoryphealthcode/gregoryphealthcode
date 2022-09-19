import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { PostcodeToAddressResponseModel } from 'src/app/shared/components/postcode-to-address/postcode-to-address.service';
import { AppInfoService } from 'src/app/shared/services/app-info.service';

@Component({
  selector: 'app-group-admin-add-edit',
  templateUrl: './group-admin-add-edit.component.html',
  styleUrls: ['./group-admin-add-edit.component.scss']
})
export class GroupAdminAddEditComponent extends PopupReactiveFormBase implements OnInit {
  constructor(public appInfo: AppInfoService
  ) {
    super();
  }

  active = true;
  isPzEnabled = false;

  protected controllerName = "group";
  protected onOpened = (data) => {
    this.setupForm();
    this.setup(data);
  };

  ngOnInit() {
    this.setupForm();
  }

  protected populateForm(x) {
    super.populateForm(x);
  }

  setupForm() {
    this.editForm = new FormGroup({
      groupId: new FormControl(null),
      bureauName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      active: new FormControl(null),
      primaryContactName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      primaryContactTel: new FormControl(null, [Validators.required, Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/)]),
      postcode: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
      address1: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      address2: new FormControl(null, Validators.maxLength(50)),
      address3: new FormControl(null, Validators.maxLength(50)),
      address4: new FormControl(null, Validators.maxLength(50)),
      isPzEnabled: new FormControl(null),
      pzRegistrationReference: new FormControl(null, Validators.maxLength(250)),
      pzOrganisationCode: new FormControl(null, Validators.maxLength(10)),
      pzApiKey: new FormControl(null, Validators.maxLength(50)),
      notes: new FormControl(null),
    });
  }

  postcodeResolverAddressSelectHandler(value: PostcodeToAddressResponseModel) {
    this.updateFormAddressLines(
      value.line_1,
      value.line_2,
      value.line_3,
      value.post_Town
    );
  }

  private updateFormAddressLines(
    line1: string,
    line2: string,
    line3: string,
    line4: string
  ) {
    this.editForm.patchValue({
      address1: line1,
      address2: line2,
      address3: line3,
      address4: line4,
    });
  }
}