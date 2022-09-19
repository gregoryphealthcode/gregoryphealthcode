import { NgModule } from '@angular/core';
import { DxPopupModule, DxSelectBoxModule, DxButtonModule, DxTextBoxModule, DxNumberBoxModule,
         DxFormModule, DxAccordionModule, DxCheckBoxModule, DxDataGridModule, DxValidatorModule, DxValidationSummaryModule,
         DxAutocompleteModule,
         DxTextAreaModule} from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactDetailsComponent } from './contact-details.component';
import { PostcodeSelectAddressModule } from '../postcode-select-address/postcode-select-address.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostcodeToAddressModule } from '../postcode-to-address/postcode-to-address.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { ContactTelecomEditModule } from './contact-telecom-edit/contact-telecom-edit.module';
import { ContactListModule } from './contacts-list.module';
import { MatTabsModule } from '@angular/material/tabs';
import { NoDataModule } from '../no-data/no-data.module';
import { MatMenuModule } from '@angular/material/menu';
import { ContactsSummaryViewModule } from '../contacts-summary-view/contacts-summary-view.module';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';
import { AddContactModule } from './add-contact/add-contact.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { EditContactModule } from './edit-contact/edit-contact.module';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { EditContactAddressModule } from './edit-contact-address/edit-contact-address.module';
import { AppFormModule } from '../app-form/app-form.module';
import { ContactAddressModule } from './contact-address/contact-address.module';
import { ContactTelecomComponent } from './contact-telecom/contact-telecom.component';

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
        DxPopupModule,
        PostcodeSelectAddressModule,
        DxAutocompleteModule,
        DxValidatorModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        PostcodeToAddressModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCheckboxModule,
        MatInputModule,
        ContactTelecomEditModule,
        ContactListModule,
        MatTabsModule,
        NoDataModule,
        MatMenuModule,
        DxTextAreaModule,
        ContactsSummaryViewModule,
        PopUpFormModule,
        DirectivesModule,
        AddContactModule,
        EditContactModule,
        AppButtonModule,
        AppFormModule,
        EditContactAddressModule,
        ContactAddressModule,
        ContactTelecomEditModule,
    ],
    declarations: [
        ContactDetailsComponent,
        ContactTelecomComponent,
    ],
    exports: [
         ContactDetailsComponent,
         ContactTelecomComponent
    ]})

    export class ContactDetailsModule {}
