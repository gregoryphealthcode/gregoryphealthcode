import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxContextMenuModule, DxPopupModule, DxScrollViewModule, DxSelectBoxModule, DxTextBoxModule, DxTooltipModule } from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { PatientTelecomSelectDropdownComponent } from './patient-telecom-select-dropdown.component';
import { PopUpFormModule } from '../../pop-up-form/pop-up-form.module';
import { AppFormModule } from '../../app-form/app-form.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';

@NgModule({
  declarations: [PatientTelecomSelectDropdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    DxPopupModule,
    PopUpFormModule,
    AppFormModule,
    AppButtonModule,
    MatTooltipModule,
    DirectivesModule,
    DxScrollViewModule,
    DxSelectBoxModule,
    MatMenuModule,
    DxTooltipModule,
    DxContextMenuModule,
    DxTextBoxModule
  ],
  exports:[PatientTelecomSelectDropdownComponent]
})
export class PatientTelecomSelectDropdownModule { }
