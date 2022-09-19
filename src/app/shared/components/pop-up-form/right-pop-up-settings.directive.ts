import { Directive, ElementRef, Host, Input, Renderer2 } from '@angular/core';
import { DxPopupComponent } from 'devextreme-angular';
import { positionConfig } from 'devextreme/animation/position';

@Directive({
  selector: '[appRightPopUpSettings]'
})
export class RightPopUpSettingsDirective {

  @Input() enableScroll: boolean;

  private modalOpenAnimationOptions: Object = {
    show: {
      type: 'slide',
      duration: 600,
      from: { position: { my: 'left top', at: 'right top', of: window } },
      to: { position: { my: 'left top', at: 'left top', of: window } },
    },
    hide: {
      type: 'slide',
      duration: 600,
      from: { position: { my: 'left top', at: 'right top', of: window } },
      to: { position: { my: 'left top', at: 'right top', of: window } },
    },
  };

  private modalOpenPosition: positionConfig = { my: 'right top', at: 'right top', of: window };

  constructor(@Host() public popup: DxPopupComponent, private renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'popup-right-border-radius');
    this.popup.position = this.modalOpenPosition;
    this.popup.animation = this.modalOpenAnimationOptions;
    this.popup.closeOnOutsideClick = false;
    this.popup.deferRendering = true;
    this.popup.showTitle = false;
    this.popup.visible = true;
    this.popup.width = 'auto';
    this.popup.height = '100%';
    this.popup.contentTemplate = 'popupContent';
    this.popup.onShown.subscribe(x=> this.onInitialized(x, this.enableScroll));
  }

  onInitialized(x, enableScroll){
    const dxPopupElem = x.component._$content[0];
    const elem = dxPopupElem.getElementsByClassName('right-modal--padding')[0];
    if(elem && enableScroll){
      elem.addEventListener("wheel", e=> e.stopPropagation());
    }

  }

}
