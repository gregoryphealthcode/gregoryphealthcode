import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostcodeToAddressComponent } from './postcode-to-address.component';
import { DxAutocompleteModule, DxSelectBoxModule } from 'devextreme-angular';



@NgModule({
  declarations: [PostcodeToAddressComponent],
  imports: [
    CommonModule,
    DxSelectBoxModule,
    DxAutocompleteModule
  ],
  exports: [PostcodeToAddressComponent]
})
export class PostcodeToAddressModule { }
