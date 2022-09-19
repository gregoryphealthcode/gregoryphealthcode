import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardActionButtonComponent } from './card-action-button/card-action-button.component';
import { AppButtonToggleComponent } from './app-button-toggle/app-button-toggle.component';
import { AppButtonDirectiveComponent } from './app-button/app-button-directive.component';
import { AppButtonComponent } from './app-button/app-button.component';
import { ContentLoaderModule } from '../../components/content-loader/content-loader.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [CardActionButtonComponent, AppButtonToggleComponent,
    AppButtonComponent, AppButtonDirectiveComponent],
  imports: [
    CommonModule, 
    ContentLoaderModule,
    MatTooltipModule,
  ],
  exports: [CardActionButtonComponent,AppButtonToggleComponent, AppButtonComponent, AppButtonDirectiveComponent]
})
export class AppButtonModule { }
