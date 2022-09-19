import { Component, OnInit } from '@angular/core';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { PatientDetailsResponseModelNew } from 'src/app/shared/services/patient.service';
import { InvoiceAddEditStoreService } from '../../invoice-add-edit-store.service';

@Component({
  selector: 'app-invoice-patient-details-view',
  templateUrl: './invoice-patient-details-view.component.html',
  styleUrls: ['./invoice-patient-details-view.component.scss']
})
export class InvoicePatientDetailsViewComponent extends SubscriptionBase implements OnInit {
  public patientDetails: PatientDetailsResponseModelNew;

  constructor(
    public store: InvoiceAddEditStoreService,
    public appInfo: AppInfoService
  ) {
    super()
  }

  ngOnInit() {
    this.subscription.add(
      this.store.invoicePatientDetails$.subscribe(
        x => { this.patientDetails = x; }
      )
    )
  }
}