import { Component, OnInit, } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';

@Component({
  selector: 'app-preferences-integration-services',
  templateUrl: './preferences-integration-services.component.html',
  styleUrls: ['./preferences-integration-services.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe
export class PreferencesIntegrationServicesComponent extends SubscriptionBase implements OnInit {
  constructor(
    public router: Router, public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit(): void {

  }
}