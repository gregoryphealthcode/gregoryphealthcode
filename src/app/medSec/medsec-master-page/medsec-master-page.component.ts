import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { medSecNavigation } from 'src/app/app-navigation';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { LockScreenService } from 'src/app/shared/services/lock-screen.service';
declare let gtag: Function;
@Component({
  selector: 'app-medsec-master-page',
  templateUrl: './medsec-master-page.component.html',
  styleUrls: ['./medsec-master-page.component.scss']
})
export class MedSecMasterPageComponent extends SubscriptionBase implements OnInit {
  public menuItems:any = medSecNavigation;

  constructor() {
    super();
  }

  ngOnInit() {

  }

}
