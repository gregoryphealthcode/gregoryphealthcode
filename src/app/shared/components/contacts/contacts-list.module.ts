import { NgModule } from '@angular/core';
import {
    DxSelectBoxModule, DxButtonModule, DxTextBoxModule, DxNumberBoxModule,
    DxFormModule, DxAccordionModule, DxCheckBoxModule, DxDataGridModule, DxValidatorModule,
    DxValidationSummaryModule, DxPopupModule, DxTreeViewModule, DxTreeListModule, DxContextMenuModule
} from 'devextreme-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListContactsComponent } from './contacts-list.component';
import { MatButtonModule } from '@angular/material/button';
import { NoDataModule } from '../no-data/no-data.module';
import { UserAvatarModule } from '../user-avatar/user-avatar.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { ContactsSummaryViewModule } from '../contacts-summary-view/contacts-summary-view.module';
import { DirectivesModule } from '../../directives/directives.module';
import { MatSelectModule } from '@angular/material/select';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';
import { ContactAddToPatientModule } from './contact-add-to-patient/contact-add-to-patient.module';
import { AddContactModule } from './add-contact/add-contact.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ContactsGridModule } from './contacts-grid/contacts-grid.module';
import { MatMenuModule } from '@angular/material/menu';
import { MedSecSiteSelectorModule } from '../med-sec-site-selector/med-sec-site-selector.module';


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
        MatButtonModule,
        NoDataModule,
        UserAvatarModule,
        MatIconModule,
        DxTreeViewModule,
        DxTreeListModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatInputModule,
        ContactsSummaryViewModule,
        DirectivesModule,
        MatSelectModule,
        DxContextMenuModule,
        DxPopupModule,
        PopUpFormModule,
        AppButtonModule,
        ContactAddToPatientModule,
        AddContactModule,
        MatCheckboxModule,
        ContactsGridModule,
        MatMenuModule,
        MedSecSiteSelectorModule,
    ],
    declarations: [
        ListContactsComponent
    ],
    exports: [
        ListContactsComponent
    ]
})

export class ContactListModule { }
