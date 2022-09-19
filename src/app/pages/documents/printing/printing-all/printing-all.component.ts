import { Component, OnInit, } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';

@Component({
  selector: 'app-printing-all',
  templateUrl: './printing-all.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
  styleUrls: ['./printing-all.component.scss'],
})

@AutoUnsubscribe
export class PrintingAllComponent extends SubscriptionBase implements OnInit {
  constructor(
    public appInfo: AppInfoService,
  ) {
    super();
  }

  ngOnInit(): void {

  }
}
