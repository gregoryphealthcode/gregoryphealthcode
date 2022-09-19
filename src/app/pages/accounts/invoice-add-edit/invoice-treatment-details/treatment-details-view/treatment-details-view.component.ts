import { Component, OnInit } from '@angular/core';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { InvoiceAddEditStoreService } from '../../invoice-add-edit-store.service';
import { GetInvoiceEpisodeDetailsResponse, GluEpisodeTypeEnum } from '../../invoice-add-edit.service';

@Component({
  selector: 'app-treatment-details-view',
  templateUrl: './treatment-details-view.component.html',
  styleUrls: ['./treatment-details-view.component.scss']
})
export class TreatmentDetailsViewComponent extends SubscriptionBase implements OnInit {
  public recordAdmitDate = false;
  public recordDischargeDate = false;
  public recordDischargeCode = false;
  public record: GetInvoiceEpisodeDetailsResponse;

  constructor(
    private store: InvoiceAddEditStoreService,
    public appInfo: AppInfoService
  ) {
    super()
  }

  ngOnInit() {
    this.subscription.add(
      this.store.invoiceEpisodeDetails$.subscribe(
        x => {
          if (x) {
            this.record = x;
            this.recordAdmitDate = (this.store.isInsurer && x.episodeTypeId !== GluEpisodeTypeEnum.Outpatient)
              || (this.store.isInsurer && x.episodeTypeId !== GluEpisodeTypeEnum.Other)
              || (x.episodeTypeId == GluEpisodeTypeEnum.Inpatient);
          }
        }
      )
    )
  }
}