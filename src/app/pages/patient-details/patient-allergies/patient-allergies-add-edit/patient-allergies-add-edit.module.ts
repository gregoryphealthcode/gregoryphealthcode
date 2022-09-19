import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { PatientAllergiesAddEditComponent } from './patient-allergies-add-edit.component';
import { DxPopupModule } from 'devextreme-angular';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';

@NgModule({
  declarations: [PatientAllergiesAddEditComponent],
  imports: [
    CommonModule,
    AppFormModule,
    DxPopupModule,
    PopUpFormModule,
    FormsModule,
    AppButtonModule,
    ReactiveFormsModule,
    DirectivesModule
  ],
  exports: [PatientAllergiesAddEditComponent]
})
export class PatientAllergiesAddEditModule { }
