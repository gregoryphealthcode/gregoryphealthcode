import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import * as swal from 'sweetalert2';

@Directive({
  selector: '[appCancelConfirmation]',
  exportAs: 'cancelConfirmation'
})
export class CancelConfirmationDirective {
  constructor() { }

  @Input() form: any;
  @Input() confirmButtonText = 'Save';
  @Input() cancelButtonText = 'Discard changes';
  @Input() textContent = 'Your changes have not been saved. You can save your changes or close to discard.';
  
  @Output() saveClick = new EventEmitter<any>();
  @Output() cancelClick = new EventEmitter<any>();  

  @HostListener('click')
  
  click() {
    if (this.form.dirty) {
      this.showConfirmDialog();
    } else {
      this.onCancel();
    }
  }

  onSave() {
    this.saveClick.emit();
  }

  onCancel() {
    this.cancelClick.emit();
  }

  public showConfirmDialog() {
    const title = 'Are you sure?';
    const text = this.textContent;

    swal.default.fire({
      position: 'top',
      title,
      text,
      confirmButtonText: this.confirmButtonText,
      cancelButtonText: this.cancelButtonText,
      denyButtonText: 'Continue editing',
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,
      denyButtonColor: 'rgb(88, 95, 99)',
      cancelButtonColor: 'rgb(167, 55, 33)',
    }).then((result) => {
      if (!result.isDenied) {
        if (result.value) {
          this.onSave();
        } else {
          this.onCancel();
        }
      }
    });
  }
}