import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateBatchComponent } from './generate-batch.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { DxCheckBoxModule, DxRadioGroupModule, DxSelectBoxModule } from 'devextreme-angular';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';

@NgModule({
  declarations: [GenerateBatchComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    AppFormModule,
    DxRadioGroupModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    AppButtonModule,
  ],
  exports: [GenerateBatchComponent]
})

export class GenerateBatchModule { }
