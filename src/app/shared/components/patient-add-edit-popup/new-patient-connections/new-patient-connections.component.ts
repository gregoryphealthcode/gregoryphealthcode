import { Component, OnInit, Output, ViewChild, EventEmitter, Input } from '@angular/core';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { ContactTypeViewModel } from 'src/app/shared/models/ContactTypeViewModel';
import { ContactModel, ContactService, PatientContactDetails } from 'src/app/shared/services/contact.service';
import { DxPopupComponent } from 'devextreme-angular';
import Guid from 'devextreme/core/guid';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { AutoPopModel } from 'src/app/shared/services/billing.service';
import { AppInfoService } from 'src/app/shared/services/app-info.service';

@Component({
  selector: 'app-new-patient-connections',
  templateUrl: './new-patient-connections.component.html',
  styleUrls: ['./new-patient-connections.component.scss']
})
export class NewPatientConnectionsComponent extends SubscriptionBase implements OnInit {
  @Input() get autoPopContact(): string {
    return this._autoPopContact;
  }
  set autoPopContact(value: string) {
    this._autoPopContact = value;
    this.addAutoPopContact(value);
  }

  @Output() contactsChange = new EventEmitter<ContactModel[]>();

  public set contacts(value: ContactModel[]) {
    this._contacts = value;
    this.contactsChange.emit(value);
  }
  public get contacts() {
    return this._contacts;
  }
  private _contacts: ContactModel[] = [];
  private _autoPopContact: string;

  contactList: ContactModel[];
  model: ContactModel;
  showAddConnectionPopup = false;
  showAddNewConnectionPopup = false;
  showConnectionInfoPopup = false;
  contactClassification: number;
  contactId: Guid = null;
  form: FormGroup;
  referChecked: boolean;

  constructor(
    private contactService: ContactService,
    private spinner: SpinnerService, public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit() {
    if (!this.autoPopContact)
      this.contacts = [];

    this.getContacts();
    this.setupForm();

    this.form.get("refer").valueChanges.subscribe((val) => {
      this.referChecked = val;
    });
  }

  addAutoPopContact(data) {
    if (data) {
      this.contactService.getContacts().subscribe(x => {
        this.contactList = x;
        this.contacts = [];
        this.contacts.push(this.contactList.find(y => y.contactId == data));
      });
    }
  }

  setupForm() {
    this.form = new FormGroup({
      theirRef: new FormControl(null, Validators.maxLength(50)),
      refer: new FormControl(null, null),
      primary: new FormControl(null, null),
    });
  }

  getContacts() {
    this.contactService.getContacts().subscribe(data => {
      this.contactList = data;
    });
  }

  remove(model: ContactModel) {
    this.contacts = this.contacts.filter(x => x.contactId !== model.contactId);
  }

  addContactToPatient(e) {
    this.contactService.getContacts().subscribe(x => {
      this.contactList = x;
      this.contacts.push(this.contactList.find(y => y.contactId == this.contactId));
    });
  }

  contactNewAddedHandler(e) {
    this.spinner.stop();
    this.contactService.getContacts().subscribe(x => {
      this.contactList = x;
      this.model = new ContactModel();
      this.model = (this.contactList.find(y => y.contactId == e.contactId));
      this.model.contactTypeId = e.contactTypeId;
      this.model.theirRef = e.theirRef;
      this.model.referrer = e.referrer;
      this.model.isPrimary = e.isPrimary;
      this.contacts.push(this.model);
    });
  }

  contactAddedHandler(e) {
    this.showAddConnectionPopup = false;
    this.showConnectionInfoPopup = true;
    this.model = new ContactModel();
    this.model = this.contactList.find(x => x.contactId == e.contactId);
  }

  onRowDoubleClick(e) {
    this.showAddConnectionPopup = false;
    this.showConnectionInfoPopup = true;
    this.model = new ContactModel();
    this.model = this.contactList.find(x => x.contactId == e.data.contactId);
  }

  addConnection(item) {
    this.showAddConnectionPopup = false;
    this.showConnectionInfoPopup = true;
    this.model = new ContactModel();
    this.model = this.contactList.find(x => x.contactId == item.contactId);
  }

  close() {
    this.form.reset();
    this.showConnectionInfoPopup = false;
  }

  save() {
    this.showConnectionInfoPopup = false;
    this.model.theirRef = this.form.get("theirRef").value;
    this.model.referrer = this.form.get("refer").value;
    this.model.isPrimary = this.form.get("primary").value;
    this.contacts.push(this.model);
    this.form.reset();
  }
}
