import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Guid from 'devextreme/core/guid';
import { ResponseModel } from '../models/ResponseModel';
import { GenericResponse } from '../models/GenericResponseModel';

export class PatientNoteModel {
  patientNoteId: Guid;
  siteId: Guid;
  patientId: Guid;
  patientText: string;
  userId: Guid;
  dateCreated: Date;
  warning: boolean;
  popup: boolean;
  noteType: string;
  noteText: any;
  createdByUserId: Guid;
  createdBy: string;
  notesVisibility: number;
  attachments: Array<PatientNoteAttachmentModel> = [];
  success: boolean;
  deletedByUserId: Guid;
}

export class PatientNoteAttachmentModel {
  attachmentId: Guid;
  attachmentFile: string;
  attachmentType: string;
  attachmentMimeType: string;
  fileBase64String: string;
  success: boolean;
}

export class DeletePatientNoteModel {
  patientNoteId: string;
}

@Injectable({
  providedIn: 'root'
})

export class PatientNoteService {
  constructor(private http: HttpClient) {
  } 

  public getPatientNoteDetails(patientNoteId: Guid): Observable<PatientNoteModel> {
    const url = `${environment.baseurl}/patientNotes/GetPatientNoteDetails?patientNoteId=${patientNoteId}`;
    return this.http.get<PatientNoteModel>(url);
  }

  public getPatientNoteAttachment(patientId: Guid, attachmentId: Guid): Observable<PatientNoteAttachmentModel> {
    const url = `${environment.baseurl}/patientNotes/patientNoteAttachment?patientId=${patientId}&&attachmentId=${attachmentId}`;
    return this.http.get<PatientNoteAttachmentModel>(url);
  }
  
  public addPatientNote(model: PatientNoteModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/patientNotes`;
    return this.http.post<GenericResponse>(url, model);
  }

  public updatePatientNote(model: PatientNoteModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/patientNotes/updatePatientNote`;
    return this.http.put<GenericResponse>(url, model);
  }

  public deletePatientNote(patientNoteId: Guid): Observable<GenericResponse> {
    const url = `${environment.baseurl}/patientNotes/deletePatientNote`;
    return this.http.put<GenericResponse>(url, { patientNoteId });
  }

  public deletePatientNoteAttachment(attachmentId: Guid): Observable<GenericResponse> {
    const url = `${environment.baseurl}/patientNotes/deletePatientNoteAttachment`;
    return this.http.put<GenericResponse>(url, { attachmentId });
  }
}
