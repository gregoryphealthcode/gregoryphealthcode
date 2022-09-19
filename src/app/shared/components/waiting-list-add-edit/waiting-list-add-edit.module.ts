import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitingListAddEditComponent } from './waiting-list-add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { AppFormModule } from '../app-form/app-form.module';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxDataGridModule, DxButtonModule, DxValidationSummaryModule, DxSelectBoxModule, DxTextAreaModule, DxCheckBoxModule, DxPopupModule, DxTextBoxModule, DxContextMenuModule, DxLoadPanelModule, DxSwitchModule, DxDateBoxModule } from 'devextreme-angular';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AppCardModule } from 'src/app/shared/widgets/app-card/app-card.module';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { AppPageWrapperModule } from '../app-page-wrapper/app-page-wrapper.module';
import { MedSecSiteSelectorModule } from '../med-sec-site-selector/med-sec-site-selector.module';
import { PatientQuickSearchModule } from '../patients/patient-quick-search/patient-quick-search.module';

@NgModule({
  declarations: [ WaitingListAddEditComponent ],
  imports: [
    CommonModule,
    FormsModule,
    PopUpFormModule,
    ReactiveFormsModule,
    AppButtonModule,
    AppFormModule,
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
    DirectivesModule,
    GridSearchTextBoxModule,
    AppPageWrapperModule,
    AppCardModule,
    DxDateBoxModule,
    PatientQuickSearchModule,
    MedSecSiteSelectorModule,
    MatTooltipModule,
  ],
  exports: [ WaitingListAddEditComponent ] 
})
export class WaitingListAddEditModule { }
