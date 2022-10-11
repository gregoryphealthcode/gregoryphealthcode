import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditContactDepartmentComponent } from './edit-contact-department.component';
import { EditContactDepartmentModalComponent } from './edit-contact-department-modal/edit-contact-department-modal.component';
import { AppFormModule } from '../../app-form/app-form.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { PostcodeSelectAddressModule } from '../../postcode-select-address/postcode-select-address.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxTextBoxModule, DxSelectBoxModule, DxDateBoxModule, DxCheckBoxModule, DxAutocompleteModule, DxPopupModule } from 'devextreme-angular';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PopUpFormModule } from '../../pop-up-form/pop-up-form.module';
import { PostcodeToAddressModule } from '../../postcode-to-address/postcode-to-address.module';

@NgModule({
  declarations: [EditContactDepartmentComponent, EditContactDepartmentModalComponent],
  imports: [
    PostcodeSelectAddressModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxCheckBoxModule,
    PostcodeToAddressModule,
    DxAutocompleteModule,
    MatIconModule,
    MatTooltipModule,
    AppButtonModule,
    AppFormModule,
    DxPopupModule,
    DirectivesModule,
    PopUpFormModule
  ],
  exports: [EditContactDepartmentComponent, EditContactDepartmentModalComponent],
})
export class EditContactDepartmentModule { }
