import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxCheckBoxModule, DxDataGridModule, DxDateBoxModule, DxNumberBoxModule, DxSelectBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AppFormModule } from '../../app-form/app-form.module';
import { PreferenceContactDetailsComponent } from './contact-details.component';


@NgModule({
  imports: [
    DxTextBoxModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DirectivesModule,
    DxDataGridModule,
    MatIconModule,
    MatButtonModule,
    DxCheckBoxModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatDialogModule,
    AppFormModule
],
  declarations: [PreferenceContactDetailsComponent


  ],
  exports: [
    PreferenceContactDetailsComponent
  ]})

  export class PreferencesContactDetailsModule {}
