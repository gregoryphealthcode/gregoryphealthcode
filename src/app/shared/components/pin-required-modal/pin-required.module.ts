import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinRequiredModalComponent } from './pin-required-modal.component';
import { DxPopupModule, DxButtonModule, DxTextBoxModule } from 'devextreme-angular';
import { DirectivesModule } from '../../directives/directives.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PinRequiredModalComponent],
  imports: [
    CommonModule, DirectivesModule, FormsModule,
    DxPopupModule, DxButtonModule, DxTextBoxModule, DirectivesModule
  ],
  exports: [PinRequiredModalComponent]
})
export class PinRequiredModule { }
