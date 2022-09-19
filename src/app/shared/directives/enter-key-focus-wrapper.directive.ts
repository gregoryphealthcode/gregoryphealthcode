import {
  Directive,
  HostListener,
  ElementRef,
  AfterViewInit,
  Input,
} from '@angular/core';


@Directive({
  selector: '[appEnterKeyFocusWrapper]',
})
export class EnterKeyFocusWrapperDirective implements AfterViewInit {
  private index = 0;
  private firstEnterKeyPressed = false;

  @Input() delay = 300;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      const focussableElements = this.getElements();
      if (focussableElements[0]) focussableElements[0].focus();
    }, this.delay);
  }

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    this.focusNextElement();
  }

  private getElements() {
    const focussableElements =
      'input:not([disabled]):not([ng-reflect-is-disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
    let elements = this.el.nativeElement.querySelectorAll(focussableElements);
    elements = Array.prototype.filter.call(elements, function (element) {
      return element.offsetWidth > 0 || element.offsetHeight > 0;
    });
    return elements;
  }

  focusNextElement() {
    const activeElem = document.activeElement;

    if (document.activeElement.tagName === 'MAT-SELECT') {
      if(this.firstEnterKeyPressed){
        this.firstEnterKeyPressed = false; // this is our second enter key press so we can continue
      }
      else{
        this.firstEnterKeyPressed = true;
        return;
      }
    }

    const focussableElements = this.getElements();
    const index = focussableElements.indexOf(activeElem);
    let nextElement = focussableElements[index + 1];

    if (!nextElement) {
      nextElement = focussableElements[0];
    }

    nextElement.focus();
  }
}
