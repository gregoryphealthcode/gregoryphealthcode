import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedSecAuthGuardService } from 'src/app/shared/guards/medsec-auth.guard';
import { MedSecHomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: MedSecHomeComponent,
    data: {accesskey: 1},
    canActivate: [MedSecAuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedSecHomeRoutingModule { }

