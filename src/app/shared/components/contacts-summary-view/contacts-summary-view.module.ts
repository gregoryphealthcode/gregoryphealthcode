import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UserAvatarModule } from '../user-avatar/user-avatar.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContactsSummaryViewComponent } from './contacts-summary-view.component';
import { DxPopupModule, DxSelectBoxModule, DxSwitchModule } from 'devextreme-angular';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';
import { ContactTelecomEditModule } from '../contacts/contact-telecom-edit/contact-telecom-edit.module';
import { EditContactAddressModule } from '../contacts/edit-contact-address/edit-contact-address.module';
import { EditContactModule } from '../contacts/edit-contact/edit-contact.module';

@NgModule({
  declarations: [ContactsSummaryViewComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    UserAvatarModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    DxSwitchModule,
    AppButtonModule,
    PopUpFormModule,
    DxPopupModule,
    DxSelectBoxModule,
    EditContactAddressModule,
    ContactTelecomEditModule,
    EditContactModule,
  ],
  exports:[ContactsSummaryViewComponent]
})
export class ContactsSummaryViewModule { }
