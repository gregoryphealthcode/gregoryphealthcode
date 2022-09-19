import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationSessionsComponent } from './location-sessions.component';
import { DxSchedulerModule, DxButtonModule, DxContextMenuModule, DxScrollViewModule, DxTextBoxModule, DxTextAreaModule, DxValidatorModule, DxSelectBoxModule, DxDropDownBoxModule, DxDataGridModule, DxPopupModule, DxTooltipModule } from 'devextreme-angular';
import { DxiValidationRuleModule } from 'devextreme-angular/ui/nested';
import { MatIconModule } from '@angular/material/icon';
import { SessionDetailsModule } from 'src/app/shared/components/sessions/session-details/session-details.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { UserAvatarModule } from 'src/app/shared/components/user-avatar/user-avatar.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DxSchedulerModule,
    DxButtonModule,
    DxContextMenuModule,
    DxScrollViewModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxValidatorModule,
    DxiValidationRuleModule,
    DxSelectBoxModule,
    DxDropDownBoxModule,
    DxDataGridModule,
    DxPopupModule,
    MatIconModule,
    SessionDetailsModule,
    MatButtonModule,
    MatTooltipModule,
    UserAvatarModule,
    DxTooltipModule,
    PopUpFormModule,
    DirectivesModule
  ],
  declarations: [
    LocationSessionsComponent
  ],
  exports: [
    LocationSessionsComponent
  ]
})

export class LocationSessionsModule { }
