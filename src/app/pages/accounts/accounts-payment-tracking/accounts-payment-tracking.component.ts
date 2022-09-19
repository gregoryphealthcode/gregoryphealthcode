import { Component, OnInit, ChangeDetectorRef, } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { BillingService, InvoiceDataModel, TransactionViewModel, CreditControlListViewModel } from 'src/app/shared/services/billing.service';
import { AppInfoService, PatientTelecom } from 'src/app/shared/services';
import { Router } from '@angular/router';
import { Address } from 'src/app/shared/services/contact.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { GridBase } from 'src/app/shared/base/grid.base';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { InvoiceAddEditService } from '../invoice-add-edit/invoice-add-edit.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { UserStore } from 'src/app/shared/stores/user.store';
import { MatDialog } from '@angular/material/dialog';
import { DialogTemplateComponent } from 'src/app/shared/components/dialog/dialog-template.component';
import { SiteAdminModel, SitesService } from 'src/app/shared/services/sites.service';

@Component({
  selector: 'app-accounts-payment-tracking',
  templateUrl: './accounts-payment-tracking.component.html',
  styleUrls: ['./accounts-payment-tracking.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }

})
@AutoUnsubscribe
export class AccountsPaymentTrackingComponent extends GridBase implements OnInit {
  private searchTerms = new BehaviorSubject<any>(undefined);
  searchTermValue: string = "";

  showPanel = false;

  tracking: InvoiceDataModel[] = [];
  selectedrowData: InvoiceDataModel;
  patientId: string;
  invoiceId: string;
  sites: SiteAdminModel[] = [];
  selectedSiteId: string;
  defaultSiteId: string = "00000000-0000-0000-0000-000000000000";

  selectedStatus = "all";
  statuses = [
    { value: 'all', text: 'All' },
    { value: 'balanced', text: 'Balanced' },
    { value: 'overdue', text: 'Overdue Payments (All)' },
    { value: 'band1', text: 'Overdue Payments (Band 1)' },
    { value: 'band2', text: 'Overdue Payments (Band 2)' },
    { value: 'band3', text: 'Overdue Payments (Band 3)' },
    { value: 'band4', text: 'Overdue Payments (Band 4)' }
  ];

  constructor(
    public appInfo: AppInfoService,
    private router: Router,
    private invoiceService: InvoiceAddEditService,
    private appMessage: AppMessagesService,
    public userStore: UserStore,
    private dialog: MatDialog, private sitesService: SitesService,
  ) {
    super();
  }

  ngOnInit() {
    this.getSites();
    this.getInvoices();

    this.subscription.add(
      this.searchTerms
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap((x) => {
            if (x !== undefined) this.reloadData();
          })
        )
        .subscribe()
    );
  }

  getSites() {
    this.sitesService.getSites().subscribe(data => {
      this.sites = data;
      this.sites.sort(function (a, b) {
        if (a.siteName < b.siteName) return -1;
        if (a.siteName > b.siteName) { return 1; }
        return 0;
      });
      this.sites.unshift({
        siteId: '00000000-0000-0000-0000-000000000000', siteName: "All Sites"
      });
    });
  }

  getInvoices() {
    this.controllerUrl = `${environment.baseurl}/billing/`;
    this.setupDataSource({
      key: 'invoiceId',
      loadParamsCallback: () => [
        { name: 'searchValue', value: this.searchTermValue },
        { name: 'status', value: this.selectedStatus },
        { name: 'selectedSiteId', value: this.selectedSiteId != '00000000-0000-0000-0000-000000000000' ? this.selectedSiteId : null },
      ],
      loadUrl: "getPaymentTracking"
    });
  }

  cloneInvoice(e) {
    const dialogRef = this.dialog.open(DialogTemplateComponent, {
      width: '250px',
      data: { title: 'Are you sure?', message: 'Are you sure you want to copy this invoice?' },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.clone(e);
      }
    });
  }

  clone(e) {
    this.invoiceService.cloneInvoice(e.data.invoiceId).subscribe(data => {
      const invoiceId = data.data;
      this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId } });
    },
      error => {
        this.appMessage.showApiErrorNotification(error);
      }
    );
  }

  reloadData() {
    this.getInvoices();
  }

  public onSearchInputChangedHandler() {
    this.searchTerms.next(this.searchTermValue);
  }

  statusChanged(e) {
    this.selectedStatus = e.selectedItem.value;
    this.reloadData();
  }

  openInvoice(e) {
    this.invoiceId = e.data.invoiceId;
    this.editInvoice();
  }

  editInvoice() {
    const invoiceId = this.invoiceId;
    sessionStorage.setItem('returnUrl', 'accounts/draft-invoices');
    this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId }, fragment: "1" });
  }

  setSelectedSiteItem(e) {
    this.selectedSiteId = e.selectedItem.siteId;
    this.getInvoices();
  }

  onFocusedRowChanged(e) {
    this.selectedrowData = e.row.data;
    this.patientId = e.row.data.patientId;
    this.invoiceId = e.row.data.invoiceId;
    this.showPanel = true;
  }
}