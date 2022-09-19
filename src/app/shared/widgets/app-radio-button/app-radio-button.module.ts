import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRadioButtonComponent } from './app-radio-button.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [AppRadioButtonComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [AppRadioButtonComponent]
})
export class AppRadioButtonModule { }
