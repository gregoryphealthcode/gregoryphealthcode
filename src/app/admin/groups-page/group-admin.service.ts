import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericResponse } from 'src/app/shared/models/GenericResponseModel';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GroupAdminService {

    constructor(private http: HttpClient) { }

    public get(userId: string): Observable<GetAdminGroupDetailsModel> {
        const url = `${environment.baseurl}/group/${userId}`;
        return this.http.get<GetAdminGroupDetailsModel>(url);
    }

    public addGroupSite(siteId?: string, groupId?: string): Observable<GenericResponse> {
        const url = `${environment.baseurl}/group/addGroupSite`;
        return this.http.post<GenericResponse>(url, {siteId, groupId});
    }

    public unlinkGroupSite(siteId?: string, groupId?: string): Observable<GenericResponse> {
        const url = `${environment.baseurl}/group/unlinkGroupSite`;
        return this.http.post<GenericResponse>(url, {siteId, groupId});
    }
}

export interface GetAdminGroupDetailsModel {
    groupId: string;
    bureauName: string;
    primaryContactName: string;
    primaryContactTel: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    postcode: string;
    notes: string;
    active: boolean | null;
    pZRegistrationReference: string;
    isPZEnabled: boolean | null;
    pZOrganisationCode: string;
    pZApiKey: string;
}