import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPageWrapperComponent } from './app-page-wrapper.component';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { PageBodyComponent } from './page-body/page-body.component';
import { PageHeaderButtonsComponent } from './page-header-buttons/page-header-buttons.component';
import { PageHeaderContentComponent } from './page-header-content/page-header-content.component';

@NgModule({
  declarations: [
    AppPageWrapperComponent,
    PageBodyComponent,
    PageHeaderButtonsComponent,
    PageHeaderContentComponent],
  imports: [
    CommonModule,
    AppButtonModule
  ],
  exports: [
    AppPageWrapperComponent,
    PageBodyComponent,
    PageHeaderButtonsComponent,
    PageHeaderContentComponent
  ]
})
export class AppPageWrapperModule { }
