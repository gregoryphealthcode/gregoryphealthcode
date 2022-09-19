import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxAutocompleteModule, DxCheckBoxModule, DxDateBoxModule, DxPopupModule, DxSelectBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { PostcodeToAddressModule } from 'src/app/shared/components/postcode-to-address/postcode-to-address.module';
import { EditContactAddressComponent } from './edit-contact-address.component';
import { EditContactAddressModalComponent } from './edit-contact-address-modal/edit-contact-address-modal.component';
import { PopUpFormModule } from '../../pop-up-form/pop-up-form.module';

@NgModule({
  declarations: [EditContactAddressComponent, EditContactAddressModalComponent],
  imports: [
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
  exports:[EditContactAddressComponent, EditContactAddressModalComponent]
})
export class EditContactAddressModule { }
