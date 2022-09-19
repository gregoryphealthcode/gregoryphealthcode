import { Component, Input, OnInit, Optional, Self} from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormControlBase } from '../app-form-control.base';

@Component({
  selector: 'app-text-box',
  templateUrl: './app-text-box.component.html',
  styleUrls: ['../app-form-control-base.scss']
})
export class AppTextBoxComponent extends FormControlBase implements OnInit {
  constructor(@Optional() @Self() control: NgControl){
    super(control);
  }
  
  @Input() showClearButton: boolean;
  @Input() isCurrency: boolean;
  @Input() min: string;
  @Input() max: string;
  @Input() mode: string;
  @Input() maxLength: number;

  public inputAttr: any;

  ngOnInit(){
    super.ngOnInit();

    this.inputAttr = { autocomplete: 'chrome-off' };

    if(this.inputType){
      this.inputAttr.type = this.inputType;
    }
  }

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
