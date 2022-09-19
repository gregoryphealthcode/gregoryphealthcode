import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: "[appEnableScroll]",
})
export class EnableScrollDirective {
  @HostListener('wheel', ['$event'])
  onScroll(e) {
    e.stopPropagation();
  }

  constructor() {}
}
