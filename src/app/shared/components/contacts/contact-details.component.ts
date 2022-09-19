import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContactService, ContactDetailsModel, ContactGridModel } from '../../services/contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SitesStore } from '../../stores/sites.store';
import { SubscriptionBase } from '../../base/subscribtion.base';
import Guid from 'devextreme/core/guid';
import { AppInfoService } from '../../services/app-info.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' },
})
@AutoUnsubscribe
export class ContactDetailsComponent extends SubscriptionBase implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private contactService: ContactService,
    private siteStore: SitesStore, public appInfo: AppInfoService
  ) {
    super();
    this.route.queryParams.subscribe(params => {
      this.contactId = params.contactId;
    });
  }

  @Input() contactId: Guid;
  @Input() siteId: Guid;
  @Input() isInPopup = false;
  @Input() contactClassification: number;
  @Input() isEdit: boolean;
  @Input() organisationId: Guid;

  @Output() closePopup = new EventEmitter();

  connectionId: Guid;
  contactDetails: ContactDetailsModel;
  connections: ContactGridModel[];
  isGP: boolean;
  tabIndex = 0;
  showEditContact: boolean;
  showConnection: boolean;

  ngOnInit(): void {
    this.siteId = this.siteStore.getSelectedSite().siteId;
    this.getContactDetails();
    this.getConnections();
  }

  getContactDetails() {
    this.contactService.getContactDetails(this.contactId).subscribe(x => {
      this.contactDetails = x;
      this.contactClassification = x.contactType.contactClassificationId;
      if (this.contactDetails.contactType.contactType == "GP")
        this.isGP = true;

      if (this.isInPopup && this.isEdit)
        this.showEditContact = true;
    });
  }

  editContact() {
    this.showEditContact = true;
  }

  getConnections() {
    this.contactService.getConnections(this.contactId, this.siteId).subscribe((value) => {
      this.connections = value;
    })
  }

  unlinkConnection() {
    this.contactService.deleteConnection(this.contactId, this.connectionId).subscribe(x => {
      this.getConnections();
    })
  }

  updateContact(e) {
    this.contactService.getContactDetails(this.contactId).subscribe(x => {
      this.contactDetails = x;
    });
  }

  updateConnections() {
    this.showConnection = false;
    this.contactService.getConnections(this.contactId, this.siteId).subscribe(x => {
      this.connections = x;
    })
  }

  addConnection() {
    this.showConnection = true;
  }

  connectionsRowChanged(e) {
    this.connectionId = e.row.data.contactId;
  }

  close() {
    if (this.isInPopup) {
      this.closePopup.emit();
    } else {
      this.router.navigate(['/list-contacts']);
    }
  }

  indexValue(e) {
    this.tabIndex = e;
  }
}