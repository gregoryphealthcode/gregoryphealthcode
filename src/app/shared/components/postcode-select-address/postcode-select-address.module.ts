import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { DxButtonModule, DxCheckBoxModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxLoadPanelModule, DxBoxModule, DxResponsiveBoxModule, DxFormModule, DxDropDownBoxModule, DxListModule, DxDataGridModule, DxPopupModule, DxDateBoxModule } from 'devextreme-angular';

import { PatientSearchModule } from 'src/app/shared/components/patient-search/patient-search.component';

import { PipesModule } from '../../pipes/pipes.module';

import { AppInfoService } from '../../services';

import { PostcodeSelectAddressComponent } from './postcode-select-address.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxValidationGroupModule,
    DxLoadPanelModule,
    DxBoxModule,
    DxResponsiveBoxModule,
    DxFormModule,
    DxDropDownBoxModule,
    DxListModule,
    DxDataGridModule,
    PatientSearchModule,
    DxPopupModule,
    DxDateBoxModule,
    PipesModule
  ],
  providers: [AppInfoService],
  declarations: [PostcodeSelectAddressComponent],
  exports: [PostcodeSelectAddressComponent]
})
export class PostcodeSelectAddressModule { }
