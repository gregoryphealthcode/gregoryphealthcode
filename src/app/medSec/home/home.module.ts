import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DxDataGridModule } from 'devextreme-angular';
import { MedSecHomeRoutingModule } from './home-routing.module';
import { MedSecHomeComponent } from './home.component';

@NgModule({
  declarations: [MedSecHomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    DxDataGridModule,    
  ],
  providers: [],
  exports: [MedSecHomeComponent,
    MedSecHomeRoutingModule]
})
export class MedSecHomeModule {}
