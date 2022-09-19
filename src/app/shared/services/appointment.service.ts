import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import Guid from "devextreme/core/guid";
import { ProcedureCodesViewModel } from "../models/ProcedureCodesViewModel";
import { BasicPatientDetailsViewModel } from "./patient.service";
import { StatusCode } from "src/app/_helpers/StatusCode";
import { CountResponseModel } from "../models/CountResponseModel";
import { map } from "rxjs/operators";
import { LocationAddRequest } from "../models/LocationAddRequest";
import { ResponseModel } from "../models/ResponseModel";
import { GenericResponse, GenericResponseModel } from "../models/GenericResponseModel";
import { GetInvoicePayorResponseModel, InvoiceEpisodeDetailsRequestResponseBase, SetInvoiceEpisodeDetialsRequest } from "src/app/pages/accounts/invoice-add-edit/invoice-add-edit.service";

@Injectable({
  providedIn: "root",
})
export class AppointmentService {
  constructor(private http: HttpClient) { }
  public getAppointmentOwners(siteId?: string | null): Observable<AppointmentOwnerModel[]> {
    const url = `${environment.baseurl}/appointmentOwner/getAll`;
    return this.http.get<AppointmentOwnerModel[]>(url).pipe(map((x:any)=>{
      x.data.forEach(element => {
        element.ownerId = element.id;
        element.ownerName = element.name;
      });
      return x.data}));
  }

  public addAppointmentOwner(specialistDetails: any): Observable<any> {
    const url = `${environment.baseurl}/appointmentOwner/add`;
    return this.http.post<boolean>(url, specialistDetails);
  }

  public updateAppointmentOwner(specialistDetails: any): Observable<any> {
    const url = `${environment.baseurl}/appointmentOwner/update`;
    return this.http.put<boolean>(url, specialistDetails);
  }

  public getAppointmentOwner(id: string): Observable<any> {
    const url = `${environment.baseurl}/appointmentOwner/get?id=${id}`;
    return this.http.get<any>(url);
  }

  public addAppointmentLocation(specialistDetails: LocationAddRequest): Observable<boolean> {
    const url = `${environment.baseurl}/appointmentLocations`;
    return this.http.post<boolean>(url, specialistDetails);
  }

  public getAppointmentLocations(siteId?: string | null, showInactive?:boolean): Observable<AppointmentListViewModel[]> {
    const url = `${environment.baseurl}/appointmentLocations/getAll?showInactive=${showInactive}`;;
    return this.http.get<AppointmentListViewModel[]>(url).pipe(map((x:any)=>{
      x.data.forEach(element => {
        element.id = element.locationId;
        element.name = element.locationName;
        element.appointmentOwners = element.appointmentOwners;
      });
      return x.data}));
  }

  public updateAppointmentStatus(appointmentId, statusId): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointment/updateStatus`;
    return this.http.put<GenericResponse>(url, {appointmentId: appointmentId, statusId: statusId});
  }

  public deleteAppointmentLocation(locationId: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointmentLocations/${locationId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public deleteAppointmentOwner(id: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointmentOwner/${id}`;
    return this.http.delete<GenericResponse>(url);
  }

  public getAppointmentTypesByOwner(specialistId: string): Observable<AppointmentTypes[]> {
    const url = `${environment.baseurl}/appointment/getOwnerAppointmentTypes?ownerId=${specialistId}`;
    return this.http.get<AppointmentTypes[]>(url);
  }

  public getTypesForAppointments(sessionId?: string): Observable<AppointmentTypes[]> {
    let url = `${environment.baseurl}/appointmentTypes`;
    if (sessionId) {
      url += "?sessionId=" + sessionId;
    }
    return this.http.get<AppointmentTypes[]>(url);
  }

  public getAppointmentTypes(specialistId: string): Observable<AppointmentTypes[]> {
    const url = `${environment.baseurl}/appointment/getOwnerAppointmentTypes?ownerId=${specialistId}`;
    return this.http.get<AppointmentTypes[]>(url);
  }

  public getAppointmentTypesSelection(): Observable<AppointmentTypes[]> {
    const url = `${environment.baseurl}/appointmentTypes/getAppointmentTypesSelection`;
    return this.http.get<AppointmentTypes[]>(url);
  }

  public getSpecialistAppointmentTypes(specialistId: string): Observable<AppointmentTypes[]> {
    const url = `${environment.baseurl}/appointmentTypes`;
    return this.http.get<AppointmentTypes[]>(url);
  }

  public getAppointmentSessions(): Observable<AppointmentSessionModel[]> {
    const url = `${environment.baseurl}/appointmentSession/getAll`;
    return this.http.get<AppointmentOwnerModel[]>(url).pipe(map((x:any)=>{return x.data}));
  }

  public getAppointmentLocationSessions(locationId: string): Observable<SessionDataModel[]> {
    const url = `${environment.baseurl}/appointment/getLocationSessions/${locationId}`;
    return this.http.get<SessionDataModel[]>(url);
  }

  public getLocationSessionsForSpecialist(locationId: string, specialistsIds: string[]): Observable<SessionDataModel[]> {
    const params = new HttpParams({
      fromObject: {
        specialistsIds,
        locationId,
      },
    });
    const url = `${environment.baseurl}/appointmentSession/getLocationSessionsForSpecialists`;
    return this.http.get<SessionDataModel[]>(url, { params });
  }

  public getAppointmentSessionDetails(sessionId: Guid): Observable<SessionDataModel> {
    const url = `${environment.baseurl}/appointmentSession/getAppointmentSessionDetails?sessionId=${sessionId}`;
    return this.http.get<SessionDataModel>(url);
  }

  public addAppointmentSession(sessionDetails: SessionDataModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointmentSession/addAppointmentSession`;
    return this.http.post<GenericResponse>(url, sessionDetails);
  }

  public updateAppointmentSession(sessionDetails: SessionDataModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointmentSession/updateAppointmentSession`;
    return this.http.post<GenericResponse>(url, sessionDetails);
  }

  public getSessionTypes(): Observable<SessionTypes[]> {
    const url = `${environment.baseurl}/appointmentSession/getAppointmentSessionTypes`;
    return this.http.get<SessionTypes[]>(url);
  }

  public getAvailableSessions(sessionId: string, ownerId: string | null, duration: number, appointmentTypeId: string, startDate: Date, endDate: Date): Observable<any[]> {
    let obj: any = {
      duration: duration.toString(),
      appointmentTypeId: appointmentTypeId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    if (sessionId) {
      obj.sessionId = sessionId;
    }

    if (ownerId) {
      obj.ownerId = ownerId;
    }

    const params = new HttpParams({
      fromObject: obj,
    });

    const url = `${environment.baseurl}/appointmentSession/getAvailableSessions`;
    return this.http.get<any[]>(url, { params });
  }

  public getAvailableSlots(sessionBooking: boolean, appointmentTypeId: string, duration: number, startDate: Date, ownerId: string | null, locationId: string | null) : Observable<AppointmentSlotModel[]> {
    let obj: any = {
      sessionBooking: sessionBooking,
      appointmentTypeId: appointmentTypeId,
      duration: duration,
      startDate: new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString(),
    }

    if (ownerId && ownerId != '00000000-0000-0000-0000-000000000000') {
      obj.ownerId = ownerId;
    }

    if (locationId && locationId != '00000000-0000-0000-0000-000000000000') {
      obj.locationId = locationId;
    }
    
    const params = new HttpParams({
      fromObject: obj,
    });
    
    const url = `${environment.baseurl}/appointmentSession/getAvailableSlots`;
    return this.http.get<AppointmentSlotModel[]>(url, {params});
  }

  public bookAppointment(request): Observable<GenericResponseModel<AddAppointmentResponseModel>> {
    const url = `${environment.baseurl}/appointment/book`;
    return this.http.post<GenericResponseModel<AddAppointmentResponseModel>>(url, request);
  }

  public updateAppointment(request): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointment/update`;
    return this.http.put<GenericResponse>(url, request);
  }

  public completeAppointment(request): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointment/complete`;
    return this.http.post<GenericResponse>(url, request);
  }

  public syncEbookingAppointments(): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointment/syncEbookingAppointments`;
    return this.http.post<GenericResponse>(url,{});
  }

  public getAppointmentLocationsForOwner(ownerId: string): Observable<AppointmentListViewModel[]> {
    const url = `${environment.baseurl}/appointmentLocations/getLocationsForOwner?ownerId=${ownerId}`;
    return this.http.get<AppointmentListViewModel[]>(url);
  }

  public getAppointments(specialistsIds: string[], startDate: Date, endDate: Date): Observable<GetAppointmentsDiaryViewResponse> {
    const params = new HttpParams({
      fromObject: {
        specialistsIds,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    const url = `${environment.baseurl}/appointment/getAppointmentsDiaryView`;
    return this.http.get<GetAppointmentsDiaryViewResponse>(url, { params });
  }

  public getAppointment(appointmentId: string): Observable<GetAppointmentResponseModel> {
    const url = `${environment.baseurl}/appointment/getAppointment/${appointmentId}`;
    return this.http.get<GetAppointmentResponseModel>(url);
  }

  public addToWaitingList(waitingListVM: WaitingListModel): Observable<boolean> {
    const url = `${environment.baseurl}/waitinglist`;
    return this.http.post<boolean>(url, waitingListVM);
  }

  public cancelAppointment(appointmentId: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointment/cancelAppointment`;
    return this.http.put<GenericResponse>(url, {appointmentId: appointmentId});
  }

  public getDiary(locationId: string, ownerId: string): Observable<DiaryViewModel[]> {
    const url = `${environment.baseurl}/appointment/getDiary?ownerId=${ownerId}&locationId=${locationId}`;
    return this.http.get<DiaryViewModel[]>(url);
  }

  public getConfirmationTemplates(): Observable<AppointmentTemplatesResponseModel> {
    const url = `${environment.baseurl}/template/getAppointmentConfirmationTemplates`;
    return this.http.get<AppointmentTemplatesResponseModel>(url);
  }

  public reserveAppointment(appointmentDetails: AppointmentViewModel) {
    const url = `${environment.baseurl}/appointment/addAppointment`;
    return this.http.post<GenericResponseModel<AddAppointmentResponseModel>>(url, appointmentDetails);
  }

  public unreserveAppointment(appointmentId: string) {
    const url = `${environment.baseurl}/appointment/unreserveAppointment`;
    return this.http.post<GenericResponse>(url, {appointmentId});
  }

  public createAppointmentServiceType(appointmentDetails: AppointmentServiceTypeViewModel): Observable<AppointmentResponseModel> {
    const url = `${environment.baseurl}/appointment/createAppointmentServiceType`;
    return this.http.post<AppointmentResponseModel>(url, appointmentDetails);
  }

  public deleteAppointmentServiceType(appointmentServiceTypeId: string): Observable<AppointmentResponseModel> {
    const url = `${environment.baseurl}/appointment/deleteAppointmentServiceType/${appointmentServiceTypeId}`;
    return this.http.delete<AppointmentResponseModel>(url);
  }

  public createAppointmentServiceProcedureCode(appointmentDetails: ProcedureCodesViewModel): Observable<AppointmentResponseModel> {
    const url = `${environment.baseurl}/appointment/createAppointmentProcedureCode`;
    return this.http.post<AppointmentResponseModel>(url, appointmentDetails);
  }

  public deleteAppointmentServiceProcedureCode(procedureCodeId: string): Observable<AppointmentResponseModel> {
    const url = `${environment.baseurl}/appointment/deleteProcedureCode/${procedureCodeId}`;
    return this.http.delete<AppointmentResponseModel>(url);
  }

  public getAppointmentServiceProcedureCode(appointmentServiceTypeId: string): Observable<ProcedureCodesViewModel[]> {
    const url = `${environment.baseurl}/appointment/getAppointmentProcedureCodesByServiceId/${appointmentServiceTypeId}`;
    return this.http.get<ProcedureCodesViewModel[]>(url);
  }

  public addAppointmentInstructions(appointmentInstructionDetails: AppointmentInstructionsViewModel): Observable<AppointmentResponseModel> {
    const url = `${environment.baseurl}/appointmentInstructions/add`;
    return this.http.post<AppointmentResponseModel>(url, appointmentInstructionDetails);
  }

  public updateAppointmentInstructions(appointmentInstructionDetails: AppointmentInstructionsViewModel): Observable<AppointmentResponseModel> {
    const url = `${environment.baseurl}/appointmentInstructions/update`;
    return this.http.put<AppointmentResponseModel>(url, appointmentInstructionDetails);
  }

  public deleteAppointmentInstructions(appointmentInstructionsId: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointmentInstructions?appointmentInstructionsId=${appointmentInstructionsId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public getlluAppointmentInstructions(): Observable<InstructionsViewModel[]> {
    const url = `${environment.baseurl}/lluAppointmentInstructions/getInstructions`;
    return this.http.get<InstructionsViewModel[]>(url);
  }

  public deleteInstructions(id: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/lluAppointmentInstructions?id=${id}`;
    return this.http.delete<GenericResponse>(url);
  }

  public getAppointmentInstructions(appointmentId: string): Observable<AppointmentInstructionsViewModel[]> {
    const url = `${environment.baseurl}/appointmentInstructions/getAll?appointmentId=${appointmentId}`;
    return this.http.get<AppointmentInstructionsViewModel[]>(url);
  }

  public getAppointmentInstructionDetails(appointmentInstructionsId: string): Observable<InstructionsViewModel> {
    const url = `${environment.baseurl}/appointmentInstructions/getDetails?appointmentInstructionsId=${appointmentInstructionsId}`;
    return this.http.get<InstructionsViewModel>(url);
  }

  public getAllAppointmentProcedures(appointmentId: string): Observable<ProcedureCodesViewModel[]> {
    const url = `${environment.baseurl}/appointment/getAllAppointmentProcedures/${appointmentId}`;
    return this.http.get<ProcedureCodesViewModel[]>(url);
  }

  public getAppointmentsForPatient(patientId: string): Observable<AppointmentViewModel[]> {
    const url = `${environment.baseurl}/appointment/getAppointmentsForPatient/${patientId}`;
    return this.http.get<AppointmentViewModel[]>(url);
  }

  public checkAppointmentSessionExists(model: SessionDataViewModel): Observable<string> {
    const url = `${environment.baseurl}/appointment/checkAppointmentSessionExists`;
    return this.http.post<string>(url, model);
  }

  public getNextAppointment(patientId: string): Observable<AppointmentViewModel> {
    const url = `${environment.baseurl}/appointment/getNextAppointment/${patientId}`;
    return this.http.get<AppointmentViewModel>(url);
  }

  public deleteSession(sessionId: string): Observable<ResponseModel> {
    const url = `${environment.baseurl}/appointment/deleteSession/${sessionId}`;
    return this.http.delete<ResponseModel>(url);
  }

  public getAppointmentsByDate(startDate: string, isToday: boolean): Observable<BasicPatientDetailsViewModel[]> {
    let url: string;
    if (startDate === null) {
      url = `${environment.baseurl}/appointment/getAppointmentsByDate?isToday=${isToday}`;
    } else {
      url = `${environment.baseurl}/appointment/getAppointmentsByDate?startDate=${startDate}&isToday=${isToday}`;
    }
    return this.http.get<BasicPatientDetailsViewModel[]>(url);
  }

  public getCompletedAppointmentsCount(): Observable<number> {
    const url = `${environment.baseurl}/appointment/getCompletedAppointmentsCount`;
    return this.http.get<CountResponseModel>(url).pipe(map((x) => x.count));
  }

  public setPayor(model: SetAppointmentPayorRequest): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointment/setPayor`;
    return this.http.put<GenericResponse>(url, model);
  }
}

export class AppointmentOwnerModel { 
  id: string;
  name: string;
}

export interface BookAppointmentResponseModel {
  letterId: string | null;
}

export interface SetAppointmentPayorRequest extends InvoiceEpisodeDetailsRequestResponseBase {
  appointmentId: string;
}

export interface AddAppointmentResponseModel {
  id: string;
  appointmentOverlap: boolean;
}

export class AppointmentSlotModel {
  sessionId: string;
  locationId: string;
  locationName: string;
  ownerId: string;
  ownerName: string;
  startDate: Date;
  endDate: Date;
  appointmentsNow: string[] | null;
}

export class AppointmentInstructionsViewModel {
  appointmentInstructionsId?: string;
  appointmentId?: string;
  title: string;
  text: string;
  isDirections: boolean;
}

export class InstructionsViewModel {
  id: string;
  title: string;
  text: string;
  isDirections: boolean;
}

export class AppointmentServiceTypeViewModel {
  serviceTypeCode: string;
  appointmentId: string;
  appointmentServiceTypeId: string;
  description: string;
  code: string;
  cost: number;
}

export class AppointmentResponseModel {
  isSuccess: boolean;
  payload: string;
  statusCode: StatusCode;
  message: string;
}

export enum AppointmentStatus {
  Reserved = 1,
  Booked = 2,
  Cancelled = 3,
  Completed = 4,
  Billed = 5,
  Deleted = 6,
}

export class AppointmentListViewModel {
  id: string;
  name: string;
  street: string;
  town: string;
  postcode: string;
  hcCode: string;
  appointmentOwners: string[];
}

export class AppointmentLocationModel {
  id: string;
  name: string;
}

export class SessionDataViewModel {
  appointmentSessions: SessionDataModel;
  locationId: string;
  siteId: string;
}

export class AppointmentSessionModel {
  sessionId: string;
  siteId: string;
  siteName: string;
  description: string;
  ownerId: string;
  ownerName: string;
  locationId: string;
  locationName: string;
  eBooking: boolean;
  unavailable: boolean;
  unavailableStartDateTime: Date | null;
  unavailableEndDateTime: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  repeatsEvery: number | null;
  mon: boolean;
  monStartTime: Date | null;
  monEndTime: Date | null;
  tues: boolean;
  tuesStartTime: Date | null;
  tuesEndTime: Date | null;
  wed: boolean;
  wedStartTime: Date | null;
  wedEndTime: Date | null;
  thurs: boolean;
  thursStartTime: Date | null;
  thursEndTime: Date | null;
  fri: boolean;
  friStartTime: Date | null;
  friEndTime: Date | null;
  sat: boolean;
  satStartTime: Date | null;
  satEndTime: Date | null;
  sun: boolean;
  sunStartTime: Date | null;
  sunEndTime: Date | null;
  appointmentTypes: string[] | null;
  backgroundColour: string;
}

export class SessionDataModel {
  id: string;
  startDate: string;
  endDate: string;
  ownerId: string;
  description: string;
  isRecurring: boolean;
  text: string;
  recurrenceRule: string;
  recurrenceException: string;
  sessionTypeId: string;
  minimumSlotDuration: number;
  sessionId: string;
  addToWaitingList: boolean;
  unavailableTypeId: string;
  recurrenceWindow: number;
  locationId: string;
  appointmentIds: string[];
  eBooking: boolean;
}

export class AppointmentDataModel {
  text: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  sessionId: string;
  addToWaitingList: boolean;
  sessionTypeId: string;
  unavailableTypeId: string;
  locationId: string;
}

export interface GetAppointmentsDiaryViewResponse {
  appointments: AppointmentDiaryViewModel[];
  sessions: SessionDiaryViewModel[];
}

export interface SessionDiaryViewModel {
  startDate: Date;
  endDate: Date;
  locationId: string;
  locationName: string;
  description: string;
  ownerId: string;
  sessionId: string;
  unavailableTypeId?: string;
  backgroundColour: string;
}

export interface AppointmentDiaryViewModel {
  startDate: string;
  endDate: string;
  locationId: string;
  locationName: string;
  ownerId: string;
  patientId: string;
  appointmentId: string;
  appointmentType: string;
  ownerName: string;
  sessionId: string | null;
  patientName: string;
  highlightColour: string;
  backgroundColour: string;
  textColour: string;
  translatorNeeded: boolean;
  translatorLanguage: string;
  statusId: number;
  status: string;
}

export class AppointmentViewModel {
  text: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  durationMinutes: number;
  patientId: string;
  locationId: string;
  ownerId: string;
  siteId: string;
  sessionId: string;
  sessionDayId: string;
  appointmentTypeId: string;
  realAppointmentTypeId: string;
  appointmentType: string;
  description: string;
  isNFG: boolean;
  locationName: string;
  patientName: string;
  addToWaitingList: boolean;
  translatorNeeded: boolean;
  translatorLanguage: number;
  appointmentId: string;
  costCentreId: string;
  dnaReasonId: number;
  appointmentStatus: number;
  ownerName: string;
  claimNumber: string;
  confirmationText: boolean;
  confirmationLetter: boolean;
  confirmationEmail: boolean;
  appointmentStatusDescrption: string;
  photoDataType: string;
  photoAsBase64String: string;
  photoBytes: string;
  displayInfo: string;
}

export interface AddAppointmentRequestBase {
  locationId: string;
  patientId: string;
  startDate: Date;
  endDate: Date;
  durationMinutes: number;
  description: string;
}

export interface EditGetAppointmentRequestBase extends AddAppointmentRequestBase {
  appointmentId: string;
  translatorNeeded: boolean;
  translatorLanguage: number | null;
  confirmationLetter: boolean;
  confirmationText: boolean;
  confirmationEmail: boolean;
  emailTemplateId: string | null;
  smsTemplateId: string | null;
  letterTemplateId: string | null;
  payorId: string | null;
}

export interface GetAppointmentResponseModel extends EditGetAppointmentRequestBase {
  siteId: Guid;
  siteName: string;
  statusId: GluAppointmentStatus;
  appointmentTypeId: string;
  appointmentType: string;
  ownerId: string;
  ownerName: string;
  locationName: string;
  payor: GetInvoicePayorResponseModel;
}

export enum GluAppointmentStatus {
  Reserved = 1,
  Booked = 2,
  Cancelled = 3,
  Completed = 4,
  Billed = 5,
  Deleted = 6
}

export class InvoiceAppointmentViewModel {
  text: string;
  startDate: Date;
  endDate: Date;
  invoiceNumber: string;
  patientId: string;
  locationId: string;
  ownerId: string;
  siteId: string;
  appointmentId: string;
  appointmentTypeId: string;
  appointmentType: string;
  description: string;
  locationName: string;
  ownerName: string;
  invoiceId: string;
  dischargeId: string;
  claimNumber: string;
  comments: string;
  controllingSpecialistCode: string;
  payeeProviderHCCode: string;
  treatingHospital: string;
  invoiceDate: Date;
}

export class DiaryViewModel {
  text: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  durationMinutes: number;
  patientId: string;
  locationId: string;
  ownerId: string;
  siteId: string;
  sessionId: string;
  appointmentTypeId: string;
  description: string;
  isNFG: boolean;
  locationName: string;
  patientName: string;
  addToWaitingList: boolean;
  highlightColour: string;
  backgroundColour: string;
  textColour: string;
  isUnavailableSession: boolean;
  appointmentId: string;
  appointmentTypeName: string;
  isSession: boolean;
}

export class SessionTypes {
  description: string;
  sessionTypeId: Guid;
}

export class AppointmentTypes {
  description: string;
  id: Guid;
  duration: number;
  backgroundColour: string;
  textColour: string;
  uniqueNo: number;
  appointmentOwnerId: string;
  appointmentOwnerName: string;
  appointmentTypeCode: string;
  appointmentTypeCodeId: string;
  appointmentTypeId: string;
  sessionTypeId: string;
  defaultEpisodeType: string;
  appointmentOwners: string[];
}

export class WaitingListModel {
  notes: string;
  patientId: string;
  locationId: string;
  ownerId: string;
  siteId: string;
  appointmentType: string;
  appointmentOwnerTypeId: string;
  priority: boolean;
  dateAdded: Date;
  appointmentDate: Date;
  slotAvailable: boolean;
  duration: number;
  appointmentTypeId: string;
  waitingListId: string;
}

export class UnavailableTypes {
  description: string;
  id: Guid;
  textColour: string;
  highlightColour: string;
  backgroundColour: string;
}

export class RecurrenceWindowTypes {
  description: string;
  id: number;
}

export interface AppointmentTemplatesResponseModel {
  useDefaultConfirmationEmail: boolean;
  useDefaultConfirmationLetter: boolean;
  useDefaultConfirmationSms: boolean;
  emailTemplates: TemplateListItem[];
  smsTemplates: TemplateListItem[];
  letterTemplates: TemplateListItem[];
  defaultEmailConfirmation: string | null;
  defaultSmsConfirmation: string | null;
  defaultLetterConfirmation: string | null;
}

export interface TemplateListItem {
  templateId: string;
  description: string;
}


