import { NgModule, Component, EventEmitter, Output, Input } from '@angular/core';
import { DxPopupModule, DxHtmlEditorModule } from 'devextreme-angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppInfoService } from 'src/app/shared/services';
import Guid from 'devextreme/core/guid';
import 'devextreme/ui/html_editor/converters/markdown';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PatientNoteService, PatientNoteModel } from 'src/app/shared/services/patient-note.service';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-patient-popup-warning-notes',
  templateUrl: './patient-popup-warning-notes.component.html',
  styleUrls: ['./patient-popup-warning-notes.component.scss']
})

export class PatientPopupWarningNotesComponent {
  @Input() popupNotesData: PatientNoteModel[];
  @Input() patientId: Guid;

  @Output() closedPopupWarnings = new EventEmitter();

  visibleItem = 0;
  selectedIndex = 0;
  selectedItem: PatientNoteModel;

  constructor(
    public appInfo: AppInfoService,
    public patientNoteService: PatientNoteService
  ) {

  }

  ngOnInit() {
    this.setItem(this.selectedIndex);
  }

  public setItem(index: number) {
    this.selectedIndex = index;
    this.selectedItem = this.popupNotesData[index];
  }

  closeWarnings() {
    this.closedPopupWarnings.emit();
  }

  nextClicked() {
    const newIndex = this.selectedIndex + 1;
    if (newIndex >= this.popupNotesData.length) { return; }
    this.setItem(newIndex);
  }

  previousClicked() {
    const newIndex = this.selectedIndex - 1;
    if (newIndex < 0) { return; }
    this.setItem(newIndex);
  }

  downloadAttachment(attachmentId: string) {
    this.patientNoteService.getPatientNoteAttachment(this.patientId, attachmentId).subscribe(data => {
      var blob = this.b64toBlob(data.fileBase64String);
      saveAs(blob, data.attachmentFile);
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

export interface PopupNoteModel {
  attachmentFile: string;
  dateCreated: Date;
  warning: boolean;
  popup: boolean;
  noteType: string;
  noteText: any;
  createdByUserId: Guid;
  createdBy: string;
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxPopupModule,
    DxHtmlEditorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    AppButtonModule
  ],
  providers: [AppInfoService],
  declarations: [PatientPopupWarningNotesComponent],
  exports: [PatientPopupWarningNotesComponent]
})
export class PatientPopupWarningNotesModule { }
