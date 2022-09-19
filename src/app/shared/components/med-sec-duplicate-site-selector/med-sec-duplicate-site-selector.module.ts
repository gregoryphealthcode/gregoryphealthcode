import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedSecDuplicateSiteSelectorComponent } from './med-sec-duplicate-site-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { AppFormModule } from '../app-form/app-form.module';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';
import { DxCheckBoxModule, DxPopupModule } from 'devextreme-angular';

@NgModule({
  declarations: [MedSecDuplicateSiteSelectorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppButtonModule,
    AppFormModule,
    PopUpFormModule,
    DxPopupModule,
    DxCheckBoxModule
  ],
  exports: [MedSecDuplicateSiteSelectorComponent]
})
export class MedSecDuplicateSiteSelectorModule { }
