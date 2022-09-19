import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { AppInjector } from 'src/app/shared/services/app.injector';
import { DocumentsService, PatientLetterModel } from 'src/app/shared/services/documents.service';
import { SignalRMainHubService } from 'src/app/shared/services/signal-rmain-hub.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { UserStore } from 'src/app/shared/stores/user.store';
import { environment } from 'src/environments/environment';
import { PatientCommunicationStore } from '../patient-communications-store.service';

@Component({
  selector: 'app-patient-letters',
  templateUrl: './patient-letters.component.html',
  styleUrls: ['./patient-letters.component.scss']
})
export class PatientLettersComponent extends SubscriptionBase implements OnInit, OnDestroy {
  @Input() accounts: boolean;

  @Output() selectedRecord = new EventEmitter<any>();

  letters: PatientLetterModel[] = [];
  filteredLetters: PatientLetterModel[] = [];
  dateFormat: string;
  templatePreviewUrl: string = "";
  rowInfo;
  letterStatus = ["All", "Draft", "Sent"];
  selectedStatus = "All";
  focusedRowIndex = 0;
  format = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
  searchBoxValue = "";
  toDate = new Date();
  fromDate = new Date();

  private signalRHub: SignalRMainHubService;
  private signalRCallbacks = new Map();

  constructor(
    private store: PatientCommunicationStore,
    private appInfo: AppInfoService,
    private documentsService: DocumentsService,
    public userStore: UserStore,
    private spinner: SpinnerService,
    private appMessages: AppMessagesService,
    public datepipe: DatePipe
  ) {
    super();
    const injector = AppInjector.getInjector();
    this.signalRHub = injector.get(SignalRMainHubService);
    this.toDate = undefined;
    this.fromDate = undefined;
  }

  ngOnInit() {
    this.dateFormat = this.appInfo.getDateFormat;

    if (this.accounts) {
      this.addToSubscription(this.store.accountLetters$.pipe(tap(x => {
        this.letters = x;
        this.filteredLetters = x;
        this.focusedRowIndex = 0;

        this.search();
      })))
    }
    else {
      this.addToSubscription(this.store.letters$.pipe(tap(x => {
        this.letters = x;
        this.filteredLetters = x;
        this.focusedRowIndex = 0;

        this.search();
      })))
    }

    this.addSignalRListener('draftLettersChanged', (x) => {
      this.store.getPatientLetters$();
    });

    this.addSignalRListener('draftLetterSaved', (x) => {
      this.templatePreviewUrl = null;
      this.store.getPatientLetters$();
      if (this.rowInfo) {
        this.getDocumentPreviewUrl(this.rowInfo);
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

  public deleteClicked(e) {
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

  onFocusedRowChanged(e) {
    this.templatePreviewUrl = "";
    if (e?.row?.data) {
      this.rowInfo = e.row.data;
      this.getDocumentPreviewUrl(this.rowInfo);
    }
  }

  getDocumentPreviewUrl(e) {
    if (e.isCorrespondence) {
      this.subscription.add(this.documentsService.generateUrl({ correspondenceId: e.id })
        .pipe(map(x => `${environment.serverUrl}/pdf?url=${x.data}`),
          tap(x => this.templatePreviewUrl = x)).subscribe()
      );
    }
    else {
      this.subscription.add(this.documentsService.generateUrl({ letterId: e.id })
        .pipe(map(x => `${environment.serverUrl}/letterPreview?url=${x.data}`),
          tap(x => this.templatePreviewUrl = x)).subscribe()
      );
    }
  }

  public editClicked(e) {
    this.selectedRecord.emit({ id: e.data.id, patientId: this.store.getPatientId });
  }

  onRowDoubleClick(e) {
    this.editLetter(e.data.id);
  }

  search() {
    let search = this.searchBoxValue.toLocaleLowerCase();

    if (search == "")
      this.filteredLetters = this.letters;
    else {
      if (this.format.test(search)) {
        this.filteredLetters = this.letters.filter(x => x.created != null && this.datepipe.transform(x.created, this.dateFormat) == search)
      }
      else {
        this.filteredLetters = this.letters.filter(x =>
          (x.description != null && (x.description.toLocaleLowerCase().includes(search) || x.description == search)) ||
          (x.category != null && (x.category.toLocaleLowerCase().includes(search) || x.category.toLocaleLowerCase() == search)) ||
          (x.comments != null && (x.comments.toLocaleLowerCase().includes(search) || x.comments.toLocaleLowerCase() == search)) ||
          (x.invoiceNumber != null && (x.invoiceNumber.toLocaleLowerCase().includes(search) || x.invoiceNumber.toLocaleLowerCase() == search))
        );
      }
    }

    if (this.fromDate) {
      this.fromDate = new Date(this.fromDate.getFullYear(), this.fromDate.getMonth(), this.fromDate.getDate(), 0, 0, 0);
      this.filteredLetters = this.filteredLetters.filter(x => x.created != null && new Date(x.created) >= this.fromDate);
    }
    if (this.toDate) {
      this.toDate = new Date(this.toDate.getFullYear(), this.toDate.getMonth(), this.toDate.getDate(), 23, 59, 59);
      this.filteredLetters = this.filteredLetters.filter(x => x.created != null && new Date(x.created) <= this.toDate);
    }

    this.focusedRowIndex = -1;
  }

  editLetter(data) {
    if (data.isCorrespondence) {
      let correspondenceId = data;
      this.subscription.add(this.documentsService.viewCorrespondence(correspondenceId).subscribe())
    }
    else {
      let letterId = data;
      this.subscription.add(this.documentsService.editLetter(letterId).subscribe())
    }
  }

  editCopyLetter(data) {
    let correspondenceId = data.id
    this.documentsService.editLetterAsCopy(correspondenceId).subscribe(x => {
      if (x.success) {
        this.store.getPatientLetters$();
        this.editLetter(x.data);
      }
    });
  }

  statusChanged(e) {
    this.store.setLetterStatus$(e.selectedItem);
  }

  reloadData() {
    this.store.getPatientLetters$();
  }
}