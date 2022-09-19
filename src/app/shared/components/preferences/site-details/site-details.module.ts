import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteDetailsComponent } from './site-details.component';
import { AppFormModule } from '../../app-form/app-form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { PostcodeToAddressModule } from '../../postcode-to-address/postcode-to-address.module';

@NgModule({
  declarations: [SiteDetailsComponent],
  imports: [
    CommonModule,
    AppFormModule,
    FormsModule,
    ReactiveFormsModule,
    AppButtonModule,
    PostcodeToAddressModule,
  ],
  exports: [SiteDetailsComponent]
})
export class SiteDetailsModule { }
