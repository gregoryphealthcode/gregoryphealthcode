import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientCommunicationsComponent } from './patient-communications.component';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxDataGridModule, DxPopupModule, DxFileUploaderModule, DxSelectBoxModule, DxDateBoxModule, DxRadioGroupModule } from 'devextreme-angular';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { PatientDocumentsAddEditComponent } from './patient-documents/patient-documents-add-edit/patient-documents-add-edit.component';
import { PatientSmsAddComponent } from './patient-sms/patient-sms-add/patient-sms-add.component';
import { PatientSmsComponent } from './patient-sms/patient-sms.component';
import { PatientDocumentsComponent } from './patient-documents/patient-documents.component';
import { PatientLettersComponent } from './patient-letters/patient-letters.component';
import { PatientLettersAddEditModule } from './patient-letters/patient-letters-add-edit/patient-letters-add-edit.module';
import { PatientCommunicationsSummaryComponent } from './patient-communications-summary/patient-communications-summary.component';
import { WebcamModule } from 'ngx-webcam';
import { CameraComponent } from './patient-documents/camera/camera.component';
import { PatientTelecomSelectDropdownModule } from 'src/app/shared/components/patients/patient-telecom-select-dropdown/patient-telecom-select-dropdown.module';

@NgModule({
  declarations: [ PatientCommunicationsComponent,
    PatientLettersComponent,  
    PatientDocumentsComponent, PatientDocumentsAddEditComponent, 
    PatientSmsComponent, PatientSmsAddComponent, PatientCommunicationsSummaryComponent, CameraComponent ],
  imports: [
    CommonModule,
    GridSearchTextBoxModule, 
    AppButtonModule,
    DxDataGridModule,
    PopUpFormModule, 
    DxPopupModule,
    DxDateBoxModule,
    DxSelectBoxModule,
    MatIconModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    DxFileUploaderModule,
    AppFormModule,
    MatTabsModule,
    MatCheckboxModule,
    PipesModule, 
    MatTooltipModule,
    PatientLettersAddEditModule,
    WebcamModule,
    DxRadioGroupModule,
    PatientTelecomSelectDropdownModule
  ],
  exports: [ PatientCommunicationsComponent,
    PatientLettersComponent,
    PatientDocumentsComponent, PatientDocumentsAddEditComponent, 
    PatientSmsComponent, PatientSmsAddComponent ]
})
export class PatientCommunicationsModule { }
