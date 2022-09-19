import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedSecSiteSelectorComponent } from './med-sec-site-selector/med-sec-site-selector.component';
import { DxPopupModule, DxSelectBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';



@NgModule({
  declarations: [MedSecSiteSelectorComponent],
  imports: [
    CommonModule,
    AppButtonModule,
    PopUpFormModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxTextBoxModule
  ],
  exports: [MedSecSiteSelectorComponent]
})
export class MedSecSiteSelectorModule { }
