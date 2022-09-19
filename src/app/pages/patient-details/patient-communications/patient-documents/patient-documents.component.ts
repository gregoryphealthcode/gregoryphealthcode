import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { map, tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { DocumentsService } from 'src/app/shared/services/documents.service';
import { PatientDocumentModel, PatientDocumentService } from 'src/app/shared/services/patient-document-service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { environment } from 'src/environments/environment';
import { PatientCommunicationStore } from '../patient-communications-store.service';

@Component({
  selector: 'app-patient-documents',
  templateUrl: './patient-documents.component.html',
  styleUrls: ['./patient-documents.component.scss']
})
export class PatientDocumentsComponent extends SubscriptionBase implements OnInit {
  @Output() selectedRecord = new EventEmitter<any>();

  documents: PatientDocumentModel[] = [];
  filteredDocuments: PatientDocumentModel[] = [];
  dateFormat: string;
  rowInfo;
  documentTypes = ["All", "Document", "Dictation"];
  selectedType = "All";
  showPreview = false;
  templatePreviewUrl: string = "";
  focusedRowIndex = 0;
  image;
  format = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
  searchBoxValue = "";
  toDate = new Date();
  fromDate = new Date(new Date().getTime() - (90 * 24 * 60 * 60 * 1000));

  constructor(
    private store: PatientCommunicationStore,
    private patientDocumentService: PatientDocumentService,
    private documentsService: DocumentsService,
    private spinner: SpinnerService,
    private appMessages: AppMessagesService,
    private appInfoService: AppInfoService,
    private sanitizer: DomSanitizer,
    public datepipe: DatePipe
  ) {
    super();
    this.toDate = undefined;
    this.fromDate = undefined;
  }

  ngOnInit(): void {
    this.dateFormat = this.appInfoService.getDateFormat;

    this.addToSubscription(this.store.documents$.pipe(tap(x => {
      this.documents = x;
      this.filteredDocuments = x;
      this.focusedRowIndex = 0;

      this.search();
    })));
  }

  search() {
    let search = this.searchBoxValue.toLocaleLowerCase();

    if (search == "")
      this.filteredDocuments = this.documents;
    else {
      if (this.format.test(search)) {
        this.filteredDocuments = this.documents.filter(x => x.documentDate != null && this.datepipe.transform(x.documentDate, this.dateFormat) == search)
      }
      else {
        this.filteredDocuments = this.documents.filter(x =>
          (x.documentName != null && (x.documentName.toLocaleLowerCase().includes(search) || x.documentName == search)) ||
          (x.documentTypeDescription != null && (x.documentTypeDescription.toLocaleLowerCase().includes(search) || x.documentTypeDescription.toLocaleLowerCase() == search)) ||
          (x.createdByName != null && (x.createdByName.toLocaleLowerCase().includes(search) || x.createdByName.toLocaleLowerCase() == search)) ||
          (x.patientDocumentTypeDescription != null && (x.patientDocumentTypeDescription.toLocaleLowerCase().includes(search) || x.patientDocumentTypeDescription.toLocaleLowerCase() == search)) ||
          (x.comments != null && (x.comments.toLocaleLowerCase().includes(search) || x.comments.toLocaleLowerCase() == search))
        );
      }
    }

    if (this.fromDate) {
      this.fromDate = new Date(this.fromDate.getFullYear(), this.fromDate.getMonth(), this.fromDate.getDate(), 0, 0, 0);
      this.filteredDocuments = this.filteredDocuments.filter(x => x.documentDate != null && new Date(x.documentDate) >= this.fromDate);
    }
    if (this.toDate) {
      this.toDate = new Date(this.toDate.getFullYear(), this.toDate.getMonth(), this.toDate.getDate(), 23, 59, 59);
      this.filteredDocuments = this.filteredDocuments.filter(x => x.documentDate != null && new Date(x.documentDate) <= this.toDate);
    }

    

    this.focusedRowIndex = -1;
  }

  public editClicked(e) {
    if (!e.data.locked) {
      this.selectedRecord.emit({ id: e.data.patientDocumentId, type: e.data.documentTypeDescription, url: null });
    }
  }

  onFocusedRowChanged(e) {
    this.image = undefined;
    this.templatePreviewUrl = undefined;
    this.showPreview = false;
    if (e?.row?.data) {
      this.rowInfo = e.row.data;
     
      if (this.rowInfo.fileName && (this.rowInfo.fileType == "DOCX")) {
        this.showPreview = true;
        this.getDocumentPreviewUrl(this.rowInfo);
      }
      if (this.rowInfo.fileName && this.rowInfo.fileType == "PDF") {
        this.showPreview = true;
        this.getPdfUrl(this.rowInfo);
      }
      if (this.rowInfo.fileName && (this.rowInfo.fileType == "PNG" || this.rowInfo.fileType == "JPG" || this.rowInfo.fileType == "BMP")) {
        this.showPreview = true;
        this.patientDocumentService.getPatientFile(this.store.getPatientId, this.rowInfo.patientDocumentId, this.rowInfo.fileName).subscribe(data => {
          let objectURL = 'data:image/png;base64,' + data.fileBase64String;
          this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        });
      }
    }
  }

  reloadData() {
    this.store.getPatientDocuments$();
  }

  getDocumentPreviewUrl(e) {
    this.subscription.add(this.documentsService.generateUrl({ documentId: e.patientDocumentId })
      .pipe(map(x => `${environment.serverUrl}/documentPreview?url=${x.data}`),
        tap(x => this.templatePreviewUrl = x)).subscribe()
    );
  }

  getPdfUrl(e) {
    this.subscription.add(this.documentsService.generateUrl({ documentPdfId: e.patientDocumentId })
      .pipe(map(x => `${environment.serverUrl}/pdf?url=${x.data}`),
        tap(x => this.templatePreviewUrl = x)).subscribe()
    );
  }

  public deleteClicked(e) {
    const text = 'Are you sure you want to delete this document?'

    const callback = () => {
      this.spinner.start();
      this.patientDocumentService.deletePatientDocument(e.data.patientDocumentId).subscribe(
        (x) => {
          this.spinner.stop();
          this.appMessages.showSuccessSnackBar("Document deleted");
          this.reloadData();
        },
        (e) => {
          this.spinner.stop(); this.appMessages.showApiErrorNotification(e)
        }
      );
    };

    this.appMessages.showDeleteConfirmation(callback, text);
  }

  typeChanged(e) {
    this.store.setDocumentType$(e.selectedItem);
  }

  downloadFile(e) {
    this.patientDocumentService.getPatientFile(e.data.patientId, e.data.patientDocumentId, e.data.fileName, e.data.externalStorageId).subscribe(data => {
      var blob = this.b64toBlob(data.fileBase64String);
      saveAs(blob, data.fileName);
    });
  }

  editDocument(e) {
    let documentId = e;
      this.subscription.add(this.documentsService.editDocument(documentId).subscribe())
  }

  editCopyDocument(e) {
    let patientDocumentId = e.data.patientDocumentId
    this.documentsService.editDocumentAsCopy(patientDocumentId).subscribe(x => {
      if (x.success) {
        this.store.getPatientDocuments$();
        this.editDocument(x.data);
      }
    });
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
}