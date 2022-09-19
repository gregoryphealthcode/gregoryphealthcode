import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Guid from 'devextreme/core/guid';
import { TitlesViewModel, TelecomTypes, ReferenceNumberTypes } from '.';
import { ContactTypeViewModel } from '../models/ContactTypeViewModel';
import { map, tap } from 'rxjs/operators';
import { GenericViewModel } from './user.service';
import { CorrespondenceTemplateModel } from '../models/CorrespondenceTemplateModel';
import { SiteViewModel } from '../models/SiteViewModel';
import { DataPointItemsModel, PreferenceDataPointItemsModel } from './patient.service';
import { GenericResponse, GenericResponseModel } from '../models/GenericResponseModel';
import { OrganisationModel } from './contact.service';
import { ResponseModel } from '../models/ResponseModel';

@Injectable({
  providedIn: 'root'
})
export class SitesService {
  constructor(private http: HttpClient) {
  }

  public getCurrentSiteDetails(): Observable<SiteDetailsModel> {
    const url = `${environment.baseurl}/site/getCurrentSiteDetails`;
    return this.http.get<SiteDetailsModel>(url);
  }

  public updateCurrentSiteDetails(model: SiteDetailsModel): Observable<ResponseModel> {
    const url = `${environment.baseurl}/site/updateCurrentSiteDetails`;
    return this.http.put<ResponseModel>(url, model);
  }

  public updateCurrentSiteAddress(model: SiteDetailsModel): Observable<ResponseModel> {
    const url = `${environment.baseurl}/site/updateCurrentSiteAddress`;
    return this.http.put<ResponseModel>(url, model);
  }

  public updateCurrentSiteDocuments(model: SiteDetailsModel): Observable<ResponseModel> {
    const url = `${environment.baseurl}/site/updateCurrentSiteDocuments`;
    return this.http.put<ResponseModel>(url, model);
  }

  public updateCurrentSiteAccounts(model: SiteDetailsModel): Observable<ResponseModel> {
    const url = `${environment.baseurl}/site/updateCurrentSiteAccounts`;
    return this.http.put<ResponseModel>(url, model);
  }

  public updateCurrentSitePatientZoneDetails(model: SiteDetailsModel): Observable<ResponseModel> {
    const url = `${environment.baseurl}/site/updateCurrentSitePatientZone`;
    return this.http.put<ResponseModel>(url, model);
  }

  public updateCurrentSiteHealthcodeDetails(model: SiteDetailsModel): Observable<ResponseModel> {
    const url = `${environment.baseurl}/site/updateCurrentSiteHealthcode`;
    return this.http.put<ResponseModel>(url, model);
  }

  public getAddressTypes(): Observable<AddressTypeViewModel[]> {
    const url = `${environment.baseurl}/patientAddress/getAddressTypes`;
    return this.http.get<AddressTypeViewModel[]>(url);
  }

  public getTitlesForSite(): Observable<TitlesViewModel[]> {
    const url = `${environment.baseurl}/site/getTitles`;
    return this.http.get<TitlesViewModel[]>(url);
  }

  public getGlu_Titles(): Observable<TitlesViewModel[]> {
    const url = `${environment.baseurl}/site/getGlu_Titles`;
    return this.http.get<TitlesViewModel[]>(url);
  }

  public getTelecomTypes(): Observable<TelecomTypes[]> {
    const url = `${environment.baseurl}/site/getTelecomTypes`;
    return this.http.get<TelecomTypes[]>(url);
  }

  public addTelecomType(model: TelecomTypes): Observable<GenericResponse> {
    const url = `${environment.baseurl}/site/addTelecomType`;
    return this.http.post<GenericResponse>(url, model);
  }

  public updateTelecomType(model: TelecomTypes): Observable<GenericResponse> {
    const url = `${environment.baseurl}/site/updateTelecomType`;
    return this.http.patch<GenericResponse>(url, model);
  }

  public deleteTelecomType(uniqueNo: number): Observable<GenericResponse> {
    const url = `${environment.baseurl}/site/deleteTelecomType?uniqueNo=${uniqueNo}`;
    return this.http.delete<GenericResponse>(url);
  }

  public deleteDataPoint(uniqueNo: number): Observable<GenericResponse> {
    const url = `${environment.baseurl}/llu_PatientDataPoints/${uniqueNo}`;
    return this.http.delete<GenericResponse>(url);
  }

  /*  public addTempSession(authToken: string, sessionStorage: any) {
     const url = `${environment.odataBaseurl}TempSessionStorage`;
     return this.http.post<any>(url, sessionStorage, { headers: { Authorization: 'Bearer ' + authToken } });
   } */

  public getPhotoFile(id: string): Observable<any> {
    const url = `${environment.baseurl}/profilephotos/GetById?id=${id}`;
    return this.http.get<Blob>(url, { observe: 'response', responseType: 'blob' as 'json' })
      ;
  }

  public getPatientReferenceNumberTypes(): Observable<ReferenceNumberTypes[]> {
    const url = `${environment.baseurl}/patientReferenceNumberTypes/getReferenceNumberTypes`;
    return this.http.get<ReferenceNumberTypes[]>(url);
  }

  public deletePatientReferenceNumberType(uniqueNo: number): Observable<GenericResponse> {
    const url = `${environment.baseurl}/patientReferenceNumberTypes/${uniqueNo}`;
    return this.http.delete<GenericResponse>(url);
  }

  public getContactTypes(): Observable<ContactTypeViewModel[]> {
    const url = `${environment.baseurl}/site/getContactTypesForSite`;
    return this.http.get<ContactTypeViewModel[]>(url);
  }

  public getContactTelecomTypes(): Observable<TelecomTypes[]> {
    const url = `${environment.baseurl}/site/getContactTelecomTypes`;
    return this.http.get<TelecomTypes[]>(url);
  }

  public updateContactTelecomTypes(model: TelecomTypes): Observable<boolean> {
    const url = `${environment.baseurl}/site/updateContactTelecomTypes`;
    return this.http.patch<boolean>(url, model);
  }

  public isSitePatientZoneEnabled(): Observable<boolean> {
    const url = `${environment.baseurl}/site/isSitePatientZoneEnabled`;
    return this.http.get<boolean>(url);
  }

  public isSingleSpecialist(): Observable<boolean> {
    const url = `${environment.baseurl}/site/isSingleSpecialist`;
    return this.http.get<boolean>(url);
  }

  public getRelatedPersonTypes(): Observable<RelatedPersonsTypeViewModel[]> {
    const url = `${environment.baseurl}/site/getRelatedPersonTypes`;
    return this.http.get<RelatedPersonsTypeViewModel[]>(url);
  }

  public getReminderLetterTimescales(siteId: string): Observable<ReminderLetterTimescalesViewModel[]> {
    const url = `${environment.baseurl}/site/getReminderLetterTimescales/${siteId}`;
    return this.http.get<ReminderLetterTimescalesViewModel[]>(url);
  }

  public updateReminderLetterTimescales(model: ReminderLetterTimescalesViewModel): Observable<boolean> {
    const url = `${environment.baseurl}/site/updateReminderLetterTimescales`;
    return this.http.patch<boolean>(url, model);
  }

  public getInvoiceNumberDetails(): Observable<InvoiceNumberViewModel> {
    const url = `${environment.baseurl}/site/getInvoiceNumberDetails`;
    return this.http.get<InvoiceNumberViewModel>(url);
  }

  public updateInvoiceNumberDetails(model: InvoiceNumberViewModel): Observable<boolean> {
    const url = `${environment.baseurl}/site/updateInvoiceNumberDetails`;
    return this.http.patch<boolean>(url, model);
  }

  public updatePaymentType(model: GenericViewModel): Observable<boolean> {
    const url = `${environment.baseurl}/site/updatePaymentMethod`;
    return this.http.patch<boolean>(url, model);
  }

  public deletePaymentMethod(uniqueNo: number) {
    const url = `${environment.baseurl}/site/deletePaymentMethod/${uniqueNo}`;
    return this.http.delete(url);
  }

  public getTemplates(): Observable<DocumentTemplateViewModel[]> {
    const url = `${environment.baseurl}/site/getTemplates`;
    return this.http.get<DocumentTemplateViewModel[]>(url);
  }

  public getTemplatesByType(uniqueNo: number): Observable<DocumentTemplateViewModel[]> {
    const url = `${environment.baseurl}/site/getTemplatesByType/${uniqueNo}`;
    return this.http.get<DocumentTemplateViewModel[]>(url);
  }

  public getTemplatesByCategoryType(catNo: number): Observable<DocumentTemplateViewModel[]> {
    const url = `${environment.baseurl}/site/getTemplatesByCategory/${catNo}`;
    return this.http.get<DocumentTemplateViewModel[]>(url);
  }

  public copyFileRemote(mycopyfiledata: CopyFileModel): Observable<boolean> {
    console.log('copyfile:', mycopyfiledata);
    const url = `${environment.documentApiUrl}/home/CopyTemplateFile`;
    return this.http.post<boolean>(url, mycopyfiledata);
  }

  public getTemplate(templateId: string): Observable<DocumentTemplateViewModel> {
    const url = `${environment.baseurl}/site/getTemplate/${templateId}`;
    return this.http.get<DocumentTemplateViewModel>(url);
  }

  public getSitePreferences(): Observable<SiteViewModel> {
    const url = `${environment.baseurl}/site/getSitePreferences`;
    return this.http.get<SiteViewModel>(url);
  }

  public updateSitePreferences(model: SiteViewModel) {
    const url = `${environment.baseurl}/site/updateSitePreferences`;
    return this.http.patch(url, model);
  }

  public isSitePatientZonePending(): Observable<string> {
    const url = `${environment.baseurl}/site/isSitePatientZonePending`;
    return this.http.get<string>(url);
  }

  telecomTypes$ = this.http.get<TelecomTypes[]>(`${environment.baseurl}/site/getGlobalTelecomTypes`).pipe();

  public getSitePayeeProvider(): Observable<PayeeProviderModel> {
    const url = `${environment.baseurl}/site/getCurrentSitePayeeProvider`;
    return this.http.get<PayeeProviderModel>(url);
  }

  public updateCurrentSitePayeeProvider(model: PayeeProviderModel): Observable<ResponseModel> {
    const url = `${environment.baseurl}/site/updateCurrentSitePayeeProvider`;
    return this.http.put<ResponseModel>(url, model);
  }

  public getSites(): Observable<SiteAdminModel[]> {
    const url = `${environment.baseurl}/site/getSites`;
    return this.http.get<SiteAdminModel[]>(url);
  }

  public getSiteAccessRoles(): Observable<string[]> {
    const url = `${environment.baseurl}/site/getSiteAccessRoles`;
    return this.http.get<string[]>(url);
  }

  public getSitePatientzone(): Observable<boolean> {
    const url = `${environment.baseurl}/site/getSitePatientzone`;
    return this.http.get<boolean>(url);
  }

  public getBureauSites(): Observable<BureauSites[]> {
    const url = `${environment.baseurl}/site/getBureauSites`;
    return this.http.get<BureauSites[]>(url);
  }

  public deleteEdiAddress(id: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/glu_EDIInsurerAddress/deleteAddress?id=${id}`;
    return this.http.delete<GenericResponse>(url);
  }

  public getTaskCounts(): Observable<TaskCountModel> {
    const url = `${environment.baseurl}/invoiceTasks/getTaskCounts`;
    return this.http.get<TaskCountModel>(url);
  }

  public getPaymentAge(): Observable<PaymentAgeModel[]> {
    const url = `${environment.baseurl}/paymentAge/getAll`;
    return this.http.get<PaymentAgeModel[]>(url).pipe(map((x:any)=>{      
      return x.data
    }));
  } 
} 

export class TaskCountModel {
  upcomingCount: number;
  dueCount: number;
}

export class CopyFileModel {
  SourceFile: string;
  DestinationFile: string;
  Overwrite: boolean;
  SiteID: Guid;
  SiteRef: string;
  Context: string;
  Token: string;
  DestinationFolder: string;
}

export class InvoiceNumberViewModel {
  uniqueNo: number;
  nextNumber: number;
  autoIncrement: boolean;
  prefix: string;
  suffix: string;
  minLength: number | null;
  maxLength: number | null;
}

export class ReminderLetterTimescalesViewModel {
  invoiceTypeId: string;
  siteId: string;
  uniqueNo: number;
  reminder1DaysDelayFromInv: number;
  reminder2DaysDelayFromReminder1: number;
  reminder3DaysDelayFromReminder2: number;
  reminder4DaysDelayFromReminder3: number;
  reminder5DaysDelayFromReminder4: number;
  reminder5RepeatEveryXDays: number;
  invoiceType: string;

}
export class DocumentTemplateViewModel {
  templateId: string;
  siteId: string;
  siteRef: string;
  category: number;
  description: string;
  fileName: string;
  comments: string;
  default: boolean;
  type: number;
  categoryDescription: string;
  typeDescription: string;
  isPatientZone: boolean;

}

export class RelatedPersonsTypeViewModel {
  description: string;
  active: boolean;
  rank: number;
  relatedPersonType: string;
  uniqueNo: number;
}

export class PaymentAgeModel {
  paymentAgeId: Guid | null;
  payorTypeId: InvoicePayorTypeEnum | null;
  payorType: string;
  description: string;
  band1Start: number | null;
  band1End: number | null;
  band2Start: number | null;
  band2End: number | null;
  band3Start: number | null;
  band3End: number | null;
  band4Start: number | null;
  band4End: number | null;
  band1: string;
  band2: string;
  band3: string;
  band4: string;
}

export enum InvoicePayorTypeEnum {
  Insurer = 1,
  Patient = 2,
  Contact = 3,
  Relative = 4
}

export class AddressTypeViewModel {
  uniqueNo: number;
  description: string;
}

export class SiteDetailsModel {
  siteId?: Guid | null;
  parentSiteId?: string | null;
  uniqueNo?: number | null;
  siteName?: string | null;
  siteRef?: string | null;
  ePracticeVariant?: string | null;
  contactName?: string | null;
  contactNumber?: string | null;
  contactRole?: string | null;
  subscriptionId?: string | null;
  subscriptionExpiry?: Date | null;
  dateTimeFormat?: string | null;
  shortDateFormat?: string | null;
  longDateFormat?: string | null;
  currencySymbol?: string | null;
  currencyCode?: string | null;
  financialYearStart?: Date | null;
  financialYearEnd?: Date | null;
  financialLockDate?: Date | null;
  financialLock?: boolean | null;
  autoAnalyseBulkPayment?: boolean | null;
  pzOrganisationCode?: string | null;
  pzApiKey?: string | null;
  pzRegistrationReference?: string | null;
  pzEnabled?: boolean | null;
  pzInvoices?: boolean | null;
  pzShortfalls?: boolean | null;
  pzReallocations?: boolean | null;
  pzReminders?: boolean | null;
  pzCredit?: boolean | null;
  hcClientSecret?: string | null;
  hcApiUserId?: string | null;
  hcApiPassword?: string | null;
  minimumSlotDuration?: number | null;
  siteNotes?: string | null;
  documentReference?: string | null;
  useDefaultCancellationEmail: boolean;
  useDefaultCancellationLetter: boolean;
  useDefaultCancellationSms: boolean;
  useDefaultConfirmationEmail: boolean;
  useDefaultConfirmationLetter: boolean;
  useDefaultConfirmationSms: boolean;
  useDefaultReceipt: boolean;
  isSingleSpecialist?: boolean | null;
  hasChildSites?: boolean | null;
  active?: boolean | null;
  siteAddressId: Guid | null;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  address4: string | null;
  postcode: string | null;
}

export class PayeeProviderModel {
  uniqueNo: number | null;
  hcCode: string | null;
  practitionerCode: string | null;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  address4: string | null;
  postcode: string | null;
}

export class SiteAdminModel {
  siteId?: string | null;
  siteRef?: string | null;
  siteName?: string | null;
  ePracticeVariant?: string | null;
  siteActive?: boolean | null;
  siteAddress1?: string | null;
  siteAddress2?: string | null;
  siteAddress3?: string | null;
  siteAddress4?: string | null;
  sitePostcode?: string | null;
  payeeProviderHcCode?: string | null;
  payeeProviderDisplayName?: string | null;
  payeeProviderLastName?: string | null;
  payeeProviderFirstName?: string | null;
  payeeProviderTitle?: string | null;
  payeeProviderAddress1?: string | null;
  payeeProviderAddress2?: string | null;
  payeeProviderAddress3?: string | null;
  payeeProviderAddress4?: string | null;
  payeeProviderPostcode?: string | null;
  payeeProviderPractitionerCode?: string | null;
}

export class BureauSites {
  siteId: string;
  siteName: string;
}
