import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesTemplatesAddEditComponent } from './preferences-templates-add-edit/preferences-templates-add-edit.component';
import { PreferencesTemplatesGridComponent } from './preferences-templates-grid/preferences-templates-grid.component';
import { PreferencesTemplatesComponent } from './preferences-templates.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { DxTextBoxModule, DxFormModule, DxAccordionModule, DxButtonModule, DxSelectBoxModule, DxCheckBoxModule, DxDataGridModule, DxValidatorModule, DxValidationSummaryModule, DxNumberBoxModule, DxTreeListModule, DxPopupModule, DxRadioGroupModule, DxFileUploaderModule, DxToolbarModule, DxTemplateModule, DxBoxModule } from 'devextreme-angular';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { UserAvatarModule } from 'src/app/shared/components/user-avatar/user-avatar.module';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MedSecDuplicateSiteSelectorModule } from 'src/app/shared/components/med-sec-duplicate-site-selector/med-sec-duplicate-site-selector.module';
import { PreferencesAppointmentOwnersComponent } from '../preferences-appointments/preferences-appointment-owners/preferences-appointment-owners.component';
import { PreferencesAppointmentOwnersPhotoEditComponent } from '../preferences-appointments/preferences-appointment-owners/preferences-appointment-owners-photo-edit/preferences-appointment-owners-photo-edit.component';
import { PreferencesAppointmentOwnersAddEditComponent } from '../preferences-appointments/preferences-appointment-owners/preferences-appointment-owners-add-edit/preferences-appointment-owners-add-edit.component';
import { PreferencesAppointmentOwnerPreviewComponent } from '../preferences-appointments/preferences-appointment-owners/preferences-appointment-owner-preview/preferences-appointment-owner-preview.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    PreferencesTemplatesComponent,
    PreferencesTemplatesGridComponent,
    PreferencesTemplatesAddEditComponent,
    PreferencesAppointmentOwnersComponent,
    PreferencesAppointmentOwnersPhotoEditComponent,
    PreferencesAppointmentOwnersAddEditComponent, 
    PreferencesAppointmentOwnerPreviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppButtonModule,
    AppFormModule,
    FormsModule,
    DxTextBoxModule,
    DxFormModule,
    DxAccordionModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxDataGridModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    DxNumberBoxModule,
    DxTreeListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    UserAvatarModule,
    NoDataModule,
    MatDatepickerModule,
    PopUpFormModule,
    DxPopupModule,
    MatTabsModule,
    DxRadioGroupModule,
    MatTooltipModule,
    GridSearchTextBoxModule,
    MedSecDuplicateSiteSelectorModule,
    ImageCropperModule,
    MatCheckboxModule,
    DxFileUploaderModule,
    DxToolbarModule,
    DxTemplateModule,
    DxBoxModule
  ],
  exports: [
    PreferencesTemplatesComponent,
    PreferencesTemplatesGridComponent,
    PreferencesTemplatesAddEditComponent,
  ]
})
export class PreferencesTemplatesModule { }
