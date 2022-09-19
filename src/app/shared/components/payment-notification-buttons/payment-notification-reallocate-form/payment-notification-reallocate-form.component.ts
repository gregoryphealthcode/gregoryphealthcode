import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { InvoiceAddEditStoreService } from "src/app/pages/accounts/invoice-add-edit/invoice-add-edit-store.service";
import { GetInvoicePayorResponseModel } from "src/app/pages/accounts/invoice-add-edit/invoice-add-edit.service";
import { InvoicePaymentNotificationsService } from "src/app/pages/accounts/invoice-add-edit/invoice-payment-notifications/invoice-payment-notifications.service";
import { ReactiveFormBase } from "src/app/shared/base/reactiveForm.base";
import { AppInfoService } from "src/app/shared/services/app-info.service";

@Component({
  selector: "app-payment-notification-reallocate-form",
  templateUrl: "./payment-notification-reallocate-form.component.html",
  styleUrls: ["./payment-notification-reallocate-form.component.scss"],
})
export class PaymentNotificationReallocateFormComponent extends ReactiveFormBase implements OnInit {
  @Input() patientId: string;

  @Input() set paymentNotification(value: any) {
    if (value && value.id) {
      this._invoicePaymentId = value.id;
      this.maxAmount = value.maxAmount;
      this.invoiceNo = value.invoiceNo;
      this.payorId = value.payorId;
      this.setupForm();
      this.show = true;
    }
  }
  get invoicePaymentId() {
    return this._invoicePaymentId;
  }
  private _invoicePaymentId: string;

  public show: boolean;
  public maxAmount: number;
  public invoiceNo: string;
  public payorId: string;

  protected httpRequest = (x: any) => this.dataService.reallocate(x);

  constructor(
    private formBuilder: FormBuilder,
    private dataService: InvoicePaymentNotificationsService,
    private store: InvoiceAddEditStoreService,
    public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit() {
    this.onSuccessfullySaved = x => {
      this.store.notificationsUpdate(true);
      this.showSuccessMessage("Payment has been reallocated");
      this.show = false;
      this.saved.emit(x);
    }
  }

  payorSelectedHandler(payor: GetInvoicePayorResponseModel) {
    this.setFormPropertyValue('payorTypeId', payor.type);
  }

  private setupForm() {
    this.editForm = this.formBuilder.group({
      id: [this.invoicePaymentId, Validators.required],
      payorId: [undefined, Validators.required],
      amount: [(Math.round(this.maxAmount * 100) / 100).toFixed(2), Validators.min(1)],
      payorTypeId: [undefined, Validators.required]
    });
  }
}
