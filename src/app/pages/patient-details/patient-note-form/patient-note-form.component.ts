import { NgModule, Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, Input, } from '@angular/core';
import { formatDate, Location } from '@angular/common';
import {
  DxBoxModule, DxDataGridModule, DxButtonModule, DxCheckBoxModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxLoadPanelModule, DxResponsiveBoxModule,
  DxFormModule, DxDropDownBoxModule, DxListModule, DxPopupModule, DxDateBoxModule, DxHtmlEditorModule, DxFileUploaderModule, DxHtmlEditorComponent, DxSelectBoxModule
} from 'devextreme-angular';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppInfoService, ScreenService } from 'src/app/shared/services';
import { PatientSearchModule, } from 'src/app/shared/components/patient-search/patient-search.component';
import Guid from 'devextreme/core/guid';
import { UserService } from 'src/app/shared/services/user.service';
import 'devextreme/ui/html_editor/converters/markdown';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { UserStore } from 'src/app/shared/stores/user.store';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { PatientNoteAttachmentModel, PatientNoteModel, PatientNoteService } from 'src/app/shared/services/patient-note.service';
import { FileCheckResult, FileModel, parseFile } from 'src/app/shared/helpers/file';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { MatDialog } from '@angular/material/dialog';
import { DialogTemplateComponent } from 'src/app/shared/components/dialog/dialog-template.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-patient-note-form',
  templateUrl: './patient-note-form.component.html',
  styleUrls: ['./patient-note-form.component.scss']
})
@AutoUnsubscribe
export class PatientNoteFormComponent extends ReactiveFormBase implements OnInit, AfterViewInit {
  @ViewChild('htmleditor') htmleditor: DxHtmlEditorComponent;

  @Input() patientId: Guid;
  @Input() patientNoteId: Guid;
  @Input() patientName: string;
  @Input() isEdit: boolean;

  @Output() PatientNoteSaved = new EventEmitter<Guid>();

  maxDate = new Date();
  showPatientSearch: boolean;
  editForm: FormGroup;
  patientNote: PatientNoteModel;
  uploadFilesValue: any[] = [];
  notetypes: any[];
  noteVisibility: any[];
  isFileUploaded = false;
  tempFileNames: FileModel[] = [];
  saving = false;

  constructor(
    public appInfo: AppInfoService,
    public router: Router,
    public _location: Location,
    public screenService: ScreenService,
    public userService: UserService,
    public userStore: UserStore,
    private spinnerService: SpinnerService,
    private patientNoteService: PatientNoteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    super();

    this.notetypes = ['Admin', 'Imported', 'Alert'];
    this.noteVisibility = [
      { id: 0, value: 'Practitioner Only' },
      { id: 1, value: 'Medical Secretary' },
      { id: 2, value: 'Practice' }
    ];
  }

  httpRequest = x => {
    x.patientId = this.patientId;
    x.patientNoteId = this.patientNoteId;
    x.attachments = new Array<PatientNoteAttachmentModel>();
    let i = 0;
    this.uploadFilesValue.forEach(element => {
      const outputFile = '' + formatDate(new Date(), 'yyyyMMdd_HHmmssSSS_', 'en') + element.name;
      const attachment = new PatientNoteAttachmentModel();
      attachment.attachmentFile = element.name;
      attachment.attachmentType = this.getFileExtension(outputFile).toUpperCase();
      attachment.attachmentMimeType = element.type;
      attachment.fileBase64String = this.tempFileNames[i].fileAsBase64String;
      x.attachments.push(attachment);
      i++;
    });
    if (this.isEdit) {
      return this.patientNoteService.updatePatientNote(x);
    }
    else {
      return this.patientNoteService.addPatientNote(x);
    }
  };

  onSuccessfullySaved = (x) => {
    if (this.editForm)
      this.PatientNoteSaved.emit(this.patientNoteId);
    else
      this.PatientNoteSaved.emit();
  };

  ngOnInit() {
    this.setupForm();
    if (this.isEdit) {
      this.getNoteDetails();
    }
    else {
      this.editForm.patchValue({ patientText: this.patientName });
      this.editForm.patchValue({ dateCreated: new Date() })
    }
  }

  setupForm() {
    this.editForm = new FormGroup({
      patientText: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      warning: new FormControl(null, null),
      popup: new FormControl(null, null),
      dateCreated: new FormControl(null, [Validators.required]),
      noteType: new FormControl(null, [Validators.required]),
      noteText: new FormControl(null, null),
      notesVisibility: new FormControl(null, null)
    });
  }

  getNoteDetails() {
    this.patientNoteService.getPatientNoteDetails(this.patientNoteId).subscribe(x => {
      this.patientNote = x;
      this.populateForm(x);
    })
  }

  populateForm(x) {
    super.populateForm(x)
  }

  fileUploaded(e) {
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
        this.isFileUploaded = true;
      });
    }
  }

  fileUploadHandler(result: FileCheckResult) {
    this.tempFileNames.push(result.file);
  }

  cancelClicked() {
    this.PatientNoteSaved.emit(this.patientNoteId);
  }

  removeFile(e) {
    var index = this.uploadFilesValue.indexOf(e);
    this.uploadFilesValue.splice(index, 1);
    this.tempFileNames.splice(index, 1);
  }

  deleteAttachment(e): void {
    const dialogRef = this.dialog.open(DialogTemplateComponent, {
      width: '250px',
      data: { title: 'Are you sure?', message: 'Are you sure you want to delete this attachment?' },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.patientNoteService.deletePatientNoteAttachment(e.attachmentId).subscribe(() => {
          this.snackBar.open('Attachment deleted', 'Close', {
            panelClass: 'badge-success',
            duration: 3000
          });
          const i = this.patientNote.attachments.findIndex(x => x.attachmentFile === e.attachmentFile);
          this.patientNote.attachments.splice(i, 1);
          this.spinnerService.stop();
        },
          error => {
            this.snackBar.open(error, 'Close', {
              panelClass: 'badge-danger',
              duration: 3000
            });
            this.spinnerService.stop();
          });
      }
    });
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

  getMimeTypeFromExtension(ext) {
    if (ext === 'DOC') {
      return 'application/msword';
    } else if (ext === 'DOCX') {
      return 'application/octet-stream';
    } else if (ext === 'PDF') {
      return 'application/pdf';
    } else if (ext === 'JPG') {
      return 'image/jphg';
    } else if (ext === 'JPEG') {
      return 'image/jphg';
    } else if (ext === 'PNG') {
      return 'image/png';
    } else if (ext === 'TIF') {
      return 'image/tiff';
    } else if (ext === 'TIFF') {
      return 'image/tiffm';
    } else if (ext === 'MSG') {
      return 'application/vsd.ms-outlook';
    }
    return '';
  }
}


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxValidationGroupModule,
    DxSelectBoxModule,
    DxLoadPanelModule,
    DxBoxModule,
    DxResponsiveBoxModule,
    DxFormModule,
    DxDropDownBoxModule,
    DxListModule,
    DxDataGridModule,
    PatientSearchModule,
    DxPopupModule,
    DxDateBoxModule,
    DxHtmlEditorModule,
    DxFileUploaderModule,
    PipesModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    DirectivesModule,
    AppButtonModule,
    AppFormModule
  ],
  providers: [AppInfoService],
  declarations: [PatientNoteFormComponent],
  exports: [PatientNoteFormComponent]
})
export class PatientNoteFormModule { }

