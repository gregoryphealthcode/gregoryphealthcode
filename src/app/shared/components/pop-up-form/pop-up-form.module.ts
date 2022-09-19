import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopUpFormTitleComponent } from './pop-up-form-title/pop-up-form-title.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RightPopUpSettingsDirective } from './right-pop-up-settings.directive';
import { CentralPopUpSettingsDirective } from './central-pop-up-settings.directive';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';

@NgModule({
  declarations: [PopUpFormTitleComponent, RightPopUpSettingsDirective, CentralPopUpSettingsDirective],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    AppButtonModule
  ],
  exports: [PopUpFormTitleComponent, RightPopUpSettingsDirective,CentralPopUpSettingsDirective]
})
export class PopUpFormModule { }
