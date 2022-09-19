import { Component, Optional, Self } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { FormControlBase } from '../app-form-control.base';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './app-slide-toggle.component.html',
  styleUrls: ['./app-slide-toggle.component.scss', '../app-form-control-base.scss']
})
export class AppSlideToggleComponent extends FormControlBase {
  constructor(@Optional() @Self() private ctrl: NgControl) {
    super(ctrl);
  }

  ngDoCheck() {
    const control = this.ctrl.control;
    const value = control.value;

    if (control instanceof FormControl && value === undefined || value === null) {
      setTimeout(() => {
        control.patchValue(false, { emitEvent: false, onlySelf: true });
      }, 0);
    }

    super.ngDoCheck();
  }
}
