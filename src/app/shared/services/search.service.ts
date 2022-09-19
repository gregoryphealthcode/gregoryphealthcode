import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BasicPatientDetailsViewModel } from './patient.service';
import { Observable } from 'rxjs';
import { ContactListViewModel } from './contact.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor( private http: HttpClient) {
  }
  public searchPatients(criteria: SearchCriteria): Observable<BasicPatientDetailsViewModel[]> {
   const url =
  // tslint:disable-next-line: max-line-length
  `${environment.baseurl}/Search/searchPatients?term=${criteria.term}&type=${criteria.type}&active=${criteria.active}&deceased=${criteria.deceased}&debtors=${criteria.debtors}`;

      return this.http.get<BasicPatientDetailsViewModel[]>(url);
  }

  public updateRecords(searchField: string, searchValue: string, active: boolean, debtors: boolean, deceased: boolean): Observable<BasicPatientDetailsViewModel[]> {
     const url = `${environment.baseurl}/Search/filterPatients?searchField=${searchField}&searchValue=${searchValue}&active=${active}&debtors=${debtors}&deceased=${deceased}`;
      return this.http.get<BasicPatientDetailsViewModel[]>(url);
  }

  public searchContacts(criteria: ContactSearchCriteria): Observable<ContactListViewModel[]> {
      const url =
      `${environment.baseurl}/Search/searchContacts?term=${criteria.term}&type=${criteria.type}&contactType=${criteria.contactType}`;
       return this.http.get<ContactListViewModel[]>(url);
   }
}


export class SearchCriteria
{
   term : string;
   type : string;
   active : boolean;
   deceased : boolean;
   debtors : boolean;
}

export class ContactSearchCriteria
{
   term : string;
   type : string;
   contactType : string;
}
