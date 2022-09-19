import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientAddress } from './app-info.service';
import { GenericResponse } from '../models/GenericResponseModel';
import Guid from 'devextreme/core/guid';


@Injectable({
    providedIn: 'root',
  })
export class PatientInsurerService {
    constructor( private http: HttpClient) {
    }

    public getPatientInsurers(patientId: string): Observable<PatientInsurerModel[]> {
        const url = `${environment.baseurl}/patientInsurer/getAll?patientId=${patientId}`;
        return this.http.get<PatientInsurerModel[]>(url);
    }

    public getPatientInsurerDetails(patientInsurerId: string): Observable<PatientInsurerModel> {
        const url = `${environment.baseurl}/patientInsurer/${patientInsurerId}`;
        return this.http.get<PatientInsurerModel>(url);
    }

    public addPatientInsurer(request: any): Observable<UpdatePatientInsurerModel> {
        const url = `${environment.baseurl}/patientInsurer`;
        return this.http.post<UpdatePatientInsurerModel>(url, request);
    }

    public updatePatientInsurer(request: any): Observable<UpdatePatientInsurerModel> {
      console.log(request);
        const url = `${environment.baseurl}/patientInsurer`;
        return this.http.put<UpdatePatientInsurerModel>(url, request);
    }

    public deletePatientInsurer(patientInsurerId: Guid): Observable<GenericResponse> {
        const url = `${environment.baseurl}/patientDetails/deletePatientInsurer?patientInsurerId=${patientInsurerId}`;
        return this.http.delete<GenericResponse>(url);
    }


    public getMembershipNo(patientId: string, insurerId: string): Observable<GetHcPayorMembershipResponse> {
      const url = `${environment.baseurl}/patientInsurer/getMembershipNo?patientId=${patientId}&insurerId=${insurerId}`;
      return this.http.get<GetHcPayorMembershipResponse>(url);
  }
}

export class PatientInsurerModel {
    patientInsurerId: string;
    patientId: string;
    insurerId: string;
    insurerName: string;
    logoUrl: string;
    isPrimary: boolean;
    registrationNumber: string;
    renewalDate: Date;
    renewalDateFlag: Date;
    scheme: string;
    uniqueNo: number;
    requiresDiagnosisCode : boolean;
    deliveryMethodType : string;
    invoiceType : string;
    hcCode : string;
    sendViaPatientzone : boolean;
    isInsurer : boolean;
    isPatientZone : boolean;
    description: string;
    address: PatientAddress;
}

export class UpdatePatientInsurerModel {
    patientInsurerId: string;
    insurerId: string;
    isPrimary: boolean;
    registrationNumber: string;
    renewalDate: Date;
    scheme: string;
    success: boolean;
    errors: string;
}

export class DeletePatientInsurerModel {
    insurerId: string;
}

export interface GetHcPayorMembershipResponse {
  response: ProcessHcPayorMembershipCommandResponseEnum;
  membershipNo: string;
}

export enum ProcessHcPayorMembershipCommandResponseEnum {
  NoMatch,
  Failed,
  Success,
  Processing
}
