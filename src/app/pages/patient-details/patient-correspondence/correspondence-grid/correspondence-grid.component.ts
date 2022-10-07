import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, tap } from 'rxjs/operators';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { DocumentsStoreService } from 'src/app/shared/services/documents-store.service';
import { DocumentsService } from 'src/app/shared/services/documents.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { UserStore } from 'src/app/shared/stores/user.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-correspondence-grid',
  templateUrl: './correspondence-grid.component.html',
  styleUrls: ['./correspondence-grid.component.scss']
})
export class CorrespondenceGridComponent extends GridBase implements OnInit {
  constructor(
    private appInfo: AppInfoService,
    private documentsService: DocumentsService,
    public userStore: UserStore,
    private snackBar: MatSnackBar,
    private spinner: SpinnerService,
    private appMessages: AppMessagesService,
  ) {
    super()
  }

  @Input() patientId: string;

  @Output() gridChanged = new EventEmitter();

  selectedRecord: any;
  action: string;
  dateFormat: string;
  templatePreviewUrl: string;
  correspondenceType: string = "";
  searchOptions: SearchOptions[] = [
    { value: "", viewValue: "All" },
    { value: "Letters", viewValue: "Letters" },
    { value: "Accounts", viewValue: "Accounts" },
    { value: "Appointments", viewValue: "Appointments" },
    { value: "Invoices", viewValue: "Invoices" },
  ];

  ngOnInit() {
    this.dateFormat = this.appInfo.getDateFormat;
    this.getCorrespondence();
  }

  reloadData() {
    this.getCorrespondence();
  }

  getCorrespondence() {
    this.controllerUrl = `${environment.baseurl}/patientDetails/`;
    this.setupDataSource({
      key: 'correspondenceId',
      loadParamsCallback: () => [
        { name: 'patientId', value: this.patientId },
        { name: 'type', value: this.correspondenceType }
      ],
      loadUrl: 'getPatientCorrespondence'
    });
  }

  onFocusedRowChanged(e) {
    this.subscription.add(
      this.documentsService.generateUrl({ correspondenceId: e.row.key })
        .pipe(map(x => `${environment.serverUrl}/pdf?url=${x.data}`),
          tap(x => this.templatePreviewUrl = x)).subscribe()
    );
  }

  onRowDoubleClick(e) {
    //this.editDocument(e.data);
    this.documentsService.viewCorrespondence(e.data.correspondenceId).subscribe();
  }

  editDocument(data) {
    this.subscription.add(this.documentsService.editLetter(data.letterId).subscribe());
  }

  public add() {
    this.action = "Add";
    this.selectedRecord = { id: 0, patientId: this.patientId };
  }

  public editCorrespondence(e) {
    this.spinner.start();
    this.documentsService.recreateDraftLetter(e.correspondenceId).subscribe(
      (x) => {
        this.spinner.stop();
        this.snackBar.open("Draft letter created.", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        }
        );
        this.documentsService.editLetter(x.data.id).subscribe();
        this.gridChanged.emit();
        this.reloadData();
      },
      (e) => {
        this.spinner.stop(); this.appMessages.showApiErrorNotification(e)
      }
    );
  }

  saved(e) {
    if (e.success) {
      if (this.action == "Add") {
        this.snackBar.open("Draft letter added", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
      }
    }
    if (e.errors) {
      this.snackBar.open(e.errors[0], "Close", {
        panelClass: "badge-danger",
        duration: 3000,
      });
    }
    this.action = "";
    this.gridChanged.emit();
    this.reloadData();
  }

  setSearchItem() {
    this.reloadData();
  }
}

interface SearchOptions {
  value: string;
  viewValue: string;
}