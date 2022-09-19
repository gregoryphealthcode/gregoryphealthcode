import { Component, OnInit } from '@angular/core';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { InvoiceAddEditStoreService } from '../../invoice-add-edit-store.service';
import { GetInvoiceDiagnosisCodesResponseModel } from '../../invoice-add-edit.service';

@Component({
  selector: 'app-diagnosis-view',
  templateUrl: './diagnosis-view.component.html',
  styleUrls: ['./diagnosis-view.component.scss']
})
export class DiagnosisViewComponent extends SubscriptionBase implements OnInit {
  public codes: GetInvoiceDiagnosisCodesResponseModel[];

  constructor(
    private store: InvoiceAddEditStoreService
  ) {
    super()
  }

  ngOnInit() {
    this.subscription.add(
      this.store.invoiceDiagnosisCodes$.subscribe(
        x => { this.codes = x }
      )
    )
  }
}