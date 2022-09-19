import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientLettersAddEditComponent } from './patient-letters-add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxPopupModule } from 'devextreme-angular';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';

@NgModule({
  declarations: [ PatientLettersAddEditComponent ],
  imports: [
    CommonModule,
    AppButtonModule,
    PopUpFormModule, 
    DxPopupModule,
    MatIconModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    AppFormModule,
    MatTabsModule,
    MatCheckboxModule,
    PipesModule, 
    MatTooltipModule,
  ],
  exports: [ PatientLettersAddEditComponent ]
})
export class PatientLettersAddEditModule { }
