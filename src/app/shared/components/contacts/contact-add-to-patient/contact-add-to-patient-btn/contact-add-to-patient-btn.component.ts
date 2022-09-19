import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AppInfoService } from "src/app/shared/services/app-info.service";

@Component({
  selector: "app-contact-add-to-patient-btn",
  templateUrl: "./contact-add-to-patient-btn.component.html",
  styleUrls: ["./contact-add-to-patient-btn.component.scss"],
})
export class ContactAddToPatientBtnComponent implements OnInit {
  constructor(public appInfo: AppInfoService) { }

  @Input() patientId: string;
  @Input() contactId: string;

  @Output() connectionAdded = new EventEmitter();

  showReferrers = false;
  showExistingContactsList = false;
  showAddContact = false;
  organisationId: string;
  contactClassification: number;

  items = [
    { id: 2, description: "New Person", icon: "far fa-user" },
    { id: 3, description: "New Organisation", icon: "far fa-users" },
  ];

  ngOnInit() { }

  itemClicked(item) {
    switch (item.id) {
      case 1:
        this.showExistingContactsList = true;
        break;
      case 2:
        this.contactClassification = 1;
        this.showAddContact = true;
        break;
      case 3:
        this.contactClassification = 2;
        this.showAddContact = true;
        break;
      default:
        break;
    }
  }

  selectedExistingContact(item) {
    this.contactId = item.contactId;
    this.organisationId = item.connectionId;
    this.showExistingContactsList = false;
    this.showReferrers = true;
  }

  addedContact(item) {
    const contactId = item.data.contactId;
    this.contactClassification = 1 ? this.contactId = contactId : this.organisationId = contactId;
    this.showAddContact = false;
    this.showReferrers = true;
  }
}