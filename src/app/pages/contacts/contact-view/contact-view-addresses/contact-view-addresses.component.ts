import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { Address } from 'src/app/shared/services/contact.service';
import { ContactViewStore } from '../contact-view-store.service';

@Component({
  selector: 'app-contact-view-addresses',
  templateUrl: './contact-view-addresses.component.html',
  styleUrls: ['./contact-view-addresses.component.scss']
})
export class ContactViewAddressesComponent extends SubscriptionBase implements OnInit {
  addresses: Address[]

  constructor(
    private store: ContactViewStore
  ) {
    super()
  }

  ngOnInit() {
    this.addToSubscription(
      this.store.addresses$.pipe(tap(x => this.addresses = x))
    )
  }

  editAddress(data) {
    this.store.showUpdateAddress(data.data.addressId);
  }

  public doubleClickHandled(e) {
    console.log(e);
    this.store.showUpdateAddress(e.data.addressId);
  }

  delete(e) {
    this.store.deleteAddress(e.data.addressId)
  }
}