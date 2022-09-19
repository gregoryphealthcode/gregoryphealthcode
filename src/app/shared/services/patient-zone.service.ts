import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StatusCode } from "src/app/_helpers/StatusCode";
import { environment } from "src/environments/environment";
import { PatientZoneViewModel, RegisterPractitionerViewModel } from "./user.service";

@Injectable({
  providedIn: 'root',
})
export class PatientZoneService {
  constructor(private http: HttpClient) {}

public registerOrganisation(model: PatientZoneViewModel): Observable<PatientZoneRegistrationResponseModel> {
  const url = `${environment.baseurl}/patientZone/registerOrganisation`;

  return this.http.post<PatientZoneRegistrationResponseModel>(url, model);
}

public registerPractioner(model: RegisterPractitionerViewModel): Observable<PatientZoneRegistrationResponseModel> {
  const url = `${environment.baseurl}/patientZone/registerPractioner`;

  return this.http.post<PatientZoneRegistrationResponseModel>(url, model);
}

public getRegistrationStatus(registrationReference : string, siteId : string): Observable<PatientZoneRegistrationResponseModel> {
  const url = `${environment.baseurl}/patientZone/getRegistrationStatus?reference=${registrationReference}&siteId=${siteId}`;
  return this.http.get<PatientZoneRegistrationResponseModel>(url);
}


}


export class PatientZoneRegistrationResponseModel {
  isSuccess: boolean;
  payload: string;
  statusCode: StatusCode;
  message: string;
}
