import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewSpecialistSummaryComponent } from './view-specialist-summary.component';
import { CardActionButtonComponent } from '../../widgets/app-button/card-action-button/card-action-button.component';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';



@NgModule({
  declarations: [ViewSpecialistSummaryComponent],
  imports: [
    CommonModule,
    AppButtonModule
  ],
  exports : [ViewSpecialistSummaryComponent]
})
export class ViewSpecialistSummaryModule { }
