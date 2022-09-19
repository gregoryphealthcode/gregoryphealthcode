import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { PrintingAllComponent } from './printing-all.component';
import { PrintQueueModule } from '../print-queue/print-queue.module';
import { ReprintQueueModule } from '../reprint-queue/reprint-queue.module';
import { DocumentReviewModule } from '../documents-review/documents-review.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DxDataGridModule,
    MatButtonModule,
    MatTabsModule,
    PrintQueueModule,
    ReprintQueueModule,
    DocumentReviewModule
  ],
  declarations: [
    PrintingAllComponent
  ],
  exports: 
  [PrintingAllComponent
  ]
})

export class PrintingAllModule { }