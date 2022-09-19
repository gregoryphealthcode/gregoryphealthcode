import { Routes, RouterModule } from '@angular/router';
import { PrintingAllComponent } from './printing/printing-all/printing-all.component';
import { AuthGuardService } from 'src/app/shared/guards/auth.guard';
import { NgModule } from '@angular/core';
import { GenerateBatchComponent } from './generate-batch/generate-batch.component';

const routes: Routes = [
  {
    path: 'printing',
    component: PrintingAllComponent,
    data: { accesskey: 1 },
    canActivate: [AuthGuardService]
  },
  {
    path: 'generate-batch',
    component: GenerateBatchComponent,
    data: { accesskey: 1 },
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
