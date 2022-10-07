import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Guid from 'devextreme/core/guid';
import * as fileSaver from 'file-saver';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { PatientDocumentService } from 'src/app/shared/services/patient-document-service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-patient-documents',
  templateUrl: './patient-documents.component.html',
  styleUrls: ['./patient-documents.component.scss']
})
export class PatientDocumentsComponent extends GridBase implements OnInit {
  constructor(
    private patientDocumentService: PatientDocumentService,
    private spinner: SpinnerService,
    private snackBar: MatSnackBar,
    private appMessages: AppMessagesService,
    private appInfoService: AppInfoService,
  ) {
    super();
  }

  @Input() patientId: Guid;

  @Output() changeTab = new EventEmitter<string>();

  selectedRecord: any;
  action: string;
  dateFormat: string;

  items = [
    { id: 1, description: "New Document", value: "Document", icon: "far fa-file-medical" },
    { id: 2, description: "New Dictation", value: "Dictation", icon: "far fa-comment-alt-lines" },
  ];

  ngOnInit(): void {
    this.getPatientDocuments();
    this.dateFormat = this.appInfoService.getDateFormat;
  }

  getPatientDocuments() {
    if (this.patientId != undefined) {
      this.controllerUrl = `${environment.baseurl}/patientDocuments/`;
      this.setupDataSource({
        key: 'patientDocumentId',
        loadParamsCallback: () => [
          { name: 'patientId', value: this.patientId },
        ],
      });
    }
  }

  saved(e) {
    if (e.success) {
      if (this.action == "Add") {
        this.snackBar.open("Document added", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
      }
      if (this.action == "Edit") {
        this.snackBar.open("Document edited", "Close", {
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

  public add(type) {
    this.action = "Add";
    this.selectedRecord = { id: 0, patientId: this.patientId, type: type };
  }

  public editClicked(e) {
    if (!e.data.locked) {
      this.action = "Edit";
      this.selectedRecord = { id: e.data.patientDocumentId };
    }
  }

  public deleteClicked(e) {
    const text = 'Are you sure you want to delete this document?'

    const callback = () => {
      this.spinner.start();
      this.patientDocumentService.deletePatientDocument(e.data.patientDocumentId).subscribe(
        (x) => {
          this.spinner.stop();
          this.snackBar.open("Document deleted.", "Close", {
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

  downloadFile(e) {
    this.patientDocumentService.getPatientFile(e.data.patientId, e.data.patientDocumentId, e.data.externalStorageId, e.data.fileName).subscribe(data => {
      var blob = this.b64toBlob(data.fileBase64String);
      fileSaver.saveAs(blob, data.fileName);
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

  changeTabHandler(e) {
    this.changeTab.emit(e);
  }
}
