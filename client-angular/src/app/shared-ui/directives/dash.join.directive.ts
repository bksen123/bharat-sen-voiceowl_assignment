// dash-join.directive.ts
import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appDashJoin]'
})
export class DashJoinDirective implements OnChanges {
  @Input('appDashJoin') inputArray: any[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.inputArray && Array.isArray(this.inputArray)) {
      const joined = this.inputArray.join('-');
      this.renderer.setProperty(this.el.nativeElement, 'textContent', joined);
    }
  }
}
