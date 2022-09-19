import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import Guid from "devextreme/core/guid";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { GenericResponseModel } from "../models/GenericResponseModel";

@Injectable({
    providedIn: 'root',
  })
export class PatientAllergyService {
    constructor( private http: HttpClient) {
    }    

    public getPatientAllergiesGrid(patientId: Guid): Observable<PatientAllergyModel[]> {
        const url = `${environment.baseurl}/patientAllergies`;
        return this.http.get<PatientAllergyModel[]>(url);
      }

      public getPatientAllergiesIntolerances(patientId: Guid): Observable<PatientAllergyModel[]> {
        const url = `${environment.baseurl}/patientAllergies/getPatientAllergiesIntolerances?patientId=${patientId}`;
        return this.http.get<PatientAllergyModel[]>(url);
      }

      public deletePatientAllergy(id: Guid): Observable<boolean> {
        const url = `${environment.baseurl}/patientAllergies/deletePatientAllergy?id=${id}`;
        return this.http.delete<boolean>(url);
      }

    public getAllergies(): Observable<AllergyModel[]> {
        const url = `${environment.baseurl}/patientAllergies/getAllergies`;
        return this.http.get<AllergyModel[]>(url);
    }

    public getAllergyIntolerance(): Observable<AllergyTypeModel[]> {
        const url = `${environment.baseurl}/patientAllergies/getAllergyIntolerance`;
        return this.http.get<AllergyTypeModel[]>(url);
    }

    public getAllergySeverity(): Observable<AllergySeverityModel[]> {
        const url = `${environment.baseurl}/patientAllergies/getAllergySeverity`;
        return this.http.get<AllergySeverityModel[]>(url);
    }    
}

export class AllergyModel {
    allergyCode: string | null;
    allergen: string | null;
}

export class AllergySeverityModel {
    allergySeverityId: number | null;
    allergySeverity: string | null;
}

export class AllergyTypeModel {
    allergyTypeId: number | null;
    allergyType: string | null;
}

export class PatientAllergyModel {
    id: Guid | null;
    patientId: Guid | null;
    allergyCode: string | null;
    allergen: string | null;
    allergySeverityId: number | null;
    allergySeverity: string | null;
    allergyTypeId: number | null;
    allergyType: number | null;
    notes: string | null;
}

