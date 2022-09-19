import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { BillingService, InvoiceDataModel } from 'src/app/shared/services/billing.service';

@Component({
  selector: 'app-accounts-invoices',
  templateUrl: './accounts-invoices.component.html',
  styleUrls: ['./accounts-invoices.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})
export class AccountsInvoicesComponent extends SubscriptionBase implements OnInit {
  public draftCount = 0;
  public reviewCount = 0;
  public failedCount = 0;
  public invoiceCount = 0;
  public selectedIndex = 0;
  public tabs = ["all", "draft", "review", "failed"];
  public title = "All Pending Invoices"

  constructor(
    private billingService: BillingService,
    private route: ActivatedRoute,
    ) 
  {
    super();
   }

  ngOnInit() {
    this.getCounts();
    
    this.route.fragment.subscribe((fragment: string) => {
      this.setActiveTab(fragment);     
      if (fragment == "review")
        this.title = "Invoices for Review";
    });

    if (sessionStorage.getItem('invoiceTab')) {
      this.setActiveTab(sessionStorage.getItem('invoiceTab'));
      sessionStorage.removeItem('invoiceTab'); 
    }
  }

  getCounts() {
    this.billingService.getInvoiceCounts().subscribe(data => {    
      this.invoiceCount = data.allInvoiceCount;
      this.draftCount = data.draftInvoiceCount;
      this.reviewCount = data.reviewInvoiceCount;
      this.failedCount = data.failedInvoiceCount;
    });
  }

  tabChange(e) {
    switch (e.index) {
      case 0:
        this.title = "All Pending Invoices";
      break;

      case 1:
        this.title = "Draft Invoices";
      break;

      case 2: 
        this.title = "Invoices for Review";
      break;

      case 3: 
        this.title = "Failed Validation Invoices";
      break;
    }
  }

  private setActiveTab(tab:string){
    this.selectedIndex = this.tabs.indexOf(tab);    
  }
}
