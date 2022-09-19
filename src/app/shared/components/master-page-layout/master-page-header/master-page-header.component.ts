import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
declare let gtag: Function;

@Component({
  selector: 'app-master-page-header',
  templateUrl: './master-page-header.component.html',
  styleUrls: ['./master-page-header.component.scss'],

})
export class MasterPageHeaderComponent extends SubscriptionBase implements OnInit {

  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;


  hide = false;

  constructor(public router: Router) { super()}

  ngOnInit() {
    this.subscription.add(
      this.router.events.subscribe(event => {
        // Code to call google analytics with the page navigated to....
        if (event instanceof NavigationEnd) {
          gtag('config', 'UA-156347430-1', {
            page_path: event.urlAfterRedirects
          });
        }
      })
    )
  }

  toggleMenu = () => {
    this.hide = true;
    this.menuToggle.emit();
  }
}