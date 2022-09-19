import { Component, OnInit } from '@angular/core';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';

@Component({
  selector: 'app-preferences-site',
  templateUrl: './preferences-site.component.html',
  styleUrls: ['./preferences-site.component.scss']
})

@AutoUnsubscribe
export class PreferencesSiteComponent extends SubscriptionBase implements OnInit {
  
  constructor(
    public appInfo: AppInfoService
    ) {
    super();
  }

  ngOnInit() {
  }  
}
