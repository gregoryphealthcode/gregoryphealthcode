import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxDateBoxModule, DxPopupModule } from 'devextreme-angular';
import { PrintQueueComponent } from './print-queue.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { PrintQueueDialogComponent } from './print-queue-dialog.component';
import { PdfPreviewPopupModule } from 'src/app/shared/components/pdf-preview-popup/pdf-preview-popup.module';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DxDataGridModule,
    MatButtonModule,
    MatDialogModule,
    DxPopupModule,
    PdfPreviewPopupModule,
    GridSearchTextBoxModule,
    AppButtonModule,
    DxDateBoxModule,
    MatIconModule,
    MatTooltipModule
  ],
  declarations: [
    PrintQueueComponent,
    PrintQueueDialogComponent
  ],
  exports: [
    PrintQueueComponent
  ]
})

export class PrintQueueModule { }
