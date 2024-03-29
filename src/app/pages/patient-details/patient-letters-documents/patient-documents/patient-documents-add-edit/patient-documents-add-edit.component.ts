import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { parseFile, FileCheckResult, FileModel } from 'src/app/shared/helpers/file';
import { CorrespondenceCategory } from 'src/app/shared/models/CorrespondenceTypes';
import { AppointmentService, AppointmentViewModel } from 'src/app/shared/services/appointment.service';
import { PatientDocumentService, DocumentTypeModel, PatientDocumentTypeModel, PatientDocumentModel } from 'src/app/shared/services/patient-document-service';
import { SitesService, DocumentTemplateViewModel } from 'src/app/shared/services/sites.service';
import { UserStore } from 'src/app/shared/stores/user.store';
import * as RecordRTC from 'recordrtc';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-patient-documents-add-edit',
  templateUrl: './patient-documents-add-edit.component.html',
  styleUrls: ['./patient-documents-add-edit.component.scss']
})
export class PatientDocumentsAddEditComponent extends PopupReactiveFormBase implements OnInit {
  constructor(
    private patientDocumentService: PatientDocumentService,
    private siteService: SitesService,
    private userStore: UserStore,
    private appointmentService: AppointmentService,
    private domSanitizer: DomSanitizer,
  ) {
    super()
  }

  @Output() changeTab = new EventEmitter<string>();

  patientId: string;
  documentId: string;
  documentType: string;
  documentTypes: DocumentTypeModel[];
  patientDocumentTypes: PatientDocumentTypeModel[];
  templates: DocumentTemplateViewModel[];
  appointments: AppointmentViewModel[];
  maxDate = new Date();
  uploadFilesValue: any[] = [];
  tempFileNames: FileModel[] = [];
  isLetter = false;
  isDictation: boolean;
  isDocument: boolean;
  document: PatientDocumentModel;
  newUpload = false;
  record;
  recording = false;
  recordedTime = '00:00';
  url;
  error;
  base64String;

  protected controllerName = "patientDocuments";
  protected onOpened = (data) => {
    this.documentId = data.id;

    switch (data.type) {
      case "Dictation":
        this.isDocument = false;
        this.isDictation = true;
        this.uploadFilesValue = [];
        this.tempFileNames = [];
        break;
      case "Document":
        this.isDictation = false;
        this.isDocument = true;
        this.uploadFilesValue = [];
        this.tempFileNames = [];
        break;
    }

    this.getDropdownData();
    this.setupForm();
    this.setup(data);
  };

  protected populateForm(x) {
    this.document = x;

    if (!this.isNew && this.documentTypes.find(y => y.documentTypeId == this.document.documentTypeId).description == "Dictation") {
      this.isDocument = false;
      this.isDictation = true;

      this.processRecording(this.b64toBlob(this.document.fileBase64String, "audio/wav;base64,"));
    }

    if (!this.isNew && this.documentTypes.find(y => y.documentTypeId == this.document.documentTypeId).description == "Document") {
      this.isDictation = false;
      this.isDocument = true;
    }

    if (this.isNew && this.document.fileBase64String == null)
      this.newUpload = true;
    super.populateForm(x);
  }

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    this.editForm = new FormGroup({
      patientDocumentId: new FormControl(null),
      patientId: new FormControl(null),
      documentName: new FormControl(null, [Validators.required, Validators.maxLength(250)]),
      documentTypeId: new FormControl(null),
      patientDocumentTypeId: new FormControl(null, [Validators.required]),
      appointmentId: new FormControl(null),
      templateId: new FormControl(null),
      documentDate: new FormControl(null, [Validators.required]),
      comments: new FormControl(null, Validators.maxLength(500)),
      locked: new FormControl(false),
      fileName: new FormControl(null),
      fileType: new FormControl(null),
      mimeType: new FormControl(null),
      fileBase64String: new FormControl(null),
    });

    this.editForm.patchValue({ patientId: this.patientId });
  }

  private getDropdownData() {
    this.patientDocumentService.getDocumentTypes().subscribe(data => {
      this.documentTypes = data;

      if (this.isDictation)
        this.editForm.patchValue({ documentTypeId: this.documentTypes.find(x => x.description == "Dictation").documentTypeId });

      if (this.isDocument)
        this.editForm.patchValue({ documentTypeId: this.documentTypes.find(x => x.description == "Document").documentTypeId });
    });

    this.patientDocumentService.getPatientDocumentTypes().subscribe(data => {
      this.patientDocumentTypes = data;
    });

    this.siteService.getTemplatesByType(CorrespondenceCategory.Letters).subscribe(data => {
      this.templates = data;
    });

    this.appointmentService.getAppointmentsForPatient(this.patientId).subscribe(data => {
      this.appointments = data;
    });
  }

  fileUploaded(e) {
    if (e.value.length == 0) {
      this.uploadFilesValue = [];
      this.editForm.patchValue({ fileName: "" });
      this.editForm.patchValue({ fileType: "" });
      this.editForm.patchValue({ mimeType: "" });
      this.editForm.patchValue({ fileBase64String: "" });
    }
    if (e.value.length > 0) {
      e.value.forEach(element => {
        const extension = element.name.split('.')[1];
        if (extension != "pdf" && extension != "doc" && extension != "docx" && extension != "tif" && extension != "jpg" && extension != "png" && extension != "bmp" && extension != "xls" && extension != "xlsx") {
          this.uploadFilesValue.splice(this.uploadFilesValue.length - 1, 1);
          return;
        }
        const file = element;
        parseFile(file, result =>
          this.fileUploadHandler(result));
      });
    }
  }

  removeFile(e) {
    this.uploadFilesValue = [];
  }

  deleteFile() {
    this.newUpload = true;
    this.url = null;
    this.uploadFilesValue = [];
      this.editForm.patchValue({ fileName: "" });
      this.editForm.patchValue({ fileType: "" });
      this.editForm.patchValue({ mimeType: "" });
      this.editForm.patchValue({ fileBase64String: "" });
  }

  fileUploadHandler(result: FileCheckResult) {
    this.tempFileNames.push(result.file);
    this.editForm.patchValue({ fileName: this.uploadFilesValue[0].name });
    this.editForm.patchValue({ fileType: this.getFileExtension(this.uploadFilesValue[0].name).toUpperCase() });
    this.editForm.patchValue({ mimeType: this.uploadFilesValue[0].type });
    this.editForm.patchValue({ fileBase64String: result.file.fileAsBase64String });
  }

  uploadheaders() {
    return ({
      Authorization: 'Bearer ' + this.userStore.getAuthToken(),
      enctype: 'multipart/form-data',
      UserId: this.userStore.getUserId(),
      Client: 'ePractice'
    });
  }

  getFileExtension(fname) {
    return fname.substr((fname.lastIndexOf('.') + 1));
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  startRecording() {
    this.recording = true;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  successCallback(stream) {
    var options = {
      mimeType: "audio/mpeg",
      numberOfAudioChannels: 1,
      sampleRate: 45000,
    };
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }

  stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
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

  clearRecordedData() {
    this.url = null;
  }

  errorCallback(error) {
    this.error = 'Can not play audio in your browser';
  }

  downloadFile() {
    var blob = this.b64toBlob(this.document.fileBase64String);
    fileSaver.saveAs(blob, this.document.fileName);
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

  createLetter() {
    this.show = false;
    this.changeTab.emit(this.documentId);
  }
}
