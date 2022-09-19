import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientDetailsQuickViewComponent } from './patient-details-quick-view.component';
import { MatButtonModule } from '@angular/material/button';
import { UserAvatarModule } from '../user-avatar/user-avatar.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxSwitchModule } from 'devextreme-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';

@NgModule({
  declarations: [PatientDetailsQuickViewComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    UserAvatarModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    DxSwitchModule,
    FontAwesomeModule,
    AppButtonModule
  ],
  exports:[PatientDetailsQuickViewComponent]
})
export class PatientDetailsQuickViewModule { }
