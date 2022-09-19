import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericResponse } from 'src/app/shared/models/GenericResponseModel';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserAdminService {

    constructor(private http: HttpClient) { }

    public get(userId: string): Observable<GetAdminUserDetailsModel> {
        const url = `${environment.baseurl}/user/${userId}`;
        return this.http.get<GetAdminUserDetailsModel>(url);
    }

    public addUserSite(userId?: string, siteId?: string, groupId?: string): Observable<GenericResponse> {
        const url = `${environment.baseurl}/user/addUserSite`;
        return this.http.post<GenericResponse>(url, {userId, siteId, groupId});
    }

    public unlinkUserSite(userId?: string, siteId?: string, groupId?: string): Observable<GenericResponse> {
        const url = `${environment.baseurl}/user/unlinkUserSite`;
        return this.http.post<GenericResponse>(url, {userId, siteId, groupId});
    }
}

export interface GetAdminUserDetailsModel {
    userId?: string | null;
    userName?: string | null;
    userTypeId?: number | null;
    userType?: string | null;
    pin?: string | null;
    forename?: string | null;
    surname?: string | null;
    email?: string | null;
    contactTel?: string | null;
}