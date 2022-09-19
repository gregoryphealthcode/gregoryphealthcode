import {
  Directive,
  AfterContentInit,
  Input,
  ElementRef,
  OnInit,
  AfterViewInit
} from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutofocusDirective implements AfterViewInit {
  @Input() public appAutoFocus: boolean;
  @Input() public autoFocusTimeout = 1; //seconds

  public constructor(private el: ElementRef) {}

  public ngAfterViewInit() {
    setTimeout(() => {
      const elem = this.el.nativeElement;

      if (elem.tagName === 'INPUT') {
        elem.focus();
        return;
      }
      const firstInput = elem.querySelector('input');
      firstInput.focus();
    }, this.autoFocusTimeout * 1000);
  }
}
