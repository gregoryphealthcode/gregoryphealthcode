import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientQuickSearchComponent } from './patient-quick-search/patient-quick-search.component';
import { DxDataGridModule, DxPopupModule, DxSelectBoxModule } from 'devextreme-angular';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { PatientQuickSearchPopupComponent } from './patient-quick-search-popup/patient-quick-search-popup.component';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { PopUpFormModule } from '../../pop-up-form/pop-up-form.module';
import { PatientAddEditPopupModule } from '../../patient-add-edit-popup/patient-add-edit-popup.module';



@NgModule({
  declarations: [PatientQuickSearchComponent, PatientQuickSearchPopupComponent],
  imports: [
    CommonModule,
    DxDataGridModule,
    GridSearchTextBoxModule,
    DxSelectBoxModule,
    AppButtonModule,
    PopUpFormModule,
    DxPopupModule,
    PatientAddEditPopupModule
  ],
  exports: [PatientQuickSearchComponent, PatientQuickSearchPopupComponent],
})
export class PatientQuickSearchModule { }
