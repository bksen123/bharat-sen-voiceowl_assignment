import { Directive, HostListener, ElementRef, Renderer2 } from "@angular/core";
// import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: "[ngDisabled]",
})
export class DisabledDirective {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef // tslint:disable-next-line: deprecation // private renderer: Renderer
  ) {
    this.el.nativeElement.setAttribute("autocomplete", "off");
    // renderer.setStyle(el.nativeElement, "backgroundColor", "#E1E4EA");
    renderer.setStyle(el.nativeElement, "pointer-events", "none");
  }
  @HostListener("keydown", ["$event"]) blockKeyDown(e: KeyboardEvent) {
    e.preventDefault();
  }
  @HostListener("keypress", ["$event"]) blockKeypress(e: KeyboardEvent) {
    e.preventDefault();
  }
  @HostListener("keyup", ["$event"]) blockKeyup(e: KeyboardEvent) {
    e.preventDefault();
  }
  @HostListener("cut", ["$event"]) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }
  @HostListener("copy", ["$event"]) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }
  @HostListener("paste", ["$event"]) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }
  @HostListener("click", ["$event"]) blockClick(e: KeyboardEvent) {
    e.preventDefault();
  }
}
