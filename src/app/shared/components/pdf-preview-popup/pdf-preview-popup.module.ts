import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfPreviewPopupComponent } from './pdf-preview-popup.component';
import { DirectivesModule } from '../../directives/directives.module';
import { DxPopupModule } from 'devextreme-angular';
import { AppFormModule } from '../app-form/app-form.module';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';
import { PipesModule } from '../../pipes/pipes.module';



@NgModule({
  declarations: [PdfPreviewPopupComponent],
  imports: [
    CommonModule,
    DirectivesModule,
    DxPopupModule,
    AppFormModule,
    PopUpFormModule,
    PipesModule
  ],
  exports: [PdfPreviewPopupComponent]
})
export class PdfPreviewPopupModule { }
