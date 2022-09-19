import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintingAllModule } from './printing/printing-all/printing-all.module';
import { GenerateBatchModule } from './generate-batch/generate-batch.module';
import { DocumentsRoutingModule } from './documents-route.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GenerateBatchModule,
    PrintingAllModule,
    DocumentsRoutingModule
  ]
})

export class DocumentsModule { }
