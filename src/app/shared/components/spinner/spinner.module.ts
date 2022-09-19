import { SpinnerComponent } from './spinner.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule],
  declarations: [ SpinnerComponent ],
  exports: [ SpinnerComponent ]
})
export class SpinnerModule { }
