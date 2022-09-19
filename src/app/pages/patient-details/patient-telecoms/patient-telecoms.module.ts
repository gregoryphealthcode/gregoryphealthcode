import { PatientTelecomsComponent } from './patient-telecoms.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';
import { PostcodeSelectAddressModule } from 'src/app/shared/components/postcode-select-address/postcode-select-address.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { DxDataGridModule, DxPopupModule } from 'devextreme-angular';
import { PatientTelecomsEditModule } from '../patient-telecoms-edit/patient-telecoms-edit.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';

@NgModule({
  declarations: [PatientTelecomsComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MomentModule,
    PostcodeSelectAddressModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    DxDataGridModule,
    DxPopupModule,
    PatientTelecomsEditModule,
    MatTooltipModule,
    DirectivesModule,
    PopUpFormModule,
    GridSearchTextBoxModule,    
    AppButtonModule,
  ],
  exports: [PatientTelecomsComponent],
  providers: []
})

export class PatientTelecomsModule { }