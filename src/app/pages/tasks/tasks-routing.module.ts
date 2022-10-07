import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './tasks.component';
import { AuthGuardService } from 'src/app/shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    data: { accesskey: 1 },
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
