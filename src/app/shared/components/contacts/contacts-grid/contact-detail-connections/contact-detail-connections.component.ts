import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { Address, ContactDetailsModel, ContactService } from 'src/app/shared/services/contact.service';

@Component({
  selector: 'app-contact-detail-connections',
  templateUrl: './contact-detail-connections.component.html',
  styleUrls: ['./contact-detail-connections.component.scss']
})
export class ContactDetailConnectionsComponent extends SubscriptionBase implements OnInit {
  @Input() contactId: string;

  @Output() addedConnection = new EventEmitter<ContactDetailsModel>();

  records: any[] = [];
  count = 0;

  constructor(
    private contactService: ContactService
  ) {
    super()
  }

  ngOnInit() {
    this.contactService.getContactDetails(this.contactId).subscribe((x: any) => {
      this.records = x.linkedChildren;
      this.records = this.records.concat(x.linkedParents);

      this.count = this.records.length;
      this.records.forEach(e => {
        if (e.telecoms && e.telecoms.length > 0) {
          e.preferredTelecom = e.telecoms.find(t => t.preferred);
        }
      });
      this.records = this.records.filter(x => x.contactClassification === "Department");
    });
  }

  getBackgroundColor(cellInfo) {
    return cellInfo.data.backgroundColor;
  }

  connectionSelected(e) {
    this.addedConnection.emit(e);
  }
}
