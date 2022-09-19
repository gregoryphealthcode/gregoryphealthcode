import { NgModule } from '@angular/core';
import { DxSchedulerModule, DxPopupModule, DxSelectBoxModule, DxButtonModule, DxTextBoxModule,
  DxLoadPanelModule, DxContextMenuModule, DxDropDownBoxModule, DxDataGridModule, DxTagBoxModule, DxTooltipModule, DxToastModule, DxLoadIndicatorModule, DxCheckBoxModule } from 'devextreme-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';
import { ViewDiaryComponent } from './view-diary.component';
import { MatIconModule } from '@angular/material/icon';
import { LocationSessionsModule } from 'src/app/pages/sessions/location-sessions.module';
import { UserAvatarModule } from '../user-avatar/user-avatar.module';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { AppFormModule } from '../app-form/app-form.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        DxSchedulerModule,
        DxPopupModule,
        MomentModule,
        DxTextBoxModule,
        DxButtonModule,
        DxLoadPanelModule,
        DxSelectBoxModule,
        DxContextMenuModule,
        DxDropDownBoxModule,
        DxDataGridModule,
        LocationSessionsModule,
        MatIconModule,
        UserAvatarModule,
        DxTagBoxModule,
        DxTooltipModule,
        AppButtonModule,
        DxToastModule,
        DxLoadIndicatorModule,
        DxTagBoxModule,
        DxCheckBoxModule,
        MatTooltipModule
    ],
    declarations: [
      ViewDiaryComponent
    ],
    exports: [
        ViewDiaryComponent
    ]})

    export class ViewDiaryModule {}
