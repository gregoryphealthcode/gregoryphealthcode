import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GluEpisodeTypeEnum } from 'src/app/pages/accounts/invoice-add-edit/invoice-add-edit.service';
import { GenericResponseModel, GenericResponse } from '../../models/GenericResponseModel';
import { IAddEditInvoiceService } from './invoice-services-store.service';
import { environment } from 'src/environments/environment';
import { ProcedureCodesViewModel } from '../../models/ProcedureCodesViewModel';

@Injectable({
  providedIn: 'root'
})
export class InvoiceServicesService implements IAddEditInvoiceService {
  constructor(private http: HttpClient) { }

  updateFee(fee: number, lineId: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/invoiceServices/updateFee`;
    return this.http.put<GenericResponseModel<string>>(url, {fee, lineId});
  }

  getFee(parentEntityId: string, serviceCode: string, procedures: string[]): Observable<GenericResponseModel<number>> {
    const params = new HttpParams({
      fromObject: {
        invoiceId: parentEntityId,
        serviceCode,
        procedures
      },
    });
    const url = `${environment.baseurl}/invoiceServices/getFee`;
    return this.http.get<GenericResponseModel<number>>(url, { params });
  }

  getAll(parentEntityId: string): Observable<GetInvoiceServiceResponseModel[]> {
    const url = `${environment.baseurl}/invoiceServices?parentId=${parentEntityId}`;
    return this.http.get<GetInvoiceServiceResponseModel[]>(url);
  }

  getProcedureCodes(code: string): Observable<ProcedureCodesViewModel[]> {
    const url = `${environment.baseurl}/invoiceServiceProcedures?searchTerms=${code}`;
    return this.http.get<ProcedureCodesViewModel[]>(url);
  }

  addService(request: AddInvoiceServiceRequest): Observable<GenericResponseModel<string>> {
    const url = `${environment.baseurl}/invoiceServices`;
    return this.http.post<GenericResponseModel<string>>(url, request);
  }

  updateService(request: EditInvoiceServiceRequest): Observable<GenericResponse> {
    const url = `${environment.baseurl}/invoiceServices`;
    return this.http.put<GenericResponseModel<string>>(url, request);
  }

  removeService(id: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/invoiceServices/${id}`;
    return this.http.delete<GenericResponse>(url);
  }
  addProcedure(request: AddServiceProcedureRequest): Observable<GenericResponseModel<string>> {
    const url = `${environment.baseurl}/invoiceServiceProcedures`;
    return this.http.post<GenericResponseModel<string>>(url, request);
  }
  removeProcedure(id: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/invoiceServiceProcedures/${id}`;
    return this.http.delete<GenericResponse>(url);
  }
}

export interface AddEditInvoiceServiceBase {
  ownerId: string;
  episodeTypeId: GluEpisodeTypeEnum;
  code: string;
  units: number;
  fee: number | null;
  startTime: Date | string;
  endTime: Date | string;
}

export interface AddInvoiceServiceRequest extends AddEditInvoiceServiceBase  {
  parentId: string;
}

export interface EditInvoiceServiceRequest extends AddEditInvoiceServiceBase  {
  lineId: string;
}

export interface IGetInvoiceServiceResponseModel extends AddEditInvoiceServiceBase  {
  lineId: string;
  description: string;
  requiresProcedure: boolean;
  procedures: ProcedureResponseModel[];
  showEditProcedure?: boolean;
}

export class GetInvoiceServiceResponseModel implements IGetInvoiceServiceResponseModel {
  ownerId: string;
  episodeTypeId: GluEpisodeTypeEnum;
  code: string;
  units: number;
  fee: number;
  startTime: string | Date;
  endTime: string | Date;
  lineId: string;
  description: string;
  requiresProcedure: boolean;
  showEditProcedure?: boolean;
  procedures: ProcedureResponseModel[];


  toAddRequest(parentEntityId): AddInvoiceServiceRequest{
    return {
      parentId: parentEntityId,
      ownerId: this.ownerId,
      episodeTypeId: this.episodeTypeId,
      code: this.code,
      units: this.units,
      fee: this.fee,
      startTime: this.startTime,
      endTime: this.endTime,
    }
  }

  toEditRequest():EditInvoiceServiceRequest{
    return {
      lineId: this.lineId,
      ownerId: this.ownerId,
      episodeTypeId: this.episodeTypeId,
      code: this.code,
      units: this.units,
      fee: this.fee,
      startTime: this.startTime,
      endTime: this.endTime,
    }
  }
}

export interface ProcedureResponseModel extends AddGetInvoiceServiceProcedureBase {
  id: string;
  description: string;
}

export interface AddGetInvoiceServiceProcedureBase {
  code: string;
}

export interface AddServiceProcedureRequest extends AddGetInvoiceServiceProcedureBase {
  lineId: string;
}
