import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { BulkPaymentViewStore } from '../account-bulk-payment-store.service';

@Component({
  selector: 'app-bulk-payment-summary',
  templateUrl: './bulk-payment-summary.component.html',
  styleUrls: ['./bulk-payment-summary.component.scss']
})
export class BulkPaymentSummaryComponent extends SubscriptionBase implements OnInit {
  public dataSource = [];
  allocated: number;
  unallocated: number;
  shortfalls: number;

  constructor(
    public store: BulkPaymentViewStore,
    public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit() {
    this.addToSubscription(
      this.store.unallocated$.pipe(tap(
        x => {
          if (x) 
          this.unallocated = x;
          else
          this.unallocated = 0;
          
          this.setDataSource();          
        }
      ))
    )

    this.addToSubscription(
      this.store.allocated$.pipe(tap(
        x => {
          if (x)
          this.allocated = x;
          else
          this.allocated = 0;

          this.setDataSource();          
        }
      ))
    )

    this.addToSubscription(
      this.store.shortfall$.pipe(tap(
        x => {
          if (x)
          this.shortfalls = x;
          else
          this.shortfalls = 0;

          this.setDataSource();
          
        }
      ))
    )
  }

  private setDataSource() {
    this.dataSource = [
      { name: "allocated", val: this.allocated, color: 'rgb(29, 178, 245)' },
      { name: "unallocated", val: this.unallocated, color: 'rgb(245, 86, 74)' },
      { name: "shortfall", val: this.shortfalls, color: 'orange' },
    ];
  }

  customizePoint(pointInfo: any) {
    return { color: pointInfo.data.color };
  }
}
