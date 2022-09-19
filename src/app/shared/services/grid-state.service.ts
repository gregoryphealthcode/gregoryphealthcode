import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Guid from 'devextreme/core/guid';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenericResponse, GenericResponseModel } from '../models/GenericResponseModel';

@Injectable({
  providedIn: 'root'
})
export class GridStateService {

  constructor(private http: HttpClient) {
  }

  public getGridStates(gridId: string) {
    const url = `${environment.baseurl}/gridState?gridId=${gridId}`;
    return this.http.get<GetGridStateResponseModel[]>(url);
  }

  public addGridState(gridId: string, name: string, content: string, isGlobal: boolean = false) {
    const url = `${environment.baseurl}/gridState`;
    const request = { gridId, name, content, isGlobal };
    return this.http.post<GenericResponseModel<AddGridStateResponseModel>>(url, request);
  }

  public updateGridState(id: string, content: string): Observable<any> {
    const url = `${environment.baseurl}/gridState`;
    return this.http.put<boolean>(url, { id, content });
  }

  public deleteGridState(gridStateId: Guid): Observable<GenericResponse> {
    const url = `${environment.baseurl}/gridState/deleteGridState/${gridStateId}`;
    return this.http.delete<GenericResponse>(url);
  }
}

export interface AddGridStateResponseModel {
  id: string;
}

export interface AddGridStateRequest extends AddGetGridStateBaseModel {
  gridId: string;
}

export interface GetGridStateResponseModel extends AddGetGridStateBaseModel {
  id: string;
}

export interface AddGetGridStateBaseModel {
  name: string;
  contents: string;
  isGlobal: boolean;
}
