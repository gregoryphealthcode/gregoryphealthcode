import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteHealthcodeComponent } from './site-healthcode.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { AppFormModule } from '../../app-form/app-form.module';

@NgModule({
  declarations: [SiteHealthcodeComponent],
  imports: [
    CommonModule,
    AppFormModule,
    FormsModule,
    ReactiveFormsModule,
    AppButtonModule,
  ],
  exports: [SiteHealthcodeComponent]
})
export class SiteHealthcodeModule { }
