import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppInfoService } from 'src/app/shared/services';

@Component({
  selector: 'app-accounts-bulk-payment',
  templateUrl: './accounts-bulk-payment.component.html',
  styleUrls: ['./accounts-bulk-payment.component.scss']
})
export class AccountsBulkPaymentComponent implements OnInit {
  currencySymbol: string;
  currencyCode: string;
  dateFormat: string;
  selectedIndex = 1;
  bulkPaymentId: string;

  constructor(private route: ActivatedRoute, public appInfo: AppInfoService) { }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.bulkPaymentId = params.bulkPaymentId;
    });
  }

  siteIdchanged(siteId: string) {
    this.currencySymbol = this.appInfo.getCurrencySymbolBySite(siteId);
    this.currencyCode = this.appInfo.getCurrencyCodeBySite(siteId);
    this.dateFormat = this.appInfo.getDateFormatBySite(siteId);
  }
}
