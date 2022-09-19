import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesRoutingModule } from './messages-routing.module';
import {
  DxBoxModule, DxButtonModule, DxContextMenuModule, DxCheckBoxModule, DxFormModule,
  DxDropDownBoxModule, DxFileUploaderModule, DxDataGridModule, DxPopupModule, DxDateBoxModule,
  DxTextAreaModule, DxListModule, DxTextBoxModule, DxResponsiveBoxModule, DxSelectBoxModule, DxRangeSelectorModule,
  DxResizableModule, DxScrollViewModule, DxHtmlEditorModule, DxToolbarModule, DxValidatorModule, DxValidationGroupModule, DxLoadPanelModule
} from 'devextreme-angular';
import { MessagesComponent } from './messages.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MessageNewComponent } from './message-new/message-new.component';
import { PatientSearchModule } from 'src/app/shared/components/patient-search/patient-search.component';
import { AppInfoService } from 'src/app/shared/services';

@NgModule({
  imports: [CommonModule,
    CommonModule,
    DxBoxModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxContextMenuModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxDropDownBoxModule,
    DxFileUploaderModule,
    DxFormModule,
    DxHtmlEditorModule,
    DxListModule,
    DxLoadPanelModule,
    DxPopupModule,
    DxRangeSelectorModule,
    DxResizableModule,
    DxResponsiveBoxModule,
    DxScrollViewModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxTextBoxModule,
    DxToolbarModule,
    DxValidationGroupModule,
    DxValidatorModule,
    MessagesRoutingModule,
    PatientSearchModule,
    PipesModule,
  ],
  providers: [AppInfoService],
  declarations: [MessagesComponent, MessageNewComponent],
  exports: [MessagesComponent, MessagesRoutingModule]
})

export class MessagesModule { }
