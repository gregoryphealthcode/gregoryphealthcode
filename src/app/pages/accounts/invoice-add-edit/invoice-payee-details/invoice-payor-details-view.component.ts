import { Component, OnInit } from '@angular/core';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { InvoiceAddEditStoreService } from '../invoice-add-edit-store.service';
import { GetInvoicePayorResponseModel } from '../invoice-add-edit.service';

@Component({
  selector: 'app-invoice-payor-details-view',
  templateUrl: './invoice-payor-details-view.component.html',
  styleUrls: ['./invoice-payor-details-view.component.scss']
})
export class InvoicePayorDetailsViewComponent extends SubscriptionBase implements OnInit {

  public payor: GetInvoicePayorResponseModel;

  constructor(
    private store: InvoiceAddEditStoreService,
    public appInfo: AppInfoService
  ) {
    super()
  }

  ngOnInit() {
    this.subscription.add(
      this.store.invoicePayorDetails$.subscribe(
        x => { this.payor = x }
      )
    )
  }

  needsRenewal(e) {
    if (e && new Date(e).getTime() <= new Date().getTime())
      return true;

    return false;
  }

  needsRenewalLabel(e) {
    if (e && new Date(e).getTime() <= new Date().getTime())
      return "Policy lapsed on";

    return "Policy lapses on";
  }
}
