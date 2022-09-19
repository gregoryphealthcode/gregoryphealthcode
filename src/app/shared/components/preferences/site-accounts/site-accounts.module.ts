import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteAccountsComponent } from './site-accounts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { AppFormModule } from '../../app-form/app-form.module';

@NgModule({
  declarations: [SiteAccountsComponent],
  imports: [
    CommonModule,
    AppFormModule,
    FormsModule,
    ReactiveFormsModule,
    AppButtonModule,
  ],
  exports: [SiteAccountsComponent],
})
export class SiteAccountsModule { }
