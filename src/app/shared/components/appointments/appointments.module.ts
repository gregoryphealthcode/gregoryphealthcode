import { NgModule } from '@angular/core';
import { DxSchedulerModule, DxPopupModule, DxSelectBoxModule, DxTextBoxModule, DxLoadPanelModule, DxNumberBoxModule, DxFormModule } from 'devextreme-angular';
import { AppointmentsComponent } from './appointments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';
import { PatientSearchModule } from 'src/app/shared/components/patient-search/patient-search.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NoDataModule } from '../no-data/no-data.module';
import { MatButtonModule } from '@angular/material/button';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { DirectivesModule } from '../../directives/directives.module';
import { AppFormModule } from '../app-form/app-form.module';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        DxSchedulerModule,
        MomentModule,
        DxPopupModule,
        PatientSearchModule,
        DxSelectBoxModule,
        DxTextBoxModule,
        DxLoadPanelModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        NoDataModule,
        MatButtonModule,
        DxNumberBoxModule,
        AppButtonModule,
        DirectivesModule,
        DxFormModule,
        AppFormModule,
    PopUpFormModule,
    ReactiveFormsModule,
    ],
    declarations: [
        AppointmentsComponent
    ],
    exports: [
        AppointmentsComponent
    ]
})

export class AppointmentsControlModule { }
