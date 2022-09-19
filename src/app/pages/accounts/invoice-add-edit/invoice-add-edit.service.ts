import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorData } from 'src/app/shared/models/ErrorData';
import { GenericResponse, GenericResponseModel } from 'src/app/shared/models/GenericResponseModel';
import { PatientDetailsResponseModelNew } from 'src/app/shared/services/patient.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceAddEditService {
  constructor(private http: HttpClient) {
  }

  public getPayors(patientId: string): Observable<GetInvoicePayorResponseModel[]> {
    const url = `${environment.baseurl}/payor/getAll?patientId=${patientId}`;
    return this.http.get<GetInvoicePayorResponseModel[]>(url);
  }

  public getPotentialPayors(patientId: string): Observable<GetPatientPotentialPayorsResponseModel> {
    const url = `${environment.baseurl}/payor/getPotentialPayors?patientId=${patientId}`;
    return this.http.get<GetPatientPotentialPayorsResponseModel>(url);
  }

  public getPayor(payorId: string, typeId: number): Observable<GetInvoicePayorResponseModel> {
    const url = `${environment.baseurl}/payor/getById?id=${payorId}&typeId=${typeId}`;
    return this.http.get<GetInvoicePayorResponseModel>(url);
  }

  public getInvoice(invoiceId: string): Observable<GetInvoiceQueryResponseModel> {
    const url = `${environment.baseurl}/invoice/getById?id=${invoiceId}`;
    return this.http.get<GetInvoiceQueryResponseModel>(url);
  }

  public getInvoiceStatus(invoiceId: string): Observable<GetInvoiceStatusQueryResponseModel> {
    const url = `${environment.baseurl}/invoice/getById?id=${invoiceId}`;
    return this.http.get<GetInvoiceStatusQueryResponseModel>(url);
  }

  public saveInvoice(model: AddInvoiceRequest): Observable<GenericResponseModel<AddInvoiceResponseModel>> {
    const url = `${environment.baseurl}/invoice/addInvoice`;
    return this.http.post<GenericResponseModel<AddInvoiceResponseModel>>(url, model);
  }

  public cancelInvoice(model): Observable<GenericResponse> {
    const url = `${environment.baseurl}/invoice/cancelInvoice`;
    return this.http.put<GenericResponse>(url, model);
  }

  public setInvoiceEpisode(model: SetInvoiceEpisodeDetialsRequest): Observable<GenericResponse> {
    const url = `${environment.baseurl}/invoice/setEpisodeDetails`;
    return this.http.put<GenericResponse>(url, model);
  }

  public updatePayorDetails(model: EditGetPayorDetailsDto): Observable<GenericResponse> {
    const url = `${environment.baseurl}/payor/update`;
    return this.http.put<GenericResponse>(url, model);
  }

  public updateInvoicePayor(model: UpdateInvoicePayorRequest): Observable<GenericResponse> {
    const url = `${environment.baseurl}/invoice/updatePayor`;
    return this.http.put<GenericResponse>(url, model);
  }

  public updateInvoiceMainDetails(model: InvoiceDetailsRequestResponseBase, invoiceId: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/invoice/updateMainDetails`;
    return this.http.put<GenericResponse>(url, { invoiceNo: model.invoiceNo, invoiceDate: model.invoiceDate, invoiceId });
  }

  public addDiagnosisCode(invoiceId: string, code: string): Observable<GenericResponseModel<string>> {
    const url = `${environment.baseurl}/invoicediagnosis`;
    return this.http.post<GenericResponseModel<string>>(url, { invoiceId, code });
  }

  public setDiagnosisCodeAsPrimary(invoiceDiagnosisId: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/invoicediagnosis/setAsPrimary`;
    return this.http.put<GenericResponse>(url, { id: invoiceDiagnosisId });
  }

  public deleteDiagnosisCode(invoiceDiagnosisId: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/invoicediagnosis?id=${invoiceDiagnosisId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public getInvoiceDiagnosisCodes(invoiceId: string): Observable<GetInvoiceDiagnosisCodesResponseModel[]> {
    const url = `${environment.baseurl}/invoicediagnosis?invoiceId=${invoiceId}`;
    return this.http.get<GetInvoiceDiagnosisCodesResponseModel[]>(url);
  }

  public sendInvoice(id: string, templateId: string): Observable<GenericResponseModel<SendInvoiceResponseModel>> {
    const url = `${environment.baseurl}/billing/sendInvoice`;
    return this.http.put<GenericResponseModel<SendInvoiceResponseModel>>(url, { id, templateId });
  }

  public setToReview(id: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/invoice/setToReview`;
    return this.http.put<GenericResponse>(url, { id });
  }

  public cloneInvoice(invoiceId: string): Observable<GenericResponseModel<string>> {
    const url = `${environment.baseurl}/invoice/cloneInvoice`;
    return this.http.post<GenericResponseModel<string>>(url, { invoiceId });
  }

  public regenerateInvoice(id: string): Observable<GenericResponseModel<SendInvoiceResponseModel>> {
    const url = `${environment.baseurl}/billing/regenerateInvoice`;
    return this.http.put<GenericResponseModel<SendInvoiceResponseModel>>(url, { id });
  }
}

export interface SetInvoiceEpisodeDetialsRequest extends InvoiceEpisodeDetailsRequestResponseBase {
  invoiceId: string;
}

export interface InvoiceEpisodeDetailsRequestResponseBase {
  episodeTypeId: GluEpisodeTypeEnum;
  dischargeCodeId: GluDischargeCodeEnum | null;
  admissionDate?: Date;
  dischargeDate?: Date;
  locationId: string;
  ownerId: string;
}

export class GetInvoiceEpisodeDetailsResponse implements InvoiceEpisodeDetailsRequestResponseBase {

  episodeTypeId: GluEpisodeTypeEnum;
  dischargeCodeId: GluDischargeCodeEnum | null;
  admissionDate?: Date;
  dischargeDate?: Date;
  locationId: string;
  ownerId: string;
  locationName: string;
  ownerName: string;
  type: string;
  dischargeReason: string;

  toRequest(invoiceId: string): SetInvoiceEpisodeDetialsRequest {
    return {
      invoiceId, episodeTypeId: this.episodeTypeId, dischargeCodeId: this.dischargeCodeId,
      admissionDate: this.admissionDate, dischargeDate: this.dischargeDate, locationId: this.locationId, ownerId: this.ownerId
    }
  }
}

export enum GluEpisodeTypeEnum {
  CashBenefit = 1,
  Daycase = 2,
  Inpatient = 3,
  NursingHome = 4,
  Outpatient = 5,
  ConsultingRooms = 6,
  Other = 7
}

export enum GluDischargeCodeEnum {
  AgainstMedicalAdvice = 1,
  Unknown = 2,
  Death = 3,
  MentalHealthDischarge = 4,
  Routine = 5,
  StillBorn = 6,
  Transferred = 7,
  TransferToSelfFunding = 8
}

export interface GetInvoiceStatusQueryResponseModel {
  status: string;
}

export interface GetInvoiceQueryResponseModel {
  patient: PatientDetailsResponseModelNew;
  details: GetInvoiceDetailsResponse;
  payor: GetInvoicePayorResponseModel;
  episode: GetInvoiceEpisodeDetailsResponse;
  validationErrors: ErrorData[];
}

export interface GetInvoicePayorResponseModel extends EditGetPayorDetailsDto {
  siteId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  contactType: string;
  contactClassification: number | null;
  backgroundColor: string;
  mobileNo: string;
  invalid: boolean;
  requiresDiagnosisCode: boolean;
  isInsurer: boolean;
}

export interface EditGetPayorDetailsDto {
  payorId: string;
  email: string;
  mobileNo: string;
  type: InvoicePayorTypeEnum;
  insRegistrationNumber: string;
  insScheme: string;
  deliveryType: string;
  insRenewalDate: string | null;
  sendViaPatientzone: boolean;
  address: SimpleAddressViewModelBase;
}

export interface InvoiceDetailsRequestResponseBase {
  invoiceNo: string;
  authCode: string;
  invoiceDate?: string | Date;
}

export interface GetInvoiceDetailsResponse {
  invoiceNo: string;
  authCode: string;
  status: string;
  statusId: InvoiceStatusEnum;
  invoiceDate?: string | Date;
}

export enum InvoiceStatusEnum {
  Draft = 1,
  Review = 2,
  Issued = 3,
  Balanced = 4,
  Cancelled = 5,
  Error = 6,
  FailedValidation = 7,
  Passed = 8,
  Ready = 9,
  Submitted = 10
}

export interface SimpleAddressViewModelBase {
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  postcode: string;
  country: string;
  addressTypeId: number;
}

export interface AddInvoiceRequest {
  patientId: string;
  payor: AddEditPayorRequestBase;
  details: InvoiceDetailsRequestResponseBase;
}

export interface UpdateInvoicePayorRequest {
  invoiceId: string;
  payor: AddEditPayorRequestBase;
}

export interface AddEditPayorRequestBase {
  payorId: string;
  type: InvoicePayorTypeEnum;
}

export enum InvoicePayorTypeEnum {
  Insurer = 1,
  Patient = 2,
  Contact = 3,
  Relative = 4
}

export interface AddInvoiceResponseModel {
  id: string;
}

export interface GetInvoiceDiagnosisCodesResponseModel {
  id: string;
  code: string;
  description: string;
  isPrimary: boolean;
}

export interface SendInvoiceResponseModel {
  ediErrors: ErrorData[];
  correspondenceId: string;
}

export interface GetPatientPotentialPayorsResponseModel {
  contacts: GetPatientPotentialPayorResponseModel[];
  related: GetPatientPotentialPayorResponseModel[];
}

export interface GetPatientPotentialPayorResponseModel extends AddEditPayorRequestBase {
  firstName: string;
  lastName: string;
  icon?: string;
}