import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PatientZoneErrorSectionComponent } from './patientzone-error-section/patientzone-error-section.component';




@NgModule({
  declarations: [PatientZoneErrorSectionComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [PatientZoneErrorSectionComponent]
})
export class PatientZoneErrorSectionModule { }
