import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-app-button-toggle',
  templateUrl: './app-button-toggle.component.html',
  styleUrls: ['./app-button-toggle.component.scss']
})
export class AppButtonToggleComponent implements OnInit {

  @Output() changed = new EventEmitter<boolean>();
  @Input() onText = 'On';
  @Input() offText = 'Off';

  public active = true;

  constructor() { }

  ngOnInit() {
  }

  onToggle(){
    this.active= !this.active;
    this.changed.emit(this.active);
  }

}
