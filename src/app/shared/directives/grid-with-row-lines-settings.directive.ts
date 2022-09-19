import { Directive, ElementRef, Host, Renderer2 } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';

@Directive({
  selector: '[gridWithRowLinesSettings]'
})
export class GridWithRowLinesSettingsDirective {

  constructor(@Host() public grid: DxDataGridComponent, renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'cssGridGeneral');
    renderer.addClass(hostElement.nativeElement, 'custom-Grid');
    grid.showColumnLines = false;
    grid.rowAlternationEnabled = true;
    // grid.showRowLines = true;
    grid.showBorders = false;
  }

}
