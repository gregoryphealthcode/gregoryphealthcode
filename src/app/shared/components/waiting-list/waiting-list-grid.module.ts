import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitingListGridComponent } from './waiting-list-grid.component';
import { WaitingListAddEditComponent } from '../waiting-list-add-edit/waiting-list-add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DxDataGridModule, DxButtonModule, DxValidationSummaryModule, DxSelectBoxModule, DxTextAreaModule, DxCheckBoxModule, DxPopupModule, DxTextBoxModule, DxContextMenuModule, DxLoadPanelModule, DxSwitchModule, DxDateBoxModule } from 'devextreme-angular';
import { DirectivesModule } from '../../directives/directives.module';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { AppCardModule } from '../../widgets/app-card/app-card.module';
import { GridSearchTextBoxModule } from '../../widgets/grid-search-text-box/grid-search-text-box.module';
import { AppFormModule } from '../app-form/app-form.module';
import { AppPageWrapperModule } from '../app-page-wrapper/app-page-wrapper.module';
import { PatientQuickSearchModule } from '../patients/patient-quick-search/patient-quick-search.module';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';
import { MedSecSiteSelectorModule } from '../med-sec-site-selector/med-sec-site-selector.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WaitingListAddEditModule } from '../waiting-list-add-edit/waiting-list-add-edit.module';

@NgModule({
  declarations: [WaitingListGridComponent],
  imports: [
    CommonModule,
    FormsModule,
    DxDataGridModule,
    DxButtonModule,
    DxValidationSummaryModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxCheckBoxModule,
    DxPopupModule,
    DxTextBoxModule,
    DxContextMenuModule,
    DxLoadPanelModule,
    DxSwitchModule,
    MatButtonModule,
    MatButtonModule,
    MatIconModule,
    PopUpFormModule,
    ReactiveFormsModule,
    AppButtonModule,
    AppFormModule,
    DirectivesModule,
    GridSearchTextBoxModule,
    AppPageWrapperModule,
    AppButtonModule,
    AppCardModule,
    DxDateBoxModule,
    PatientQuickSearchModule,
    MedSecSiteSelectorModule,
    MatTooltipModule,
    WaitingListAddEditModule
  ],
  exports: [WaitingListGridComponent],
})
export class WaitingListGridModule { }
