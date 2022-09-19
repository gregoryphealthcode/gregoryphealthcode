import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormSectionComponent } from './form-section/form-section.component';
import { AppTextBoxComponent } from './app-text-box/app-text-box.component';
import { FormGroupComponent } from './form-group/form-group.component';
import { DxDateBoxModule, DxNumberBoxModule, DxSelectBoxModule, DxTagBoxModule, DxTextAreaModule, DxTextBoxModule } from 'devextreme-angular';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AppSelectBoxComponent } from './app-select-box/app-select-box.component';
import { AppDateBoxComponent } from './app-date-box/app-date-box.component';
import { AppTextAreaBoxComponent } from './app-text-area-box/app-text-area-box.component';
import { MatSelectModule } from '@angular/material/select';
import { AppFormLabelComponent } from './app-form-label/app-form-label.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AppSlideToggleComponent } from './app-slide-toggle/app-slide-toggle.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CancelConfirmationDirective } from './cancel-confirmation.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { AppTagBoxComponent } from './app-tag-box/app-tag-box.component';


@NgModule({
  declarations: [FormSectionComponent, AppTextBoxComponent, FormGroupComponent,
    AppSelectBoxComponent, AppDateBoxComponent, AppTextAreaBoxComponent, AppFormLabelComponent,
    AppSlideToggleComponent, CancelConfirmationDirective, AppTagBoxComponent],
  imports: [
    CommonModule,FormsModule, DxTextBoxModule,MatInputModule, MatSelectModule, MatSlideToggleModule,
    MatButtonModule, MatIconModule,
    DxSelectBoxModule,MatSelectModule,
    MatDatepickerModule, DxDateBoxModule,
    DxTextAreaModule, DxNumberBoxModule,
    AppButtonModule, DxTagBoxModule,
  ],
  exports: [FormSectionComponent,FormGroupComponent,AppTextBoxComponent,AppSelectBoxComponent,
     AppFormLabelComponent,AppDateBoxComponent, AppTextAreaBoxComponent, AppSlideToggleComponent,
     CancelConfirmationDirective, AppTagBoxComponent]
})
export class AppFormModule { }
