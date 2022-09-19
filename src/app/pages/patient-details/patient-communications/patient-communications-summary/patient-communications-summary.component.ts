import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { DocumentsService } from 'src/app/shared/services/documents.service';
import { PatientDocumentService } from 'src/app/shared/services/patient-document-service';
import { PatientCommunicationSummaryModel } from 'src/app/shared/services/patient.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { PatientCommunicationStore } from '../patient-communications-store.service';
import { SignalRMainHubService } from 'src/app/shared/services/signal-rmain-hub.service';
import { AppInjector } from 'src/app/shared/services/app.injector';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-patient-communications-summary',
  templateUrl: './patient-communications-summary.component.html',
  styleUrls: ['./patient-communications-summary.component.scss']
})
export class PatientCommunicationsSummaryComponent extends SubscriptionBase implements OnInit, OnDestroy {
  @Output() selectedLetter = new EventEmitter<any>();
  @Output() selectedDocument = new EventEmitter<any>();

  documentSummary: PatientCommunicationSummaryModel[] = [];
  filteredDocumentSummary: PatientCommunicationSummaryModel[] = [];
  searchBoxValue = "";
  dateFormat: string;
  rowInfo;
  templatePreviewUrl: string = "";
  showPreview = false;
  smsPreview: string = undefined;
  smsSent: string = undefined;
  image;
  format = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
  focusedRowIndex = 0;
  toDate = new Date();
  fromDate = new Date(new Date().getTime() - (90 * 24 * 60 * 60 * 1000));

  private signalRHub: SignalRMainHubService;
  private signalRCallbacks = new Map();

  constructor(
    private store: PatientCommunicationStore,
    private documentsService: DocumentsService,
    private patientDocumentService: PatientDocumentService,
    private appInfoService: AppInfoService,
    private spinner: SpinnerService,
    private appMessages: AppMessagesService,
    private sanitizer: DomSanitizer,
    public datepipe: DatePipe
  ) {
    super();
    const injector = AppInjector.getInjector();
    this.signalRHub = injector.get(SignalRMainHubService);
    this.toDate = undefined;
    this.fromDate = undefined;
  }

  ngOnInit(): void {
    this.dateFormat = this.appInfoService.getDateFormat;

    this.addToSubscription(this.store.documentSummary$.pipe(tap(x => {
      this.documentSummary = x;
      this.filteredDocumentSummary = x;
      this.focusedRowIndex = 0;

      this.search();
    })));

    this.addSignalRListener('draftLettersChanged', (x) => {
      this.store.getPatientCommunicationSummary$();
    });

    this.addSignalRListener('draftLetterSaved', (x) => {
      this.templatePreviewUrl = null;
      this.store.getPatientCommunicationSummary$();
      if (this.rowInfo) {
        if (this.rowInfo.type == "Letter(Sent)")
          this.getCorrespondenceUrl(this.rowInfo);
        else
          this.getLetterUrl(this.rowInfo);
      }
    });
  }

  ngOnDestroy() {
    this.signalRCallbacks.forEach((value, key) =>
      this.signalRHub.removeListener(key, value)
    );
  }

  addSignalRListener(methodName: string, callback: any) {
    this.signalRCallbacks.set(methodName, callback);
    this.signalRHub.addListener(methodName, callback);
  }

  onFocusedRowChanged(e) {
    this.showPreview = false;
    this.smsPreview = undefined;
    this.smsSent = undefined;
    this.image = undefined;
    if (e?.row?.data) {
      this.rowInfo = e.row.data;
      if (this.rowInfo.type == "Document" && (this.rowInfo.fileType == "DOCX")) {
        this.getDocumentPreviewUrl(this.rowInfo);
        this.showPreview = true;
      }
      if (this.rowInfo.type == "Document" && this.rowInfo.fileType == "PDF") {
        this.getPdfUrl(this.rowInfo);
        this.showPreview = true;
      }
      if (this.rowInfo.type == "Document" && (this.rowInfo.fileType == "PNG" || this.rowInfo.fileType == "JPG" || this.rowInfo.fileType == "BMP")) {
        this.patientDocumentService.getPatientFile(this.store.getPatientId, this.rowInfo.id, this.rowInfo.fileName).subscribe(data => {
          let objectURL = 'data:image/png;base64,' + data.fileBase64String;
          this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        });
      }
      if (this.rowInfo.type == "Letter(Draft)") {
        this.getLetterUrl(this.rowInfo);
        this.showPreview = true;
      }
      if (this.rowInfo.type == "Letter(Sent)") {
        this.getCorrespondenceUrl(this.rowInfo);
        this.showPreview = true;
      }
      if (this.rowInfo.type == "SMS") {
        this.smsPreview = this.rowInfo.text;
        this.smsSent = this.rowInfo.details;
      }
    }
  }

  search() {
    let search = this.searchBoxValue.toLocaleLowerCase();

    if (search == "")
      this.filteredDocumentSummary = this.documentSummary;
    else {
      if (this.format.test(search)) {
        this.filteredDocumentSummary = this.documentSummary.filter(x => x.created != null && this.datepipe.transform(x.created, this.dateFormat) == search)
      }
      else {
        this.filteredDocumentSummary = this.documentSummary.filter(x =>
          (x.details != null && (x.details.toLocaleLowerCase().includes(search) || x.details == search)) ||
          (x.fileType != null && (x.fileType.toLocaleLowerCase().includes(search) || x.fileType.toLocaleLowerCase() == search)) ||
          (x.text != null && (x.text.toLocaleLowerCase().includes(search) || x.text.toLocaleLowerCase() == search)) ||
          (x.type != null && (x.type.toLocaleLowerCase().includes(search) || x.type.toLocaleLowerCase() == search))
        );
      }
    }

    if (this.fromDate) {
      this.fromDate = new Date(this.fromDate.getFullYear(), this.fromDate.getMonth(), this.fromDate.getDate(), 0, 0, 0);
      this.filteredDocumentSummary = this.filteredDocumentSummary.filter(x => x.created != null && new Date(x.created) >= this.fromDate);
    }

    if (this.toDate) {
      this.toDate = new Date(this.toDate.getFullYear(), this.toDate.getMonth(), this.toDate.getDate(), 23, 59, 59);
      this.filteredDocumentSummary = this.filteredDocumentSummary.filter(x => x.created != null && new Date(x.created) <= this.toDate);
    }

    this.focusedRowIndex = -1;
  }

  reloadData() {
    this.store.getPatientCommunicationSummary$();
  }

  onRowDoubleClick(e) {
    if (e.data.type == 'Letter(Draft)')
      this.editLetter(e.data.id);
    if (e.data.type == 'Letter(Sent)')
      this.openLetter(e.data);
    if (e.data.type == 'Document' || e.data.type == 'Document')
      this.selectedDocument.emit({ id: e.data.patientDocumentId, url: null });
  }

  getCorrespondenceUrl(e) {
    this.subscription.add(this.documentsService.generateUrl({ correspondenceId: e.id })
      .pipe(map(x => `${environment.serverUrl}/pdf?url=${x.data}`),
        tap(x => this.templatePreviewUrl = x)).subscribe()
    );
  }

  getLetterUrl(e) {
    this.subscription.add(this.documentsService.generateUrl({ letterId: e.id })
      .pipe(map(x => `${environment.serverUrl}/letterPreview?url=${x.data}`),
        tap(x => this.templatePreviewUrl = x)).subscribe()
    );
  }

  getPdfUrl(e) {
    this.subscription.add(this.documentsService.generateUrl({ documentPdfId: e.id })
      .pipe(map(x => `${environment.serverUrl}/pdf?url=${x.data}`),
        tap(x => this.templatePreviewUrl = x)).subscribe()
    );
  }

  public editLetterCommentsClicked(e) {
    this.selectedLetter.emit({ id: e.data.id, patientId: this.store.getPatientId });
  }

  editLetter(data) {
    let letterId = data;
    this.subscription.add(this.documentsService.editLetter(letterId).subscribe());
  }

  editCopyLetter(data) {
    let correspondenceId = data.id
    this.documentsService.editLetterAsCopy(correspondenceId).subscribe(x => {
      if (x.success) {
        this.store.getPatientCommunicationSummary$();
        this.editLetter(x.data);
      }
    });
  }

  openLetter(data) {
    let correspondenceId = data.id;
    this.subscription.add(this.documentsService.viewCorrespondence(correspondenceId).subscribe())
  }

  public deleteLetterClicked(e) {
    const text = 'Are you sure you want to delete this letter?'

    const callback = () => {
      this.spinner.start();
      this.documentsService.deleteLetter(e.data.id).subscribe(
        (x) => {
          this.spinner.stop();
          this.appMessages.showSuccessSnackBar("Letter deleted.");
          this.reloadData();
        },
        (e) => {
          this.spinner.stop(); this.appMessages.showApiErrorNotification(e)
        }
      );
    };

    this.appMessages.showDeleteConfirmation(callback, text);
  }

  getDocumentPreviewUrl(e) {
    this.subscription.add(this.documentsService.generateUrl({ documentId: e.id })
      .pipe(map(x => `${environment.serverUrl}/documentPreview?url=${x.data}`),
        tap(x => this.templatePreviewUrl = x)).subscribe()
    );
  }

  public editDocumentClicked(e) {
    this.selectedDocument.emit({ id: e.data.id, url: null });
  }

  public deleteDocumentClicked(e) {
    const text = 'Are you sure you want to delete this document?'

    const callback = () => {
      this.spinner.start();
      this.patientDocumentService.deletePatientDocument(e.data.id).subscribe(
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
}

export class CommunicationModel {
  id: string;
  type: string;
}