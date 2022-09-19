import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import Guid from "devextreme/core/guid";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { GenericResponse, GenericResponseModel } from "../models/GenericResponseModel";

@Injectable({
    providedIn: 'root',
  })
export class PatientDocumentService {
    constructor( private http: HttpClient) {
    }    

    public getDocumentTypes(): Observable<DocumentTypeModel[]> {
        const url = `${environment.baseurl}/documentType/getAll`;
        return this.http.get<DocumentTypeModel[]>(url);
    }

    public deleteDocumentType(id: Guid): Observable<GenericResponse> {
        const url = `${environment.baseurl}/documentType?id=${id}`;
        return this.http.delete<GenericResponse>(url);
    }

    public getPatientDocumentTypes(): Observable<PatientDocumentTypeModel[]> {
        const url = `${environment.baseurl}/patientDocumentType/getAll`;
        return this.http.get<PatientDocumentTypeModel[]>(url);
    }

    public deletePatientDocumentType(id: Guid): Observable<GenericResponse> {
        const url = `${environment.baseurl}/patientDocumentType?id=${id}`;
        return this.http.delete<GenericResponse>(url);
    }

    public getPatientDocuments(patientId: string, type: string): Observable<PatientDocumentModel[]> {
        const url = `${environment.baseurl}/patientDocuments/getAll?patientId=${patientId}&&type=${type}`;
        return this.http.get<PatientDocumentModel[]>(url);
      }

    public getPatientDocumentDetails(id: Guid): Observable<PatientDocumentModel> {
        const url = `${environment.baseurl}/patientDocuments/${id}`;
        return this.http.get<PatientDocumentModel>(url);
    }
    
    public deletePatientDocument(id: Guid): Observable<GenericResponse> {
        const url = `${environment.baseurl}/patientDocuments?id=${id}`;
        return this.http.delete<GenericResponse>(url);
    }

    public getPatientFile(patientId: Guid, patientDocumentId: Guid, fileName: string, externalStorageId?: string): Observable<PatientFileModel> {
        const url = `${environment.baseurl}/patientDocuments/getPatientFile?patientId=${patientId}&&patientDocumentId=${patientDocumentId}&&fileName=${fileName}&&externalStorageId=${externalStorageId}`;
        return this.http.get<PatientFileModel>(url);
    }

    public getPatientRecipients(patientId: string, type: number): Observable<PatientRecipientModel[]> {
        const url = `${environment.baseurl}/patientLetters/getPatientRecipients?patientId=${patientId}&&type=${type}`;
        return this.http.get<PatientRecipientModel[]>(url);
    }
}

export class PatientRecipientModel {
    recipientId: string | null;
    recipientName: string | null;
}

export class DocumentTypeModel {
    documentTypeId?: Guid | null;
    description?: string | null;
    active?: boolean | null;
}

export class PatientDocumentTypeModel {
    patientDocumentTypeId?: Guid | null;
    description?: string | null;
    active?: boolean | null;
}

export class PatientDocumentModel {
    patientDocumentId?: Guid | null;
    patientId?: Guid | null;
    siteId?: Guid | null;
    templateId?: Guid | null;
    templateDescription?: string | null;
    appointmentId?: Guid | null;
    appointmentDescription?: string | null;
    documentTypeId?: Guid | null;
    documentTypeDescription?: string | null;
    patientDocumentTypeId?: Guid | null;
    patientDocumentTypeDescription?: string | null;
    documentName?: string | null;
    documentDate?: Date | null;
    createdByName?: string | null;
    createdDate?: Date | null;
    comments?: string | null;
    locked?: boolean | null;
    lockedBy?: Guid | null;
    lockedDate?: Date | null;
    externalStorageId?: string | null;
    fileName?: string | null;
    fileType?: string | null;
    mimeType?: string | null;
    fileBase64String?: string | null;
    superseded: boolean | null;
}

export class PatientFileModel {
    fileName?: string | null;
    fileBase64String?: string | null;
}