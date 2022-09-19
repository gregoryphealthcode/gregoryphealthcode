import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactTelecomTypeService {

  constructor(private http: HttpClient) {
  }

  public getGlobalContactTelecomTypes(): Observable<any[]> {
    const url = `${environment.baseurl}/contactTelecomTypes/getAllGlobalTypes`;
    return this.http.get<any[]>(url);
  }
}
