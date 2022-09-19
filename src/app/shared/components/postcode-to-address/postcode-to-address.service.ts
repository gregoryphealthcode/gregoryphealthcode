import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostcodeToAddressService {

  constructor(private http: HttpClient) {
  }

  public getAddressesForPostcode(postcode: string): Observable<PostcodeToAddressResponse> {
    const url = `${environment.baseurl}/address/getAddressesForPostcode/${postcode}`;
    return this.http.get<PostcodeToAddressResponse>(url);
  }
}

export interface PostcodeToAddressResponseModel {
  line_1: string;
  line_2: string;
  line_3: string;
  post_Town: string;
  county: string;
  latitude: number;
  longitude: number;
  postcode?:string;
}

export interface PostcodeToAddressResponse {
  success: boolean;
  errorMessage: string;
  addresses: PostcodeToAddressResponseModel[];
}
