import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GenericResponse, GenericResponseModel } from "src/app/shared/models/GenericResponseModel";
import { environment } from "src/environments/environment";
import { InvoicePayorTypeEnum } from "../invoice-add-edit.service";

@Injectable({
  providedIn: "root",
})
export class InvoicePaymentNotificationsService {
  constructor(
    private http: HttpClient
  ) {

  }

  public getAll(invoiceId: string): Observable<GetInvoicePaymentNotificationsResponseModel[]> {
    const url = `${environment.baseurl}/invoicePaymentNotification/getAll?invoiceId=${invoiceId}`;
    return this.http.get<GetInvoicePaymentNotificationsResponseModel[]>(url);
  }

  public addPaymentNotification(model: RecordPaymentForPaymentNotificationRequest): Observable<GenericResponseModel<ShortfallResponse>> {
    const url = `${environment.baseurl}/invoicePaymentNotification/addPaymentAllocation`;
    return this.http.post<GenericResponseModel<ShortfallResponse>>(url, model);
  }

  public processShortfalls(model: ShortfallProcessModel): Observable<GenericResponseModel<ShortfallResponse>> {
    const url = `${environment.baseurl}/invoicePaymentNotification/processShortfalls`;
    return this.http.post<GenericResponseModel<ShortfallResponse>>(url, model);
  }

  public recordTransaction(model: RecordPaymentForPaymentNotificationRequest): Observable<GenericResponse> {
    const url = `${environment.baseurl}/invoicePaymentNotification/recordTransaction`;
    return this.http.put<GenericResponse>(url, model);
  }

  public reallocate(model: ReallocatePaymentNotificationRequest): Observable<GenericResponse> {
    const url = `${environment.baseurl}/invoicePaymentNotification/reallocatePayment`;
    return this.http.put<GenericResponse>(url, model);
  }
}

export class ShortfallResponse {
  correspondenceId: string; 
}

export class ShortfallProcessModel {
  shortfalls: PaymentNotificationModel[];
}

export class PaymentNotificationModel {
  invoiceId: string;
  payorId: string;
  payorTypeId: number;
  originalPayorType: string;
  amount: number;
  bulkPaymentTransactionId: string;
  templateId: string;
  sendViaPatientzone: boolean;
}

export interface GetInvoicePaymentNotificationsResponseModel {
  id: string;
  payorId: string;
  payorDisplayName: string;
  initialAmount: number;
  paidAmount: number;
  reallocatedAmount: number;
  leftAmount: number;
  status: string;
  payorType: string;
  remindersCount: number;
  lastReminderDate: string | null;
  created: string | null;
}

export interface RecordPaymentForPaymentNotificationRequest {
  id: string;
  amount: number;
  methodId: GluTransactionMethodTypesEnum;
  comments: string;
}

export interface ReallocatePaymentNotificationRequest {
  id: string;
  payorId: string;
  payorTypeId: InvoicePayorTypeEnum;
  amount: number;
}

export enum GluTransactionMethodTypesEnum {
  BACS = 1,
  Cash = 2,
  Cheque = 3,
  CreditCard = 4,
  CreditDebitCard = 5,
  DebitCard = 6,
  OnlineCardPayment = 7,
  PostalOrder = 8,
  Transfer = 9,
  Writeoff = 10
}