import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { requiredIfValidator } from 'src/app/shared/helpers/form-helper';
import { CorrespondenceCategory } from 'src/app/shared/models/CorrespondenceTypes';
import { AppInfoService } from 'src/app/shared/services';
import { DocumentsService } from 'src/app/shared/services/documents.service';
import { PatientDocumentService, PatientDocumentModel, PatientRecipientModel } from 'src/app/shared/services/patient-document-service';
import { SitesService, DocumentTemplateViewModel } from 'src/app/shared/services/sites.service';

@Component({
  selector: 'app-patient-letters-add-edit',
  templateUrl: './patient-letters-add-edit.component.html',
  styleUrls: ['./patient-letters-add-edit.component.scss']
})
export class PatientLettersAddEditComponent extends PopupReactiveFormBase implements OnInit { 
  patientId: string;
  documentId: string;
  letterId: string;
  editForm: FormGroup;
  templates: DocumentTemplateViewModel[] = [];
  maxDate = new Date();
  document: PatientDocumentModel;
  url;
  selectedRecipientType: number;
  recipients: PatientRecipientModel[] = [];
  recipientTypes = [
    { id: 3, description: "Contact" },
    { id: 2, description: "Insurer" },
    { id: 1, description: "Patient" },
    { id: 4, description: "Related" },
  ]

  constructor(
    public appInfo: AppInfoService,
    public router: Router,
    private siteService: SitesService,
    private documentsService: DocumentsService,
    private patientDocumentService: PatientDocumentService,
  ) {
    super();
  }

  protected controllerName = "patientLetters";
  protected onOpened = (data) => {    
    this.letterId = data.id;
    this.patientId = data.patientId;

    this.getTemplates();
    this.setupForm();
    this.setup(data);
    if (this.isNew)
      this.editForm.patchValue({dateTyped: new Date()});
  };

  ngOnInit() {
  }

  getRecipients(patientId: string, type: number) {
    this.patientDocumentService.getPatientRecipients(patientId, type).subscribe(data => {
      this.recipients = data;
      this.recipients.sort(function (a, b) {
        if (a.recipientName < b.recipientName) return -1;
        if (a.recipientName > b.recipientName) return 1;
        return 0;
      })
    })
  }

  getTemplates() {
    this.siteService.getTemplatesByType(CorrespondenceCategory.Letters).subscribe((data) => {
      this.templates = data;
      this.templates.sort(function (a, b) {
        if (a.description < b.description) return -1;
        if (a.description > b.description) { return 1; }
        return 0;
      })
    });
  }

  private setupForm() {
    this.editForm = new FormGroup({
      id: new FormControl(null),
      patientId: new FormControl(null),
      recipientType: new FormControl(null),
      recipientId: new FormControl(null, requiredIfValidator(() => this.selectedRecipientType && this.selectedRecipientType != 1)),
      dateTyped: new FormControl(null),
      templateId: new FormControl(null, [Validators.required]),
      comments: new FormControl(null, [Validators.maxLength(200)]),
      isCorrespondence: new FormControl(null),
    });

    this.editForm.get('recipientType').valueChanges.subscribe(x => {
      this.selectedRecipientType = x;
      if (x && x != 1)
        this.getRecipients(this.patientId, x);

      this.editForm.get("recipientId").updateValueAndValidity();
    })
  }
}