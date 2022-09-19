import { ComponentFactory, ComponentFactoryResolver, ComponentRef, Directive, HostListener, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ContentLoaderComponent } from '../components/content-loader/content-loader.component';
@Directive({
  selector: '[appLoadingSpinner]'
})
export class LoadingSpinnerDirective {

  @Input('appLoadingSpinner')
  set showSpinner(spinning: boolean) {
    this.container.clear();

    if (spinning) {
      this.spinnerComponent = this.container.createComponent(this.componentFactory);
    } else {
      this.container.createEmbeddedView(this.template);
    }
  }

  componentFactory: ComponentFactory<ContentLoaderComponent>;
  spinnerComponent: ComponentRef<ContentLoaderComponent>;

  constructor(private container: ViewContainerRef,
              private template: TemplateRef<any>,
              private componentFactoryResolver: ComponentFactoryResolver) {
    this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(ContentLoaderComponent);
  }

  ngOnInit(): void {

  }

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
  }

  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: any): void {
    event.stopPropagation();
  }

  @HostListener('mouseup', ['$event'])
  public onMouseUp(event: any): void {
    event.stopPropagation();
  }

}
