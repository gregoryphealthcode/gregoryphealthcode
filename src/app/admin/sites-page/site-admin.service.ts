import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericResponse, GenericResponseModel } from 'src/app/shared/models/GenericResponseModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteAdminService {

  constructor(private http: HttpClient) { }

  public get(siteId: string): Observable<GetAdminSiteDetailsModel> {
    const url = `${environment.baseurl}/site/${siteId}`;
    return this.http.get<GetAdminSiteDetailsModel>(url);
  }

  public migrateSiteData(siteRef: string): Observable<GenericResponseModel<MigrationResponse>> {
    const url = `${environment.baseurl}/site/migrateSiteData`;
    return this.http.put<GenericResponseModel<MigrationResponse>>(url, {siteRef: siteRef});
  }
}

export class MigrationResponse {
  patients: MigrationResponseModel;
  contacts: MigrationResponseModel;
  relatedPersons: MigrationResponseModel; 
  invoices: MigrationResponseModel;
  correspondence: MigrationResponseModel;
}

export class MigrationResponseModel {
  import: MigrationResponseModelPart;
  addresses?: MigrationResponseModelPart;
  telecoms?: MigrationResponseModelPart;
  files?: MigrationResponseModelPart;
}

export class MigrationResponseModelPart {
  successCount: number;
  errorCount: number;
  errorDetails: MigrationErrorDetails[];
}

export class MigrationErrorDetails {
  description: string;
  error: string;
}

export interface GetAdminSiteDetailsModel {
  siteId: string | null;
  siteName: string;
  siteRef: string;
  ePracticeVariant: string;
  siteActive: boolean | null;
  siteAddress1: string;
  siteAddress2: string;
  siteAddress3: string;
  siteAddress4: string;
  sitePostcode: string;
  payeeProviderHcCode: string;
  payeeProviderPractitionerCode: string;
  payeeProviderDisplayName: string;
  payeeProviderLastName: string;
  payeeProviderFirstName: string;
  payeeProviderTitle: string;
  payeeProviderAddress1: string;
  payeeProviderAddress2: string;
  payeeProviderAddress3: string;
  payeeProviderAddress4: string;
  payeeProviderPostcode: string;
}
