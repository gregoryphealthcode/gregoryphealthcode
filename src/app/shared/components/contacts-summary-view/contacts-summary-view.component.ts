import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from '../../base/subscribtion.base';
import { ContactDetails } from '../../models/ContactDetails';
import { AppInfoService } from '../../services/app-info.service';
import { ContactService, Address, TelecomsViewModel, } from '../../services/contact.service';

@Component({
  selector: 'app-contacts-summary-view',
  templateUrl: './contacts-summary-view.component.html',
  styleUrls: ['./contacts-summary-view.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})

@AutoUnsubscribe
export class ContactsSummaryViewComponent extends SubscriptionBase implements OnInit {
  constructor(
    private contactService: ContactService,
    public appInfo: AppInfoService,
    private router: Router) {
    super();
  }

  @Input() showButton = true;
  @Input() showTitle = true;
  @Input() isInPatientDetails = false;
  @Input() isInConnection = false;
  @Input() isInContactDetails = false;
  @Input() addToContact = false;
  @Input() addToPatient = false;
  @Input() showButtons = true;
  @Input() isInPopup: boolean;
  @Input() set contactId(value: string) {
    if (value) {
      this._contactId = value;
      this.getData()
    }
  };
  get contactId() {
    return this._contactId
  };

  @Output() addContactToParentHandler = new EventEmitter();
  @Output() addContactToPatient = new EventEmitter();
  @Output() selectedContactId = new EventEmitter();
  @Output() editSelected = new EventEmitter<any>();

  private _contactId: string;

  contact: any;
  connections: any[];
  isPerson = false;
  primaryAdress: Address;
  billingAdress: Address;
  showDepartments: boolean;
  preferredMethod: string;
  preferredMethodValue: string;
  telecomSystem: TelecomsViewModel[] = [];
  organisations: ContactDetails[] = [];
  departments: ContactDetails[] = [];
  department: string;
  showPrimaryAddress = true;
  addressId: any;
  telecomId: any;
  contactToEdit: any;
  contactClassification: number;

  ngOnInit(): void {
  }

  enableScroll(e) {
    const elem = e.currentTarget;
    if (elem) {
      elem.addEventListener("wheel", e => e.stopPropagation());
      elem.addEventListener("touchmove", e => e.stopPropagation());
    }
  }

  getData() {
    this.subscription.add(
      this.contactService.getContactPreviewDetails(this.contactId).subscribe(x => {
        this.contact = x;
        this.contactClassification = this.contact.contactType.contactClassificationId;
        if (this.contact.contactType.contactClassificationId === 1) {
          this.connections = this.contact.linkedOrganisations;
          this.isPerson = true;
        } else {
          this.connections = this.contact.linkedContacts;
          this.isPerson = false;
        }
      })
    )
  }

  getBackgroundColor(data) {
    return data.backgroundColor;
  }

  getPhone(data) {
    return data.replace(/\s/g, "");
  }

  editContactDetails(contactId) {
    this.editSelected.emit(contactId)
  }

  addContactToParent(e) {
    if (this.departments.length > 0) {
      this.showDepartments = true;
    }
    else {
      this.addContactToParentHandler.emit(e);
    }
  }

  addContactToPatientClick(e) {
    this.addContactToPatient.emit(e);
  }

  linkToDepartment() {
  }

  continue() {
  }

  getDepartment(e) {
    if (e !== undefined) {
      this.department = e.selectedItem.contactId;
    }
  }

  routeToContact(contactId) {
    this.router.navigate(["/view-contact/" + contactId]);
  }
}
