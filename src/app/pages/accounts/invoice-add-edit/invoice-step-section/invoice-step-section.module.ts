import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceStepSectionComponent } from './invoice-step-section.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InvoiceErrorSectionModule } from '../invoice-error-section/invoice-error-section.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [InvoiceStepSectionComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    InvoiceErrorSectionModule,
    MatTooltipModule,
  ],
  exports: [InvoiceStepSectionComponent]
})
export class InvoiceStepSectionModule { }
