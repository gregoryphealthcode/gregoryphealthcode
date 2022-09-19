import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { DxDataGridModule, DxButtonModule, DxPopupModule, DxTextBoxModule, DxCheckBoxModule, DxSelectBoxModule, DxDateBoxModule } from 'devextreme-angular';
import { PatientSearchModule } from 'src/app/shared/components/patient-search/patient-search.component';
import { ViewDiaryModule } from 'src/app/shared/components/diary/view-diary.module';
import { PatientInsurersComponent } from './patient-insurers.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PatientInsurersEditModule } from '../patient-insurers-edit/patient-insurers-edit.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        DxDataGridModule,
        DxButtonModule,
        DxPopupModule,
        DxTextBoxModule,
        PatientSearchModule,
        ViewDiaryModule,
        DxCheckBoxModule,
        DxSelectBoxModule,
        DxTextBoxModule,
        DxDateBoxModule,
        MatIconModule,
        MatButtonModule,
        PatientInsurersEditModule,
        MatTooltipModule,
        PopUpFormModule,
        DirectivesModule,
        AppFormModule,
        AppButtonModule
    ],
    declarations: [
        PatientInsurersComponent
    ],
    exports: [
        PatientInsurersComponent
    ],
    providers: [
        DatePipe
    ]
})

export class PatientInsurersModule { }
