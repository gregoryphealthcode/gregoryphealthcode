import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Guid from 'devextreme/core/guid';

export class HealthcodeNewsModel { 
    newsArticleId: Guid | null;
    datePublished: Date | null;
    rank: number | null;
    title: string | null;
    htmlContent: string | null;
    author: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    constructor(private http: HttpClient) {
    }    

    public getHealthcodeNews(): Observable<HealthcodeNewsModel[]> {
        const url = `${environment.baseurl}/news/`;
        return this.http.get<HealthcodeNewsModel[]>(url);
    }
}