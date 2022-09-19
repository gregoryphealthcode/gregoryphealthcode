import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxDateBoxModule } from 'devextreme-angular';
import { MatButtonModule } from '@angular/material/button';
import { ReprintQueueComponent } from './reprint-queue.component';
import { PdfPreviewPopupModule } from 'src/app/shared/components/pdf-preview-popup/pdf-preview-popup.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DxDataGridModule,
    MatButtonModule,
    PdfPreviewPopupModule,
    AppButtonModule,
    DxDateBoxModule,
    MatIconModule,
    MatTooltipModule,
  ],
  declarations: [
    ReprintQueueComponent

  ],
  exports: [
    ReprintQueueComponent
  ]
})

export class ReprintQueueModule { }