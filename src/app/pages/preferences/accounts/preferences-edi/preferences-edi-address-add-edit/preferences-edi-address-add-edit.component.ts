import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { PostcodeToAddressResponseModel } from 'src/app/shared/components/postcode-to-address/postcode-to-address.service';
import { SitesService } from 'src/app/shared/services/sites.service';
import { InsurersViewModel, UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-preferences-edi-address-add-edit',
  templateUrl: './preferences-edi-address-add-edit.component.html',
  styleUrls: ['./preferences-edi-address-add-edit.component.scss']
})
export class PreferencesEdiAddressAddEditComponent extends PopupReactiveFormBase implements OnInit {
  insurers: InsurersViewModel[] = [];
  addressTypes = [
    { id: 1, value: "Site" },
    { id: 2, value: "Paper Bills" },
  ]

  protected controllerName = "glu_EDIInsurerAddress";
  protected onOpened = (data) => {
    this.setupForm();
    this.setup(data);
  };

  constructor(
    private userService: UserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getInsurers();
    this.setupForm();
  }

  getInsurers() {
    this.userService.getInsurers().subscribe(data => {
      this.insurers = data;
      this.insurers.sort(function (a, b) {
        if (a.insurerName < b.insurerName) return -1;
        if (a.insurerName > b.insurerName) { return 1; }
        return 0;
      })
    })
  }

  setupForm() {
    this.editForm = new FormGroup({
      id:  new FormControl(undefined),
      insurerId: new FormControl(undefined, Validators.required), 
      addressType: new FormControl(undefined, Validators.required),
      address1: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      address2: new FormControl(null, Validators.maxLength(50)),
      address3: new FormControl(null, Validators.maxLength(50)),
      address4: new FormControl(null, Validators.maxLength(50)),
      postcode: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
    });
  }

  postcodeResolverAddressSelectHandler(value: PostcodeToAddressResponseModel) {
    this.updateFormAddressLines(value.line_1, value.post_Town, value.line_3, value.county);
  }

  private updateFormAddressLines(line1: string, line2: string, line3: string, line4: string) {
    this.editForm.patchValue({ address1: line1 });
    this.editForm.patchValue({ address2: line2 });
    this.editForm.patchValue({ address3: line3 });
    this.editForm.patchValue({ address4: line4 });
  }
}