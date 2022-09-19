import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card-action-button',
  templateUrl: './card-action-button.component.html',
  styleUrls: ['./card-action-button.component.scss']
})
export class CardActionButtonComponent implements OnInit {
  @Output() clicked = new EventEmitter<any>();
  @Input() icon:string;
  @Input() text:string;

  constructor() { }

  ngOnInit() {
  }

}
