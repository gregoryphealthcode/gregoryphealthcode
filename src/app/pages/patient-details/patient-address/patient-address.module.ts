import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientAdressComponent } from './patient-address.component';
import { DxDataGridModule, DxButtonModule, DxPopupModule, DxScrollViewModule } from 'devextreme-angular';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { DxiColumnModule } from 'devextreme-angular/ui/nested';
import { PatientAddressEditBtnModule } from 'src/app/shared/components/patients/patient-address-edit-btn/patient-address-edit-btn.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [PatientAdressComponent],
  imports: [
    CommonModule,
    AppFormModule,
    AppButtonModule,
    DxDataGridModule,
    DxScrollViewModule,
    DxiColumnModule,
    DxButtonModule,
    DxPopupModule,
    GridSearchTextBoxModule,
    PatientAddressEditBtnModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [PatientAdressComponent],
  providers: [

  ]
})
export class PatientAddressModule { }
