import { Component, Input, Optional, Self} from '@angular/core';
import { NgControl} from '@angular/forms';
import { FormControlBase } from '../app-form-control.base';

@Component({
  selector: 'app-select-box',
  templateUrl: './app-select-box.component.html',
  styleUrls: ['./app-select-box.component.scss', '../app-form-control-base.scss']
})
export class AppSelectBoxComponent extends FormControlBase {
  constructor(
    @Optional() @Self() control: NgControl){
    super(control);
  }

  @Input() set dataSource(value: any[]){
    this._dataSource = value;
    this.setDisplayValue();
  }
  get dataSource() 
  {return this._dataSource;
  }

  @Input() searchEnabled = true;
  @Input() valueExpr: string;
  @Input() displayExpr: string;
  @Input() placeholder: string;
  @Input() stylingMode = 'outlined';

  private _dataSource: any[];
  
  public displayValue: string;  

  onValueChange = (value) =>{
    if (this.dataSource && this.dataSource.length > 0){
      this.setDisplayValue();
    }
  }

  private setDisplayValue(){
    if (this.value && this.dataSource && this.dataSource.length > 0){
      if(!this.valueExpr || (this.valueExpr && this.valueExpr === 'this')){
        this.displayValue = this.value;
        return;
      }

      const selected = this.dataSource.find(x=>x[this.valueExpr]===this.value);
      this.displayValue = selected[this.displayExpr];
    }
  }
}

