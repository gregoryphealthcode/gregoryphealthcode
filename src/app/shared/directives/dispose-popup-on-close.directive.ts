import { Directive, TemplateRef, ViewContainerRef, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { DxPopupComponent } from 'devextreme-angular/ui/popup';
import { DxTemplateDirective } from 'devextreme-angular';

@Directive({
  selector: '[appDisposePopupOnClose]',
})
export class DisposePopupOnCloseDirective implements AfterContentInit {
  @ContentChildren(DxTemplateDirective) contentChildren!: QueryList<DxTemplateDirective>;

  private firstRender: boolean;

  constructor(
    private popup: DxPopupComponent
  ) {
    this.popup.onShown.subscribe(() =>
      this.renderTemplates()
    );

    this.popup.onHidden.subscribe(() =>
      this.clearTemplates());
  }

  ngAfterContentInit() {
    console.log(this.contentChildren);
  }

  private renderTemplates(){
    if(!this.firstRender){
      this.firstRender = true;
      return;
    }

    this.contentChildren.forEach((x:any)=> {
        console.log(x);
        //x.viewContainerRef.createEmbeddedView(x.templateRef);
    });
  }

  private clearTemplates(){
    this.contentChildren.forEach((x:any) => {
      console.log(x);
      //x.viewContainerRef.clear();
  });
  }
}
