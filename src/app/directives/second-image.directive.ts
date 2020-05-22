import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[appSecondImage]",
})
export class SecondImageDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
