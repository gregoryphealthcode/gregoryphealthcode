import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, tap } from 'rxjs/operators';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { DocumentsService } from 'src/app/shared/services/documents.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { UserStore } from 'src/app/shared/stores/user.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-patient-letters',
  templateUrl: './patient-letters.component.html',
  styleUrls: ['./patient-letters.component.scss']
})
export class PatientLettersComponent extends GridBase implements OnInit {
  constructor(
    private appInfo: AppInfoService,
    private documentsService: DocumentsService,
    public userStore: UserStore,
    private spinner: SpinnerService,
    private snackBar: MatSnackBar,
    private appMessages: AppMessagesService,
  ) {
    super()
  }

  @Input() patientId: string;
  @Input() newDictation = false;
  @Input() documentId: string;

  selectedRecord: any;
  action: string;
  complete: boolean = false;
  public dateFormat: string;
  templatePreviewUrl: string = "";

  ngOnInit() {
    this.dateFormat = this.appInfo.getDateFormat;
    this.getLetters();

    if (this.newDictation) {
      this.add();      
    }

    this.addSignalRListener('draftLettersChanged', (x) => {
      this.refreshData();
    });
  }

  getLetters() {
    this.controllerUrl = `${environment.baseurl}/patientLetters/`;
    this.setupDataSource({
      key: 'letterId',
      loadParamsCallback: () => [
        { name: 'patientId', value: this.patientId },
        { name: 'complete', value: this.complete }
      ],
    });
  }

  saved(e) {
    if (e.success) {
      if (this.action == "Add") {
        this.snackBar.open("Draft letter added", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
      }
      if (this.action == "Edit") {
        this.snackBar.open("Draft letter edited", "Close", {
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
    this.refreshData();
  }

  public add() {
    this.action = "Add";
    if (this.documentId) 
      this.selectedRecord = { id: 0, patientId: this.patientId, documentId: this.documentId };
    else
      this.selectedRecord = { id: 0, patientId: this.patientId };
  }

  public editClicked(e) {
    this.action = "Edit";
    this.selectedRecord = { id: e.data.letterId, patientId: this.patientId };
  }

  public deleteClicked(e) {
    const text = 'Are you sure you want to delete this letter?'

    const callback = () => {
      this.spinner.start();
      this.documentsService.deleteLetter(e.data.letterId).subscribe(
        (x) => {
          this.spinner.stop();
          this.snackBar.open("Letter deleted.", "Close", {
            panelClass: "badge-success",
            duration: 3000,
          }
          );
          this.refreshData();
        },
        (e) => {
          this.spinner.stop(); this.appMessages.showApiErrorNotification(e)
        }
      );
    };

    this.appMessages.showDeleteConfirmation(callback, text);
  }

  onFocusedRowChanged(e) {
    this.getDocumentUrl(e);
  }

  getDocumentUrl(e) {
    if (e.row.locked) {
      this.subscription.add(this.documentsService.generateUrl({ correspondenceId: e.row.key })
          .pipe(map(x => `${environment.serverUrl}/pdf?url=${x.data}`),
            tap(x => this.templatePreviewUrl = x)).subscribe()
      );
    }
    else {
      this.subscription.add(this.documentsService.generateDraftUrl(e.row.key, e.row.data.templateId)
        .pipe(map(x => `${environment.serverUrl}/template?url=${x.data}`),
          tap(x => this.templatePreviewUrl = x)).subscribe()
      );
    }
  }

  onRowDoubleClick(e) {
    this.editLetter(e.data);
  }

  editLetter(data) {
    this.subscription.add(
      this.documentsService.editLetter(data.letterId).subscribe()
    )
  }

  editDocumentComments(data) {
    this.subscription.add(
      this.documentsService.editLetter(data.letterId).subscribe()
    )
  }

  checkboxChanged() {
    this.complete = !this.complete;
    this.refreshData();
  }
}