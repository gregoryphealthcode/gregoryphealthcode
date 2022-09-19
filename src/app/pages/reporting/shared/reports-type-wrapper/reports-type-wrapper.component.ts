import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { UserStore } from 'src/app/shared/stores/user.store';
import { ReportItemModel, reportsItems } from '../../items';

@Component({
  selector: 'app-reports-type-wrapper',
  templateUrl: './reports-type-wrapper.component.html',
  styleUrls: ['./reports-type-wrapper.component.scss'],
  host: { class: 'd-flex flex-column' }
})
export class ReportsTypeWrapperComponent extends SubscriptionBase implements OnInit {
  public title: string;
  public items: ReportItemModel[];

  constructor(
    private route: ActivatedRoute,
    private userStore: UserStore
  ) {
    super();
  }

  ngOnInit() {
    this.subscription.add(
      this.route.url.subscribe((params) => {
        let key = params[0].path;
        
        const item = reportsItems.find(x => x.key === key);
        this.title = item.title;
        this.items = item.items;
      })
    );
  }
}