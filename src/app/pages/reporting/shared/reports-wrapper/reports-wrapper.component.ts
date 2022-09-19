import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { UserStore } from 'src/app/shared/stores/user.store';
import { reportsItems } from '../../items';

@Component({
  selector: 'app-reports-wrapper',
  templateUrl: './reports-wrapper.component.html',
  styleUrls: ['./reports-wrapper.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})
export class ReportsWrapperComponent extends SubscriptionBase implements OnInit {
  public backRoute: string;
  public backRouteName: string;
  public title: string;

  constructor(
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    let childItemRoute = this.route.firstChild;
    this.subscription.add(
      childItemRoute.url.subscribe(
        urls => {
          let parentKey = urls[0].path;

          const parent = reportsItems.find(x => x.key === parentKey);
          this.backRoute = './' + parent.key;
          this.backRouteName = parent.title + ' Reports';

          let childKey = urls[1].path;
          const child = parent.items.find(x => x.key === childKey);
          this.title = child.title;
        }
      )
    )
  }
}