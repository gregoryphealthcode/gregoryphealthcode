import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { GetLastSelectedPatientsViewModel } from '../models/getLasSelectedPatientViewModel';
import { GetRecentAppointmentsViewModel } from '../models/GetRecentAppointmentsViewModel';


@Injectable({
  providedIn: 'root'
})
export class UserRecentsService {

  constructor(private alertservice: AlertService,
    private http: HttpClient
    ) { }

  addUserLastXPatients(selectedPatientId: string) {
    const apiUrl = environment.baseurl + '/userRecents/updateLastSelectedPatient';
    const patientId = selectedPatientId;

    return this.http.post<any>(apiUrl, { patientId})
      .pipe(
        catchError(err => {
          this.alertservice.error('Error - unable to add record to UserLastXPatients table: /n' + err.error.message || err.status);
          return throwError(err);
      }));
  }

  getLastSelectedPatients(): Observable<GetLastSelectedPatientsViewModel[]>{
    const apiUrl = environment.baseurl + '/userRecents/getLastSelectedPatients'
    return this.http.get<GetLastSelectedPatientsViewModel[]>(apiUrl);
  }

  getRecentAppointments(): Observable<GetRecentAppointmentsViewModel>{
    const apiUrl = environment.baseurl + '/appointment/getRecentAppointments'
    return this.http.get<GetRecentAppointmentsViewModel>(apiUrl);
  }

}
