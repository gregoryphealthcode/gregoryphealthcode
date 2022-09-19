import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxDateBoxModule } from 'devextreme-angular';
import { MatButtonModule } from '@angular/material/button';
import { DocumentReviewComponent } from './documents-review.component';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DxDataGridModule,
    MatButtonModule,
    AppButtonModule,
    DxDateBoxModule
  ],
  declarations: [
    DocumentReviewComponent

  ],
  exports: [
    DocumentReviewComponent
  ]
})

export class DocumentReviewModule { }
