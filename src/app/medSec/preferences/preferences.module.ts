import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DxTextBoxModule, DxFormModule, DxAccordionModule, DxButtonModule, DxSelectBoxModule, DxCheckBoxModule,
         DxDataGridModule, DxValidatorModule, DxValidationSummaryModule, DxNumberBoxModule, DxTreeListModule, DxPopupModule } from 'devextreme-angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { UserAvatarModule } from 'src/app/shared/components/user-avatar/user-avatar.module';
import { ContactsSummaryViewModule } from 'src/app/shared/components/contacts-summary-view/contacts-summary-view.module';
import { MatInputModule } from '@angular/material/input';
import { MedSecPreferencesIntegrationServicesComponent } from './preferences-integration-services/preferences-integration-services.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MedSecPreferencesRoutingModule } from './medsec-preferences-routing.module';
import { PreferencesIntegrationServicesModule } from 'src/app/pages/preferences/preferences-integration-services/preferences-integration-services.module';
import { PreferencesTemplatesModule } from 'src/app/pages/preferences/preferences-templates/preferences-templates.module';


@NgModule({
    imports: [
        FormsModule,
        CommonModule,
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
        ContactsSummaryViewModule,
        PopUpFormModule,
        DxPopupModule,
        MatTabsModule,
        PreferencesIntegrationServicesModule,
        MedSecPreferencesRoutingModule,
        PreferencesTemplatesModule
    ],
    declarations: [
      MedSecPreferencesIntegrationServicesComponent,
    ],
    exports: [
      MedSecPreferencesIntegrationServicesComponent
    ]})

    export class MedSecPreferencesModule {}
