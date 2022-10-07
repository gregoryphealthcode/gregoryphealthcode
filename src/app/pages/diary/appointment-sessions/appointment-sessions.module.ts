import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentSessionsComponent } from './appointment-sessions.component';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxDataGridModule, DxScrollViewModule, DxButtonModule, DxPopupModule, DxDateBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxiColumnModule } from 'devextreme-angular/ui/nested';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { SessionDetailsModule } from 'src/app/shared/components/sessions/session-details/session-details.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [AppointmentSessionsComponent],
  imports: [
    CommonModule,
    AppFormModule,
    AppButtonModule,
    DxSelectBoxModule,
    DxDataGridModule,
    DxScrollViewModule,
    DxiColumnModule,
    DxButtonModule,
    DxPopupModule,
    DxDateBoxModule,
    GridSearchTextBoxModule,
    MatIconModule,
    MatTooltipModule,
    PopUpFormModule,
    SessionDetailsModule,
    MatCheckboxModule,
  ],
  exports: [AppointmentSessionsComponent]
})
export class AppointmentSessionsModule { }
