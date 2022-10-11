import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { CorrespondenceCategory } from 'src/app/shared/models/CorrespondenceTypes';
import { AppInfoService } from 'src/app/shared/services';
import { DocumentsService } from 'src/app/shared/services/documents.service';
import { PatientDocumentModel, PatientDocumentService } from 'src/app/shared/services/patient-document-service';
import { SitesService, DocumentTemplateViewModel } from 'src/app/shared/services/sites.service';

@Component({
  selector: 'app-patient-letters-add-edit',
  templateUrl: './patient-letters-add-edit.component.html',
  styleUrls: ['./patient-letters-add-edit.component.scss']
})
export class PatientLettersAddEditComponent extends PopupReactiveFormBase implements OnInit, AfterViewInit {
  constructor(
    public appInfo: AppInfoService,
    public router: Router,
    private siteService: SitesService,
    private documentsService: DocumentsService,
    private patientDocumentService: PatientDocumentService,
    private domSanitizer: DomSanitizer,
  ) {
    super();
  }

  patientId: string;
  documentId: string;
  letterId: string;
  editForm: FormGroup;
  templates: DocumentTemplateViewModel[] = [];
  maxDate = new Date();
  document: PatientDocumentModel;
  url;

  protected controllerName = "patientLetters";
  protected onOpened = (data) => {
    this.letterId = data.id;
    this.patientId = data.patientId;
    this.documentId = data.documentId;

    if (this.documentId) {
      this.getDocumentDetails();
    }

    this.getTemplates();
    this.setupForm();
    this.setup(data);

    this.onSuccessfullySaved = x => {
      if (x.data != null) {
        this.documentsService.editLetter(x.data.id).subscribe(data => {
          if (!this.documentId)
            this.show = false;
          else
            this.isNew = false;
          this.saved.emit(x);
        });
      }
      else {
        this.show = false;
        this.saved.emit(x);
      }
    };
  };

  ngOnInit() {
  }

  getDocumentDetails() {
    this.patientDocumentService.getPatientDocumentDetails(this.documentId).subscribe(data => {
      this.document = data;
      this.processRecording(this.b64toBlob(this.document.fileBase64String, "audio/wav;base64,"));
    })
  }

  populateForm(x) {
    super.populateForm(x);

    if (!this.isNew)
      this.editForm.patchValue({ letterId: this.letterId });
  }

  getTemplates() {
    this.siteService.getTemplatesByType(CorrespondenceCategory.Letters).subscribe((data) => {
      this.templates = data;
    });
  }

  private setupForm() {
    this.editForm = new FormGroup({
      letterId: new FormControl(null),
      patientId: new FormControl(null),
      dateTyped: new FormControl(new Date()),
      templateId: new FormControl(null, [Validators.required]),
      comments: new FormControl(null, [Validators.maxLength(200)]),
    });
  }

  processRecording(blob) {
    this.url = URL.createObjectURL(blob);
    this.readInfo(blob)
  }

  readInfo(blob) {
    var callback = x => this.processBlob(x);
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      var base64data = reader.result;
      callback(base64data);
    }
  }

  processBlob(x) {
    var string64 = x.split("base64,");
    this.editForm.patchValue({ fileBase64String: string64[1] });
    this.editForm.patchValue({ fileName: "Dictation" + (moment(new Date())).format('DD-MM-YYYY') + ".mp3" });
    this.editForm.patchValue({ fileType: ".mp3" });
    this.editForm.patchValue({ mimeType: "audio/mpeg" });
  }

  b64toBlob: any = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
}
