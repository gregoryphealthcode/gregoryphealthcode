import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppointmentViewModel } from './appointment.service';
import { StatusCode, } from '../../_helpers/StatusCode';
import { environment } from 'src/environments/environment';
import { PatientDetails } from './app-info.service';
import { ProcedureCodesViewModel } from '../models/ProcedureCodesViewModel';
import { DocumentTemplateViewModel, PayeeProviderModel } from './sites.service';
import { GenericResponse, GenericResponseModel } from '../models/GenericResponseModel';
import { FileModel } from '../helpers/file';
import Guid from 'devextreme/core/guid';
import { GluTransactionMethodTypesEnum } from 'src/app/pages/accounts/invoice-add-edit/invoice-payment-notifications/invoice-payment-notifications.service';
import { AddInvoiceResponseModel, SendInvoiceResponseModel } from 'src/app/pages/accounts/invoice-add-edit/invoice-add-edit.service';
import { ResponseModel } from '../models/ResponseModel';

@Injectable()
export class BillingService {
  public selectedCreditControlRecord: any;

  constructor(private router: Router, private http: HttpClient) {
    this.selectedCreditControlRecord = null;
  }

  public getAppointmentsForBilling(siteId: string): Observable<AppointmentViewModel[]> {
    const url = `${environment.baseurl}/billing/getAppointmentsForBilling/${siteId}`;
    return this.http.get<AppointmentViewModel[]>(url);
  }

  public saveInvoice(model: InvoiceDataModel): Observable<BillingResponseModel> {
    const url = `${environment.baseurl}/billing/saveInvoice`;
    return this.http.post<BillingResponseModel>(url, model);
  }

  public getInvoicesByType(type: number): Observable<InvoiceDataModel[]> {
    const url = `${environment.baseurl}/billing/getInvoicesByType/${type}`;
    return this.http.get<InvoiceDataModel[]>(url);
  }

  public removeInvoiceDiagnosis(model: InvoiceDiagnosisDataModel): Observable<BillingResponseModel> {
    const url = `${environment.baseurl}/billing/removeInvoiceDiagnosis`;
    return this.http.post<BillingResponseModel>(url, model);
  }

  public getInvoice(invoiceId: string): Observable<InvoiceDataModel> {
    const url = `${environment.baseurl}/billing/getInvoice/${invoiceId}`;
    return this.http.get<InvoiceDataModel>(url);
  }

  public getUnsettledPayorInvoices(): Observable<CreditControlListViewModel[]> {
    const url = `${environment.baseurl}/billing/getUnsettledPayorInvoices`;
    return this.http.get<CreditControlListViewModel[]>(url);
  }

  public getTransactions(invoiceId: string): Observable<GetInvoiceTransactionResponseModel[]> {
    const url = `${environment.baseurl}/billing/getTransactions?invoiceId=${invoiceId}`;
    return this.http.get<GetInvoiceTransactionResponseModel[]>(url);
  }

  public getInvoiceTransactions(invoiceId: string): Observable<GetInvoiceTransactionResponseModel[]> {
    const url = `${environment.baseurl}/billing/${invoiceId}/transactions`;
    return this.http.get<GetInvoiceTransactionResponseModel[]>(url);
  }

  public saveTransaction(model: TransactionDetail): Observable<GenericResponseModel<SendInvoiceResponseModel>> {
    const url = `${environment.baseurl}/billing/saveTransaction`;
    return this.http.post<GenericResponseModel<SendInvoiceResponseModel>>(url, model);
  }

  public createTransactionReceipt(transactionId: string): Observable<GenericResponseModel<SendInvoiceResponseModel>> {
    const url = `${environment.baseurl}/transactions/createTransactionReceipt`;
    return this.http.post<GenericResponseModel<SendInvoiceResponseModel>>(url, { transactionId });
  }

  public generateTransactionReceipts(dateFrom: Date, dateTo: Date): Observable<GenericResponseModel<number>> {
    const url = `${environment.baseurl}/transactions/generateTransactionReceipts`;
    return this.http.post<GenericResponseModel<number>>(url, { dateFrom, dateTo });
  }

  public getInvoiceTaskTypes(): Observable<TaskTypeModel[]> {
    const url = `${environment.baseurl}/invoiceTasks/getTaskTypes`;
    return this.http.get<TaskTypeModel[]>(url);
  }

  public getInvoiceTaskDetails(id): Observable<InvoiceTaskModel> {
    const url = `${environment.baseurl}/invoiceTasks/${id}`;
    return this.http.get<InvoiceTaskModel>(url);
  }

  public getInvoiceTasks(invoiceId: string): Observable<InvoiceTaskModel[]> {
    const url = `${environment.baseurl}/invoiceTasks/getAll/${invoiceId}`;
    return this.http.get<InvoiceTaskModel[]>(url);
  }

  public addInvoiceTask(model: InvoiceTaskModel): Observable<string> {
    const url = `${environment.baseurl}/invoiceTasks/`;
    return this.http.post<string>(url, model);
  }

  public updateInvoiceTask(model: InvoiceTaskModel): Observable<string> {
    const url = `${environment.baseurl}/invoiceTasks/`;
    return this.http.put<string>(url, model);
  }

  public deleteInvoiceTask(taskId: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/invoiceTasks/${taskId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public reallocateInvoiceAmount(model: InvoiceDataModel, letterTemplate: string, wasSentToPatientZone: boolean): Observable<BillingResponseModel> {
    const url = `${environment.baseurl}/billing/reallocateInvoiceAmount?wasPatientZone=${wasSentToPatientZone}&templateName=${letterTemplate}`;
    return this.http.post<BillingResponseModel>(url, model);
  }

  public reallocateBulkInvoiceAmount(model: InvoiceDataModel, templateId: string, sendToPZ = false): Observable<BillingResponseModel> {
    const url = `${environment.baseurl}/bulkPayments/reallocateBulkInvoiceAmount?sendToPZ=${sendToPZ}&templateId=${templateId}`;
    return this.http.post<BillingResponseModel>(url, model);
  }

  public deleteInvoice(invoiceId: string) {
    const url = `${environment.baseurl}/billing/deleteInvoice/${invoiceId}`;
    return this.http.delete(url);
  }

  public getOutstandingInvoices(payorId: string): Observable<OutstandingInsurerInvoicesViewModel[]> {
    const url = `${environment.baseurl}/billing/getOutstandingInvoices?payorId=${payorId}`;
    return this.http.get<OutstandingInsurerInvoicesViewModel[]>(url);
  }

  public updateBulkPayment(model: any): Observable<GenericResponse> {
    const url = `${environment.baseurl}/bulkPayments/`;
    return this.http.put<GenericResponse>(url, model);
  }

  public addBulkPayment(model: any): Observable<GenericResponseModel<string>> {
    const url = `${environment.baseurl}/bulkPayments`;
    return this.http.post<GenericResponseModel<string>>(url, model);
  }

  public saveAllocationPayment(model: BulkPaymentAddAllocationRequest): Observable<GenericResponse> {
    const url = `${environment.baseurl}/bulkPayments/allocatePayment/`;
    return this.http.post<GenericResponse>(url, model);
  }

  public processBulkPaymentTransactions(model: BulkPaymentAddAllocationRequest): Observable<GenericResponse> {
    const url = `${environment.baseurl}/bulkPayments/processBulkPaymentTransactions/`;
    return this.http.post<GenericResponse>(url, model);
  }

  public editAllocationPayment(bulkPaymentTransactionId: string, allocation: number, comments: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/bulkPayments/editPaymentAllocation/`;
    return this.http.put<GenericResponse>(url, { bulkPaymentTransactionId: bulkPaymentTransactionId, allocation: allocation, comments: comments });
  }

  public removeAllocationPayment(bulkPaymentTransactionId: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/bulkPayments/deleteBulkPaymentAllocation/${bulkPaymentTransactionId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public increaseBulkPaymentTotal(bulkPaymentId: string, ammountToIncrease: number): Observable<GenericResponse> {
    const url = `${environment.baseurl}/bulkPayments/increaseBulkPaymentTotal`;
    return this.http.put<GenericResponse>(url, { bulkPaymentId, ammountToIncrease });
  }

  public getBulkPayment(bulkPaymentId: string): Observable<BulkPaymentViewModel> {
    const url = `${environment.baseurl}/bulkPayments/${bulkPaymentId}`;
    return this.http.get<BulkPaymentViewModel>(url);
  }

  public getBulkPaymentShortFalls(bulkPaymentId: string): Observable<GetBulkPaymentShortFallsViewModel[]> {
    const url = `${environment.baseurl}/bulkPayments/getShortFalls/${bulkPaymentId}`;
    return this.http.get<GetBulkPaymentShortFallsViewModel[]>(url);
  }

  public generateShortfallLetters(templateId: string): Observable<GenericResponseModel<number>> {
    const url = `${environment.baseurl}/bulkPayments/generateShortfallLetters`;
    return this.http.post<GenericResponseModel<number>>(url, { templateId });
  }

  public getBulkPaymentTransactions(bulkPaymentId: string): Observable<PaymentAllocationViewModel[]> {
    const url = `${environment.baseurl}/bulkPayments/getBulkPaymentTransactions/${bulkPaymentId}`;
    return this.http.get<PaymentAllocationViewModel[]>(url);
  }

  public generateBulkPaymentReceipt(bulkPaymentId: string): Observable<GenericResponseModel<string>> {
    const url = `${environment.baseurl}/bulkPayments/generateBulkPaymentReceipt`;
    return this.http.put<GenericResponseModel<string>>(url, { bulkPaymentId });
  }

  public deleteBulkPayment(bulkPaymentId: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/bulkPayments/${bulkPaymentId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public getInvoiceItems(invoiceId: string): Observable<InvoiceLineItemViewModel[]> {
    const url = `${environment.baseurl}/billing/getInvoiceItems/${invoiceId}`;
    return this.http.get<InvoiceLineItemViewModel[]>(url);
  }

  public getInvoicePdf(invoiceId: string): Observable<FileModel> {
    const uri = `${environment.baseurl}/invoice/getPdf?id=${invoiceId}`;
    return this.http.get<FileModel>(uri);
  }

  public getInvoiceEpisode(invoiceId: string): Observable<InvoiceAppointmentDetailsDataModel> {
    const url = `${environment.baseurl}/billing/getInvoiceEpisode?invoiceId=${invoiceId}`;
    return this.http.get<InvoiceAppointmentDetailsDataModel>(url);
  }

  public submitReallocationToPatientZone(model: OutstandingInsurerInvoicesViewModel): Observable<BillingResponseModel> {
    const url = `${environment.baseurl}/billing/submitReallocationToPatientZone`;
    return this.http.post<BillingResponseModel>(url, model);
  }

  public generateReallocationDocuments(model: OutstandingInsurerInvoicesViewModel, sendToPz: boolean, templateName: string): Observable<boolean> {
    const url = `${environment.baseurl}/billing/generateReallocationDocuments?sendToPz=${sendToPz}&templateName=${templateName}`;
    return this.http.post<boolean>(url, model);
  }

  public submitCreditNoteToPatientZone(model: PatientZoneCreditNoteViewModel): Observable<BillingResponseModel> {
    const url = `${environment.baseurl}/billing/submitCreditNoteToPatientZone`;
    return this.http.post<BillingResponseModel>(url, model);
  }

  public checkInvoiceNumberUnique(siteId: string, invoiceNumber: string): Observable<BillingResponseModel> {
    const url = `${environment.baseurl}/billing/checkInvoiceNumber/${siteId}/${invoiceNumber}`;
    return this.http.get<BillingResponseModel>(url);
  }

  public saveInvoiceItem(model: InvoiceLineItemViewModel): Observable<InvoiceLineItemViewModel[]> {
    const url = `${environment.baseurl}/billing/saveInvoiceItem`;
    return this.http.post<InvoiceLineItemViewModel[]>(url, model);
  }

  public saveInvoiceItems(model: InvoiceLineItemViewModel[]): Observable<InvoiceLineItemViewModel[]> {
    const url = `${environment.baseurl}/billing/saveInvoiceItems`;
    return this.http.post<InvoiceLineItemViewModel[]>(url, model);
  }

  public deleteService(invoiceItemId: string) {
    const url = `${environment.baseurl}/billing/deleteService/${invoiceItemId}`;
    return this.http.delete(url);
  }

  public deleteProcedure(invoiceItemId: string) {
    const url = `${environment.baseurl}/billing/deleteProcedure/${invoiceItemId}`;
    return this.http.delete(url);
  }

  public getServiceItems(invoiceItemId: string): Observable<ServiceItemsViewModel> {
    const url = `${environment.baseurl}/billing/getInvoiceServiceDetails/${invoiceItemId}`;
    return this.http.get<ServiceItemsViewModel>(url);
  }

  public updateInvoiceItems(model: InvoiceLineItemViewModel[]): Observable<InvoiceLineItemViewModel[]> {
    const url = `${environment.baseurl}/billing/updateInvoiceItems`;
    return this.http.post<InvoiceLineItemViewModel[]>(url, model);
  }

  public getInvoiceCounts(): Observable<InvoiceCountsModel> {
    const url = `${environment.baseurl}/billing/getInvoiceCounts`;
    return this.http.get<InvoiceCountsModel>(url);
  }

  public getAppointmentsForBillingCount(): Observable<number> {
    const url = `${environment.baseurl}/billing/getAppointmentsForBillingCount`;
    return this.http.get<number>(url);
  }

  public setInvoiceAsSent(invoiceId: Guid): Observable<GenericResponse> {
    const url = `${environment.baseurl}/billing/setInvoiceAsSent`;
    return this.http.post<GenericResponse>(url, { id: invoiceId });
  }

  public getCreditControl(band: string): Observable<CreditControlModel[]> {
    const url = `${environment.baseurl}/billing/getCreditControl`;
    return this.http.get<CreditControlModel[]>(url);
  }

  public getPayors(type: string, subType?: string): Observable<PayorModel[]> {
    const url = `${environment.baseurl}/billing/getPayors?type=${type}&&subType=${subType}`;
    return this.http.get<PayorModel[]>(url);
  }

  public getRelatedPayors(patientId: string, type: number): Observable<PayorModel[]> {
    const url = `${environment.baseurl}/billing/getRelatedPayors?patientId=${patientId}&&type=${type}`;
    return this.http.get<PayorModel[]>(url);
  }

  public getPayeeProvider(): Observable<GenericResponseModel<PayeeProviderModel>> {
    const url = `${environment.baseurl}/billing/getPayeeProviders`;
    return this.http.get<GenericResponseModel<PayeeProviderModel>>(url);
  }

  public checkPayeeProviderTreatments(): Observable<GenericResponseModel<boolean>> {
    const url = `${environment.baseurl}/billing/checkPayeeProviderTreatments`;
    return this.http.get<GenericResponseModel<boolean>>(url);
  }

  public searchAutoPopClaims(model: any): Observable<AutoPopClaimModel[]> {
    const url = `${environment.baseurl}/billing/searchAutoPopClaims?treatmentHospital=${model.treatmentHospital}&&treatmentDate=${model.treatmentDate}&&lastName=${model.lastName}&&birthDate=${model.birthDate}`;
    return this.http.get<AutoPopClaimModel[]>(url);
  }

  public downloadAutoPopClaim(model: AutoPopClaimModel): Observable<ResponseModel> {
    const url = `${environment.baseurl}/billing/downloadAutoPopClaim`;
    return this.http.post<ResponseModel>(url, { model });
  }

  public getAutoPopInvoicesFromApi(): Observable<ResponseModel> {
    const url = `${environment.baseurl}/billing/getAutoPopInvoicesFromApi`;
    return this.http.get<ResponseModel>(url);
  }

  public getAutoPopPatientDetails(id: string): Observable<AutoPopModel> {
    const url = `${environment.baseurl}/billing/getAutoPopPatientDetails?id=${id}`;
    return this.http.get<AutoPopModel>(url);
  }

  public getAutoPopInvoiceDetails(id: string): Observable<AutoPopInvoiceModel> {
    const url = `${environment.baseurl}/billing/getAutoPopInvoiceDetails?id=${id}`;
    return this.http.get<AutoPopInvoiceModel>(url);
  }

  public createAutoPopInvoice(id: string, patientId: string): Observable<GenericResponseModel<AddInvoiceResponseModel>> {
    const url = `${environment.baseurl}/billing/createAutoPopInvoice`;
    return this.http.post<GenericResponseModel<AddInvoiceResponseModel>>(url, { id: id, patientId: patientId });
  }
}

export class AutoPopModel {
  id: string;
  patientId: string;
  patientFirstName: string;
  patientLastName: string;
  patientGender: string;
  patientBirthDate: Date;
  patientAddressLine1: string;
  patientAddressLine2: string;
  patientAddressLine3: string;
  patientAddressLine4: string;
  patientPostcode: string;
  insurerId: string;
  insurerName: string;
  insurerMembershipNumber: string;
  insurerPolicyLapse: Date;
}

export class AutoPopClaimModel extends AutoPopModel {
  dateAdded: Date;
  claimId: string;
  siteId: string;
  practitionerFirstName: string;
  practitionerLastName: string;
  practitionerAddressLine1: string;
  practitionerAddressLine2: string;
  practitionerAddressLine3: string;
  practitionerAddressLine4: string;
  practitionerPostcode: string;
  episodeType: string;
  episodeDate: Date;
}

export class AutoPopInvoiceModel {
  siteId: Guid;
  episodeType: string;
  episodeDate: Date;
  episodeEndDate: Date;
  episodeOwner: string;
  service: AutoPopServiceModel[];
}

export class PayeeProviderTreatmentModel {
  treatmentId: string;
  code: string;
  description: string;
}

export class AutoPopServiceModel {
  id: string;
  quantity: number;
  total: number;
}

export interface BulkPaymentAddAllocationRequest {
  bulkPaymentId: string;
  allocations: BulkPaymentAddAllocationModel[];
}

export interface BulkPaymentAddAllocationModel {
  invoiceId: string;
  bulkPaymentTransactionId?: string;
  allocation: number;
}

export class PatientZoneCreditNoteViewModel {
  grossAmount: number;
  vATAmount: number;
  netAmount: number;
  pzTransactionRef: string;
  pZInvoiceRef: string;
  invoiceNumber: string;
  transactionId: string;
}
export class PMIViewModel {
  insurer: string;
  claim: PMIClaimViewModel;
}

export class PMIClaimViewModel {
  patient: PatientDetails;
  invoiceDetail: InvoiceDataModel;
}

export class PaymentAllocationViewModel {
  bulkPaymentTransactionId: string;
  invoiceId: string;
  invoiceNumber: string;
  invoiceType: string;
  invoiceDate: Date | null;
  patientId: string;
  patientName: string;
  invoiceTotal: number | null;
  balanceDue: number | null;
  allocation: number | null;
  allocatedDate: Date | null;
  processed: boolean;
  shortfallAllocated: boolean;
}
export class BulkPaymentViewModel {
  payorType: string;
  dateCreated: Date;
  payorId: string;
  total: number;
  method: string;
  payorRef: string;
  comments: string;
  allocated: number;
  unallocated: number;
  shortfalls: number;
  bulkPaymentId: string;
  siteId: string;
  payorName: string;
  invoiceId: string;
  siteName: string;
  methodId: GluTransactionMethodTypesEnum;
}


export class TransactionDetail {
  notificationId: string;
  siteId: string;
  invoiceNumber: string;
  payorId: string;
  amountPaid: number;
  transactionTypeId: string;
  methodId: string;
  comments: string;
  invoiceId: string;
  transactionDate: Date;
  invoiceTotal: number;
  totalPaid: number;
  payorName: string;
  isWriteOff: boolean;
  patientZoneResponse: string;
  patientId: string;
}

export class TransactionViewModel {
  patientName: string;
  patientId: string;
  invoiceId: string;
  siteId: string;
  payorId: string;
  invoiceNumber: string;
  payorName: string;
  invoiceDate: Date;
  birthDate: Date;
  outstandingBalance: number;
  writeOffBalance: number;
  totalPaid: number;
  invoiceTotal: number;
  writeOffAmount: number;
  transactionLines: TransactionLineViewModel[];
  payorOutstandingViewModel: PayorOutstandingViewModel[];
  invoiceWasSentToPatientZone: boolean;
  patientZoneResponse: string;
  patientTransId: string;
}

export interface GetInvoiceTransactionResponseModel {
  transactionId: string;
  payorName: string;
  transactionDate: string;
  transactionType: string;
  comments: string;
  methodType: string;
  amount: number;
  payorType: string;
}

export class InvoiceTaskModel {
  invoiceId: string;
  invoiceNumber: string;
  invoiceNotificationId: string;
  payorId: string;
  payorName: string;
  taskId: string;
  taskTypeId: number | null;
  taskTypeName: string;
  dueDateTime: Date;
  percentageComplete: number;
  isComplete: boolean;
  note: string;
  createdBy: string;
}

export class TaskTypeModel {
  id: number;
  description: string;
}

export enum GluTransactionTypesEnum {
  Payment = 1,
  OverpaymentCredit = 2,
  AdjustmentCredit = 3,
  CreditNote = 4,
  Refund = 5,
  WriteOff = 6,
  OverpaymentDebit = 7,
  ReallocationCredit = 8,
  ReallocationDebit = 9,
  Invoice = 10,
  ReversalCredit = 11,
  ReversalDebit = 12,
  AdjustmentDebit = 13
}

export class TransactionLineViewModel {
  transactionDate: Date;
  transactionType: string;
  who: string;
  amountPaid: number;
  methodType: string;
}

export class PayorOutstandingViewModel {

  payorId: string;
  payorName: string;
  outstandingBalance: number;
}
export class BulkPaymentAllocationViewModel {
  siteId: string;
  bulkPaymentId: string;
  payorId: string;
  total: number;
  methodId: string;
  payorName: string;
  comments: string;
  bulkPayments: OutstandingInsurerInvoicesViewModel[];
}

export class OutstandingInsurerInvoicesViewModel {
  patientId: string;
  invoiceId: string;
  siteId: string;
  invoiceNumber: string;
  payorName: string;
  invoiceDate: Date;
  totalDue: number;
  balanceDue: number;
  patientName: string;
  allocation: number;
  payorId: string;
  reallocation: boolean;
  status: string;
  sendElectronically: boolean;
  shortfallLetter: any;
  statusCode: StatusCode;
}

export interface GetBulkPaymentShortFallsViewModel {
  bulkPaymentTransactionId: string;
  invoiceNumber: string;
  invoiceId: string;
  siteId: string;
  invoiceDate: string;
  patientId: string | null;
  patientName: string;
  completed: string;
  canBeSent: boolean;
  patientEmail: string;
  patientMobileNo: string;
  patientHasBillingAddress: boolean;
  patientSendViaPatientzone: boolean;
  payorId: string;
  payorName: string;
  totalDue: number | null;
  balanceDue: number | null;
  allocation: number | null;
  shortfallLetter?: DocumentTemplateViewModel;
  reallocation: boolean;
  valid: boolean;
  templateId: string;
  selectedTemplateId: string;
}

export class CreditControlListViewModel {
  band1: number;
  band2: number;
  band3: number;
  band4: number;
  patientId: Guid;
  invoiceId: Guid;
  siteId: Guid;
  invoiceNumber: string;
  payorName: string;
  invoiceDate: Date;
  totalDue: number;
  patientName: string;
  totalGross: number;
  siteName: string;
}

export class InvoiceDataModel {
  patientName: string;
  remainingDue: number;
  status: string;
  siteId: string;
  invoiceNumber: string;
  patientId: Guid;
  firstName: string;
  lastName: string;
  title: string;
  recipientId: string;
  invoiceDate: Date;
  registrationNumber: number;
  invoiceId: Guid;
  invoiceItems: InvoiceLineItemViewModel[];
  invoiceDiagnosis: InvoiceDiagnosisDataModel[];
  invoiceEpisode: InvoiceAppointmentDetailsDataModel;
  deliveryMethodType: string;
  totalGross: number;
  totalNett: number;
  parentId: string;
  fullName: string;
  invoiceType: string;
  gender: string;
  specialistName: string;
  practitionerCode: string;
  birthDate: Date;
  siteRef: string;
  uniqueNo: number;
  claimNumber: string;
  comments: string;
  controllingSpecialistCode: string;
  payeeProviderHCCode: string;
  gpFirstVisit: Date;
  symtomsFirstNoticed: Date;
  gpContactId: string;
  sendViaPatientzone: boolean;
  lastStep: string;
  appointmentId: string;
  documentId: string;
  templateId: string;
}

export class InvoiceItemDataModel {
  patientId: string;
  invoiceId: string;
  siteId: string;
  invoiceNumber: string;
  serviceDescription: string;
  industryStandard: string;
  serviceCode: string;
  startDate: Date;
  cost: number;
  invoiceItemId: string;
  serviceProvider: string;
  serviceLocation: string;
}

export class InvoiceDiagnosisDataModel {
  invoiceId: Guid;
  siteId: string;
  description: string;
  code: string;
  isPrimary: boolean;
}
export class BillingResponseModel {
  isSuccess: boolean;
  payload: string;
  statusCode: StatusCode;
  message: string;
}

export class InvoiceAppointmentDetailsDataModel {
  invoiceId: string;
  siteId: string;
  patientId: string;
  locationId: string;
  ownerId: string;
  appointmentTypeId: string;
  ownerName: string;
  locationName: string;
  episodeDescription: string;
  dischargeReasonId: string;
  controllingSpecialistCode: string;
  payeeProviderHCCode: string;
  treatingHospital: string;
  startDate: Date;
  endDate: Date;
  comments: string;
}


export class ServiceItemsViewModel {
  invoiceItemViewModel: InvoiceLineItemViewModel;
  procedureItems: ProcedureCodesViewModel[];
}

export class ServiceSummaryViewModel {
  cost: number;
  invoiceItemId: string;
  serviceCodeType: string;
  startDate: string;
  endDate: string;
  count: number;
  serviceDescription: string;
  groupInvoiceItemId: string;
  industryStandard: string;
  units: number;
  procedures: ProcedureSummaryViewModel[];

}
export class ProcedureSummaryViewModel {
  description: string;
  code: string;
}
export class InvoiceLineItemViewModel {
  patientId: string;
  invoiceNumber: string;
  cost: number;
  invoiceId: string;
  siteId: string;
  procedureCode: string;
  serviceCodeType: string;
  startDate: string;
  endDate: string;
  procedureDescription: string;
  count: number;
  serviceDescription: string;
  groupInvoiceItemId: string;
  invoiceItemId: string;
  industryStandard: string;
  units: number;
  serviceProvider: string;
  serviceLocation: string;
  addProcedure: boolean;
  requiresProcedure: boolean;
  uniqueNo: number;
}

export class GPContactViewModel {
  gpContactId: string;
  gpFirstVisit: Date;
  symtomsFirstNoticed: Date;
}

export class CreditControlModel {
  siteId: string | null;
  siteName: string | null;
  payorId: string | null;
  payorName: string | null;
  invoiceId: string | null;
  invoiceNo: string | null;
  invoiceDate: Date | null;
  patientId: string | null;
  patientName: string | null;
  total: number | null;
  band1: number | null;
  band2: number | null;
  band3: number | null;
  band4: number | null;
}

export class CreditControlInvoiceModel {
  key: string | null;
  payorName: string | null;
  total: number | null;
  band1: number | null;
  band2: number | null;
  band3: number | null;
  band4: number | null;
}

export class PayorModel {
  payorId: string;
  payorName: string;
  payorType: string;
}

export class InvoiceCountsModel {
  allInvoiceCount: number;
  draftInvoiceCount: number;
  reviewInvoiceCount: number;
  failedInvoiceCount: number;
}

export class BulkPaymentTransactionEdit {
  bulkPaymentTransactionId: string;
  allocation: number | null;
  comments: string;
}

export enum CreditControlBandDropDownEnum {
  band1 = 1,
  band2 = 2,
  band3 = 3,
  band4 = 4
}