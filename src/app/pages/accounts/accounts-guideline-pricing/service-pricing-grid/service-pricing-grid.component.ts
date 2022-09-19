import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { ManagedPayorModel, ManagedServiceLocationModel, ManagedServicePayorLocationModel, PricingMatrixService } from 'src/app/shared/services/pricing-matrix.service';

@Component({
  selector: 'app-service-pricing-grid',
  templateUrl: './service-pricing-grid.component.html',
  styleUrls: ['./service-pricing-grid.component.scss']
})
export class ServicePricingGridComponent extends SubscriptionBase implements OnInit {
  @Input() serviceId: number;
  @Input() payors: ManagedPayorModel[];
  @Input() selectedLocation: string;
  @Input() locations: ManagedServiceLocationModel[];  
  servicePayorLocations: ManagedServicePayorLocationModel[] = [];

  currentPayorId;
  currentLocationId;

  constructor(
    private pricingMatrixService: PricingMatrixService,
    private appMessages: AppMessagesService,
    public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit() {
    this.getManagedServicePayorLocations();
  }  

  getManagedServicePayorLocations() {
    if (this.serviceId) {
      this.pricingMatrixService.getManagedServicePayorLocations(this.serviceId).subscribe(data => {
        this.servicePayorLocations = data;
      });
    }
  }

  getPrice(e) {
    return this.servicePayorLocations.find(x => x.managedServiceId == this.serviceId && x.managedPayorId == this.payors[e.columnIndex - 1]?.payorId
      && x.locationId == e.data.locationId)?.price;
  }
}
