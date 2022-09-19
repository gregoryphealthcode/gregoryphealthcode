import { Component, OnInit, ViewChild, } from '@angular/core';
import { Router } from '@angular/router';
import { BillingService, BulkPaymentViewModel } from 'src/app/shared/services/billing.service';
import { AppInfoService } from 'src/app/shared/services';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { InsurersViewModel, UserService } from 'src/app/shared/services/user.service';
import { GridBase } from 'src/app/shared/base/grid.base';
import { environment } from 'src/environments/environment';
import { UserStore } from 'src/app/shared/stores/user.store';
import { MedSecSiteSelectorComponent } from 'src/app/shared/components/med-sec-site-selector/med-sec-site-selector/med-sec-site-selector.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GluTransactionMethodTypesEnum } from '../invoice-add-edit/invoice-payment-notifications/invoice-payment-notifications.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { SiteAdminModel, SitesService } from 'src/app/shared/services/sites.service';

@Component({
  selector: 'app-accounts-bulk-payments',
  templateUrl: './accounts-bulk-payments.component.html',
  styleUrls: ['./accounts-bulk-payments.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})
@AutoUnsubscribe
export class AccountsBulkPaymentsComponent extends GridBase implements OnInit {
  @ViewChild(MedSecSiteSelectorComponent) siteSelector: MedSecSiteSelectorComponent;
  insurers: InsurersViewModel[] = [];
  selectedInsurer = "All Insurers";
  selectedAllocation = 0;
  allocations = [
    { id: 0, value: "All Allocations" },
    { id: 1, value: "Fully Allocated" },
    { id: 2, value: "Not Fully Allocated" }
  ]

  selectedRecord: any;
  showPanel = false;
  currencyCode;
  sites: SiteAdminModel[] = [];
  selectedSiteId: string;
  defaultSiteId: string = "00000000-0000-0000-0000-000000000000";

  bulkPayment: BulkPaymentViewModel = new BulkPaymentViewModel();

  gluTransactionMethodTypesEnum: typeof GluTransactionMethodTypesEnum;

  constructor(
    private router: Router,
    private billingService: BillingService,
    public appInfo: AppInfoService,
    private userService: UserService,
    public userStore: UserStore,
    private authService: AuthService,
    private appMessages: AppMessagesService, private sitesService: SitesService,
  ) {
    super();
  }

  ngOnInit() {
    this.currencyCode = this.appInfo.getCurrencyCode;
    this.getInsurers();
    this.getSites();
    this.getBulkPayments();
    this.gluTransactionMethodTypesEnum = GluTransactionMethodTypesEnum;
  }

  getInsurers() {
    this.subscription.add(this.userService.getInsurers().subscribe(data => {
      this.insurers = data;
      this.insurers.sort(function (a, b) {
        if (a.insurerName < b.insurerName) return -1;
        if (a.insurerName > b.insurerName) { return 1; }
        return 0;
      })
      this.insurers.unshift(new InsurersViewModel({
        insurerId: -1,
        uniqueNo: -1,
        code: "All",
        insurerName: "All Insurers",
        logoUrl: '',
        notes: '',
        requiresDiagnosisCode: false,
        isSTV: false
      }));
      this.selectedInsurer = "All";
    }));
  }

  getBulkPayments() {
    this.controllerUrl = `${environment.baseurl}/bulkPayments/`;
    this.setupDataSource({
      key: 'bulkPaymentId',
      loadParamsCallback: () => [
        { name: 'insurer', value: this.selectedInsurer != "All Insurers" ? this.selectedInsurer : '' },
        { name: 'status', value: this.selectedAllocation },
        { name: 'selectedSiteId', value: this.selectedSiteId != '00000000-0000-0000-0000-000000000000' ? this.selectedSiteId : null },
      ],
    });
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

  onFocusedRowChanged(e) {
    if (e !== null && e !== undefined) {
      this.billingService.getBulkPayment(e.row.data.bulkPaymentId).subscribe(data => {
        this.bulkPayment = data;
      });
      this.showPanel = true;
    }
  }

  add() {
    if (this.userStore.isMedSecUser()) {
      this.siteSelector.show();
    } else {
      this.addClicked();
    }
  }

  public addClicked() {
    this.selectedRecord = { id: 0 };
  }

  edit(e) {
    if (this.userStore.isMedSecUser()) {
      this.authService.selectSite(e.data.siteId).subscribe(x => {
        this.router.navigate(['/accounts/bulk-payments/' + e.data.bulkPaymentId]);
      });
    } else {
      this.router.navigate(['/accounts/bulk-payments/' + e.data.bulkPaymentId]);
    }
  }

  insurerChanged(e) {
    this.selectedInsurer = e.selectedItem.insurerName;
    this.reloadData();
  }

  allocationChanged(e) {
    this.selectedAllocation = e.selectedItem.id;
    this.reloadData();
  }

  saved(e) {
    if (this.userStore.isMedSecUser()) {
      this.unselectSite();
    }

    if (e.success) {
      this.appMessages.showSuccessSnackBar("Bulk payment added.");
    }
    if (e.errors) {
      this.appMessages.showFailedSnackBar(e.errors[0]);
    }

    this.router.navigate(['/accounts/bulk-payments/' + e.data.id]);

    this.reloadData();
  }

  setSelectedSiteItem(e) {
    this.selectedSiteId = e.selectedItem.siteId;
    this.getBulkPayments();
  }

  private unselectSite(callback?) {
    if (this.userStore.isMedSecUser()) {
      this.subscription.add(
        this.authService.unselectSite().subscribe(() => {
          if (callback) {
            callback();
          }
        })
      );
    }
  }

  reloadData() {
    this.getBulkPayments();
  }
}