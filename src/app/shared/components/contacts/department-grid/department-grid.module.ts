import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentGridComponent } from './department-grid.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { DxDataGridModule, DxPopupModule, DxSelectBoxModule } from 'devextreme-angular';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { PopUpFormModule } from '../../pop-up-form/pop-up-form.module';

@NgModule({
  declarations: [DepartmentGridComponent],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    GridSearchTextBoxModule,
    DxDataGridModule,
    DxPopupModule,
    DxSelectBoxModule,
    FormsModule,
    DirectivesModule,
    AppButtonModule,
    PopUpFormModule,
    MatCheckboxModule,
    MatIconModule
  ],
  exports: [DepartmentGridComponent],
})
export class DepartmentGridModule { }
