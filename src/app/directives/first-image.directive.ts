import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[appFirstImage]",
})
export class FirstImageDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
