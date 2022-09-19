import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostcodeToAddressModule } from '../../postcode-to-address/postcode-to-address.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { ContactTelecomEditComponent } from './contact-telecom-edit.component';
import { DxTextBoxModule, DxAutocompleteModule, DxPopupModule } from 'devextreme-angular';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { AppFormModule } from '../../app-form/app-form.module';
import { ContactTelecomEditBtnComponent } from './contact-telecom-edit-btn/contact-telecom-edit-btn.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PopUpFormModule } from '../../pop-up-form/pop-up-form.module';

@NgModule({
  imports: [
      FormsModule,
      CommonModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatIconModule,
      PostcodeToAddressModule,
      MatTooltipModule,
      MatFormFieldModule,
      MatSelectModule,
      MatCheckboxModule,
      MatInputModule,
      DxTextBoxModule,
      DxAutocompleteModule,
      AppButtonModule,
      AppFormModule,
      DxPopupModule,
      DirectivesModule,
      PopUpFormModule
  ],
  declarations: [
      ContactTelecomEditComponent,
      ContactTelecomEditBtnComponent
  ],
  exports: [
    ContactTelecomEditComponent, ContactTelecomEditBtnComponent
  ]})

  export class ContactTelecomEditModule {}
