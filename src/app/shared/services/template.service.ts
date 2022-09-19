import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { GenericResponse } from "../models/GenericResponseModel";
import { map } from "rxjs/operators";
import { ShareModel } from "./patient.service";
import { thickness } from "devexpress-reporting/scopes/reporting-chart-internal";

@Injectable({
    providedIn: 'root'
})
export class TemplateService {
    constructor(private http: HttpClient) { }
    public getGlobalTemplateCategories(): Observable<GlobalTemplateTypesModel[]> {
        const url = `${environment.baseurl}/glu_TemplateCategories/getTemplateCategories`;
        return this.http.get<GlobalTemplateTypesModel[]>(url);
    }

    public getGlobalTemplateTypes(category: number): Observable<GlobalTemplateTypesModel[]> {
        const url = `${environment.baseurl}/glu_TemplateTypes/getTemplateTypes?category=${category}`;
        return this.http.get<GlobalTemplateTypesModel[]>(url);
    }

    public getGlobalTemplates(type: number | null): Observable<GlobalTemplateViewModel[]> {
        const url = `${environment.baseurl}/glu_Templates/getAll`;
        return this.http.get(url).pipe(map((x: any) => x.data.filter(y => y.typeId == type)));
    }

    public deleteGlobalTemplate(templateId: string): Observable<GenericResponse> {
        const url = `${environment.baseurl}/glu_Templates/${templateId}`;
        return this.http.delete<GenericResponse>(url);
    }

    public getSiteTemplates(type: number | null): Observable<TemplateViewModel[]> {
        const url = `${environment.baseurl}/llu_Templates/getAll`;
        return this.http.get(url).pipe(map((x: any) => x.data.filter(y => y.typeId == type && y.active)));
    }

    public deleteSiteTemplate(templateId: string): Observable<GenericResponse> {
        const url = `${environment.baseurl}/llu_Templates/${templateId}`;
        return this.http.delete<GenericResponse>(url);
    }

    public getMedsecTemplates(type: number | null): Observable<TemplateViewModel[]> {
        const url = `${environment.baseurl}/bureauTemplates/getAll`;
        return this.http.get(url).pipe(map((x: any) => x.data.filter(y => y.typeId == type)));
    }

    public deleteMedsecTemplate(templateId: string): Observable<GenericResponse> {
        const url = `${environment.baseurl}/bureauTemplates/${templateId}`;
        return this.http.delete<GenericResponse>(url);
    }

    public shareMedsecTemplateWithSite(model: ShareModel): Observable<GenericResponse> {
        const url = `${environment.baseurl}/bureauTemplates/share`;
        return this.http.post<GenericResponse>(url, model);
    }

    public getTemplatesByType(type: number) :Observable<TemplateViewModel[]> {
        const url = `${environment.baseurl}/llu_Templates/getInvoiceTemplates?type=${type}`;
        return this.http.get<TemplateViewModel[]>(url);
    } 
}

export class GlobalTemplateTypesModel {
    uniqueNo: number;
    description: string;
    category: string;
}

export class GlobalTemplateCategoryModel {
    uniqueNo: number;
    description: string;
    category: string;
}

export class TemplateFileModel {
    name?: string | null;
    contentBase64String?: string | null;
}

export class GlobalTemplateViewModel {
    id?: number | null;
    typeId?: number | null;
    type?: string | null;
    file?: TemplateFileModel | null;
    fileName?: string | null;
    description?: string | null;
    comments?: string | null;
    isPatientZone?: boolean | null;
    active?: boolean | null;
}

export class TemplateViewModel {
    templateId?: string | null;
    existingGlobalTemplateId?: number | null;
    existingLocalTemplateId?: string | null;
    existingBureauTemplateId?: string | null;
    typeId?: number | null;
    type?: string | null;
    description?: string | null;
    comments?: string | null;
    default?: boolean | null;
    isPatientZone?: boolean | null;
    active?: boolean | null;
}