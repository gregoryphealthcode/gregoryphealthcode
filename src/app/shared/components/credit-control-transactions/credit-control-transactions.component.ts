import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { OnInit, OnChanges, ChangeDetectorRef, Component, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { UserService, GenericViewModel } from '../../services/user.service';
import {
  TransactionViewModel, BillingService, TransactionDetail, TransactionLineViewModel,
  InvoiceDataModel, InvoiceAppointmentDetailsDataModel, PatientZoneCreditNoteViewModel
} from '../../services/billing.service';
import { forkJoin } from 'rxjs';
import notify from 'devextreme/ui/notify';
import { AppInfoService, } from '../../services';
import { DxPopupComponent } from 'devextreme-angular';
import { ContactService, ContactListViewModel, Address } from '../../services/contact.service';
import { PatientService } from '../../services/patient.service';
import { StatusCode } from 'src/app/_helpers/StatusCode';
import { SitesStore } from '../../stores/sites.store';
import { SpinnerService } from '../../services/spinner.service';
import { SubscriptionBase } from '../../base/subscribtion.base';
import { PrintingService } from '../../services/printing.service';
import { PrintQueueViewModel } from '../../models/PrintQueueViewModel';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-credit-control-transactions',
  templateUrl: './credit-control-transactions.component.html',
  styleUrls: ['./credit-control-transactions.component.scss']
})

@AutoUnsubscribe
export class CreditControlTransactionsComponent extends SubscriptionBase implements OnInit, OnChanges {
  constructor(
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private billingService: BillingService,
    public appInfoService: AppInfoService,
    private spinnerService: SpinnerService,
    private contactService: ContactService,
    private patientService: PatientService,
    private siteStore: SitesStore,
    private printService: PrintingService) {
    super();

  }

  @ViewChild('redistributePopup') redistributePopup: DxPopupComponent;

  @Input() siteId: string;
  @Input() invoiceId: string;
  @Input() patientId: string;

  transactionVM: TransactionViewModel = new TransactionViewModel();
  transType: GenericViewModel[] = [];
  methods: GenericViewModel[] = [];
  transactionDetail: TransactionDetail = new TransactionDetail();
  transactionLines: TransactionLineViewModel[] = [];
  transTypeSelected: GenericViewModel = new GenericViewModel();
  subTransTypeSelected: GenericViewModel = new GenericViewModel();
  subTransType: GenericViewModel[] = [];
  currencySymbol: string;
  currencyCode: string;
  showSubTransType = false;
  payorSelected: ContactListViewModel;
  payors: ContactListViewModel[] = [];
  invoiceVM: InvoiceDataModel;
  outstandingBalance: number;
  showRedistributePopup: boolean;
  linkId = 'Invoice';
  taskTypeSelected = true;
  patients: any[] = [];
  shortfallLetter: string;
  addressVM: Address = new Address();
  payorDetailsVM: Address = new Address();

  letters: string[] = [
    'none',
    'Shortfall'
  ];

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
  }

  ngOnInit(): void {
    this.getTransactions();
  }

  updateShortfallLetterValue(e) {
    this.shortfallLetter = e.value;
  }


  getPrimaryAddress() {
    this.patientService.getPatientPrimaryAddress(this.transactionVM.patientId).subscribe(data => {
      this.addressVM = data;
      this.changeDetectorRef.detectChanges();
    });
  }

  getPayorDetails(contactId: string) {
    this.contactService.getContactAddress(contactId).subscribe(data => {
      this.payorDetailsVM = data;
      this.changeDetectorRef.detectChanges();
    });
  }

  getTransactions() {
    this.transactionDetail = new TransactionDetail();

    this.currencySymbol = this.appInfoService.getCurrencySymbolBySite(this.siteId);
    this.currencyCode = this.appInfoService.getCurrencyCodeBySite(this.siteId);
    this.siteId = this.siteStore.getSelectedSite().siteId;

    forkJoin([
      this.billingService.getInvoiceTransactions(this.invoiceId),
      this.userService.getTransactionTypes(),
      this.userService.getPaymentMethodTypes()])
      .subscribe(([billing, transTypes, methodTypes]) => {
        this.transType = transTypes;
        //this.transactionVM = billing;
        this.methods = methodTypes;
        //this.outstandingBalance = billing.outstandingBalance;
        this.getPayorContacts();
        this.changeDetectorRef.detectChanges();
      });
  }

  save() {
    this.spinnerService.start();
    this.transactionDetail.invoiceId = this.invoiceId;
    this.transactionDetail.invoiceNumber = this.transactionVM.invoiceNumber;
    this.transactionDetail.siteId = this.siteId;
    this.transactionDetail.payorId = this.payorSelected.contactId;

    this.transactionDetail.invoiceTotal = this.transactionVM.invoiceTotal;
    if (this.subTransTypeSelected.description === 'Debit') {
      this.transactionDetail.amountPaid = Math.abs(this.transactionDetail.amountPaid);
    }

    this.transactionDetail.totalPaid = this.transactionVM.totalPaid;
    this.transactionDetail.patientId = this.patientId;
    this.transactionDetail.payorName = this.payorSelected.fullName;
    this.transactionDetail.transactionTypeId = this.transTypeSelected.id;
    this.transactionDetail.patientZoneResponse = this.transactionVM.patientZoneResponse;
    if (this.transTypeSelected.description === 'Write Off') {
      this.transactionDetail.isWriteOff = true;
    }

    this.subscription.add(this.billingService.saveTransaction(this.transactionDetail).subscribe(data => {
      if (this.transactionVM.invoiceWasSentToPatientZone && this.transTypeSelected.description === 'Credit Note') {
        const model = new PatientZoneCreditNoteViewModel();

        model.grossAmount = this.transactionVM.outstandingBalance;
        model.vATAmount = 0;
        model.netAmount = this.transactionDetail.amountPaid;
        model.pzTransactionRef = this.transactionVM.patientTransId;
        model.pZInvoiceRef = this.transactionVM.patientZoneResponse;
        model.invoiceNumber = this.transactionVM.invoiceNumber;
        model.transactionId = data;

        this.subscription.add(this.billingService.submitCreditNoteToPatientZone(model).subscribe(val => {
          this.spinnerService.stop();
          if (val.isSuccess) {
            notify('Transaction added successfully and sent to patientzone.', 'success');
          }
          else if (val.statusCode === StatusCode.PatientZoneError) {
            notify('Transaction added successfully but failed to send to patientzone.', 'success');
          }
          else {
            notify(val.message, 'error');
          }
        },
          error => {
            notify('An error occurred', 'error');
            this.spinnerService.stop();
          }));
      }
      else {
        this.spinnerService.stop();
        notify('Transaction added successfully.', 'success');
      }

      this.getTransactions();
      this.showSubTransType = false;
      this.changeDetectorRef.detectChanges();
    },
      error => {
        notify('An error occurred', 'error');
        this.spinnerService.stop();
      }));
  }

  addTransaction() {
    this.showSubTransType = false;
    this.transactionDetail = new TransactionDetail();
    this.transTypeSelected = new GenericViewModel();
    this.subTransTypeSelected = new GenericViewModel();
  }

  redistribute() {
    this.getPayorContacts();
    this.showRedistributePopup = true;
  }

  updateTransactions(e) {
    console.log(e);
  }

  getPayorContacts() {
    this.contactService.getPayorContacts(this.siteId, this.transactionVM.patientId).subscribe(value => {
      this.payors = value;
      const payor = new ContactListViewModel();
      payor.contactId = this.transactionVM.patientId;
      payor.fullName = this.transactionVM.patientName;
      this.payors.push(payor);
      this.changeDetectorRef.detectChanges();
    });
  }

  reallocate(sendToPZ: boolean) {
    this.spinnerService.start();
    this.invoiceVM = new InvoiceDataModel();
    const selectedSite = this.siteStore.getSelectedSite();
    this.invoiceVM.status = 'Issued';
    this.invoiceVM.siteId = this.siteId;
    this.invoiceVM.parentId = this.invoiceId;
    this.invoiceVM.patientId = this.transactionVM.patientId;
    this.invoiceVM.totalGross = this.transactionVM.invoiceTotal;
    this.invoiceVM.siteRef = selectedSite.siteRef;
    // this.invoiceVM.payorType = "Payor";
    // GD need to work out what this should be
    this.invoiceVM.fullName = this.transactionVM.patientName;
    this.invoiceVM.recipientId = this.payorSelected.contactId;
    this.invoiceVM.invoiceNumber = this.transactionVM.invoiceNumber;
    this.invoiceVM.totalNett = this.outstandingBalance;

    this.invoiceVM.invoiceEpisode = new InvoiceAppointmentDetailsDataModel();

    this.subscription.add(this.billingService.reallocateInvoiceAmount(this.invoiceVM, this.shortfallLetter,
      sendToPZ).subscribe(value => {
        if (value.isSuccess && value.statusCode === StatusCode.success) {
          notify('Invoice Created', 'success');
          this.showRedistributePopup = false;
          this.getTransactions();
          this.spinnerService.stop();
        }

        if (!value.isSuccess) {
          this.spinnerService.stop();
          notify('An error occurred', 'error');
        }
      },
        error => {
          this.spinnerService.stop();
          notify('An error occurred', 'error');
        }
      ));
  }

  taskSelectedChanged(e) {
    if (e.value === true) {
      this.linkId = 'Invoice';
    }
    else {
      this.linkId = '';
    }
  }

  addToPrintQueue() {
    const model = new PrintQueueViewModel();
    model.patientId = this.patientId;
    this.spinnerService.start();
    this.subscription.add(this.printService.addToPrintQueue(model).subscribe(data => {
      this.spinnerService.stop();
    },
      error => {
        this.spinnerService.stop();
      }));
  }

  print() { }
}
