import { Component, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormControlBase } from '../app-form-control.base';

@Component({
  selector: 'app-tag-box',
  templateUrl: './app-tag-box.component.html',
  styleUrls: ['./app-tag-box.component.scss', '../app-form-control-base.scss']
})
export class AppTagBoxComponent extends FormControlBase {
  @Input() set dataSource(value: any[]) {
    this._dataSource = value;
  }
  get dataSource() {
    return this._dataSource;
  }

  @Input() searchEnabled = true;
  @Input() valueExpr: string;
  @Input() displayExpr: string;
  @Input() placeholder: string;
  @Input() stylingMode = 'outlined';

  private _dataSource: any[];

  public displayValue: string;

  constructor(@Optional() @Self() control: NgControl) {
    super(control);
  }

  onValueChange = (value) => {
    if (this.dataSource && this.dataSource.length > 0) {
    }
  }
}