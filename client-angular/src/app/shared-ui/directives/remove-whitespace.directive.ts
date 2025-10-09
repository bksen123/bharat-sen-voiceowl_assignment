import { Directive, Input, ElementRef, HostListener } from '@angular/core';
// import * as _ from 'lodash';

@Directive({
  selector: '[appRemoveWhitespace]'
})
export class RemoveWhitespaceDirective {
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric = false;
  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event:KeyboardEvent) {

    if (this.el.nativeElement.selectionStart === 0 && event.key=== ' ') {
      event.preventDefault();
    }
    if (!RegExp(this.regexStr).test(event.key)) {
      event.preventDefault();
    }
  }

  validateFields(event: any){
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z ]/g, '').replace(/\s/g, '');
      event.preventDefault();
    }, 100);
  }

}
