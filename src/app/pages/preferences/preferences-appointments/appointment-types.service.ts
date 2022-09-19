import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import Guid from "devextreme/core/guid";
import { Observable } from "rxjs";
import { GenericResponse } from "src/app/shared/models/GenericResponseModel";
import { AppointmentTypes } from "src/app/shared/services/appointment.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AppointmentTypesService {
  constructor(private http: HttpClient) { }

  public getAppointmentTypes(): Observable<AppointmentTypes[]> {
    const url = `${environment.baseurl}/appointmentTypes`;
    return this.http.get<AppointmentTypes[]>(url);
  }

  public delete(appointmentTypeId: Guid): Observable<GenericResponse> {
    const url = `${environment.baseurl}/appointmentTypes/${appointmentTypeId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public getAppointmentGlobalTypes(): Observable<any[]> {
    const url = `${environment.baseurl}/appointmentTypes/getAllGlobalTypes`;
    return this.http.get<any[]>(url);
  }
}
