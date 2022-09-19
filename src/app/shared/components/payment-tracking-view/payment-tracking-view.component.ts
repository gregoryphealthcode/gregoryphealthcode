import { ChangeDetectorRef, Component, Input, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService, PatientTelecom } from 'src/app/shared/services';
import { BillingService, GetInvoiceTransactionResponseModel, TransactionViewModel } from 'src/app/shared/services/billing.service';
import { Address } from 'src/app/shared/services/contact.service';
import { BasicPatientDetailsViewModel, PatientBalanceViewModel, PatientService } from 'src/app/shared/services/patient.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';

@Component({
  selector: 'app-payment-tracking-view',
  templateUrl: './payment-tracking-view.component.html',
  styleUrls: ['./payment-tracking-view.component.scss']
})
@AutoUnsubscribe
export class PaymentTrackingViewComponent extends SubscriptionBase implements OnInit {
  @Input() get patientId(): string {
    return this._patientId;
  }
  set patientId(value: string) {
    if (value !== undefined && value !== null) {
      this._patientId = value;
      this.getData();
    }
  }

  @Input() get invoiceId(): string {
    return this._invoiceId;
  }
  set invoiceId(value: string) {
    if (value !== undefined && value !== null) {
      this._invoiceId = value;
      this.getTransactions()
    }
  }

  public selectStatus = 'All';
  public patientBalance: PatientBalanceViewModel = new PatientBalanceViewModel;
  public transactionViewModel: GetInvoiceTransactionResponseModel[] = [];
  public patientDetails: BasicPatientDetailsViewModel = new BasicPatientDetailsViewModel();
  public showPrimaryAddress = true;
  public primaryAdress: Address;
  public billingAdress: Address;
  public telecoms: PatientTelecom[] = [];
  private _patientId: string;
  private _invoiceId: string;

  constructor(
    private billingService: BillingService,
    private changeDetectorRef: ChangeDetectorRef,
    public appInfo: AppInfoService,
    private patientService: PatientService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {

  }

  private getData() {
    forkJoin([
      this.patientService.getBasicPatientDetails(this.patientId),
      this.patientService.getPatientBalance(this.patientId),
      this.patientService.getAddresses(this.patientId),
      this.patientService.getPatientTelecoms(this.patientId)
    ])
      .subscribe(([basicDetails, balance, address, telecoms]) => {
        this.patientDetails = basicDetails;
        this.telecoms = telecoms;
        this.patientBalance = balance;
        this.setAddresses(address);

        this.changeDetectorRef.detectChanges();
      });
  }

  getTransactions() {
    this.subscription.add(this.billingService.getTransactions(this.invoiceId).subscribe(data => {
      this.transactionViewModel = data;
    }));
  }

  private setAddresses(addresses: Address[]) {
    for (const i in addresses) {
      if (addresses[i].billingAddress === true) {
        this.billingAdress = addresses[i];
        break;
      }
    }

    for (const i in addresses) {
      if (addresses[i].primaryAddress === true) {
        this.primaryAdress = addresses[i];
        break;
      }
    }
  }

  showPatientDetails() {
    this.router.navigate([`/patient-details/${this.patientId}`]);
  }

  manageTransactions() {
    if (this.invoiceId) { 
      let invoiceId = this.invoiceId;
      this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId }, fragment: "1" });
    }
  }
}