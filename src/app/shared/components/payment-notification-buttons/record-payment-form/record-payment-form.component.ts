import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { InvoiceAddEditStoreService } from 'src/app/pages/accounts/invoice-add-edit/invoice-add-edit-store.service';
import { GetInvoicePayorResponseModel } from 'src/app/pages/accounts/invoice-add-edit/invoice-add-edit.service';
import { InvoicePaymentNotificationsService } from 'src/app/pages/accounts/invoice-add-edit/invoice-payment-notifications/invoice-payment-notifications.service';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { GenericViewModel, MethodTypeModel, UserService } from 'src/app/shared/services/user.service';
import { UserStore } from 'src/app/shared/stores/user.store';

@Component({
  selector: 'app-record-payment-form',
  templateUrl: './record-payment-form.component.html',
  styleUrls: ['./record-payment-form.component.scss']
})
export class RecordPaymentFormComponent extends ReactiveFormBase implements OnInit {
@Input() set paymentNotification(value: any) {
  if (value && value.id) {
    this._invoicePaymentId = value.id;
    this.maxAmount = value.maxAmount;
    this.setupForm();
    this.show = true;
  }
}
get invoicePaymentId() {
  return this._invoicePaymentId;
}
private _invoicePaymentId: string;

public methods: MethodTypeModel[] = [];
public show: boolean;
public maxAmount: number;
public min;

protected httpRequest = (x: any) => this.dataService.recordTransaction(x);

constructor(
  private formBuilder: FormBuilder,
  private dataService: InvoicePaymentNotificationsService,
  private siteService: UserService,
  public userStore: UserStore,
  private store: InvoiceAddEditStoreService,
  public appInfo: AppInfoService
  ) {
  super();
}

ngOnInit() {
  this.min = this.store.invoiceDate;
  this.successMessage = "Payment has been successfully recorded and transaction created."

  this.onSuccessfullySaved = x=>{
    this.showSuccessMessage(this.successMessage);
    this.show = false;
    this.saved.emit(x);
  }

  this.addToSubscription(this.getMethodTypes$())
}

protected getMethodTypes$(){
  return this.siteService.getPaymentMethodTypes()
  .pipe(tap(x=> {this.methods = x}))
}

payorSelectedHandler(payor:GetInvoicePayorResponseModel){
  this.setFormPropertyValue('payorTypeId', payor.type);
}

private setupForm() {
  this.editForm = this.formBuilder.group({
    id: [this.invoicePaymentId],
    methodId: [undefined, Validators.required],
    amount: [undefined, [Validators.required, Validators.min(1)]],
    transactionDate: [this.min, Validators.required],    
    comments: [undefined, Validators.required]
  });
}
}
