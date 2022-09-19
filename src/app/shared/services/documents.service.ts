import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Guid from 'devextreme/core/guid';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GenericResponse, GenericResponseModel } from '../models/GenericResponseModel';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  constructor(private http: HttpClient) { }

  public editSiteTemplate(siteTemplateId) : Observable<GenericResponseModel<string>> {
    return this.generateUrl({siteTemplateId})
    .pipe(tap(x=> window.open(`${environment.serverUrl}/template?url=${x.data}`, "_blank")));
  }

  public editMedsecTemplate(medsecTemplateId) : Observable<GenericResponseModel<string>> {
    return this.generateUrl({medsecTemplateId})
    .pipe(tap(x=> window.open(`${environment.serverUrl}/template?url=${x.data}`, "_blank")));
  }

  public editGlobalTemplate(globalTemplateId) : Observable<GenericResponseModel<string>> {
    return this.generateUrl({globalTemplateId})
    .pipe(tap(x=> window.open(`${environment.serverUrl}/template?url=${x.data}`, "_blank")));
  }

  public getPatientLetters(patientId: string, status: string): Observable<PatientLetterModel[]> {
    const url = `${environment.baseurl}/patientLetters/getAll?patientId=${patientId}&&status=${status}`;
    return this.http.get<PatientLetterModel[]>(url);
  }

  public editLetter(letterId) : Observable<GenericResponseModel<string>> {
    return this.generateUrl({letterId})
    .pipe(tap(x=> window.open(`${environment.serverUrl}/letter?url=${x.data}`, "_blank")));
  }  

  public editLetterAsCopy(correspondenceId): Observable<GenericResponseModel<string>> {
    const url = `${environment.baseurl}/patientLetters/editAsCopy`;
    return this.http.put<GenericResponseModel<string>>(url, {correspondenceId: correspondenceId});
  }

  public editDocument(documentId) : Observable<GenericResponseModel<string>> {
    return this.generateUrl({documentId})
    .pipe(tap(x=> window.open(`${environment.serverUrl}/document?url=${x.data}`, "_blank")));
  }

  public editDocumentAsCopy(patientDocumentId): Observable<GenericResponseModel<string>> {
    const url = `${environment.baseurl}/patientDocuments/editAsCopy`;
    return this.http.put<GenericResponseModel<string>>(url, {patientDocumentId: patientDocumentId});
  }

  public viewCorrespondence(correspondenceId) : Observable<GenericResponseModel<string>> {
    return this.generateUrl({correspondenceId})
    .pipe(tap(x=> window.open(`${environment.serverUrl}/pdf?url=${x.data}`, "_blank")));
  }

  public deleteLetter(letterId) : Observable<GenericResponse> {
    const url = `${environment.baseurl}/patientLetters?letterId=${letterId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public recreateDraftLetter(correspondenceId) : Observable<GenericResponseModel<LetterIdModel>> {
    const url = `${environment.baseurl}/patientLetters/recreateDraftLetter?correspondenceId=${correspondenceId}`;
    return this.http.post<GenericResponseModel<LetterIdModel>>(url, correspondenceId);
  }

  public generateUrl(request: GenerateDocumentViewerUrlRequest){
    const url = `${environment.baseurl}/documents/generateUrl`;
    return this.http.post<GenericResponseModel<string>>(url, request)
  }

  public getSiteTemplates(): Observable<documentTemplates[]> {
    const url = `${environment.baseurl}/template/getSiteTemplates`;
    return this.http.get<documentTemplates[]>(url);
  }

  public generateDraftUrl(letterId, templateId) {
    const url = `${environment.baseurl}/documents/generateDraftUrl`;
    return this.http.post<GenericResponseModel<string>>(url, {letterId, templateId})
  }
}

export interface GenerateDocumentViewerUrlRequest {
  correspondenceId?: string;
  siteTemplateId?: string;
  documentId?: string;
  documentPdfId?: string;
  letterId?: string;
  medsecTemplateId?: string;
  globalTemplateId?: number | null;
  printQueueDocuments?: string[];
}

export interface GenerateDraftDocumentViewerUrlRequest {
  siteTemplateId?: string;
  letterId?: string;
  medsecTemplateId?: string;
  globalTemplateId?: number | null;
}

export class documentTemplates {
  id: Guid;
  name: string;
  type: number;
}

export class LetterIdModel {
  id: Guid;
}

export class PatientLetterModel {
  id: string;
  templateId: string;
  description: string;
  invoiceNumber: string;
  category: string;
  created: Date | null;
  comments: string;
  locked: boolean | null;
  isCorrespondence: boolean | null;
  superseded?: boolean | null;
}