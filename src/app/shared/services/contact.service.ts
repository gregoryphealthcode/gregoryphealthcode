import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import Guid from 'devextreme/core/guid';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { ContactDetails } from '../models/ContactDetails';
import { ContactTypeViewModel } from '../models/ContactTypeViewModel';
import { BasicPatientDetailsViewModel } from './patient.service';
import { PatientAddress } from './app-info.service';
import { TelecomTypeEnum } from '../models/TelecomTypeEnum';
import { StreamInvocationMessage } from '@aspnet/signalr';
import { calendarFormat } from 'moment';
import { GenericResponse, GenericResponseModel } from '../models/GenericResponseModel';
import { map } from 'rxjs/operators';


@Injectable()
@AutoUnsubscribe
export class ContactService {
  constructor(private http: HttpClient) {
  }

  public getContacts(): Observable<ContactModel[]> {
    const url = `${environment.baseurl}/contact/getContacts`;
    return this.http.get<ContactModel[]>(url);
  }

  public addContact(specialistDetails: ContactViewModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/contact/addContact`;
    return this.http.post<GenericResponse>(url, specialistDetails);
  }

  public updateContact(specialistDetails: ContactViewModel): Observable<ContactDetailsModel> {
    const url = `${environment.baseurl}/contact/updateContact`;
    return this.http.put<ContactDetailsModel>(url, specialistDetails);
  }

  public deleteContact(contactId: string): Observable<boolean> {
    const url = `${environment.baseurl}/contact/deleteContact/${contactId}`;
    return this.http.delete<boolean>(url);
  }

  public getContactPreviewDetails(contactId: Guid): Observable<ContactDetailsModel> {
    const url = `${environment.baseurl}/contact/getContactPreviewDetails?contactId=${contactId}`;
    return this.http.get<ContactDetailsModel>(url).pipe(map(x => {
      if (x.addresses && x.addresses.length > 0) {
        x.primaryAddress = x.addresses.find(x => x.primaryAddress);
      }
      return x
    }));
  }

  public getContactDetails(contactId: Guid): Observable<ContactDetailsModel> {
    const url = `${environment.baseurl}/contact/getContactDetails?contactId=${contactId}`;
    return this.http.get<ContactDetailsModel>(url).pipe(map(x => {
      if (x.addresses && x.addresses.length > 0) {
        x.primaryAddress = x.addresses.find(x => x.primaryAddress);
      }
      return x
    }));
  }

  public getContactLinks(contactId: Guid): Observable<ContactLinkedContactsModel> {
    const url = `${environment.baseurl}/contact/getContactLinks?contactId=${contactId}`;
    return this.http.get<ContactLinkedContactsModel>(url);
  }

  public getContactDepartments(contactId: Guid): Observable<ContactDepartmentsModel> {
    const url = `${environment.baseurl}/contact/getContactDepartments?contactId=${contactId}`;
    return this.http.get<ContactDepartmentsModel>(url);
  }

  public getContactPatients(contactId: Guid): Observable<linkedPatientModel[]> {
    const url = `${environment.baseurl}/contact/getContactPatients?contactId=${contactId}`;
    return this.http.get<linkedPatientModel[]>(url);
  }

  public getContactReferenceDetails(patientId: string, contactId: string): Observable<ContactModel> {
    const url = `${environment.baseurl}/contact/getContactReferenceDetails?patientId=${patientId}&&contactId=${contactId}`;
    return this.http.get<ContactModel>(url);
  }

  //may need to be removed eventually
  public getContactAddress(contactId: string): Observable<Address> {
    const url = `${environment.baseurl}/contact/getContactAddress/${contactId}`;
    return this.http.get<Address>(url);
  }

  public getContactAddresses(contactId: string): Observable<Address[]> {
    const url = `${environment.baseurl}/contact/getContactAddresses/${contactId}`;
    return this.http.get<Address[]>(url);
  }

  public getContactAddressDetails(addressId: Guid): Observable<Address> {
    const url = `${environment.baseurl}/contact/getContactAddressDetails?addressId=${addressId}`;
    return this.http.get<Address>(url);
  }

  public addContactAddress(addressModel: Address): Observable<GenericResponse> {
    const url = `${environment.baseurl}/contact/addContactAddress`;
    return this.http.post<GenericResponse>(url, addressModel);
  }

  public updateContactAddress(addressModel: Address): Observable<boolean> {
    const url = `${environment.baseurl}/contact/updateContactAddress`;
    return this.http.put<boolean>(url, addressModel);
  }

  public deleteContactAddress(addressId: Guid): Observable<GenericResponse> {
    const url = `${environment.baseurl}/contact/deleteContactAddress?addressId=${addressId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public getConnections(contactId: Guid, siteId: Guid): Observable<ContactGridModel[]> {
    let url = `${environment.baseurl}/contact/getConnections?contactId=${contactId}&siteId=${siteId}`;
    return this.http.get<ContactGridModel[]>(url);
  }

  public addConnection(contactId: Guid, connectionId: Guid): Observable<boolean> {
    const url = `${environment.baseurl}/contact/addConnection`;
    return this.http.post<boolean>(url, { contactId, connectionId });
  }

  public linkPatient(model: ContactModel): Observable<boolean> {
    const url = `${environment.baseurl}/contact/linkPatient`;
    return this.http.post<boolean>(url, model);
  }

  public deleteConnection(contactId: Guid, connectionId: Guid): Observable<boolean> {
    const url = `${environment.baseurl}/contact/deleteConnection?contactId=${contactId}&connectionId=${connectionId}`;
    return this.http.delete<boolean>(url);
  }

  public getDepartmentDetails(departmentId: Guid): Observable<ContactViewModel> {
    const url = `${environment.baseurl}/department/getDepartmentDetails?departmentId=${departmentId}`;
    return this.http.get<ContactViewModel>(url);
  }

  public addDepartment(departmentDetails: ContactViewModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/department/addDepartment`;
    return this.http.post<GenericResponse>(url, departmentDetails);
  }

  public updateDepartment(departmentDetails: ContactViewModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/department/updateDepartment`;
    return this.http.put<GenericResponse>(url, departmentDetails);
  }

  public deleteDepartment(contactId: Guid, departmentId: Guid): Observable<boolean> {
    const url = `${environment.baseurl}/department/deleteDepartment?contactId=${contactId}&departmentId=${departmentId}`;
    return this.http.delete<boolean>(url);
  }

  public addDepartmentConnection(contactId: Guid, departmentId: Guid): Observable<boolean> {
    const url = `${environment.baseurl}/department/addDepartmentConnection`;
    return this.http.post<boolean>(url, { contactId, departmentId });
  }

  public unlinkDepartment(contactId: Guid, departmentId: Guid): Observable<boolean> {
    const url = `${environment.baseurl}/department/unlinkDepartment?contactId=${contactId}&departmentId=${departmentId}`;
    return this.http.delete<boolean>(url);
  }

  public unlinkPatient(contactId: Guid, patientId: Guid): Observable<boolean> {
    const url = `${environment.baseurl}/contact/unlinkPatient?contactId=${contactId}&patientId=${patientId}`;
    return this.http.delete<boolean>(url);
  }

  public getContactTelecoms(contactId: Guid, siteId: Guid): Observable<TelecomsViewModel[]> {
    const url = `${environment.baseurl}/contact/getContactTelecoms?contactId=${contactId}&siteId=${siteId}`;
    return this.http.get<TelecomsViewModel[]>(url);
  }

  public getContactTelecomDetails(telecomId: Guid): Observable<TelecomsViewModel> {
    const url = `${environment.baseurl}/contact/getContactTelecomDetails?telecomId=${telecomId}`;
    return this.http.get<TelecomsViewModel>(url);
  }

  public addContactTelecom(telecomData: TelecomsViewModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/contact/addContactTelecom`;
    return this.http.post<GenericResponse>(url, telecomData);
  }

  public updateContactTelecom(telecomData: TelecomsViewModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/contact/updateContactTelecom`;
    return this.http.post<GenericResponse>(url, telecomData);
  }

  public deleteContactTelecom(telecomId: Guid): Observable<GenericResponse> {
    const url = `${environment.baseurl}/contact/deleteContactTelecom?telecomId=${telecomId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public getGlobalContactTypes(): Observable<gluContactTypeModel[]> {
    const url = `${environment.baseurl}/contactTypes/getGlobalContactTypes`;
    return this.http.get<gluContactTypeModel[]>(url);
  }

  public getLocalContactTypes(classification?: number): Observable<lluContactTypeModel[]> {
    const url = `${environment.baseurl}/contactTypes/getLocalContactTypes?classification=${classification ?? null}`;
    return this.http.get<lluContactTypeModel[]>(url);
  }

  public addContactType(specialistDetails: UpdateContactViewModel): Observable<string> {
    const url = `${environment.baseurl}/contact/createContactType`;
    return this.http.post<string>(url, specialistDetails);
  }

  public deleteContactType(contactTypeId: Guid): Observable<GenericResponse> {
    const url = `${environment.baseurl}/contactTypes?id=${contactTypeId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public getContactsBySiteAndType(siteId: string, contactType: number): Observable<ContactTypeViewModel[]> {
    const url = `${environment.baseurl}/contact/contactsBySite/${siteId}/${contactType}`;
    return this.http.get<ContactTypeViewModel[]>(url);
  }
  public getContactsBySiteTypeAndId(siteId: string, contactTypeId: number, contactType: string): Observable<ContactTypeViewModel[]> {
    const url = `${environment.baseurl}/contact/contactsBySite/${siteId}/${contactTypeId}/${contactType}`;
    return this.http.get<ContactTypeViewModel[]>(url);
  }

  public addContactRelationship(specialistDetails: ContactRelationshipVM): Observable<boolean> {
    const url = `${environment.baseurl}/contact/addRelationship`;
    return this.http.post<boolean>(url, specialistDetails);
  }

  public getPayorContacts(siteId: string, patientId: string): Observable<ContactListViewModel[]> {
    const url = `${environment.baseurl}/contact/getPatientsPayors/${siteId}/${patientId}`;
    return this.http.get<ContactListViewModel[]>(url);
  }

  public addContactToPatient(patientContactDetails: ContactModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/contact/addContactToPatient`;
    return this.http.post<GenericResponse>(url, patientContactDetails);
  }

  public updatePatientContactReference(patientContactDetails: ContactModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/contact/updatePatientContactReference`;
    return this.http.put<GenericResponse>(url, patientContactDetails);
  }

  public getSitePayors(siteId: string): Observable<ContactListViewModel[]> {
    const url = `${environment.baseurl}/contact/getSitePayors/${siteId}`;
    return this.http.get<ContactListViewModel[]>(url);
  }

  public getPatientContactByType(patientId: string, type: string): Observable<ContactDetails[]> {
    const url = `${environment.baseurl}/contact/getPatientsContacts/${patientId}/${type}`;
    return this.http.get<ContactDetails[]>(url);
  }

  public getContact(contactId: string): Observable<ContactDetails> {
    const url = `${environment.baseurl}/contact/getContact/${contactId}`;
    return this.http.get<ContactDetails>(url);
  }

  public getLinkedPractice(contactId: string, parentId: string): Observable<LinkedPracticeDetailsViewModel> {
    const url = `${environment.baseurl}/contact/getLinkedPractice/${contactId}/${parentId}`;
    return this.http.get<LinkedPracticeDetailsViewModel>(url);
  }

  public getParentContacts(contactId: string, siteId: string): Observable<ContactDetails[]> {
    const url = `${environment.baseurl}/contact/getParentContacts?contactId=${contactId}&siteId=${siteId}`;
    return this.http.get<ContactDetails[]>(url);
  }

  public getTelecoms(contactId: string): Observable<TelecomsViewModel[]> {
    const url = `${environment.baseurl}/contact/getTelecoms/${contactId}`;
    return this.http.get<TelecomsViewModel[]>(url);
  }

  public unlinkContact(contactLinkId: string): Observable<boolean> {
    const url = `${environment.baseurl}/contact/unlinkContact/${contactLinkId}`;
    return this.http.delete<boolean>(url);
  }

  public deleteTelecom(telecomId: string): Observable<boolean> {
    const url = `${environment.baseurl}/contact/deleteTelecom/${telecomId}`;
    return this.http.delete<boolean>(url);
  }

  public getContactsPatients(contactId: string): Observable<BasicPatientDetailsViewModel[]> {
    const url = `${environment.baseurl}/contact/getContactsPatients/${contactId}`;
    return this.http.get<BasicPatientDetailsViewModel[]>(url);
  }

  public updateContactPatient(patientContactDetails: PatientContactDetails): Observable<boolean> {
    const url = `${environment.baseurl}/contact/updateContactPatient`;
    return this.http.patch<boolean>(url, patientContactDetails);
  }

  public setAsPayor(contactId: string) {
    const url = `${environment.baseurl}/contact/setContactPayorFlag`;
    return this.http.put(url, { contactId });
  }
}

export class OrganisationModel {
  contactId: string;
  displayName: string;
}

export class LinkedPracticeDetailsViewModel {
  addressName: string;
  primaryAddress: boolean;
  billingAddress: boolean;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  postcode: string;
  country: string;
}

export interface AddContactToPatientRequest {
  patientId: string;
  contactId: string;
  organisationId: string | null;
  referrer: boolean | null;
  theirRef: string;
  isPrimary: boolean;
}

export class ContactRelationshipVM {
  parentId: string;
  childId: string;
  contactId: string;
  departmentId: string;
}

export class PatientContactDetails {
  patientId: string;
  contactId: string;
  siteId: string;
  displayName: string;
  contactType: string;
  referrer: boolean;
  uniqueNo: number;
  linkedPracticeName: string;
  classificationTypeId: number;
  organisationId: string;
  theirRef: string;
  primary: boolean;
  backgroundColor: string;


  static FromContactListViewModel(viewModel: ContactListViewModel, patientId: string, siteId: string, referrer: boolean, theirRef: string, primary: boolean)
    : PatientContactDetails {
    const toReturn = new PatientContactDetails();
    toReturn.patientId = patientId;
    toReturn.contactId = viewModel.contactId,
      toReturn.displayName = viewModel.fullName;
    toReturn.siteId = siteId;
    toReturn.contactType = viewModel.contactType;
    toReturn.referrer = referrer;
    toReturn.theirRef = theirRef;
    toReturn.uniqueNo = 0;
    toReturn.linkedPracticeName = '';
    toReturn.classificationTypeId = 1;
    toReturn.organisationId = viewModel.organisationId;
    toReturn.primary = primary;
    toReturn.backgroundColor = viewModel.backgroundColor;

    return toReturn;
  }
}

export class ContactTelecomsViewModel {
  preferredContactMethod: string;
  preferredContactMethodValue: string;
  otherContactMethods: Map<string, string>;
}

export class ContactDetailsModel {
  contactId: Guid | null;
  siteId: Guid | null;
  contactType: ContactTypeModel | null;
  backgroundColor: string | null;
  lastName: string | null;
  firstName: string | null;
  title: string | null;
  knownAs: string | null;
  displayName: string | null;
  isPayor: boolean | null;
  sendViaPatientzone: boolean | null;
  inactive: boolean | null;
  inactiveReason: string | null;
  addresses: Address[] | null;
  jobTitle: string | null;
  qualifications: string | null;
  telecoms: ContactTelecomModel[] | null;
  preferredTelecom?: ContactTelecomModel;
  linkedChildren: linkedContactModel[] | null;
  linkedParents: linkedContactModel[] | null;
  primaryAddress: Address | null;
  billingAddress: Address | null;
}

export class ContactDepartmentsModel {
  contactType: ContactTypeModel | null;
  linkedDepartments: linkedDepartmentModel[] | null;
}

export class ContactLinkedContactsModel {
  contactType: ContactTypeModel | null;
  linkedOrganisations: linkedOrganisationModel[] | null;
  linkedContacts: linkedContactModel[] | null;
}

export class linkedDepartmentModel {
  parentOrganisationId: Guid | null;
  departmentId: Guid | null;
  organisationName: string | null;
  contactType: ContactTypeModel | null;
  name: string | null;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  address4: string | null;
  contactNumber: string | null;
  contactEmail: string | null;
  organisations: number | null;
  contacts: number | null;
  postcode: string | null;
}

export class linkedBase {
  contactId: Guid | null;
  contactType: ContactTypeModel | null;
  address: Address | null;
  telecoms: ContactTelecomModel[] | null;
}

export class linkedOrganisationModel extends linkedBase {
  displayName: string | null;
}

export class linkedContactModel extends linkedBase {
  lastName: string | null;
  firstName: string | null;
  title: string | null;
  knownAs: string | null;
  jobTitle: string | null;
}

export class linkedPatientModel {
  patientId: Guid | null;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  birthDate: Date | null;
  gender: string | null;
  inactive: boolean | null;
  deceased: boolean | null;
  primaryAddress: Address | null;
  billingAddress: Address | null;
  insurer: Insurer | null;
  telecoms: Array<Telecom> | null;
  referenceNumbers: Array<ReferenceNumber> | null;
}

export class linkedPracticeModel {
  name: string | null;
  address: Address | null;
}

export class ContactGridModel {
  contactId: Guid | null;
  displayName: string | null;
  contactType: string | null;
  contactClassification: number | null;
  email: string | null;
  address: string | null;
  isPayor: boolean | null;
  inactive: boolean | null;
  linked: boolean | null;
}

export class ContactModel {
  patientId: Guid | null;
  contactId: Guid | null;
  contactTypeId: Guid | null;
  displayName: string | null;
  contactType: string | null;
  contactClassification: number | null;
  address: Address | null;
  isPrimary: boolean | null;
  referrer: boolean | null;
  theirRef: string | null;
}

export class ContactViewModel {
  contactId: string | null;
  siteId: Guid | null;
  contactType: ContactTypeModel | null;
  organisationType: ContactTypeModel | null;
  lastName: string | null;
  firstName: string | null;
  title: string | null;
  knownAs: string | null;
  displayName: string | null;
  isPayor: boolean | null;
  sendViaPatientzone: boolean | null;
  inactive: boolean | null;
  inactiveReason: string | null;
  addressTypeId: number | null;
  postcode: string | null;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  address4: string | null;
  primary: boolean | null;
  billing: boolean | null;
  jobTitle: string | null;
  qualifications: string | null;
  telecoms: Array<TelecomModel> | null;
}

export class ContactTypeModel {
  contactTypeId: Guid | null;
  contactClassificationId: number | null;
  contactType: string | null;
  uniqueNo: number | null;
}

export class ContactTelecomModel {
  type: number | null;
  value: string | null;
  description: string | null;
  preferred?: boolean;
  id?: string;
}

export class TelecomModel {
  telecomType: number | null;
  type: number | null;
  value: string | null;
}

export class CreateContactViewModel {
  siteId: Guid;
  lastName: string;
  firstName: string;
  otherInitials: string;
  title: string;
  contactTypeId: Guid;
  isPayor: boolean;
  qualifications: string;
  jobTitle: string;
  addresses: Array<Address>;
  parentId: Guid;
  contactType: string;
  knownAs: string;
  sendViaPatientzone: boolean;
  preferredContactMethod: string;
  telecoms: Array<TelecomsViewModel>;
  email: string;
  contactId: Guid;
  classificationTypeId: number;
  displayName: string;
  inactive: boolean;
  inactiveReason: string;
  bureauId: string;
}


export class UpdateContactViewModel {
  siteId: Guid;
  lastName: string;
  firstName: string;
  otherInitials: string;
  title: string;
  contactTypeId: string;
  payor: boolean;
  qualifications: string;
  jobTitle: string;
  addresses: Array<Address>;
  contactId: Guid;
  pager: string;
  workTel: string;
  homeTel: string;
  email: string;
  mobile: string;
  inCaseOfEmergency: string;
  website: string;
  preferredContactMethod: string;
  contactType: string;
  classificationTypeId: number;
  skype: string;
}

export class AddressResponseModel {
  addresses: Address[];
  data: any;
}

export class Address {
  addressId: string;
  addressType: number | null;
  addressTypeDescription: string;
  rank: number | null;
  primaryAddress: boolean | null;
  billingAddress: boolean | null;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  postcode: string;
  country: string;
  siteId: Guid | null;
  uniqueNo: number | null;
  patientId: Guid | null;
  contactId: Guid | null;
  latitude: number | null;
  longitude: number | null;
  data: any | null;
  errors: any | null;
  success: boolean | null;
}

export class Insurer {
  description: string | null;
  registrationNumber: string | null;
}

export class Telecom {
  type: TelecomType | null;
  telecomValue: string | null;
}

export class TelecomType {
  description: string | null;
}

export class ReferenceNumber {
  refNoType: string | null;
  refNoValue: string | null;
}

export class ContactListViewModel {
  fullName: string;
  contactType: string;
  contactTypeId: string;
  classificationTypeId: number;
  contactTypeDescription: string;
  referrer: boolean;
  contactId: string;
  linkedPractice: string;
  preferredContactMethod: string;
  email: string;
  workTel: string;
  mobile: string;
  fax: string;
  pager: string;
  website: string;
  inCaseOfEmergency: string;
  homeTel: string;
  sendViaPatientzone: boolean;
  items: ContactListViewModel[];
  postcode: string;
  parentId: string;
  organisationId: string;
  uniqueNo: number;
  theirRef: string;
  siteName: string;
  addresses: PatientAddress[];
  backgroundColor: string;
}

export class TelecomsViewModel {
  telecomId: Guid;
  siteId: Guid;
  contactId: Guid;
  type: number;
  telecomType: number;
  description: string;
  value: string;
  preferred: boolean;
  primary: boolean;
  rank: number;
  usage: string;
  system: any;
}

export class lluContactTypeModel {
  contactTypeId: Guid | null;
  siteId: Guid | null;
  description: string | null;
  systemType: string | null;
  backgroundColor: string | null;
  active: boolean | null;
  sendViaPatientzone: boolean | null;
  typeId: number | null;
  typeDescription: string | null;
  contactClassificationId: number | null;
  uniqueNo: number | null;
  contactType: string | null;
}

export class gluContactTypeModel {
  uniqueNo: number | null;
  description: string | null;
}