import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Address } from './contact.service';
import { GenericResponse, GenericResponseModel } from '../models/GenericResponseModel';
import Guid from 'devextreme/core/guid';

@Injectable()
export class RelatedPersonService {
    constructor(private router: Router, private http: HttpClient) {
    }

    public getRelatedPersonsForPatient(patientId: Guid): Observable<RelatedPersonsViewModel[]> {
        const url = `${environment.baseurl}/relatedPersons/getRelatedPersons?patientId=${patientId}`;
        return this.http.get<RelatedPersonsViewModel[]>(url);
    }

    public getRelatedPersonDetails(relatedPersonId: Guid) : Observable<RelatedPersonsViewModel> {
        const url = `${environment.baseurl}/relatedPersons/getRelatedPersonDetails?relatedPersonId=${relatedPersonId}`;
        return this.http.get<RelatedPersonsViewModel>(url);
    }

    public addRelatedPerson(model: RelatedPersonsViewModel): Observable<GenericResponseModel<string>> {
        const url = `${environment.baseurl}/relatedPersons/addRelatedPerson`;
        return this.http.post<GenericResponseModel<string>>(url, model); 
    }

    public updateRelatedPerson(model: RelatedPersonsViewModel): Observable<GenericResponse> {
        const url = `${environment.baseurl}/relatedPersons/updateRelatedPerson`;
        return this.http.patch<GenericResponse>(url, model); 
    }

    public deleteRelatedPerson(relatedPersonId: string): Observable<GenericResponse> {
        const url = `${environment.baseurl}/relatedPersons?relatedPersonId=${relatedPersonId}`;
        return this.http.delete<GenericResponse>(url);
    }

    public getNextOfKin(patientId: string): Observable<RelatedPersonsViewModel> {
        const url = `${environment.baseurl}/relatedPersons/getNextOfKin?patientId=${patientId}`;
        return this.http.get<RelatedPersonsViewModel>(url);
    }

    public getRelatedPersonsAddress(id: string): Observable<RelatedPersonsViewModel> {
        const url = `${environment.baseurl}/relatedPersons/getRelatedPersonsAddress/${id}`;
        return this.http.get<RelatedPersonsViewModel>(url);
    }

    public setAsPayor(relatedPersonId: string) {
        const url = `${environment.baseurl}/relatedPersons/setRelatedPersonsPayor?relatedPersonId=${relatedPersonId}`;
        return this.http.patch(url, relatedPersonId);
    }


}

export class RelatedPersonsList {
    firstName: string;
    lastName: string;
    relatedPersonType: string;
    relationshipToPatient: string;
    patientRelatedPersonId: string;
    isPayor: boolean;
}

export class RelatedPersonsViewModel {
    patientRelatedPersonId: Guid | null;
    relatedPersonId: Guid | null;
    patientId: Guid | null;
    siteId: Guid | null;
    lastName: string | null;
    firstName: string | null;    
    title: string | null;
    displayName: string | null;
    relatedPersonType: string | null;
    relationshipToPatient: string | null;
    email: string | null;
    contactNumber: string | null;
    sendViaPatientzone: boolean | null;
    isPayor: boolean | null;
    comments: string | null;    
    description: string | null;
    address: Address | null; 
}
