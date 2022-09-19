import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-label',
  templateUrl: './app-form-label.component.html',
  styleUrls: ['../app-form-control-base.scss'],
})
export class AppFormLabelComponent implements OnInit {
  constructor() { }

  @Input() set hasBottomMargin(value: number) {
    const re = / mb-0 /gi;
    this.class = this.class.replace(re, '');

    if (!value) {
      this.class += ' mb-0 ';
    }    
  }
  get hasBottomMargin() {
    return this._hasBottomMargin;
  }

  @Input() caption: string;
  @Input() value: string;
  @Input() direction = 'column';

  @HostBinding('class') class = 'a-form-group ';
  
  private _hasBottomMargin: number;

  ngOnInit() {
    if (this.direction === 'row') {
      this.class += 'd-row';
    } else {
      this.class += 'd-col';
    }
  }
}