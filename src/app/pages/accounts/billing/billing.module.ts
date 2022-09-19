import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule, DxPopupModule, DxTextBoxModule, DxCheckBoxModule, DxSelectBoxModule, DxDateBoxModule, DxNumberBoxModule, DxScrollViewModule } from 'devextreme-angular';
import { ViewDiaryModule } from 'src/app/shared/components/diary/view-diary.module';
import { RouterModule } from '@angular/router';
import { ContactDetailsModule } from 'src/app/shared/components/contacts/contact-details.module';
import { PatientSearchModule } from 'src/app/shared/components/patient-search/patient-search.component';
import { PatientInsurersModule } from '../../patient-details/patient-insurers/patient-insurers.module';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';
import { UserAvatarModule } from 'src/app/shared/components/user-avatar/user-avatar.module';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { BillingListSummaryViewModule } from 'src/app/shared/components/billing-list-summary-view/billing-list-summary-view.module';
import { MatTabsModule } from '@angular/material/tabs';
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { DxiColModule } from 'devextreme-angular/ui/nested';
import { BillingListComponent } from './billing-list.component';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        RouterModule,
        DxDataGridModule,
        DxButtonModule,
        DxPopupModule,
        DxTextBoxModule,
        PatientSearchModule,
        ViewDiaryModule,
        DxCheckBoxModule,
        DxSelectBoxModule,
        PatientInsurersModule,
        ContactDetailsModule,
        DxDateBoxModule,
        DxNumberBoxModule,
        DxScrollViewModule,
        NoDataModule,
        UserAvatarModule,
        MatButtonModule,
        MatStepperModule,
        MatIconModule,
        BillingListSummaryViewModule,
        MatTabsModule,
        DirectivesModule,
        AppFormModule,
        DxiColModule,      
        GridSearchTextBoxModule,
        AppButtonModule 
    ],
    declarations: [
        BillingListComponent
    ]
})

export class BillingModule { }