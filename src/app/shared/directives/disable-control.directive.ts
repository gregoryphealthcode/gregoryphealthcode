import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective {

  @Input() disableControl: boolean;
  ngOnChanges(changes) {
   if (changes.disableControl) {
     const action = this.disableControl ? 'disable' : 'enable';
     this.ngControl.control[action]();
   }
 }

  constructor( private ngControl: NgControl ) {
  }


}
