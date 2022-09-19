import { Component, OnInit, } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { GridBase } from 'src/app/shared/base/grid.base';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SitesService } from 'src/app/shared/services/sites.service';
import { AppInfoService } from 'src/app/shared/services/app-info.service';

@AutoUnsubscribe
@Component({
  selector: 'app-payment-age-bands',
  templateUrl: './payment-age-bands.component.html',
  styleUrls: ['./payment-age-bands.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})

@AutoUnsubscribe
export class PaymentAgeBandsComponent extends GridBase implements OnInit {
  isContactShown = false;
  selectedRecord: any;
  show = false;
  ages: number = 0;

  constructor(
    private snackBar: MatSnackBar,
    private siteService: SitesService, public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit() {
    this.getPaymentAges();
  }

  getPaymentAges() {
    this.controllerUrl = `${environment.baseurl}/paymentAge/`;
    this.setupDataSource({
      key: 'paymentAgeId',
      loadParamsCallback: () => [
      ],
    });
  }

  public editClicked(e) {
    this.show = true;
    this.selectedRecord = { id: e.data.paymentAgeId };
  }

  saved(e) {
    if (e.success) {
      this.snackBar.open("Payment age bands updated", "Close", {
        panelClass: "badge-success",
        duration: 3000,
      });
    }
    if (e.errors) {
      this.snackBar.open(e.errors[0], "Close", {
        panelClass: "badge-danger",
        duration: 3000,
      });
    }
    this.show = false;
    this.getPaymentAges();
  }

  getBackgroundColor(cellInfo) {
    return cellInfo.data.backgroundColor;
  }
}