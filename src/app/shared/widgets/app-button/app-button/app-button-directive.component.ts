import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { AppButtonBase } from './app-button.base';

@Component({
  selector: 'appButtonDirective',
  templateUrl: './app-button-directive.component.html',
  styleUrls: ['./app-button.base.scss']
})
export class AppButtonDirectiveComponent extends AppButtonBase implements OnInit {

  @HostBinding('class') class = '';
  constructor() { super() }

  ngOnInit(): void {
    this.class = this.btnClass;
  }

}

