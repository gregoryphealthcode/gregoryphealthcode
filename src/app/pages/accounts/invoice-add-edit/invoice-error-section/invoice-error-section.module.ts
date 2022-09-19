import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InvoiceErrorSectionComponent } from './invoice-error-section.component';

@NgModule({
  declarations: [InvoiceErrorSectionComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [InvoiceErrorSectionComponent]
})

export class InvoiceErrorSectionModule { }