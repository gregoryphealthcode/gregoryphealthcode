import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { BillingService, PaymentAllocationViewModel } from 'src/app/shared/services/billing.service';

@Component({
  selector: 'app-payment-allocations',
  templateUrl: './payment-allocations.component.html',
  styleUrls: ['./payment-allocations.component.scss']
})
export class PaymentAllocationsComponent extends SubscriptionBase implements OnInit {
  constructor(private billingService : BillingService) {
    super();
  }

  @Input() dateFormat: any;
  @Input() currencyCode: string;
  @Input() public set id (value){
    if(value){
      this._id = value;
      this.getPaymentAllocation(value);
    }
  }
  public get id(){ return this._id;}
  private _id: any;

  paymentAllocations : PaymentAllocationViewModel[] =[];

  ngOnInit() {
  }

  getPaymentAllocation(id: string)
  {
    this.subscription.add(this.billingService.getPaymentAllocation(id).subscribe(data =>{
       this.paymentAllocations = data;
    }));
  }
}