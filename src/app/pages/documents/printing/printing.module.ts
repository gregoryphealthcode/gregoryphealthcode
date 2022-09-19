import { PrintingRoutingModule } from './printing-route.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintingAllModule } from './printing-all/printing-all.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PrintingRoutingModule,
    PrintingAllModule
  ]
})

export class PrintingModule { }
