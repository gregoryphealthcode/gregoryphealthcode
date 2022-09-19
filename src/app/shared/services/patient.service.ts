import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  PatientDetailsModel, PatientAddress, PatientReferenceNumber,
  PatientTelecom, DataPoint, PatientDetailsResponseModel
} from './app-info.service';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservedValueOf } from 'rxjs';
import Guid from 'devextreme/core/guid';
import { PatientBalance } from 'src/app/pages/patient-details/PatientBalance';
import { Address, AddressResponseModel, PatientContactDetails, TelecomsViewModel } from './contact.service';
import { ResponseModel } from '../models/ResponseModel';
import { EditPatientRequest, AddPatientRequest } from '../models/AddEditPatientRequestBase';
import { PatientNoteDocumentModel } from '../models/PatientNoteDocumentModel';
import { GenericResponse } from '../models/GenericResponseModel';
import { PatientNoteModel } from './patient-note.service';
import { GenerateBatchComponent } from 'src/app/pages/documents/generate-batch/generate-batch.component';
import { DateTimeSummaryOptionsModel } from 'devexpress-reporting/scopes/reporting-chart-internal-series';
import { map } from 'rxjs/operators';

export class UpdatePatientAddress {
  AddressId: string;
  PatientId: string;
  AddressType: string;
  Rank: number;
  PrimaryAddress: boolean;
  BillingAddress: boolean;
  Address1: string;
  Address2: string;
  Address3: string;
  Address4: string;
  Postcode: string;
  Country: string;
  Longitude: number;
  Latitude: number;
  SiteId: string;
  UniqueNo: number;
}

export class UpdatePatientReferenceNumber {
  ReferenceNumberId: string;
  SiteId: string;
  PatientId: string;
  RefNoType: string;
  RefNoValue: string;
  PrimaryRefNo: boolean;
  Rank: number;
  UniqueNo: number;
}


export class UpdatePatientTelecom {
  TelecomId: string;
  SiteId: string;
  Patientid: string;
  TelecomSystem: string;
  TelecomValue: string;
  Rank: number;
  Preferred: boolean;
  Usage: string;
  UniqueNo: number;
}


export class UpdatePatientModel {
  UserId: Guid;
  UniqueNo: number;
  PatientId: Guid;
  SiteId: Guid;
  Inactive: boolean;
  InactiveReason: string;
  LastName: string;
  LastNamePhonex: string;
  FirstName: string;
  OtherInitials: string;
  Title: string;
  Gender: string;
  BirthDate: Date;
  Deceased: boolean;
  DeceasedDate: Date;
  PrimaryAddress: Guid;
  BillingAddress: Guid;
  PrimaryGP: Guid;
  PrimaryInsurer: Guid;
  PrimaryTelecom: Guid;
  PrimaryRefNo: Guid;
  patientAddresses: Array<UpdatePatientAddress>;
  patientReferenceNumbers: Array<UpdatePatientReferenceNumber>;
  deletedReferenceNumbers: Array<PatientReferenceNumber>;
  patientTelecoms: Array<UpdatePatientTelecom>;
  deletedTelecoms: Array<PatientTelecom>;
  patientBalance: Array<PatientBalance>;
  dataPoints: Array<DataPoint>;
  deletedDatapoints: Array<DataPoint>;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private http: HttpClient) {
  }
  /* public getTitles(): any {
    const url = `${environment.odataBaseurl}llu_Titles`;
    return this.http.get<any>(url);
  } */

  public getPatientsGrid(): Observable<BasicPatientDetailsViewModel[]> {
    const url = `${environment.baseurl}/search/getPatients`;
    return this.http.get<BasicPatientDetailsViewModel[]>(url);
  }

  public getPatientId(siteId: string): Observable<any> {
    const url = `${environment.baseurl}/PatientDetails/GetPatientNumber/${siteId}`;

    return this.http.get<any>(url);
  }

  public getPatientDetails(patientId: string): Observable<PatientDetailsResponseModelNew> {
    const url = `${environment.baseurl}/PatientDetails/getPatientDetails?patientId=${patientId}`;

    return this.http.get<PatientDetailsResponseModelNew>(url);
  }

  public getQuickSearchViewRecords() {
    const url = `${environment.baseurl}/PatientDetails/getForQuickSearchView`;
    return this.http.get(url)
      .pipe(map((x: any) => {
        x.data.forEach(element => {
          element.name = element.lastName + ' ' + element.firstName;
        });
        return x.data
      }));
  }

  public getPatientQuickDetails(patientId: string): Observable<GetPatientQuickDetailsResponse> {
    const url = `${environment.baseurl}/PatientDetails/getPatientQuickDetails?patientId=${patientId}`;

    return this.http.get<GetPatientQuickDetailsResponse>(url);
  }

  public getBasicPatientDetails(patientId: string): Observable<any> {
    const url = `${environment.baseurl}/PatientDetails/getBasicPatientDetails?patientId=${patientId}`;
    return this.http.get<BasicPatientDetailsViewModel>(url);
  }

  public updatePatientInsurer(patientInsurerViewModel: PatientInsurerViewModel): Observable<PatientInsurerViewModel[]> {
    const url = `${environment.baseurl}/PatientDetails/updatePatientInsurer`;
    return this.http.post<PatientInsurerViewModel[]>(url, patientInsurerViewModel);
  }

  public getPatientInsurers(patientId: string): Observable<PatientInsurerViewModel[]> {
    const url = `${environment.baseurl}/PatientDetails/getPatientInsurers/${patientId}`;

    return this.http.get<PatientInsurerViewModel[]>(url);
  }

  public getPatientPrimaryAddress(patientId: Guid): Observable<Address> {
    const url = `${environment.baseurl}/patientAddress/getPrimaryAddress?patientId=${patientId}`;
    return this.http.get<Address>(url);
  }

  public deletePatientInsurer(patientInsurerId: string): Observable<boolean> {
    const url = `${environment.baseurl}/PatientDetails/deletePatientInsurer/${patientInsurerId}`;
    return this.http.delete<boolean>(url);
  }

  public getAccounts(patientId: string): Observable<PatientAccountsViewModel[]> {
    const url = `${environment.baseurl}/PatientDetails/getPatientInvoices/${patientId}`;

    return this.http.get<PatientAccountsViewModel[]>(url);
  }

  public getNotes(patientId: string): Observable<PatientNoteModel[]> {
    const url = `${environment.baseurl}/PatientDetails/getPatientNotes?patientId=${patientId}`;
    return this.http.get<PatientNoteModel[]>(url);
  }

  public getSmsTexts(patientId: Guid): Observable<PatientSmsTextViewModel[]> {
    const url = `${environment.baseurl}/PatientDetails/getSmsTexts?patientId=${patientId}`;
    return this.http.get<PatientSmsTextViewModel[]>(url);
  }

  public getActivityLogs(patientId: string, isSummary: boolean): Observable<PatientActivityLogsViewModel[]> {
    const url = `${environment.baseurl}/PatientDetails/getPatientActivityLog/${patientId}/${isSummary}`;
    return this.http.get<PatientActivityLogsViewModel[]>(url);
  }

  public getCorrespondenceCounts(patientId: string): Observable<GetPatientCorrespondenceCountsQueryResponseModel> {
    const url = `${environment.baseurl}/PatientDetails/${patientId}/getCorrespondenceCounts`;
    return this.http.get<GetPatientCorrespondenceCountsQueryResponseModel>(url);
  }

  public getAddresses(patientId: string): Observable<Address[]> {
    const url = `${environment.baseurl}/PatientDetails/getPatientAddresses/${patientId}/`;
    return this.http.get<Address[]>(url);
  }

  public getContacts(patientId: string): Observable<PatientContactDetails[]> {
    const url = `${environment.baseurl}/PatientDetails/getPatientContacts?patientId=${patientId}`;
    return this.http.get<PatientContactDetails[]>(url);
  }

  public getPatientTelecoms(patientId: string): Observable<PatientTelecom[]> {
    const url = `${environment.baseurl}/PatientDetails/getPatientTelecoms?patientId=${patientId}`;
    return this.http.get<PatientTelecom[]>(url);
  }

  public getPatientTelecomDetails(telecomId: string): Observable<PatientTelecom> {
    const url = `${environment.baseurl}/PatientDetails/getPatientTelecomDetails?telecomId=${telecomId}`;
    return this.http.get<PatientTelecom>(url);
  }

  public updatePatientAddress(addressModel: Address): Observable<AddressResponseModel> {
    const url = `${environment.baseurl}/PatientDetails/updatePatientAddress`;
    return this.http.post<AddressResponseModel>(url, addressModel);
  }

  public deletePatientAddress(addressId: Guid): Observable<GenericResponse> {
    const url = `${environment.baseurl}/PatientDetails/deletePatientAddress?addressId=${addressId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public addPatientTelecom(model: PatientTelecom): Observable<GenericResponse> {
    const url = `${environment.baseurl}/PatientDetails/addPatientTelecom`;
    return this.http.post<GenericResponse>(url, model);
  }

  public updatePatientTelecom(model: PatientTelecom): Observable<GenericResponse> {
    const url = `${environment.baseurl}/PatientDetails/updatePatientTelecom`;
    return this.http.put<GenericResponse>(url, model);
  }

  public deletePatientTelecom(telecomId: string): Observable<boolean> {
    const url = `${environment.baseurl}/PatientDetails/deletePatientTelecom?telecomId=${telecomId}`;
    return this.http.delete<boolean>(url);
  }

  public deletePatientContact(uniqueNo: number): Observable<boolean> {
    const url = `${environment.baseurl}/PatientDetails/deletePatientContact?uniqueNo=${uniqueNo}`;
    return this.http.delete<boolean>(url);
  }

  public getPatientDataPoints(patientId: Guid, category: string): Observable<DataPointItemsModel[]> {
    const url = `${environment.baseurl}/patientDataPoints/getPatientDataPoints?patientId=${patientId}&category=${category}`;
    return this.http.get<DataPointItemsModel[]>(url);
  }

  public getDataPointItems(category: string): Observable<DataPointItemsModel[]> {
    const url = `${environment.baseurl}/patientDataPoints/getDataPointItems?category=${category}`;
    return this.http.get<DataPointItemsModel[]>(url);
  }

  public getPatientDataPointDetails(dataPointId: Guid): Observable<DataPointItemsModel> {
    const url = `${environment.baseurl}/PatientDataPoints/getPatientDataPointDetails?dataPointId=${dataPointId}`;
    return this.http.get<DataPointItemsModel>(url);
  }

  public addPatientDataPoint(model: DataPointItemsModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/patientDataPoints/addPatientDataPoint`;
    return this.http.post<GenericResponse>(url, model);
  }

  public updatePatientDataPoint(model: DataPointItemsModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/patientDataPoints/updatePatientDataPoint`;
    return this.http.put<GenericResponse>(url, model);
  }

  public deletePatientDataPoint(dataPointId: Guid): Observable<GenericResponse> {
    const url = `${environment.baseurl}/patientDataPoints/deletePatientDataPoint?dataPointId=${dataPointId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public getPatientReferenceNumbers(patientId: string): Observable<PatientReferenceNumber[]> {
    const url = `${environment.baseurl}/PatientDetails/getPatientReferenceNumber/${patientId}`;
    return this.http.get<PatientReferenceNumber[]>(url);
  }

  public getPatientMainInsurer(patientId: string): Observable<PatientMainInsurerViewModel> {
    const url = `${environment.baseurl}/PatientDetails/getPatientMainInsurer/${patientId}`;
    return this.http.get<PatientMainInsurerViewModel>(url);
  }

  public updatePatientReferenceNumbers(model: PatientReferenceNumber): Observable<PatientReferenceNumber[]> {
    const url = `${environment.baseurl}/PatientDetails/updatePatientReferenceNumber`;
    return this.http.post<PatientReferenceNumber[]>(url, model);
  }

  public deletePatientReferenceNumber(referenceNumberId: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/patientReferenceNumbers/${referenceNumberId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public deletePatientReferenceNumberType(referenceNumberId: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/PatientDetails/deletePatientReferenceNumber/${referenceNumberId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public getPatientBalance(patientId: string): Observable<PatientBalanceViewModel> {
    const url = `${environment.baseurl}/PatientDetails/getPatientBalance/${patientId}`;
    return this.http.get<PatientBalanceViewModel>(url);
  }

  public updatePatientBalance(model: PatientBalanceViewModel): Observable<PatientBalanceViewModel> {
    const url = `${environment.baseurl}/PatientDetails/updatePatientBalance`;
    return this.http.post<PatientBalanceViewModel>(url, model);
  }

  public editPatientAddressTelecom(model: PatientDetailsModel): Observable<PatientDetailsModel> {
    const url = `${environment.baseurl}/PatientDetails/editPatientAddress`;
    return this.http.put<PatientDetailsModel>(url, model);
  }

  public editPatientDetails(model: PatientDetailsModel): Observable<PatientDetailsModel> {
    const url = `${environment.baseurl}/PatientDetails/editPatientDetails`;
    return this.http.put<PatientDetailsModel>(url, model);
  }

  public addPatient(patientDetails: PatientDetailsModel): Observable<PatientDetailsResponseModel> {
    const url = `${environment.baseurl}/PatientDetails/addPatient`;
    return this.http.post<PatientDetailsResponseModel>(url, patientDetails);
  }

  public checkDuplicatePatient(lastName: string, firstName: string, birthDate: string): Observable<PatientDetailsModel[]> {
    const url = `${environment.baseurl}/patientDetails/checkDuplicatePatient?lastName=${lastName}&firstName=${firstName}&birthDate=${birthDate}`;
    return this.http.get<PatientDetailsModel[]>(url);
  }

  public getPatients(siteId: string): Observable<BasicPatientDetailsViewModel[]> {
    const url = `${environment.baseurl}/PatientDetails/getPatients/${siteId}`;
    return this.http.get<BasicPatientDetailsViewModel[]>(url);
  }

  public deletePatientNote(mydeletenote: any): Observable<any> {
    const url = `${environment.baseurl}/PatientNotes/DeletePatientNote`;
    return this.http.post<any>(url, mydeletenote);
  }
  public getRecentlySelectedPatients(): Observable<BasicPatientDetailsViewModel[]> {
    const url = `${environment.baseurl}/PatientDetails/getRecentlySelectedPatients/`;
    return this.http.get<BasicPatientDetailsViewModel[]>(url);
  }

  public deletePatient(patientId: string): Observable<boolean> {
    const url = `${environment.baseurl}/PatientDetails/deletePatient?patientId=${patientId}`;
    return this.http.delete<boolean>(url);
  }

  public getPatientSearchTabsCounts(startDate: string): Observable<GetPatientSearchTabsCountResponseModel> {
    const url = `${environment.baseurl}/PatientDetails/getPatientSearchTabsCounts?startDate=${startDate}`;
    return this.http.get<GetPatientSearchTabsCountResponseModel>(url);
  }

  public setPatientRecentlySelected(patientId: Guid): Observable<GenericResponse> {
    const url = `${environment.baseurl}/patientDetails/setPatientRecentlySelected?patientId=${patientId}`;
    return this.http.post<GenericResponse>(url, patientId);
  }

  public getPatientAllergyCount(patientId: Guid): Observable<any[]> {
    const url = `${environment.baseurl}/PatientDetails/getPatientAllergyCount?patientId=${patientId}`;
    return this.http.get<any[]>(url);
  }

  public getPatientDataPointsCount(patientId: Guid): Observable<DataPointItemsModel[]> {
    const url = `${environment.baseurl}/PatientDetails/getPatientDataPointsCount?patientId=${patientId}`;
    return this.http.get<DataPointItemsModel[]>(url);
  }

  public getPatientWaitingListEntries(patientId: Guid): Observable<WaitingListModel[]> {
    const url = `${environment.baseurl}/waitinglist/getAllByPatientId?patientId=${patientId}`;
    return this.http.get<WaitingListModel[]>(url);
  }

  public deletePatientWaitingListEntry(waitingListId: Guid): Observable<GenericResponse> {
    const url = `${environment.baseurl}/patientWaitingList?waitingListId=${waitingListId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public shareMedsecPatientWithSite(model: ShareModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/patientDetails/share`;
    return this.http.post<GenericResponse>(url, model);
  }

  public getPatientCommunicationSummary(patientId: string): Observable<PatientCommunicationSummaryModel[]> {
    const url = `${environment.baseurl}/patientDetails/getPatientDocumentSummary?patientId=${patientId}`;
    return this.http.get<PatientCommunicationSummaryModel[]>(url);
  }

  public getPatientSms(patientId: Guid): Observable<PatientSmsModel[]> {
    const url = `${environment.baseurl}/sms/getAll?patientId=${patientId}`;
    return this.http.get<PatientSmsModel[]>(url);
  }
  
  public getPatientPhoneNumbers(patientId: string): Observable<PatientTelecom[]> {
    const url = `${environment.baseurl}/PatientDetails/getPatientPhoneNumbers?patientId=${patientId}`;
    return this.http.get<PatientTelecom[]>(url);
  }
}

export class PatientSmsTextViewModel {
  smsDateTime: Date;
  status: string;
  phoneNumber: string;
  messageText: string;
  ago: string;
}

export class PatientCorrespondenceViewModel {
  correspondenceType: string;
  fileType: string;
  comments: string;

  correspondenceDate: Date;
  dateCreated: Date;

  authorName: string;
  typedByName: string;
  sentOrReceived: string;
}

export class PatientActivityLogsViewModel {

  uniqueNo: number;
  systemLogId: string;
  eventDateTime: Date;
  eventCategory: string;
  eventCode: string;
  reportedBy: string;
  details: string;
  otherSource: string;
  userEmail: string;
  userName: string;
}

export class PatientDetailsResponseModelNew {
  patientId: Guid;
  siteId: Guid;
  lastName: string;
  firstName: string;
  displayName: string;
  title: string;
  age: number;
  birthDate: Date;
  gender: string;
  sendViaPatientzone: boolean;
  inactive: boolean;
  inactiveReason: string;
  deceased: boolean;
  deceasedDate: Date;
  noChase: string;
  onStop: boolean;
  onWaitingList: boolean;
  email: string;
  mobileNumber: string;
  draftInvoiceCount: number | null;
  address: {
    addressType: number;
    primaryAddress: boolean;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    country: string;
    postcode: string;
  }
}

export interface GetPatientQuickDetailsResponse {
  patientId: string;
  displayName: string;
  lastName: string;
  firstName: string;
  title: string;
  birthDate: string;
  age: number;
}

export class PatientInsurerViewModel {
  uniqueNo: number;
  patientId: string;
  patientInsurerId: string;
  insurerId: string;
  description: string;
  scheme: string;
  renewalDate: Date;
  registrationNumber: number;
  isPrimary: boolean;
  logoUrl: string;
  requiresDiagnosisCode: boolean;
  deliveryMethodType: string;
  invoiceType: string;
  hcCode: string;
  sendViaPatientzone: boolean;
  insurerName: string;
  isInsurer: boolean;
  isPatientZone: boolean;
  address: PatientAddress;
}

export class PatientBalanceViewModel {
  balanceDue: number;
  onStop: boolean;
  doNotChase: boolean;
  doNotChaseUntil: Date;
  paymentPlan: boolean;
  paymentPlanId: Guid;
  notes: string;
  patientId: Guid;
  siteId: Guid;
  uniqueNo: number;
}

export interface PatientMainInsurerViewModel {
  insurerName: string;
  registrationNumber: string;
  logoUrl: string;
  expiryDate: Date;
}

export class CorrectedPatientDetails {
  patientId: Guid;
  siteId: Guid;
  inactive: boolean;
  inactiveReason: string;
  lastName: string;
  lastNamePhonex: string;
  firstName: string;
  otherInitials: string;
  title: string;
  gender: string;
  birthDate: Date;
  age: number;
  deceased: boolean;
  deceasedDate: Date;
  patientAddresses: Array<PatientAddress>;
  patientReferenceNumbers: Array<PatientReferenceNumber>;
  deletedReferenceNumbers: Array<PatientReferenceNumber>;
  patientTelecoms: Array<PatientTelecom>;
  deletedTelecoms: Array<PatientTelecom>;
  dataPoints: Array<DataPoint>;
  deletedDatapoints: Array<DataPoint>;
  patientBalance: Array<PatientBalanceViewModel>;
  sendViaPatientzone: boolean;
}


export class PatientAccountsViewModel {
  invoiceId: Guid | null;
  patientId: Guid | null;
  //siteId: Guid | null;
  recipientId: Guid | null;
  //parentId: Guid | null;
  uniqueNo: number | null;
  invoiceNumber: string | null;
  invoiceType: string | null;
  invoiceDate: Date | null;
  invoiceTotal: number | null;
  amountDue: number | null;
  payorType: string | null;
  status: string | null;
}

export class PatientNotesViewModel {
  dateCreated: Date;
  noteType: string;
  popup: boolean;
  warning: boolean;
  createdBy: string;
  uniqueNo: number;
  noteText: string;
  id: string;
  patientId: string;
  attachments: PatientNoteDocumentModel[];
  visibility: number;

}

export class BasicPatientDetailsViewModel {
  patientId: Guid;
  siteId: Guid;
  inactive: boolean;
  inactiveReason: string;
  lastName: string;
  lastNamePhonex: string;
  firstName: string;
  otherInitials: string;
  title: string;
  gender: string;
  identifiesAs: string;
  birthDate: Date;
  age: number;
  deceased: boolean;
  deceasedDate: Date;
  postcode: string;
  validatedDuplicateCheck: boolean;
  refNumber: string;
  refType: string;
  startDateTime: Date;
  endDateTime: Date;
  noChase: boolean;
  onStop: boolean;
  sendViaPatientzone: boolean;
  attachments: PatientNoteDocumentModel[];
  referenceNumber: string;
  telecoms: string[];
  telecom: string;
  insurer: string;
  invoices: string[];
  addresses: Address[];
  recentlySelected: recentlySelectedModel;
  balance: number | null;
  lastSelected: Date | null;
  lastModified: Date | null;
  dateCreated: Date | null;
}

export class recentlySelectedModel {
  userId: Guid | null;
  dateTimeSelected: Date | null;
}

export class PatientDataPointItemsViewModel {
  uniqueNo: number;
  dataPointId: Guid;
  siteId: Guid;
  patientId: Guid;
  dataCategory: string;
  dataItem: string;
  dataValue1: string;
  data2Description: string;
  data2Value: string;
  data3Description: string;
  data3Value: string;
  comment: string;
  dataCategoryRank: number;
  dataItemRank: number;
  flagRed: boolean;
  flagAmber: boolean;
  flagGreen: boolean;
}


export class AddNewPatientViewModel {
  basicPatientDetailsViewModel: BasicPatientDetailsViewModel;
  patientReferenceNumber: PatientReferenceNumber[];
  address: Address;
  telecomsViewModel: PatientTelecom[];
  addAnother: boolean;
}

export interface AddEditPatientResponseBase {
  isDuplicate: boolean;
  duplicatePatients: DuplicatePatientDetails[];
}

export interface DuplicatePatientDetails {
  lastName: string;
  firstName: string;
  birthDate?: string;
  patientId?: string;
  siteId: string;
  gender: string;
  title: string;
  deceased?: boolean;
  deceasedDate?: string;
  postcode: string;
  noChase: boolean;
  sendViaPatientzone: boolean;
}

export interface AddPatientResponse extends AddEditPatientResponseBase {
  patientId: string;
}

export interface GetPatientSearchTabsCountResponseModel {
  totalPatientsCount: number | string;
  recentlySelectedCount: number;
  todaysAppointmentsCount: number;
}

export class DataPointItemsModel {
  dataPointId: Guid | null;
  patientId: Guid | null;
  siteId: Guid | null;
  uniqueNo: number | null;
  category: string | null;
  categoryRank: number | null;
  dataItemRank: number | null;
  value1Description: string | null;
  value1Type: string | null;
  value1Value: string | null;
  value1MaxLength: number | null;
  value1List: string | null;
  recordValue2: boolean | null;
  value2Description: boolean | null;
  value2Type: string | null;
  value2Value: string | null;
  value2MaxLength: number | null;
  value2List: string | null;
  recordValue3: boolean | null;
  value3Description: boolean | null;
  value3Type: string | null;
  value3Value: string | null;
  value3MaxLength: number | null;
  value3List: string | null;
  comment: string | null;
  recordComment: boolean | null;
  alwaysAdd: boolean | null;
  flagRed: boolean | null;
  flagAmber: boolean | null;
  flagGreen: boolean | null;
  active: boolean | null;
}

export class PreferenceDataPointItemsModel {
  siteId: Guid | null;
  uniqueNo: number | null;
  category: string | null;
  categoryRank: number | null;
  dataPointDescription: string | null;
  valueType: string | null;
  valueMaxLength: number | null;
  value1List: string | null;
  recordValue2: boolean | null;
  value2Description: boolean | null;
  value2Type: string | null;
  value2MaxLength: number | null;
  value2List: string | null;
  recordValue3: boolean | null;
  value3Description: boolean | null;
  value3Type: string | null;
  value3MaxLength: number | null;
  value3List: string | null;
  recordComment: boolean | null;
  alwaysAdd: boolean | null;
  active: boolean | null;
}
export interface GetPatientCorrespondenceCountsQueryResponseModel {
  completedCount: number;
  draftCount: number;
}

export class WaitingListModel {
  id: string;
  siteId: string;
  patientId: string;
  patientName: string;
  birthDate: Date;
  dateAdded: Date;
  appointmentTypeId: string;
  appointmentDescription: string;
  locationId: string;
  locationName: string;
  ownerId: string;
  ownerName: string;
  notes: string;
  priorty: boolean | null;
  duration: number | null;
}

export class ShareModel {
  id: string;
  siteIds: string[];
}

export class PatientCommunicationSummaryModel {
  id: string;
  type: string;
  details: string;
  text: string;
  fileType: string;
  created: Date | null;
  invoiceNumber: string;
  superseded?: boolean | null;
}

export class PatientSmsModel {
  id: number | null;
  smsDateTime: Date | null;
  status: string;
  phoneNumber: string;
  messageText: string;
  ago: number;
}