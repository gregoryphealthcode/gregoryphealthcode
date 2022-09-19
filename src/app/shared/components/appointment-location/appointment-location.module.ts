import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppointmentLocationComponent } from './appointment-location.component';
import { DxButtonModule, DxTextBoxModule, DxTextAreaModule, DxValidationSummaryModule } from 'devextreme-angular';
import { MatIconModule } from '@angular/material/icon';
import { DirectivesModule } from '../../directives/directives.module';
import { PostcodeToAddressModule } from '../postcode-to-address/postcode-to-address.module';
import { MatButtonModule } from '@angular/material/button';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        DxButtonModule, DxTextBoxModule, DxTextAreaModule,
        DxValidationSummaryModule,
        MatIconModule,
        PostcodeToAddressModule,
        DirectivesModule,
        MatButtonModule,
        AppButtonModule
    ],
    declarations: [
        AppointmentLocationComponent
    ],
    exports: [
        AppointmentLocationComponent
    ]
})

export class AppointmentLocationDetailsModule { }
