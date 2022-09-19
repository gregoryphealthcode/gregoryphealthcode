import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitePatientZoneComponent } from './site-patient-zone.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { AppFormModule } from '../../app-form/app-form.module';

@NgModule({
  declarations: [SitePatientZoneComponent],
  imports: [
    CommonModule,
    AppFormModule,
    FormsModule,
    ReactiveFormsModule,
    AppButtonModule,
  ],
  exports: [SitePatientZoneComponent],
})
export class SitePatientZoneModule { }
