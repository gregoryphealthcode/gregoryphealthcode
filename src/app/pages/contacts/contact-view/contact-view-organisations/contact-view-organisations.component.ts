import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { ContactDetailsModel } from 'src/app/shared/services/contact.service';
import { ContactViewStore } from '../contact-view-store.service';

@Component({
  selector: 'app-contact-view-organisations',
  templateUrl: './contact-view-organisations.component.html',
  styleUrls: ['./contact-view-organisations.component.scss']
})
export class ContactViewOrganisationsComponent extends SubscriptionBase implements OnInit {
  records: ContactDetailsModel[];

  constructor(
    public store: ContactViewStore
  ) {
    super()
  }

  ngOnInit() {
    this.addToSubscription(
      this.store.linkedContacts$.pipe(tap(x => {
        if (x) {
          if (x.contactType.contactClassificationId > 1) { //is Organisation
            this.records = x.linkedContacts;
          }
          else {
            this.records = x.linkedOrganisations;
          }
          this.records.forEach(e => {
            if (e.telecoms && e.telecoms.length > 0) {
              e.preferredTelecom = e.telecoms.find(t => t.preferred);
            }
          })
        }          
      }))
    )       
  }

  getBackgroundColor(cellInfo) {
    return cellInfo.data.backgroundColor;
  }
}