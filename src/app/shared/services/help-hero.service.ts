import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Guid from 'devextreme/core/guid';

export class HelpHeroModel { 
    uniqueNo: number | null;
    tourCode: string | null;
    tourDescription: string | null;
    platform: string | null;
    ePracticePageUrl: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class HelpHeroService {
    constructor(private http: HttpClient) {
    }    

    public getHelpHero(): Observable<HelpHeroModel[]> {
        const url = `${environment.baseurl}/helpHero/`;
        return this.http.get<HelpHeroModel[]>(url);
    }
}