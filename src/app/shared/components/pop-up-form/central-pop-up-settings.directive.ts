import { Directive, Host, Input } from '@angular/core';
import { DxPopupComponent } from 'devextreme-angular/ui/popup';
import { positionConfig } from 'devextreme/animation/position';


@Directive({
  selector: '[appCentralPopUpSettings]'
})
export class CentralPopUpSettingsDirective{

  @Input() enableScroll: boolean;

  private modalOpenPosition: positionConfig = { my: 'top', at: 'top', of: window, offset: '0 50' };

  constructor(@Host() public popup: DxPopupComponent) {
    this.popup.position = this.modalOpenPosition;
    this.popup.closeOnOutsideClick = false;
    this.popup.resizeEnabled = false;
    this.popup.deferRendering = true;
    this.popup.showTitle = false;
    this.popup.width = 'auto';
    this.popup.maxWidth = '90%';
    this.popup.height = 'auto';
    this.popup.maxHeight ='90%';
    this.popup.visible = true;
    this.popup.contentTemplate = 'popupContent';
    this.popup.onShown.subscribe(x=> this.onInitialized(x, this.enableScroll));
  }

  onInitialized(x, enableScroll){
    const dxPopupElem = x.component._$content[0];
    const elem = dxPopupElem.getElementsByClassName('central-popup-body')[0];
   if(elem && enableScroll){
      elem.addEventListener("wheel", e=> e.stopPropagation()); 
      elem.addEventListener("touchmove", e=> e.stopPropagation());
    }
  }
}