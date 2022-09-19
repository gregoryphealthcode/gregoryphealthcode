import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Guid from 'devextreme/core/guid';
import { ResponseModel } from '../models/ResponseModel';

export class UpdateDashboardModel {
    Content: string;
}

export class DashboardResponseModel {
    dashboardId: string;
    Content: string;
}

@Injectable({
    providedIn: 'root'
  })

  export class DashboardService {
    constructor( private http: HttpClient) {
    }

    public updateDashboard(id: string, content: string) : Observable<DashboardResponseModel> {
        const url = `${environment.baseurl}/Dashboard`;
    return this.http.put< DashboardResponseModel>(url, {id, content});
    }

    public getDashboard(): Observable<DashboardResponseModel> {
        const url = `${environment.baseurl}/Dashboard`;
        return this.http.get<DashboardResponseModel>(url);
    }

    public addDashboard(content: string) : Observable< DashboardResponseModel> {
        const url = `${environment.baseurl}/Dashboard`;
        return this.http.post< DashboardResponseModel>(url, {content});
    }
  }