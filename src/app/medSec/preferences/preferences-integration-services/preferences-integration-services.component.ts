import { Component, OnInit,} from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';

@Component({
  selector: 'app-preferences-integration-services',
  templateUrl: './preferences-integration-services.component.html',
  styleUrls: ['./preferences-integration-services.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1 py-3 px-4' },
})

@AutoUnsubscribe
export class MedSecPreferencesIntegrationServicesComponent extends SubscriptionBase implements OnInit {
  constructor(
    public router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
  }
}