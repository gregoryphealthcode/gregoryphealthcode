import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridSearchTextBoxComponent } from './grid-search-text-box.component';
import { DxTextBoxModule } from 'devextreme-angular';



@NgModule({
  declarations: [GridSearchTextBoxComponent],
  imports: [
    CommonModule,
    DxTextBoxModule
  ],
  exports: [GridSearchTextBoxComponent]
})
export class GridSearchTextBoxModule { }
