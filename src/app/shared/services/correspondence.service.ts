import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AddCorrespondenceModel } from '../models/AddCorrespondenceModel';
import { PatientNoteDocumentModel } from '../models/PatientNoteDocumentModel';
import { ResponseModel } from '../models/ResponseModel';
import { CorrespondenceTemplateModel } from '../models/CorrespondenceTemplateModel';
import { TranscriptionsModel } from '../models/TranscriptionsModel';
import Guid from 'devextreme/core/guid';
import { GenericResponseModel } from '../models/GenericResponseModel';
import { InvoicePayorTypeEnum } from './sites.service';

@Injectable({
  providedIn: 'root'
})
export class CorrespondenceService {
  constructor(private http: HttpClient) {
  }

  public getCorrespondence(patientId: Guid): Observable<CorrespondenceModel[]> {
    const url = `${environment.baseurl}/correspondence/getCorrespondence?patientId=${patientId}`;
    return this.http.get<CorrespondenceModel[]>(url);
  }

  public addCorrespondence(mycorrespondencemodel: AddCorrespondenceModel): Observable<string>  {
    const url = `${environment.baseurl}/correspondence/add`;
    return this.http.post<string>(url, mycorrespondencemodel);
  }

  public generateReminderLetters(type: string, bands : number[]) : Observable<GenericResponseModel<string>>  {
   const url = `${environment.baseurl}/correspondence/generateReminderLetters`;
     return this.http.post<GenericResponseModel<string>>(url, {type, bands}); 
  }

  public saveAttachmentFile(documentData : PatientNoteDocumentModel): Observable<boolean> {
    const url = `${environment.baseurl}/DocumentImport/movePatientNoteFromTemp`;
    return this.http.post<boolean>(url, documentData);
  }

  public deletePatientNoteAttachment(documentData : PatientNoteDocumentModel): Observable<boolean> {
    const url = `${environment.baseurl}/DocumentImport/deletePatientNoteAttachment`;
    return this.http.post<boolean>(url, documentData);
  }

  public sendSMSText(mysmstextmodel: SMSTextSendModel): Observable<ResponseModel>  {
    const url = `${environment.baseurl}/sms/sendSms`;
    return this.http.post<ResponseModel>(url, mysmstextmodel);
  }

  public updateSmsStatus(mysmstextmodel: SMSTextSendModel): Observable<ResponseModel>  {
    const url = `${environment.baseurl}/sms/statusUpdate`;
    return this.http.post<ResponseModel>(url, mysmstextmodel);
  }

  public getTemplateCategories() : Observable<CategoryTypesViewModel[]>  {
    const url = `${environment.baseurl}/template/getTemplateCategories`;
      return this.http.get<CategoryTypesViewModel[]>(url);
   }

   public addTemplate(model : CorrespondenceTemplateModel): Observable<boolean> {
    const url = `${environment.baseurl}/template/addTemplate`;
    return this.http.post<boolean>(url, model);
  }

  public deleteTemplate(templateId : string): Observable<boolean> {
    const url = `${environment.baseurl}/template/deleteTemplate?templateId=${templateId}`;
    return this.http.delete<boolean>(url);
  }

  public getTranscriptions(siteId : string) : Observable<TranscriptionsModel[]>  {
    const url = `${environment.baseurl}/correspondence/getTranscriptions?siteId=${siteId}`;
      return this.http.get<TranscriptionsModel[]>(url);
   }

  public getPatientSMSDetails(patientId: Guid): Observable<SMSTextSendModel> {
    const url = `${environment.baseurl}/sms/getPatientSmsDetails?patientId=${patientId}`;
      return this.http.get<SMSTextSendModel>(url);
  }
}

export class TemplateCategoryTypesViewModel
{
  description : string;
  uniqueNo : number;
  templaceCategoryId : number;
}

export class CategoryTypesViewModel
{
  description : string;
  uniqueNo : number;
  templateTypes : TemplateCategoryTypesViewModel[];
}

export class SMSTextSendModel
 {
  patientId : string;
  siteId: string;
  userId: string;  
  recipientName: string;
  recipientType: string;
  messageText: string;
  phoneNumber: string;
  contactId: string;
  appointmentId: string;
  senderTag: string;
}

export class CorrespondenceModel 
{
  correspondenceId?: Guid | null;
  description?: string | null;
  documentReference?: string | null;
  category?: string | null;
  created?: Date | null;
}
