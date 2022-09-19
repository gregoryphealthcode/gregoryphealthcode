import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { ContactService } from 'src/app/shared/services/contact.service';
import { Address } from 'src/app/shared/services/contact.service';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { PostcodeToAddressResponseModel } from 'src/app/shared/components/postcode-to-address/postcode-to-address.service';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import Guid from 'devextreme/core/guid';
import { AddressTypeViewModel, SitesService } from 'src/app/shared/services/sites.service';

@Component({
  selector: 'app-edit-contact-address',
  templateUrl: './edit-contact-address.component.html',
  styleUrls: ['./edit-contact-address.component.scss']
})
@AutoUnsubscribe
export class EditContactAddressComponent extends ReactiveFormBase implements OnInit {
  constructor(
    private contactService: ContactService,
    private siteService: SitesService,
    private spinnerService: SpinnerService,
  ) {
    super();
  }

  @Input() addressId: Guid;
  @Input() isNew: boolean;
  @Input() addressesCount: number;
  @Input() contactId: Guid;

  @Output() saveAddress = new EventEmitter<Address[]>();
  @Output() deleteAddress = new EventEmitter();
  @Output() formClosed = new EventEmitter();

  editForm: FormGroup;
  addressTypes: AddressTypeViewModel[] = [];
  address: Address;

  protected httpRequest = (x) => {
    x.contactId = this.contactId;
    if (this.isNew)
      return this.contactService.addContactAddress(x);
    else {
      x.addressId = this.addressId;
      return this.contactService.updateContactAddress(x);
    }
  };

  onSuccessfullySaved = (x) => {
    this.saveAddress.emit(x);
  };

  ngOnInit() {
    this.getAddressTypes();

    this.setupForm();
    if (!this.isNew)
      this.getAddressDetails(this.addressId);
  }

  postcodeResolverAddressSelectHandler(value: PostcodeToAddressResponseModel) {
    this.updateFormAddressLines(value.line_1, value.post_Town, value.line_3, value.county);
  }

  getAddressTypes() {
    this.siteService.getAddressTypes().subscribe((value) => {
      this.addressTypes = value;
    });
  }

  getAddressDetails(addressId) {
    this.spinnerService.start();
    this.contactService.getContactAddressDetails(addressId).subscribe(x => {
      this.address = x;
      super.populateForm(x);
      this.spinnerService.stop();
    });
  }

  private updateFormAddressLines(line1: string, line2: string, line3: string, line4: string) {
    this.editForm.patchValue({ address1: line1 });
    this.editForm.patchValue({ address2: line2 });
    this.editForm.patchValue({ address3: line3 });
    this.editForm.patchValue({ address4: line4 });
  }

  private setupForm() {
    this.editForm = new FormGroup({
      addressType: new FormControl(null, Validators.required),
      address1: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      address2: new FormControl(null, Validators.maxLength(50)),
      address3: new FormControl(null, Validators.maxLength(50)),
      address4: new FormControl(null, Validators.maxLength(50)),
      postcode: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
      primaryAddress: new FormControl(null, null),
      billingAddress: new FormControl(null, null),
    });
    if (this.isNew && this.addressesCount < 1) {
      this.editForm.get("primaryAddress").setValue(true);
      this.editForm.get("billingAddress").setValue(true);
    }
  }
}
