import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaymentAgeBandsEditComponent } from './payment-age-bands-edit.component';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';
import { AppFormModule } from '../app-form/app-form.module';
import { DxPopupModule } from 'devextreme-angular';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
    imports: [
        CommonModule,
        AppFormModule,
        DxPopupModule,
        PopUpFormModule,
        FormsModule,
        AppButtonModule,
        ReactiveFormsModule,
        DirectivesModule
    ],
    declarations: [
        PaymentAgeBandsEditComponent
    ],
    exports: [
        PaymentAgeBandsEditComponent
    ]
})

export class PaymentAgeBandsEditModule { }