import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { CancelConfirmationDirective } from '../../app-form/cancel-confirmation.directive';

@Component({
  selector: 'app-pop-up-form-title',
  templateUrl: './pop-up-form-title.component.html',
  styleUrls: ['./pop-up-form-title.component.scss']
})
export class PopUpFormTitleComponent implements OnInit {
  @Output() closed = new EventEmitter<any>();
  @Input() title: string;
  @Input() description: string;
  @Input() size: 'base' | 'lg' = 'base';
  @Input() centerAlign = false;
  @Input() hasBorder = false;
  @Input() ofEditForm = false;
  @Input() showClosed = true;
  @Input()
  set cancelConfirmation(value: CancelConfirmationDirective ){
    if(value){
      this._cancelConfirmation = value;
    }
  }
  _cancelConfirmation: CancelConfirmationDirective;

  @HostBinding('class') class = '';

  constructor() { }

  ngOnInit() {
    if(this.hasBorder){
      this.class += ' has-border ';
    }

    if(this.ofEditForm){
      this.class += ' edit-form-title';
    }
  }

  onClosed(){
    this.closed.emit();
    if(this._cancelConfirmation) { this._cancelConfirmation.click(); }
  }
}
