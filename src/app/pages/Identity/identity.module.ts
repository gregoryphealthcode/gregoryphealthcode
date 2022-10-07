import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent} from './login-page/login-page.component';
import { IdentityMasterPageComponent } from './identity-master-page/identity-master-page.component';
import { IdentityRoutingModule } from './identity-routing.module';
import { RouterModule } from '@angular/router';
import { SelectSiteComponent } from './select-site/select-site.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule} from '@angular/material/button';
import { DxCommonFormControlsModule } from 'src/app/shared/modules/dx-common/dx-common-form-controls.module';
import { HealthCodeUserViewComponent } from './select-site/health-code-user-view/health-code-user-view.component';
import { EPracticeUserViewComponent } from './select-site/e-practice-user-view/e-practice-user-view.component';
import { DxDataGridModule } from 'devextreme-angular';
import { PatientDetailsQuickViewModule } from 'src/app/shared/components/patient-details-quick-view/patient-details-quick-view.module';
import { PostAuthComponent } from './post-auth/post-auth.component';
import { SetupPinComponent } from './setup-pin/setup-pin.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';

@NgModule({
  declarations: [
    LoginPageComponent,
    IdentityMasterPageComponent,
    SelectSiteComponent,
    HealthCodeUserViewComponent,
    EPracticeUserViewComponent,
    PostAuthComponent,
    SetupPinComponent
    ],
  imports: [
    CommonModule,
    DxCommonFormControlsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    DxDataGridModule,
    PatientDetailsQuickViewModule,
    DirectivesModule,
    AppButtonModule
  ],
  exports:[
    IdentityRoutingModule
  ]
})
export class IdentityModule { }
