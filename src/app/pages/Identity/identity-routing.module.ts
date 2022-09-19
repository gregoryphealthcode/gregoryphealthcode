import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectSiteComponent } from './select-site/select-site.component';
import { CheckIfAuthorisedGuard } from 'src/app/shared/guards/checkIfAuthorised.guard';
import { SetupPinComponent } from './setup-pin/setup-pin.component';
import { LoginPageComponent } from './login-page/login-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'setup-pin',
    canActivate: [CheckIfAuthorisedGuard],
    component: SetupPinComponent
  },
  {
    path: 'select-site',
    canActivate: [CheckIfAuthorisedGuard],
    component: SelectSiteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdentityRoutingModule {

}
