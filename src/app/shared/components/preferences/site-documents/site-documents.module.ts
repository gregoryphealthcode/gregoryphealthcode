import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteDocumentsComponent } from './site-documents.component';
import { AppFormModule } from '../../app-form/app-form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';

@NgModule({
  declarations: [SiteDocumentsComponent],
  imports: [
    CommonModule,
    AppFormModule,
    FormsModule,
    ReactiveFormsModule,
    AppButtonModule,
  ],
  exports: [SiteDocumentsComponent],
})
export class SiteDocumentsModule { }
