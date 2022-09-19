import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import Guid from "devextreme/core/guid";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { GenericResponse } from "../models/GenericResponseModel";

@Injectable({
    providedIn: 'root'
})
export class RemittanceService {
    constructor(private http: HttpClient) {
    }

    public archiveRemittance(remittanceId: Guid,): Observable<GenericResponse> {
        const url = `${environment.baseurl}/hcRemittance/archiveRemittance`;
        return this.http.put<GenericResponse>(url, {remittanceId});
    }

    public unarchiveRemittance(remittanceId: Guid,): Observable<GenericResponse> {
        const url = `${environment.baseurl}/hcRemittance/unarchiveRemittance`;
        return this.http.put<GenericResponse>(url, {remittanceId});
    }
}

export class RemittanceModel {
    id?: Guid | null;
    insurerName?: string | null;
    dateCreated?: Date | null;
    totalAmount?: number | null;
    totalShortfall?: number | null;
    totalClaims?: number | null;
    archived?: boolean | null;
    archivedDate?: Date | null;
    archivedBy?: string | null;
    unarchivedDate?: Date | null;
    unarchivedBy?: string | null;
}