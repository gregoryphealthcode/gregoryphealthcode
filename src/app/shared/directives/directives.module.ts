import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutofocusDirective } from './autofocus.directive';
import { PreventAutoFillDirective } from './prevent-auto-fill.directive';
import { DisableControlDirective } from './disable-control.directive';
import { EnterKeyFocusWrapperDirective } from './enter-key-focus-wrapper.directive';
import { DisposePopupOnCloseDirective } from './dispose-popup-on-close.directive';
import { SnackBarDirective } from './snack-bar.directive';
import { GridWithRowLinesSettingsDirective } from './grid-with-row-lines-settings.directive';
import { GridWithStateStoreDirective } from './grid-with-state-store.directive';
import { DxPopupModule } from 'devextreme-angular';
import { GridStateSaveModule } from '../components/grid-state-save/grid-state-save.module';
import { LoadingSpinnerDirective } from './loading-spinner.directive';
import { EnableScrollDirective } from './enable-scroll.directive';

@NgModule({
  declarations: [
    AutofocusDirective,
    PreventAutoFillDirective,
    DisableControlDirective,
    EnterKeyFocusWrapperDirective,
    DisposePopupOnCloseDirective,
    SnackBarDirective,
    GridWithRowLinesSettingsDirective,
    GridWithStateStoreDirective,
    LoadingSpinnerDirective,
    EnableScrollDirective
  ],
  imports: [CommonModule, DxPopupModule, GridStateSaveModule],
  exports: [
    AutofocusDirective,
    PreventAutoFillDirective,
    DisableControlDirective,
    EnterKeyFocusWrapperDirective,
    DisposePopupOnCloseDirective,
    SnackBarDirective,
    GridWithRowLinesSettingsDirective,
    GridWithStateStoreDirective,
    LoadingSpinnerDirective,
    EnableScrollDirective
  ],
})
export class DirectivesModule {}
