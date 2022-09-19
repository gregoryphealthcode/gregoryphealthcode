import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { AutoPopModel, BillingService } from 'src/app/shared/services/billing.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { InsurersViewModel, UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invoice-auto-pop',
  templateUrl: './invoice-auto-pop.component.html',
  styleUrls: ['./invoice-auto-pop.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})
export class InvoiceAutoPopComponent extends GridBase implements OnInit {
  insurers: InsurersViewModel[] = [];
  selectedInsurer = "All Insurers";
  fromDate;
  toDate;
  dateFormat;
  processed = false;
  selectedClaim;
  showAddPatient = false;
  showSearchPopup = false;
  autoPopDetails: AutoPopModel;
  autoPopId: string;
  isSearch: boolean;  
  
  constructor(
    private spinner: SpinnerService,
    private billingService: BillingService,
    private appMessages: AppMessagesService,
    public appInfo: AppInfoService,
    private userService: UserService,
    private router: Router,
  ) 
  {
    super();
  }

  ngOnInit() {
    this.spinner.start();
    this.dateFormat = this.appInfo.getDateFormat;
    this.getInsurers();
    
    this.checkPayeeProviderTreatments();
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
  
  reloadData() {
    this.getAutoPopInvoices();
  }

  checkPayeeProviderTreatments() {
    this.billingService.checkPayeeProviderTreatments().subscribe(x => {
      if (x.success) {
        this.isSearch = x.data;
        if (this.isSearch)
          this.getAutoPopInvoices();
        else
          this.getAutoPopInvoicesFromApi();
      }
      if (x.errors) {
        this.appMessages.showApiErrorNotification(x.errors[0]);
      }
    }),
    (e => {
      this.appMessages.showApiErrorNotification(e);
    });
  }

  getAutoPopInvoicesFromApi() {
    this.billingService.getAutoPopInvoicesFromApi().subscribe(
      (x) => {
        this.getAutoPopInvoices();
      },
      (e) => {
        this.appMessages.showApiErrorNotification(e);
        this.getAutoPopInvoices();
      }
    );
  }

  getAutoPopInvoices() {
    this.controllerUrl = `${environment.baseurl}/billing/`;
    this.setupDataSource({
      key: 'claimId',
      loadParamsCallback: () => [
        { name: 'fromDate', value: this.fromDate ? new Date(this.fromDate.getTime() - (this.fromDate.getTimezoneOffset() * 60000)).toISOString() : undefined },
        { name: 'toDate', value: this.toDate ? new Date(this.toDate.getTime() - (this.toDate.getTimezoneOffset() * 60000)).toISOString() : undefined },
        { name: 'processed', value: this.processed },
        { name: 'insurerId', value: this.selectedInsurer != "All Insurers" ? this.selectedInsurer : '' },
      ],
      loadUrl: "getAutoPopInvoicesGrid",
    });
    this.spinner.stop();
  }

  dateChanged() {
    this.reloadData();
  }

  insurerChanged(e) {
    this.selectedInsurer = e.selectedItem.insurerId;
    this.reloadData();
  }

  checkboxChanged(e) {
    this.processed = !this.processed;
    this.reloadData();
  }

  onFocusedRowChanged(e) {
    this.selectedClaim = e.row.key;
  }

  process(e) {
    if (e.invoiceId) {
      this.openInvoice(e)
      return;
    }
    this.spinner.start();
    this.billingService.getAutoPopPatientDetails(e.id).subscribe(data => {
      this.spinner.stop();
      this.autoPopId = data.id;
      if (data.patientId) {
        this.setUpAutoPopInvoice(this.autoPopId, data.patientId)
      }
      else {
        this.autoPopDetails = data;
        this.showAddPatient = true;
      }
    });
  }
  
  newPatientAdded(e) {
    this.showAddPatient = false;
    this.setUpAutoPopInvoice(this.autoPopId, e)
  }

  setUpAutoPopInvoice(autoPopId: string, patientId: string) {
    this.billingService.createAutoPopInvoice(autoPopId, patientId).subscribe(x => {
      if (x) {
        let invoiceId = x.data.id;
        this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId, autoPopId: autoPopId } });
      }
    })
  }
  
  openInvoice(e) {
    if (e.invoiceId) {
      let invoiceId = e.invoiceId;
      this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId } });
    }
  }
}