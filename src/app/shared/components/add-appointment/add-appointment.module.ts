import { NgModule } from '@angular/core';
import {
    DxSchedulerModule, DxPopupModule, DxSelectBoxModule, DxTextBoxModule, DxDateBoxModule, DxValidationSummaryModule, DxCheckBoxModule, DxButtonModule,
    DxTextAreaModule, DxTabPanelModule, DxAutocompleteModule, DxNumberBoxModule, DxDataGridModule, DxRadioGroupModule
} from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';
import { AddAppointmentFormComponent } from './add-appointment.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';
import { AppointmentsControlModule } from '../appointments/appointments.module';
import { AppFormModule } from '../app-form/app-form.module';
import { AppointmentInstructionsComponent } from './appointment-instructions/appointment-instructions.component';
import { PatientWaitingListComponent } from './patient-waiting-list/patient-waiting-list.component';
import { DirectivesModule } from '../../directives/directives.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { PatientPayorsSelectModule } from '../patient-payors-select/patient-payors-select.module';
import { AppRadioButtonModule } from '../../widgets/app-radio-button/app-radio-button.module';
import { AddEditAppointmentPayorComponent } from './add-edit-appointment-payor/add-edit-appointment-payor.component';
import { PipesModule } from '../../pipes/pipes.module';
import { InvoiceServicesSelectModule } from '../invoice-services-select/invoice-services-select.module';
import { AppointmentInstructionsAddEditComponent } from './appointment-instructions/appointment-instructions-add-edit/appointment-instructions-add-edit.component';
import { InvoiceAddEditStoreService } from 'src/app/pages/accounts/invoice-add-edit/invoice-add-edit-store.service';
import { InvoiceServicesStoreService } from '../invoice-services-select/invoice-services-store.service';
import { AppointmentCompleteComponent } from './appointment-complete/appointment-complete.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        DxSchedulerModule,
        MomentModule,
        DxPopupModule,
        DxSelectBoxModule,
        DxTextBoxModule,
        DxDateBoxModule,
        DxValidationSummaryModule,
        DxCheckBoxModule,
        DxButtonModule,
        DxTextAreaModule,
        DxTabPanelModule,
        DxAutocompleteModule,
        DxNumberBoxModule,
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        PopUpFormModule,
        AppointmentsControlModule,
        AppFormModule,
        ReactiveFormsModule,
        DxDataGridModule,
        DirectivesModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        PatientPayorsSelectModule,
        AppButtonModule,
        AppRadioButtonModule,
        PipesModule, 
        InvoiceServicesSelectModule,
        DxRadioGroupModule
    ],
    declarations: [
        AddAppointmentFormComponent,
        AppointmentInstructionsComponent,
        PatientWaitingListComponent,
        AddEditAppointmentPayorComponent,
        AppointmentInstructionsAddEditComponent,
        AppointmentCompleteComponent,
    ],
    exports: [
        AddAppointmentFormComponent
    ],
    providers: [
        InvoiceAddEditStoreService,
        InvoiceServicesStoreService,
    ]
})

export class AddAppointmentModule { }