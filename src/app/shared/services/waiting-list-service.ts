import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WaitingListModel } from './appointment.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericResponse } from '../models/GenericResponseModel';


@Injectable()
export class WaitingListService {
    constructor(private router: Router, private http: HttpClient) {
    }

    public getWaitingList(): Observable<WaitingListModel[]> {
        const url = `${environment.baseurl}/waitinglist/getWaitingList`;
        return this.http.get<WaitingListModel[]>(url);
    }

    public addToWaitingList(model): Observable<GenericResponse> {
        const url = `${environment.baseurl}/waitinglist`;
        return this.http.post<GenericResponse>(url, model);
    }

    public getWaitingListDetails(id: string): Observable<WaitingListEntryModel> {
        const url = `${environment.baseurl}/waitinglist/${id}`;
        return this.http.get<WaitingListEntryModel>(url);
    }

    public isPatientOnWaitingList(patientId: string): Observable<boolean> {
        const url = `${environment.baseurl}/waitinglist/isPatientOnWaitingList/${patientId}`;
        return this.http.get<boolean>(url);
    }

    public removeFromWaitingList(waitingListId: string): Observable<boolean> {
        const url = `${environment.baseurl}/waitinglist/${waitingListId}`;
        return this.http.delete<boolean>(url);
    }
}

export class WaitingListEntryModel {
    id: string;
    siteId: string;
    siteName: string;
    patientId: string;
    patientName: string;
    birthDate: Date;
    dateAdded: Date | null;
    appointmentTypeId: string;
    appointmentTypeDescription: string;
    locationId: string;
    locationName: string;
    ownerId: string;
    ownerName: string;
    notes: string;
    priority: boolean | null;
    duration: number;
}
