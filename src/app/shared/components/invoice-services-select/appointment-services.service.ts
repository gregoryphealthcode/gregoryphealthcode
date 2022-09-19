import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericResponseModel, GenericResponse } from '../../models/GenericResponseModel';
import { environment } from 'src/environments/environment';
import { IAddEditInvoiceService } from './invoice-services-store.service';
import { AddInvoiceServiceRequest, AddServiceProcedureRequest, EditInvoiceServiceRequest, GetInvoiceServiceResponseModel } from './invoice-services.service';
import { ProcedureCodesViewModel } from '../../models/ProcedureCodesViewModel';

@Injectable({
  providedIn: 'root'
})
export class AppointmentServicesService implements IAddEditInvoiceService {
  constructor(private http: HttpClient) { }

  updateFee(fee: number, lineId: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointmentServices/updateFee`;
    return this.http.put<GenericResponseModel<string>>(url, { fee, lineId });
  }

  getFee(parentEntityId: string, serviceCode: string, procedures: string[]): Observable<GenericResponseModel<number>> {
    const url = `${environment.baseurl}/appointmentServices/getFee?invoiceId=${parentEntityId}&serviceCode=${serviceCode}&procedures=${procedures}`;
    return this.http.get<GenericResponseModel<number>>(url);
  }

  getAll(parentEntityId: string): Observable<GetInvoiceServiceResponseModel[]> {
    const url = `${environment.baseurl}/appointmentServices?parentId=${parentEntityId}`;
    return this.http.get<GetInvoiceServiceResponseModel[]>(url);
  }

  getProcedureCodes(code: string): Observable<ProcedureCodesViewModel[]> {
    const url = `${environment.baseurl}/appointmentServiceProcedures?searchTerms=${code}`;
    return this.http.get<ProcedureCodesViewModel[]>(url);
  }

  addService(request: AddInvoiceServiceRequest): Observable<GenericResponseModel<string>> {
    const url = `${environment.baseurl}/appointmentServices`;
    return this.http.post<GenericResponseModel<string>>(url, request);
  }

  updateService(request: EditInvoiceServiceRequest): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointmentServices`;
    return this.http.put<GenericResponseModel<string>>(url, request);
  }

  removeService(id: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointmentServices/${id}`;
    return this.http.delete<GenericResponse>(url);
  }

  addProcedure(request: AddServiceProcedureRequest): Observable<GenericResponseModel<string>> {
    const url = `${environment.baseurl}/appointmentServiceProcedures`;
    return this.http.post<GenericResponseModel<string>>(url, request);
  }

  removeProcedure(id: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointmentServiceProcedures/${id}`;
    return this.http.delete<GenericResponse>(url);
  }
}
