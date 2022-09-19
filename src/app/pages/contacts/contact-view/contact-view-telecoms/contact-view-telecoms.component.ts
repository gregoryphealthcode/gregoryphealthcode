import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { ContactTelecomModel } from 'src/app/shared/services/contact.service';
import { ContactViewStore } from '../contact-view-store.service';

@Component({
  selector: 'app-contact-view-telecoms',
  templateUrl: './contact-view-telecoms.component.html',
  styleUrls: ['./contact-view-telecoms.component.scss']
})
export class ContactViewTelecomsComponent extends SubscriptionBase implements OnInit {
  telecoms: ContactTelecomModel[];

  constructor(
    public store: ContactViewStore
  ) {
    super()
  }

  ngOnInit() {
    this.addToSubscription(
      this.store.contact$.pipe(tap(x => {
        if (x) {
          this.telecoms = x.telecoms;
        }
      }))
    )
  }
}