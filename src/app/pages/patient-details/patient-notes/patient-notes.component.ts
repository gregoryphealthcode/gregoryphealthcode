import { NgModule, Component, Input, OnInit, EventEmitter, Output, HostListener, ViewChild, } from '@angular/core';
import {
  DxFormModule, DxButtonModule, DxPopupModule, DxBoxModule, DxCheckBoxModule, DxDataGridModule, DxContextMenuModule, DxDataGridComponent,
  DxSwitchModule, DxToolbarModule, DxHtmlEditorModule, DxPopupComponent,
} from 'devextreme-angular';
import { BehaviorSubject, } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppInfoService, ScreenService } from 'src/app/shared/services';
import { PatientNoteFormModule } from '../patient-note-form/patient-note-form.component';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { UserStore } from 'src/app/shared/stores/user.store';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogTemplateComponent } from 'src/app/shared/components/dialog/dialog-template.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from 'src/environments/environment';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { PatientNoteService, PatientNoteModel } from 'src/app/shared/services/patient-note.service';
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import Guid from 'devextreme/core/guid';
import { GridBase } from 'src/app/shared/base/grid.base';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-patient-notes',
  templateUrl: './patient-notes.component.html',
  styleUrls: ['./patient-notes.component.scss']
})

@AutoUnsubscribe
export class PatientNotesComponent extends GridBase implements OnInit {
  constructor(
    public appInfo: AppInfoService,
    public screenService: ScreenService,
    public userStore: UserStore,
    private dialog: MatDialog,
    private patientNoteService: PatientNoteService,
    private spinner: SpinnerService,
    private appMessage: AppMessagesService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  @Input() patientId: Guid;
  @Input() patientName: string;
  @Output() NotesLoaded = new EventEmitter();

  private searchTerms = new BehaviorSubject<string>(undefined);
  searchTermValue: string = "";
  showNotePopup: boolean = false;
  showNotePreview: boolean = true;
  showAlertPopup: boolean;
  isEdit: boolean;
  patientNoteId: Guid;
  previewNoteData: PatientNoteModel;
  patientNoteSelected: PatientNoteModel;

  contextMenuItems = [
    { text: 'Edit', icon: 'fas fa-edit', disabled: !this.userStore.roleAllowsAccess(71) },
    { text: 'Delete', icon: 'fas fa-trash-alt', disabled: !this.userStore.roleAllowsAccess(71) },
  ];

  ngOnInit() {
    this.getPatientNotes();

    this.subscription.add(
      this.searchTerms
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap((x) => {
            if (x !== undefined) this.refreshData();
          })
        )
        .subscribe()
    );
  }

  getPatientNotes() {
    this.controllerUrl = `${environment.baseurl}/patientNotes/`;
    this.setupDataSource({
      key: 'patientNoteId',
      loadParamsCallback: () => [
        { name: 'patientId', value: this.patientId },
        { name: 'searchTermValue', value: this.searchTermValue },
      ],
    });
    if (this.patientNoteId)
      this.getNoteDetails(this.patientNoteId);
  }

  onFocusedRowChanged(e) {
    if (e.row.data.patientNoteId) {
      this.patientNoteId = e.row.data.patientNoteId;
      this.getNoteDetails(this.patientNoteId);
    }
    else {
      this.previewNoteData = null;
    }
  }

  getNoteDetails(e) {
    this.patientNoteService.getPatientNoteDetails(e).subscribe(x => {
      this.previewNoteData = x;
    })
  }

  onRowPrepared(e): void {
    e.rowElement.style.height = '20px';
  }

  add() {
    this.isEdit = false;
    this.showNotePopup = true;
  }

  public editClicked() {
    this.isEdit = true;
    this.showNotePopup = true;
  }

  deleteClicked() {
    const callback = () => {
      this.spinner.start();
        this.previewNoteData.deletedByUserId = this.userStore.getUserId();

        this.subscription.add(this.patientNoteService.deletePatientNote(this.previewNoteData.patientNoteId).subscribe((data) => {
          if (data.success) {
            this.snackBar.open("Note deleted", "Close", {
              panelClass: "badge-success",
              duration: 3000,
            });
            this.spinner.stop();
            this.refreshNotes();
            this.previewNoteData = null;
          }},
          e => {
            this.snackBar.open("Error deleting patient note", "Close", {
              panelClass: "badge-success",
              duration: 3000,
            });
          }
        ));
    }

    this.appMessage.showDeleteConfirmation(callback, "Are you sure you want to delete this patient note?");
  }

  public roleAllowsAccess(key) {
    return this.userStore.roleAllowsAccess(key);
  }

  refreshNotes() {
    this.refreshData();
    this.NotesLoaded.emit();
  }

  clearSearch() {
    this.searchTermValue = '';
    this.refreshData();
  }

  search(e) {
    this.searchTermValue = e.target.value;
    this.searchTerms.next(this.searchTermValue);
  }

  downloadAttachment(e) {
    this.subscription.add(this.patientNoteService.getPatientNoteAttachment(this.patientId, e.attachmentId).subscribe(data => {
      var blob = this.b64toBlob(data.fileBase64String);
      saveAs(blob, e.attachmentFile);
    }))
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

  noteSaved(e) {
    this.showNotePopup = false;
    this.refreshNotes();
    if (e) {
      this.patientNoteId = e;
      this.getNoteDetails(e);
    }
  }
}

@NgModule({
  declarations: [PatientNotesComponent],
  imports: [
    DxDataGridModule, DxBoxModule, DxButtonModule, DxContextMenuModule, DxCheckBoxModule,
    CommonModule, DxFormModule, DxSwitchModule, DxToolbarModule, DxPopupModule, DxHtmlEditorModule,
    PatientNoteFormModule, MatIconModule, MatButtonModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatSelectModule, DirectivesModule, PopUpFormModule, GridSearchTextBoxModule, AppButtonModule
  ],
  exports: [PatientNotesComponent]
})

export class PatientNotesModule { }
