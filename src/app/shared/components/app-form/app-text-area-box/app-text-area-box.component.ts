import { Component, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormControlBase } from '../app-form-control.base';

@Component({
  selector: 'app-text-area-box',
  templateUrl: './app-text-area-box.component.html',
  styleUrls: ['../app-form-control-base.scss', './app-text-area-box.component.scss']
})
export class AppTextAreaBoxComponent extends FormControlBase {
  constructor(@Optional() @Self() control: NgControl) {
    super(control);
  }

  @Input() maxLength: number;

  valueChanged(event){
    //Changed to prevent flickering
    //setTimeout(()=>this.value = event.value)
    this.value = event.value;
  }

  onKeyDown(event){
    //not clear if needed and slows down typing/performance
   /*  const key = event.event.key;
    if(key.match(/^([a-zA-ZÀ-ÖØ-öø-ÿ0-9 .!@'_-]+)$/)){
      return;
    }else{
      event.event.preventDefault();
    } */
  }
}
