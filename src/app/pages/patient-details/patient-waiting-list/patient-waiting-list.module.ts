import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientWaitingListComponent } from './patient-waiting-list.component';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxDataGridModule, DxScrollViewModule, DxButtonModule, DxPopupModule } from 'devextreme-angular';
import { DxiColumnModule } from 'devextreme-angular/ui/nested';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { MatIconModule } from '@angular/material/icon';
import { WaitingListGridModule } from 'src/app/shared/components/waiting-list/waiting-list-grid.module';

@NgModule({
  declarations: [PatientWaitingListComponent],
  imports: [
    CommonModule,
    AppButtonModule,
    DxDataGridModule,
    DxScrollViewModule,
    DxiColumnModule,
    DxButtonModule,
    DxPopupModule,
    GridSearchTextBoxModule,
    MatTooltipModule,
    MatIconModule,
    WaitingListGridModule,
  ],
  exports: [PatientWaitingListComponent]
})
export class PatientWaitingListModule { }
