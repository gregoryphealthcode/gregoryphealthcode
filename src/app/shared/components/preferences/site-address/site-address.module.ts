import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteAddressComponent } from './site-address.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { AppFormModule } from '../../app-form/app-form.module';
import { PostcodeToAddressModule } from '../../postcode-to-address/postcode-to-address.module';



@NgModule({
  declarations: [SiteAddressComponent],
  imports: [
    CommonModule,
    AppFormModule,
    FormsModule,
    ReactiveFormsModule,
    AppButtonModule,
    PostcodeToAddressModule,
  ],
  exports: [SiteAddressComponent]
})
export class SiteAddressModule { }
