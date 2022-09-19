import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { InvoiceSummaryViewComponent } from './invoice-summary-view.component';
import { DxDataGridModule } from 'devextreme-angular';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';

@NgModule({
  declarations: [InvoiceSummaryViewComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    DxDataGridModule,
    AppButtonModule
  ],
  exports:[InvoiceSummaryViewComponent]
})
export class InvoiceSummaryViewModule { }
