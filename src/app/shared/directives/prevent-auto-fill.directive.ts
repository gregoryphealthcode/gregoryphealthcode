import { Directive, ElementRef, Renderer2, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[preventAutoFill]'
})
export class PreventAutoFillDirective implements AfterViewInit{

  private inputEl: Element;

  constructor(private el: ElementRef, private renderer: Renderer2) {

  }

  ngAfterViewInit(){
    this.setElement();
    this.setAttributes();
    this.createDummyInput();
  }

  private createDummyInput() {
    const input = this.renderer.createElement('input');
    this.renderer.setStyle(input, 'display', 'none');
    const parent = this.inputEl.parentNode;
    const refChild = this.inputEl;
    this.renderer.insertBefore(parent, input, refChild);
  }

  private setElement(){
    const elem = this.el.nativeElement as HTMLElement;
    const tagName = elem.tagName.toLowerCase();

    if(tagName === 'input'){this.inputEl = elem;}
    if(tagName === 'dx-text-box'){this.inputEl = elem.children[0].children[0].children[0];}
  }

  // @HostListener('focus') onFocus() {
  //   this.toggleReadOnly(false);
  // }

  // @HostListener('blur') onFocusOut() {
  //   this.toggleReadOnly(true);
  // }

  private setAttributes() {
    this.renderer.setAttribute(this.inputEl, 'autocomplete', 'new-password');
    this.renderer.setAttribute(this.inputEl, 'name', this.getRandomName());
    //this.renderer.setAttribute(this.inputEl, 'readonly', '');
  }

  private getRandomName(): string {
    const random = Math.random().toString(36).replace(/[^a-z]+/g, '');
    return random;
  }

  private toggleReadOnly(toogle: boolean) {
    if (toogle) {
      this.renderer.setAttribute(this.inputEl, 'readonly', '');
    } else {
      this.renderer.removeAttribute(this.inputEl, 'readonly');
    }
  }


}
