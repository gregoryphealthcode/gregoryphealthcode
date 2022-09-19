import { Component, Input, OnInit, } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { InvoiceServicesStoreService } from '../invoice-services-store.service';
import { IGetInvoiceServiceResponseModel } from '../invoice-services.service';

@Component({
  selector: 'app-services-grid',
  templateUrl: './services-grid.component.html',
  styleUrls: ['./services-grid.component.scss']
})
export class ServicesGridComponent extends SubscriptionBase implements OnInit {
  constructor(
    public appInfo: AppInfoService,
    public store: InvoiceServicesStoreService,
    public appMessages: AppMessagesService
  ) {
    super()
  }

  @Input() showFee: boolean;

  public services: IGetInvoiceServiceResponseModel[];

  ngOnInit() {
    this.addToSubscription(this.store.services$.pipe(
      tap(x => {
        this.services = x;
        if (this.services && this.services.length > 1) {
          this.services.sort(function (a, b) {
            if (a.startTime < b.startTime) return -1;
            if (a.startTime > b.startTime) return 1;
            return 0;
          });
        }
      })))
  }

  delete(item) {
    const text = 'Are you sure you want to delete this service?'

    const callback = () => {
      this.store.removeService(item)
    };

    this.appMessages.showDeleteConfirmation(callback, text);
  }
}