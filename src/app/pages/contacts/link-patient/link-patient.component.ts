import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Guid from 'devextreme/core/guid';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { ContactModel } from 'src/app/shared/services/contact.service';
import { ContactViewStore } from '../contact-view/contact-view-store.service';

@Component({
  selector: 'app-link-patient',
  templateUrl: './link-patient.component.html',
  styleUrls: ['./link-patient.component.scss']
})
export class LinkPatientComponent implements OnInit {
  @Input() patientId: Guid;
  @Input() contactId: Guid;

  @Output() closed = new EventEmitter();

  editForm: FormGroup;

  constructor(
    public store: ContactViewStore, public appInfo: AppInfoService
  ) {
  }

  ngOnInit() {
    this.setupForm()
  }

  setupForm() {
    this.editForm = new FormGroup({
      theirRef: new FormControl(null, Validators.maxLength(50)),
      refer: new FormControl(null, null),
      primary: new FormControl(null, null),
    });
  }

  save() {
    var model = new ContactModel();
    model.patientId = this.patientId;
    model.contactId = this.contactId;
    model.theirRef = this.editForm.get('theirRef').value;
    model.referrer = this.editForm.get('refer').value;
    model.isPrimary = this.editForm.get('primary').value;

    this.store.linkPatient(model);
    this.closed.emit();
  }
}