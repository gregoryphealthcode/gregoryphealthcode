import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridStateSaveComponent } from './grid-state-save.component';
import { FormsModule } from '@angular/forms';
import { AppFormModule } from '../app-form/app-form.module';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';
import { AppRadioButtonModule } from '../../widgets/app-radio-button/app-radio-button.module';

@NgModule({
  declarations: [GridStateSaveComponent],
  imports: [
    CommonModule,
    FormsModule,
    AppFormModule,
    AppButtonModule,
    PopUpFormModule,
    AppRadioButtonModule
  ]
})
export class GridStateSaveModule { }
