import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitePayeeProvidersComponent } from './site-payee-providers.component';
import { AppFormModule } from '../../app-form/app-form.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { DxDataGridModule, DxPopupModule } from 'devextreme-angular';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { PopUpFormModule } from '../../pop-up-form/pop-up-form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostcodeToAddressModule } from '../../postcode-to-address/postcode-to-address.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';

@NgModule({
  declarations: [SitePayeeProvidersComponent],
  imports: [
    CommonModule,
    AppButtonModule,
    DxDataGridModule,
    AppFormModule,
    PopUpFormModule,
    DxPopupModule,
    GridSearchTextBoxModule,
    FormsModule,
    PostcodeToAddressModule,
    ReactiveFormsModule,
    DirectivesModule,
    PopUpFormModule
  ],
  exports: [SitePayeeProvidersComponent]
})
export class SitePayeeProvidersModule { }
