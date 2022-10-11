import { NgModule } from '@angular/core';
import { CreditControlTransactionsComponent } from './credit-control-transactions.component';
import { DxDataGridModule, DxBoxModule, DxButtonModule, DxContextMenuModule, DxCheckBoxModule, DxFormModule,
  DxSwitchModule, DxToolbarModule, DxPopupModule, DxTabPanelModule, DxSelectBoxModule, DxTextAreaModule,
  DxNumberBoxModule, DxDateBoxModule, DxScrollViewModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';
import { TasksModule } from 'src/app/pages/tasks/tasks.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
    declarations: [CreditControlTransactionsComponent],
    imports: [
              DxDataGridModule, DxBoxModule, DxButtonModule, DxContextMenuModule, DxCheckBoxModule,
              CommonModule, DxFormModule, DxSwitchModule, DxToolbarModule, DxPopupModule, DxDataGridModule,
              MomentModule,DxTabPanelModule, DxSelectBoxModule, DxTextAreaModule, DxNumberBoxModule,
              DxDateBoxModule, DxScrollViewModule, TasksModule, MatTabsModule, MatIconModule, MatButtonModule,
              DirectivesModule
            ],
    exports: [CreditControlTransactionsComponent]
  })

  export class CreditControlTransactionModule { }
