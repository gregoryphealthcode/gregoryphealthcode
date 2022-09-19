import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppInfoService } from 'src/app/shared/services/app-info.service';

@Component({
  selector: 'app-edit-contact-address-modal',
  templateUrl: './edit-contact-address-modal.component.html',
  styleUrls: ['./edit-contact-address-modal.component.scss']
})
export class EditContactAddressModalComponent implements OnInit {
  @Input() set addressId(value: any) {
    if (value && value.id) {
      if (value.id === "0") {
        this.isNew = true;
      } else {
        this._addressId = value.id;
        this.isNew = false;
      }

      this.show = true;
    }
  }
  get addressId() {
    return this._addressId;
  }
  @Input() set contact(x: any) {
    if (x) {
      this._contact = x;
      if (x.addresses) {
        this.addressesCount = x.addresses.length;
      } else {
        this.addressesCount = 0;
      }
      this.isOrganisation = x.contactType.contactClassificationId > 1;
    }
  }
  get contact() {
    return this._contact;
  }

  @Output() saved = new EventEmitter<any>();

  private _addressId: string;
  private _contact: string;

  addressesCount: number;
  isOrganisation: boolean;
  show: boolean;
  isNew: boolean;

  constructor(public appInfo: AppInfoService) { }

  ngOnInit() { }
}