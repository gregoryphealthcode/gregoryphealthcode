import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserPreferencesModel } from 'src/app/shared/models/UserPreferencesModel';
import { UploadProfilePhotoModel } from './profile.component';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  constructor(private http: HttpClient) { }

  public getProfile(){
    const apiUrl = environment.baseurl + '/user/getProfile'
    return this.http.get<UserProfileViewModel>(apiUrl);
  }

  public uploadPhoto(myphoto: UploadProfilePhotoModel): Observable<any>  {
    const uploaddocumenturl = `${environment.baseurl}/ProfilePhotos/UploadProfilePhoto`;
    return this.http.post<boolean>(uploaddocumenturl, myphoto);
  }

  public updateProfile(myupdateprofilemodel: UserProfileViewModel)  {
    const url = `${environment.baseurl}/user/updateprofile`;
    return this.http.put(url, myupdateprofilemodel);
  }

  public updatePreferences(myupdateprofilemodel: UserPreferencesModel)  {
    const url = `${environment.baseurl}/userSettings/updateUserPreferenceSettings`;
    return this.http.post<UserPreferencesModel>(url, myupdateprofilemodel);
  }

  public getUserPreferenceSettings()  : Observable<UserPreferencesModel> {
    const url = `${environment.baseurl}/userSettings/getUserPreferenceSettings`;
    return this.http.get<UserPreferencesModel>(url);
  }
}

export interface UserProfileViewModel {
  displayName: string;
  userName: string;
  email: string;
  title: string;
  firstName: string;
  lastName: string;
  contactTel: string;
  role: string;
  userType: string;
  pin:string;
}
