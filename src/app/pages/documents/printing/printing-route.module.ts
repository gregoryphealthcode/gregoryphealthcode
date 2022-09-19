import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuardService } from 'src/app/shared/guards/auth.guard';
import { PrintingAllComponent } from './printing-all/printing-all.component';

const routes: Routes = [
  {
    path: 'printing',
    component: PrintingAllComponent,
    data: { accesskey: 1 },
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintingRoutingModule { }
