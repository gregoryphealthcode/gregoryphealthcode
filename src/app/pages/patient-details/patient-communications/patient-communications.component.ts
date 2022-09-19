import { Component, Input, OnInit } from '@angular/core';
import { messages } from '@devexpress/analytics-core/analytics-internal';
import { type } from 'jquery';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { DocumentsService, PatientLetterModel } from 'src/app/shared/services/documents.service';
import { PatientDocumentModel, PatientDocumentService } from 'src/app/shared/services/patient-document-service';
import { PatientCommunicationSummaryModel, PatientService, PatientSmsModel } from 'src/app/shared/services/patient.service';
import { PatientCommunicationStore } from './patient-communications-store.service';

@Component({
  selector: 'app-patient-communications',
  templateUrl: './patient-communications.component.html',
  styleUrls: ['./patient-communications.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' },
  providers: [PatientCommunicationStore]
})
export class PatientCommunicationsComponent extends SubscriptionBase implements OnInit {
  @Input() patientId: string;

  selectedRecordDocument: any;
  selectedRecordLetter: any;
  selectedRecordSms: any;

  returnedDocumentSummary: PatientCommunicationSummaryModel[] = [];
  returnedDocuments: PatientDocumentModel[] = [];
  returnedLetters: PatientLetterModel[] = [];
  returnedAccountsLetters: PatientLetterModel[] = [];
  returnedSms: PatientSmsModel[] = [];

  tabIndex = 0;

  public tabs = ["all", "accounts", "documents", "letters", "sms"];

  items = [
    { id: 3, description: "New Letter", value: "Letter", icon: "far fa-envelope" },
    { id: 2, description: "Import Document", value: "Document", icon: "far fa-file-medical" },   
    { id: 1, description: "New Dictation", value: "Dictation", icon: "far fa-comment-alt-lines" },     
    { id: 4, description: "New SMS", value: "SMS", icon: "far fa-mobile" },
  ];

  constructor(
    private store: PatientCommunicationStore,
    private appMessages: AppMessagesService,
    private documentsService: DocumentsService,
  ) {
    super();
  }

  ngOnInit() {
    this.store.setPatientId$(this.patientId)
  }
  
  public add(type) {
    switch (type) {
      case "Dictation":
      case "Document":
        this.selectedRecordDocument = { id: "00000000-0000-0000-0000-000000000000", patientId: this.patientId, type: type, url: null };
        break;

      case "Letter":
        this.selectedRecordLetter = { id: "00000000-0000-0000-0000-000000000000", patientId: this.patientId };
        break;

      case "SMS":
        this.selectedRecordSms = { id: 0, patientId: this.patientId };
        break;
    }
  }

  savedHandler(e) {
    if (e.success || e.isSuccess) {
      if (this.selectedRecordDocument) {
        if (this.selectedRecordDocument.type == "Document")
          this.appMessages.showSuccessSnackBar("Document saved");
        else
          this.appMessages.showSuccessSnackBar("Document Saved");
        this.store.getPatientDocuments$();
      }
      if (this.selectedRecordLetter) {
        this.appMessages.showSuccessSnackBar("Letter saved");
        if (e.data) {
          let letterId = e.data.id;
          this.subscription.add(this.documentsService.editLetter(letterId).subscribe());
        }
        this.store.getPatientLetters$();
      }
      if (this.selectedRecordSms) {
        this.appMessages.showSuccessSnackBar("SMS sent");
        this.store.getPatientSMS$();
      }
      this.store.getPatientCommunicationSummary$();
    }
    else {
      if (e.errors)
        this.appMessages.showApiErrorNotification(e.errors[0]);
      else
        this.appMessages.showApiErrorNotification(messages)
    }
  }
}
