import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { SubscriptionBase } from '../../base/subscribtion.base';
import { AppInfoService } from '../../services/app-info.service';
import { LockScreenService } from '../../services/lock-screen.service';
declare let gtag: Function;

@Component({
  selector: 'app-master-page-layout',
  templateUrl: './master-page-layout.component.html',
  styleUrls: ['./master-page-layout.component.scss']
})
export class MasterPageLayoutComponent extends SubscriptionBase implements OnInit {

  @Input() menuItems:any[];
  public todaysdate = new Date();
  public showBlur$ = this.lockScreenService.pinRequired$;


  constructor(
    public appInfo: AppInfoService,
    public router: Router,
    private lockScreenService: LockScreenService
  ) {
    super();
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      // Code to call google analytics with the page navigated to....
      if (event instanceof NavigationEnd) {
        gtag('config', 'UA-156347430-1', {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }

}
