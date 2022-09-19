import { Component, OnInit, Input } from '@angular/core';
import { Address } from 'src/app/shared/services/contact.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostcodeToAddressResponseModel } from 'src/app/shared/components/postcode-to-address/postcode-to-address.service';
import { AddressTypeViewModel, SitesService } from 'src/app/shared/services/sites.service';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';

@Component({
  selector: 'app-patient-address-edit-modal',
  templateUrl: './patient-address-edit-btn.component.html',
  styleUrls: ['./patient-address-edit-btn.component.scss']
})
export class PatientAddressEditBtnComponent extends PopupReactiveFormBase implements OnInit {
  constructor(
    private siteService: SitesService,
    public appInfo: AppInfoService
  ) {
    super();
  }

  protected controllerName = "patientAddress";
  protected onOpened = (data) => {
    this.getAddressTypes();
    this.setupForm();
    this.setup(data);
    if (this.isNew)
      this.setPrimaryAndBilling();
  };

  @Input() addresses: Address[];

  addressTypes: AddressTypeViewModel[] = [];

  ngOnInit() {
    if (this.isNew)
      this.setPrimaryAndBilling();
  }

  getAddressTypes() {
    this.siteService.getAddressTypes().subscribe(x => {
      this.addressTypes = x;
    })
  }

  private setupForm() {
    this.editForm = new FormGroup({
      patientId: new FormControl(null),
      addressId: new FormControl(null),
      addressType: new FormControl(null, Validators.required),
      address1: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      address2: new FormControl(null, Validators.maxLength(50)),
      address3: new FormControl(null, Validators.maxLength(50)),
      address4: new FormControl(null, Validators.maxLength(50)),
      postcode: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
      primaryAddress: new FormControl(null, null),
      billingAddress: new FormControl(null, null),
    });
  }

  setPrimaryAndBilling() {
    const hasBillingAddress = this.addresses?.find(x => x.billingAddress)?.billingAddress;
    const hasPrimaryAddress = this.addresses?.find(x => x.primaryAddress)?.primaryAddress;

    if (hasBillingAddress === undefined) {
      this.editForm.patchValue({ billingAddress: true });
    }
    if (hasPrimaryAddress === undefined) {
      this.editForm.patchValue({ primaryAddress: true });
    }
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

