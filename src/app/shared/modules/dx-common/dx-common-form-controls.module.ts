import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxTextAreaModule } from 'devextreme-angular/ui/text-area';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxValidationSummaryModule} from 'devextreme-angular/ui/validation-summary';
import { DxValidatorModule} from 'devextreme-angular/ui/validator';
import { DxRadioGroupModule} from 'devextreme-angular/ui/radio-group';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxSelectBoxModule,
    DxValidationSummaryModule,
    DxValidatorModule,
    DxRadioGroupModule
  ],
  exports: [
    DxButtonModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxValidationSummaryModule,
    DxValidatorModule,
    DxSelectBoxModule,
    DxTextAreaModule
  ]
})
export class DxCommonFormControlsModule {}
