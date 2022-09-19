import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppButtonBase } from './app-button.base';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.base.scss']
})
export class AppButtonComponent extends AppButtonBase implements OnInit {
  @Input() smallButton: boolean;
  
  @Output() clicked = new EventEmitter(); 
  
  constructor() { super() }

  ngOnInit(): void {
  }

}
