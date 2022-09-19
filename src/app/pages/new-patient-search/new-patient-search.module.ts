import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule, DxSwitchModule, DxPopupModule, DxTextBoxModule, DxLoadPanelModule, DxSelectBoxModule } from 'devextreme-angular';
import { NewPatientSearchComponent } from './new-patient-search.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { UserAvatarModule } from 'src/app/shared/components/user-avatar/user-avatar.module';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PatientDetailsQuickViewModule } from 'src/app/shared/components/patient-details-quick-view/patient-details-quick-view.module';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { PatientSearchGridComponent } from './patient-search-grid/patient-search-grid.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PatientAddEditPopupModule } from 'src/app/shared/components/patient-add-edit-popup/patient-add-edit-popup.module';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { MedSecSiteSelectorModule } from 'src/app/shared/components/med-sec-site-selector/med-sec-site-selector.module';
import { MedSecDuplicateSiteSelectorModule } from 'src/app/shared/components/med-sec-duplicate-site-selector/med-sec-duplicate-site-selector.module';
import { AppointmentPopupAddEditModule } from 'src/app/shared/components/appointment-popup-add-edit/appointment-popup-add-edit.module';

@NgModule({
  declarations: [
    NewPatientSearchComponent,
    PatientSearchGridComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DxDataGridModule,
    MatIconModule,
    DxButtonModule,
    DxTextBoxModule,
    MatFormFieldModule,
    DxSwitchModule,
    DxPopupModule,
    MatButtonModule,
    UserAvatarModule,
    NoDataModule,
    MatDatepickerModule,
    PatientDetailsQuickViewModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    DirectivesModule,
    PopUpFormModule,
    MatTabsModule,
    DxLoadPanelModule,
    PatientAddEditPopupModule,
    GridSearchTextBoxModule,
    DxSelectBoxModule,
    AppButtonModule,
    MedSecSiteSelectorModule,
    MedSecDuplicateSiteSelectorModule,
    AppointmentPopupAddEditModule
  ],
  exports: [
    NewPatientSearchComponent
  ],
  providers: []
})

export class NewPatientSearchModule { }