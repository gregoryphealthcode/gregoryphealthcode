import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiaryViewComponent } from './diary-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxContextMenuModule, DxDataGridModule, DxDateBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { MedSecSiteSelectorModule } from 'src/app/shared/components/med-sec-site-selector/med-sec-site-selector.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { ViewDiaryModule } from 'src/app/shared/components/diary/view-diary.module';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { WaitingListComponent } from './waiting-list/waiting-list.component';
import { WaitingListAddEditModule } from 'src/app/shared/components/waiting-list-add-edit/waiting-list-add-edit.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { AppointmentPopupAddEditModule } from 'src/app/shared/components/appointment-popup-add-edit/appointment-popup-add-edit.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [DiaryViewComponent, WaitingListComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    DxContextMenuModule,
    AppButtonModule,
    MatMenuModule,
    MedSecSiteSelectorModule,
    ViewDiaryModule,
    DxDataGridModule,
    GridSearchTextBoxModule,
    DxDateBoxModule,
    WaitingListAddEditModule,
    ReactiveFormsModule,
    PopUpFormModule,
    AppointmentPopupAddEditModule,
    MatCheckboxModule,
    DxSelectBoxModule,
    MatTabsModule
  ],
  exports: [DiaryViewComponent, WaitingListComponent]
})
export class DiaryViewModule { }
