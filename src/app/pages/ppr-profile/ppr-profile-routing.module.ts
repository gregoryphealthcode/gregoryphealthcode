import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PprProfileComponent } from './ppr-profile.component';

const routes: Routes = [
  {
    path: '',
    component: PprProfileComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PprProfileRoutingModule { }
