import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Guid from 'devextreme/core/guid';
import { UnavailableTypes } from './appointment.service';
import { Address } from './contact.service';
import { UserLoginRequest } from '../models/UserLoginRequest';
import { GetUserDetailsResponseModel } from '../models/UserLoginResponseViewModel';
import { UserAllowedSitesViewModel } from '../models/UserAllowedSitesViewModel';
import { UserSiteSelectResponseViewModel } from '../models/UserSiteSelectResponseViewModel';
import { ProcedureCodesViewModel } from '../models/ProcedureCodesViewModel';
import { SpecialistViewModel } from '../models/SpecialistViewModel';
import { TitlesViewModel } from '.';
import { ContactTypeViewModel } from '../models/ContactTypeViewModel';
import { PostAuthRequest } from '../models/PostAuthRequest';
import { NonceStateViewModel } from '../models/NonceStateViewModel';
import { AuthTokenResponseViewModel, RefreshTokenResponseViewModel } from '../models/RefreshTokenResponseViewModel';
import { SetupPinRequest } from '../models/SetupPinRequest';
import { GenericApiResponse } from '../models/GenericApiResponse';
import { PayorModel } from './billing.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) { }

  // NOTE - this also gets a new token which encodes the SiteId & access role
  public getUserSitePermissions(userId: string, siteId: string): Observable<any> {
    const url = `${environment.authserverBaseurl}/aspnetusers/getUserSitePermissions/${userId}/${siteId}`;
    return this.http.get<string>(url);
  }

  public addAuditLog(auditModel: AuditModel) {
    const url = `${environment.authserverBaseurl}/audit/recordAuditLog`;
    return this.http.post(url, auditModel);
  }

  public getConsultantsForSite(): Observable<SpecialistViewModel[]> {
    const url = `${environment.baseurl}/site/getSpecialists`;
    return this.http.get<SpecialistViewModel[]>(url);
  }

  public getConsultantsByTypeForSite(typeId: Guid): Observable<SpecialistViewModel[]> {
    const url = `${environment.baseurl}/site/getAllSpecialistsByType?typeId=${typeId}`;
    return this.http.get<SpecialistViewModel[]>(url);
  }

  public getTranslatorTypes(): Observable<TranslatorLanguages[]> {
    const url = `${environment.baseurl}/site/getTranslatorLanguages`;
    return this.http.get<TranslatorLanguages[]>(url);
  }

  public getAppointmentStatuses(): Observable<AppointmentStatusModel[]> {
    const url = `${environment.baseurl}/appointment/getAppointmentStatuses`;
    return this.http.get<AppointmentStatusModel[]>(url);
  }

  public getServiceTypes(): Observable<IndustryStandardCodesViewModel[]> {
    const url = `${environment.baseurl}/site/getServiceTypes`;
    return this.http.get<IndustryStandardCodesViewModel[]>(url);
  }

  public getProcedureCodes(code: string): Observable<ProcedureCodesViewModel[]> {
    const url = `${environment.baseurl}/invoiceServiceProcedures?searchTerms=${code}`;
    return this.http.get<ProcedureCodesViewModel[]>(url);
  }

  public searchIndustryCodes(code: string): Observable<IndustryStandardCodesViewModel[]> {
    const url = `${environment.baseurl}/site/searchIndustryCodes?code=${code}`;
    return this.http.get<IndustryStandardCodesViewModel[]>(url);
  }

  public getDNAReasons(): Observable<GenericViewModel[]> {
    const url = `${environment.baseurl}/site/getDNAReasons`;
    return this.http.get<GenericViewModel[]>(url);
  }

  public getInsurers(): Observable<InsurersViewModel[]> {
    const url = `${environment.baseurl}/site/getInsurers`;
    return this.http.get<InsurersViewModel[]>(url);
  }

  public getDischargeCodes(): Observable<DischargeCodesViewModel[]> {
    const url = `${environment.baseurl}/site/getDischargeCodes`;
    return this.http.get<DischargeCodesViewModel[]>(url);
  }

  public getDiagnosisCodes(code: string): Observable<DiagnosisCodesViewModel[]> {
    const url = `${environment.baseurl}/site/getDiagnosisCodes?searchTerms=${code}`;
    return this.http.get<DiagnosisCodesViewModel[]>(url);
  }

  public getPaymentMethodTypes(): Observable<MethodTypeModel[]> {
    const url = `${environment.baseurl}/site/getPaymentMethodTypes`;
    return this.http.get<MethodTypeModel[]>(url);
  }

  public getTransactionTypes(): Observable<GenericViewModel[]> {
    const url = `${environment.baseurl}/site/getTransactionTypes/`;
    return this.http.get<GenericViewModel[]>(url);
  }

  public getTaskTypes(): Observable<GenericViewModel[]> {
    const url = `${environment.baseurl}/site/getTaskTypes/`;
    return this.http.get<GenericViewModel[]>(url);
  }

  public getEpisodeTypes(): Observable<EpisodeTypes[]> {
    const url = `${environment.baseurl}/site/getEpisodeTypes`;
    return this.http.get<EpisodeTypes[]>(url);
  }

  public login(model: UserLoginRequest): Observable<AuthTokenResponseViewModel> {
    const url = `${environment.baseurl}/auth/login`;
    return this.http.post<AuthTokenResponseViewModel>(url, model);
  }

  public getAllowedSites(): Observable<UserAllowedSitesViewModel[]> {
    const url = `${environment.baseurl}/user/getAllowedSites`;
    return this.http.get<UserAllowedSitesViewModel[]>(url);
  }

  public selectSite(siteId: string): Observable<UserSiteSelectResponseViewModel> {
    const url = `${environment.baseurl}/user/selectSite`;
    return this.http.post<UserSiteSelectResponseViewModel>(url, { siteId });
  }

  public unselectSite(): Observable<UserSiteSelectResponseViewModel> {
    const url = `${environment.baseurl}/user/unselectSite`;
    return this.http.post<UserSiteSelectResponseViewModel>(url, {});
  }

  public getTitlesForSite(siteId: Guid): Observable<TitlesViewModel[]> {
    const url = `${environment.baseurl}/site/getTitles/${siteId}`;
    return this.http.get<TitlesViewModel[]>(url);
  }

  public getContactTypes(): Observable<ContactTypeViewModel[]> {
    const url = `${environment.baseurl}/site/getContactTypes`;
    return this.http.get<ContactTypeViewModel[]>(url);
  }

  public getPatientDataPointCategories(): Observable<
    DataPointCategoryViewModel[]
  > {
    const url = `${environment.baseurl}/site/getPatientDataPointCategories`;
    return this.http.get<DataPointCategoryViewModel[]>(url);
  }

  changePassword(userId: string, password: string, authenticatorcode: string) {
    const changepasswordUrl =
      environment.authserverBaseurl + '/aspnetusers/changepassword';

    return this.http.post<any>(changepasswordUrl, {
      userId,
      password,
      authenticatorcode,
    });
  }

  public validatePin(pin: string): Observable<any> {
    const url = `${environment.baseurl}/user/validatePin`;
    return this.http.post<boolean>(url, { pin });
  }

  public getUserDetails() {
    const url = `${environment.baseurl}/user/GetDetails`;
    return this.http.get<GetUserDetailsResponseModel>(url);
  }

  public onPostAuth(model: PostAuthRequest) {
    const url = `${environment.baseurl}/auth/postAuth`;
    return this.http.post<AuthTokenResponseViewModel>(url, model);
  }

  public logOut(model:any){
    const url = `${environment.baseurl}/auth/logout`;
    return this.http.post(url, model);
  }

  public setupPin(model: SetupPinRequest) {
    const url = `${environment.baseurl}/user/setupPin`;
    return this.http.put<GenericApiResponse>(url, model);
  }

  public refreshToken() {
    const url = `${environment.baseurl}/auth/refreshToken`;
    return this.http.post<RefreshTokenResponseViewModel>(url, {});
  }

  public getStateAndNonceToken(): Observable<NonceStateViewModel> {
    const url = `${environment.baseurl}/auth/getNonceAndState`;
    return this.http.get<NonceStateViewModel>(url);
  }

  public addRecentlyUsedDiagnosisCodes(model: DiagnosisCodesViewModel) {
    const url = `${environment.baseurl}/user/AddUserDiagnosisHistory`;
    return this.http.post(url, model);
  }

  public getRecentlyUsedDiagnosisCodes(): Observable<DiagnosisCodesViewModel[]> {
    const url = `${environment.baseurl}/user/GetUsersRecentlyUsedDiagnosis`;
    return this.http.get<DiagnosisCodesViewModel[]>(url);
  }

  public getAppointmentTypeCodes(): Observable<AppointmentTypesCodeViewModel[]> {
    const url = `${environment.baseurl}/site/getAppointmentTypeCodes`;
    return this.http.get<AppointmentTypesCodeViewModel[]>(url);
  }
  public getAppointmentSessionTypes(): Observable<AppointmentSessionTypesViewModel[]> {
    const url = `${environment.baseurl}/site/getAppointmentSessionTypes`;
    return this.http.get<AppointmentSessionTypesViewModel[]>(url);
  }

  public getDefaultProcedureCodes(siteId: string): Observable<ProcedureCodesViewModel[]> {
    const url = `${environment.baseurl}/site/getDefaultProcedureCodes?siteId=${siteId}`;
    return this.http.get<ProcedureCodesViewModel[]>(url);
  }

  public getUserTypes(): Observable<UserTypeModel[]> {
    const url = `${environment.baseurl}/user/getUserTypes`;
    return this.http.get<UserTypeModel[]>(url);
  }

  public getSitePayors(): Observable<PayorModel[]> {
    const url = `${environment.baseurl}/site/getAllPayors`;
    return this.http.get<PayorModel[]>(url);
  }
}

export class AppointmentSessionTypesViewModel {
  sessionTypeId: string;
  description: string;
}
export class AppointmentTypesCodeViewModel {
  id: string;
  codes: string;
}
export class PatientZoneViewModel {
  practiceDetails: PZPracticeDetails;
  userDetails: PZUserDetails;
  bankDetails: DirectDebitDetails;
  terms: boolean;
  siteId: string;

}

export class RegisterPractitionerViewModel {
  siteId: string;
  PatientZoneViewModel: PatientZoneViewModel[];
}

export class DirectDebitDetails {
  accountName: string;
  sortCode: string;
  accountNumber: number;
  bankName: string;
}

export class PZUserDetails {
  user: PZUser;
  address: Address;
  email: string;
  mobile: number;
}

export class PZPracticeDetails {
  address: Address;
  userDetails: PZUser;
  practiceName: string;
  practiceId: string;
  registrationType: string;
  useOrganisationBank: string;
  practitionerCode: string;
}

export class PZUser {
  lastName: string;
  firstName: string;
  title: string;
}

export class EpisodeTypes {
  episodeTypeId: number;
  episodeType: string;
  description: string;
  recordAdmitDate: boolean;
  recordDischargeDate: boolean;
  recordDischargeCode: boolean;
}

export class AgedDebtBandsViewModel {
  uniqueNo: number;
  contactType: string;
  citeId: string;
  band1: string;
  band2: string;
  band3: string;
  band4: string;
  typeId: string;
  siteId: string;
  band1Start: number;
  band2Start: number;
  band3Start: number;
  band4Start: number;
  band1End: number;
  band2End: number;
  band3End: number;
  band4End: number;
}
export class DiagnosisCodesViewModel {
  description: string;
  code: string;
  isPrimary: boolean;
}

export class DischargeCodesViewModel {
  description: string;
  code: string;
  dischargeCodeId: number;
}

export class InsurersViewModel {
  insurerId: string;
  uniqueNo: number;
  code: string;
  insurerName: string;
  logoUrl: string;
  notes: string;
  requiresDiagnosisCode: boolean;
  isSTV: boolean;

  constructor(t?: any) {
    if (t) {
      Object.assign(this, t);
    }
  }
}

export class GenericViewModel {
  description: string;
  uniqueNo: number;
  siteId: string;
  id: string;
}

export class MethodTypeModel {
  uniqueNo: number;
  description: string;
}

export class IndustryStandardCodesViewModel {
  description: string;
  code: string;
  requiresProcedureCode: boolean;
}

export class AuditModel {
  siteId: string;
  userId: string;
  details: string;
  eventCode: string;
  eventCategory: string;
  reportedBy: string;
  patientId: string;
  reason: string;
}

@Injectable()
export class TranslatorLanguages {
  description: string;
  uniqueNo: number;
}

export class AppointmentStatusModel {
  id: number;
  status: string;
}

export class DataPointCategoryViewModel {
  category: string;
  rank: number;
}

export class UserAdminModel {
  userId?: string | null;
  userName?: string | null;
  userTypeId?: number | null;
  userType?: string | null;
  pin?: string | null;
  forename?: string | null;
  surname?: string | null;
  email?: string | null;
  contactTel?: string | null;
  sites?: UserSiteAdminModel[] | null;
}

export class UserSiteAdminModel {
  siteId?: string | null;
  siteName?: string | null;
  siteRef?: string | null;
  accessRole?: string | null;
}

export class UserTypeModel {
  uniqueNo?: number | null;
  userTypeDescription?: string | null;
  description?: string | null;
}
