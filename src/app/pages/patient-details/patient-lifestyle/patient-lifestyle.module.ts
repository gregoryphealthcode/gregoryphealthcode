import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';
import { PostcodeSelectAddressModule } from 'src/app/shared/components/postcode-select-address/postcode-select-address.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PatientLifestyleComponent } from './patient-lifestyle.component';
import { DxDataGridModule, DxPopupModule, DxTextBoxModule, DxAutocompleteModule, DxCheckBoxModule } from 'devextreme-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { PatientLifestyleEditComponent } from './patient-lifestyle-edit/patient-lifestyle-edit.component';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';

@NgModule({
  declarations: [PatientLifestyleComponent, PatientLifestyleEditComponent],
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
    MatTooltipModule,
    DirectivesModule,
    DxTextBoxModule,
    DxAutocompleteModule,
    DxCheckBoxModule,
    PopUpFormModule,
    AppFormModule,
    AppButtonModule,
    GridSearchTextBoxModule,
  ],
  exports: [PatientLifestyleComponent],
  providers: []
})
export class PatientLifestyleModule { }
