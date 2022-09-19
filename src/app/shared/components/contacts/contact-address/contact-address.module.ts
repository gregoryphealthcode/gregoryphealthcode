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
import { DxDataGridModule, DxButtonModule, DxPopupModule } from 'devextreme-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { ContactAddressComponent } from './contact-address.component';
import { EditContactAddressModule } from '../edit-contact-address/edit-contact-address.module';

@NgModule({
  declarations: [ContactAddressComponent],
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
    DxButtonModule,
    EditContactAddressModule,
    MatDialogModule,
    MatIconModule,
    DxPopupModule,
    NoDataModule,
    MatTooltipModule,
    DirectivesModule,
    PopUpFormModule,
    AppFormModule
  ],
  exports: [ContactAddressComponent],
  providers: [

  ]
})
export class ContactAddressModule { }
