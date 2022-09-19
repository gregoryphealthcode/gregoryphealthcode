import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { EMPTY, of } from "rxjs";
import { filter, switchMap, tap } from "rxjs/operators";
import { ReactiveFormBase } from "src/app/shared/base/reactiveForm.base";
import { InvoiceServicesStoreService } from "src/app/shared/components/invoice-services-select/invoice-services-store.service";
import { requiredIfValidator } from "src/app/shared/helpers/form-helper";
import { AppMessagesService } from "src/app/shared/services/app-messages.service";
import { BillingService, GetInvoiceTransactionResponseModel, GluTransactionTypesEnum } from "src/app/shared/services/billing.service";
import { DocumentsStoreService } from "src/app/shared/services/documents-store.service";
import { GenericViewModel, UserService, } from "src/app/shared/services/user.service";
import { SitesStore } from "src/app/shared/stores/sites.store";
import { UserStore } from "src/app/shared/stores/user.store";
import { InvoiceAddEditStoreService } from "../../invoice-add-edit-store.service";
import { GetInvoicePayorResponseModel, InvoiceAddEditService } from "../../invoice-add-edit.service";
import { GetInvoicePaymentNotificationsResponseModel, InvoicePaymentNotificationsService } from "../../invoice-payment-notifications/invoice-payment-notifications.service";

@Component({
  selector: "app-invoice-transactions-add",
  templateUrl: "./invoice-transactions-add.component.html",
  styleUrls: ["./invoice-transactions-add.component.scss"],
})
export class InvoiceTransactionsAddComponent extends ReactiveFormBase implements OnInit {
  @Input() invoiceId: string;
  @Input() transactions: GetInvoiceTransactionResponseModel[];

  public transType: GenericViewModel[] = [];
  public methods: GenericViewModel[] = [];
  public payors: GetInvoicePayorResponseModel[];
  public patientId: string;
  public showChooseNotification: boolean;
  public showNoNotificationsFound: boolean;
  public chooseIfFromNotification = false;
  public showForm: boolean;
  public notifications: GetInvoicePaymentNotificationsResponseModel[];
  public allNotifications: GetInvoicePaymentNotificationsResponseModel[];
  public selectedNotification: GetInvoicePaymentNotificationsResponseModel;
  public payorLabel = "Payor";
  public invoiceTotal: number;
  public outstanding: number;
  public showSub = false;

  public fromNotification = "No";
  public options = [
    "Yes",
    "No"
  ];

  public transType1 = [
    { id: 1, description: "Payment" },
    { id: 2, description: "Credit Note" },
    { id: 3, description: "Refund" },
    { id: 4, description: "Adjustment" },
    { id: 5, description: "Overpayment" },
  ];
  public filteredTransType1;
  public transType2 = [

  ];

  public min;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private siteStore: SitesStore,
    public store: InvoiceAddEditStoreService,
    private payorsService: InvoiceAddEditService,
    private paymentNotificationsService: InvoicePaymentNotificationsService,
    private billingService: BillingService,
    private serviceStore: InvoiceServicesStoreService,
    private documentsService: DocumentsStoreService,
    public userStore: UserStore,
    public appMessage: AppMessagesService
  ) {
    super();
  }

  protected httpRequest = (x: any) => this.request$(x);

  ngOnInit() {
    this.min = this.store.invoiceDate;

    this.addToSubscription(this.serviceStore.services$.pipe(tap(x => {
      let services = x;
      if (x) {
        this.invoiceTotal = services.reduce((a, b) => a + b.fee, 0);
        this.outstanding = this.invoiceTotal;
        this.transactions.forEach(transaction => {
          if (transaction.transactionType == 'Payment')
            this.outstanding -= transaction.amount;
        })
      }
    })));

    this.setupForm();
    this.addToSubscription(
      this.userService.getTransactionTypes().pipe(
        tap((x) => {
          this.transType = x.filter(y => y.description != "Invoice");
        })
      )
    );

    this.addToSubscription(
      this.userService.getPaymentMethodTypes().pipe(
        tap((x) => {
          this.methods = x;
        })
      )
    );

    this.addToSubscription(
      this.store.patientId$.pipe(
        switchMap((x) => {
          if (x) {
            return this.payorsService.getPayors(x);
          }
          return EMPTY;
        }),
        tap((x) => {
          if (x) {
            this.payors = x;
          }
        })
      )
    );

    this.addToSubscription(
      this.store.patientId$.pipe(
        tap(x => this.patientId = x)
      )
    )

    this.addToSubscription(
      this.store.notificationsChanged$.pipe(
        tap(x =>
          this.getPayors()
        )
      )
    )

    this.subscription.add(this.editForm.get('notificationId').valueChanges.subscribe(x => {
      if (x) {
        const notification = this.notifications.find(y => y.id === x);
        this.setFormPropertyValue('payorId', notification?.payorId);
        if (!this.submitting) {
          this.setFormPropertyValue('amountPaid', notification.leftAmount);
          this.setFormPropertyValue('transactionTypeId', GluTransactionTypesEnum.Payment);
          this.filteredTransType1 = this.transType1;
          if (notification.leftAmount == notification.initialAmount) {
            this.filteredTransType1 = this.transType1.filter(x => x.description != 'Refund');
          }
        }
      }
    }))


    this.subscription.add(this.editForm.get("transactionTypeId1").valueChanges.subscribe(value => {
      this.showSub = false;
      this.payorLabel = "Payor";
      if (!this.submitting) {
        switch (value) {
          case 1:
            this.editForm.patchValue({ transactionTypeId: this.transType.find(x => x.description == "Payment")?.uniqueNo });
            break;
          case 2:
            this.editForm.patchValue({ transactionTypeId: this.transType.find(x => x.description == "Credit Note")?.uniqueNo });
            break;
          case 3:
            this.editForm.patchValue({ transactionTypeId: this.transType.find(x => x.description == "Refund")?.uniqueNo });
            this.payorLabel = "Payee";
            break;
          case 4:
            this.showSub = true;
            this.transType2 = [];
            this.transType2.push({ id: 41, description: "Credit" })
            this.transType2.push({ id: 42, description: "Debit" })
            this.transType2.push({ id: 43, description: "Write-Off" })

            this.editForm.patchValue({ methodId: 11 });
            break;
          case 5:
            this.transType2 = [];
            this.transType2.push({ id: 51, description: "Credit" })
            this.transType2.push({ id: 52, description: "Debit" })
            this.showSub = true;
            this.editForm.patchValue({ methodId: 11 });
            break;
        }
      }
    }))

    this.subscription.add(this.editForm.get("transactionTypeId2").valueChanges.subscribe(value => {
      if (!this.submitting) {
        if (this.userStore.isMedSecUser()) {
          this.editForm.patchValue({ methodId: null });
        }
        switch (value) {
          case 41:
            this.editForm.patchValue({ transactionTypeId: this.transType.find(x => x.description == "Adjustment Credit")?.uniqueNo });
            if (this.userStore.isMedSecUser()) {
              this.editForm.patchValue({ methodId: this.methods.find(x => x.description == "N/A")?.uniqueNo });
            }
            break;
          case 42:
            this.editForm.patchValue({ transactionTypeId: this.transType.find(x => x.description == "Adjustment Debit")?.uniqueNo });
            if (this.userStore.isMedSecUser()) {
              this.editForm.patchValue({ methodId: this.methods.find(x => x.description == "N/A")?.uniqueNo });
            }
            break;
          case 43:
            this.editForm.patchValue({ transactionTypeId: this.transType.find(x => x.description == "Write-Off")?.uniqueNo });
            this.editForm.patchValue({ methodId: this.methods.find(x => x.description == "N/A")?.uniqueNo });
            break;
          case 51:
            this.editForm.patchValue({ transactionTypeId: this.transType.find(x => x.description == "Overpayment Credit")?.uniqueNo });
            if (this.userStore.isMedSecUser()) {
              this.editForm.patchValue({ methodId: this.methods.find(x => x.description == "N/A")?.uniqueNo });
            }
            break;
          case 52:
            this.editForm.patchValue({ transactionTypeId: this.transType.find(x => x.description == "Overpayment Debit")?.uniqueNo });
            if (this.userStore.isMedSecUser()) {
              this.editForm.patchValue({ methodId: this.methods.find(x => x.description == "N/A")?.uniqueNo });
            }
            break;
        }
      }
    }))
  }

  getPayors() {
    this.paymentNotificationsService.getAll(this.invoiceId).subscribe(x => {
      x.forEach(el =>
        el.leftAmount = el.initialAmount - el.paidAmount - el.reallocatedAmount
      );

      this.allNotifications = x;
      x = x.filter(y => y.status == "Outstanding" || y.status == "Overdue");
      this.notifications = x;
    });
  }

  onNotificationChanged(e) {
    if (e.value == "Yes") {
      this.chooseIfFromNotification = true;
      this.getNotifiedPayors();
    }
    else {
      this.chooseIfFromNotification = false;
      this.setFormPropertyValue('notificationId', undefined);
    }
  }

  private request$(data: any) {  
    if (data.notificationId) {
      const payor = this.payors.find(x => x.payorId == data.payorId);

      return this.billingService.saveTransaction(data).pipe(switchMap(x => {
        if (x.data.correspondenceId) {
          if (data.amountPaid < this.outstanding && payor.type == 1) {
            let model = {
              id: data.notificationId,
              payorId: data.payorId,
              payorDisplayName: payor.displayName,
              initialAmount: this.invoiceTotal,
              paidAmount: this.invoiceTotal - this.outstanding,
              reallocatedAmount: 0,
              leftAmount: this.outstanding - data.amountPaid,
              status: "",
              payorType: "",
              remindersCount: 0,
              lastReminderDate: null,
              created: null,
            }

            const callback = () => {
              this.store.setNeedsReallocation(model);
            };

            const cancelCallback = () => {}

            this.appMessage.showAskForConfirmationModal("Reallocate Shortfall", "There is a shortfall. Do you want to allocate this?", callback, cancelCallback);
          }

          return this.documentsService.openPdfInPopup({ correspondenceId: x.data.correspondenceId });
        }
        return of(true);
      }));
    }

    
  }

  private getNotifiedPayors() {
    this.showChooseNotification = true;
  }

  private setupForm() {
    this.editForm = this.formBuilder.group({
      invoiceId: [this.invoiceId, Validators.required],
      payorId: [this.store.getPayorId],
      notificationId: [undefined, Validators.required],
      transactionTypeId: [undefined, Validators.required],
      transactionTypeId1: [undefined, Validators.required],
      transactionTypeId2: [undefined],
      methodId: [undefined, requiredIfValidator(() => !this.showSub)],
      transactionDate: [this.min],
      comments: [undefined, Validators.maxLength(500)],
      amountPaid: [null, Validators.min(0)],
    });
  }
}
