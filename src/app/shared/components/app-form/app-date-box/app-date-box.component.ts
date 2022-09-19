import { Component, Input, OnInit, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { AppInfoService } from 'src/app/shared/services';
import { FormControlBase } from '../app-form-control.base';

@Component({
  selector: 'app-date-box',
  templateUrl: './app-date-box.component.html',
  styleUrls: ['../app-form-control-base.scss']
})
export class AppDateBoxComponent extends FormControlBase implements OnInit {
  constructor(
    public appInfo: AppInfoService,
    @Optional()
    @Self() control: NgControl) {
    super(control);
  }

  @Input() acceptCustomValue = false;
  @Input() showAsLabel = false;
  @Input() showDropDownButton = true;
  @Input() type: string = 'date';
  @Input() displayFormat: string;
  @Input() pickerType: string = "calendar";
  @Input() maxDate: any;
  @Input() minDate: any;
  @Input() interval: any;

  public useMaskBehavior = false;

  ngOnInit() {
    super.ngOnInit();
    if (this.type === 'date') {
      this.displayFormat = this.appInfo.getDateFormat;
      this.useMaskBehavior = true;
      this.acceptCustomValue = true;
    }
    if (this.pickerType === 'rollers') {
      this.displayFormat = this.appInfo.getDateFormat;
      this.useMaskBehavior = true;
      this.placeholder = 'Pick Date';
      this.acceptCustomValue = true;
    }

    if (!this.displayFormat) {
      if (this.type === 'datetime') {
        this.displayFormat = this.appInfo.getDateTimeFormat;
      }
      if (this.type === 'date') {
        this.displayFormat = this.appInfo.getDateFormat;
      }
    }
  }
}
