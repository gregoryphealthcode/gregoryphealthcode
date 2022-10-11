import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { BillingService, GetBulkPaymentShortFallsViewModel } from 'src/app/shared/services/billing.service';

@Component({
  selector: 'app-short-falls',
  templateUrl: './short-falls.component.html',
  styleUrls: ['./short-falls.component.scss']
})
export class ShortFallsComponent extends SubscriptionBase implements OnInit {
  @Input() bulkPaymentId: string;
  @Output() onNoDefaultTemplatesFound = new EventEmitter<boolean>()

  public hasPatientZone = true;
  public reallocationPayments: GetBulkPaymentShortFallsViewModel[] = [];

  constructor(
    private billingService: BillingService
  ) {
    super()
  }

  ngOnInit() {
    this.getRecords();
  }

  private getRecords() {
    this.subscription.add(
      this.billingService.getBulkPaymentShortFalls(this.bulkPaymentId).subscribe(data => {
        this.reallocationPayments = data;
        console.log(data);
      })
    );
  }
}