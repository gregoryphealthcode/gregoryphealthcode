import { PatientConnectionsModule } from '../patient-connections/patient-connections.module';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { PatientPersonalInfoComponent } from './patient-personal-info.component';
import { PatientLifestyleModule } from '../patient-lifestyle/patient-lifestyle.module';
import { PatientTelecomsModule } from '../patient-telecoms/patient-telecoms.module';
import { PatientRelatedPersonModule } from '../patient-related-persons/patient-related-persons.module';
import { PatientAddressModule } from '../patient-address/patient-address.module';
import { MatTabsModule } from '@angular/material/tabs';
import { PatientAllergiesModule } from '../patient-allergies/patient-allergies.module';

@NgModule({
  declarations: [PatientPersonalInfoComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatExpansionModule,
    PatientLifestyleModule,
    PatientTelecomsModule,
    PatientConnectionsModule,
    PatientRelatedPersonModule,
    PatientAddressModule,
    MatTabsModule,
    PatientAllergiesModule
  ],
  exports: [PatientPersonalInfoComponent],
  providers: []
})
export class PatientPersonalInfoModule { }
