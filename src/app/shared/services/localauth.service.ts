import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppInfoService } from './app-info.service';
import { HttpClient } from '@angular/common/http';
import { AlertService } from './alert.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { map } from 'rxjs/operators';
import { AuditModel, UserService } from './user.service';
import { environment } from 'src/environments/environment';
import { GoogleAnalyticsService } from './google-analytics.service';
import { OAuth365Settings } from './../../../oauth365';
import { UserStore } from '../stores/user.store';

@Injectable()
export class LocalAuthServiceOld {
  @Output() siteOrUserChanged = new EventEmitter<any>();
  @Output() configureDashboard = new EventEmitter<any>();
  loggedIn = false;
  location = null;
  locked = false;
  minsUntilLogoff = 999;
  incorrectPINattempts = 0;

  public dashboardEdit = false;

  public authenticated365 = false;
  public deviceInfo = null;
  public isMobilevar = false;
  public isTabletvar = false;
  public isDesktopvar = false;
  public longitude = '';
  public latitude = '';
  public messageTimer: any;

  AuthServer = '';
  mytokenKey = 'accessToken';
  public myuserDisplayName = null;
  public myuserPhotoURL = '';
  public myuserFirstName = '';
  myuserEmail = '';
  myuserEmailVerified = false;
  public myuserid = '';
  myproviderid = '';
  public mysiteid = sessionStorage.getItem('siteSelected');
  myusertype = '';
  // tslint:disable-next-line: max-line-length
  private myaccesskey

  private myaccessrole = 'No Access';

  User: Observable<any>;

  myresult: Observable<any>;
  myuser: Observable<string>;
  public myerrors: Observable<string[]>;
  // userService: any;

  public get getMyAccessKey(): string {
    // console.log('getMyAccessKey: ', this.myaccesskey);
    return this.myaccesskey;
  }

  public setMyAccessKey(newkey) {
    // console.log('setMyAccessKey: ', newkey);
    this.myaccesskey = newkey;
  }

  broadcastSiteOrUserChanged() {
    console.log(
      'Site or User changed.. broadcast message to update menu options!!!!'
    );
    this.siteOrUserChanged.emit();
  }

  broadcastConfigureDashboard() {
    console.log('Configure Dashboard clicked');
    if (this.dashboardEdit == false) {
      this.dashboardEdit = true;
      this.configureDashboard.emit();
    }
  }

  showError(jqXHR) {
    // this.myresult(jqXHR.status + ': ' + jqXHR.statusText);
    const response = jqXHR.responseJSON;
    if (response) {
      if (response.Message) {
        this.myerrors.pipe(
          map(resp => {
            resp.push(response.Message);
            return this.myerrors;
          })
        );
      }
      if (response.ModelState) {
        const modelState = response.ModelState;
        for (const prop in modelState) {
          if (modelState.hasOwnProperty(prop)) {
            const msgArr = modelState[prop]; // expect array here
            if (msgArr.length) {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < msgArr.length; ++i) {
                // self.errors.push(msgArr[i]);
                this.myerrors.pipe(
                  map(resp => {
                    resp.push(msgArr[i]);
                    return this.myerrors;
                  })
                );
              }
            }
          }
        }
      }
      if (response.error) {
        // self.errors.push(response.error);
        this.myerrors.pipe(
          map(resp => {
            resp.push(response.error);
            return this.myerrors;
          })
        );
      }
      if (response.error_description) {
        // self.errors.push(response.error_description);
        this.myerrors.pipe(
          map(resp => {
            resp.push(response.error_description);
            return this.myerrors;
          })
        );
      }
    }
  }

  constructor(
    private router: Router,
    appInfo: AppInfoService,
    private http: HttpClient,
    private deviceService: DeviceDetectorService,
    private alertservice: AlertService,
    private userService: UserService,
    public googleAnalyticsService: GoogleAnalyticsService,
    private userStore: UserStore
  ) {
    // this.AuthServer = appInfo.authserver_baseurl;
    // this.detectDevice();
    // this.isMobile();
    // this.isTablet();
    // this.isDesktop();
    // navigator.geolocation.getCurrentPosition(position => {
    //   // console.log(position);
    //   this.location = position.coords;
    //   this.longitude = position.coords.longitude.toString();
    //   this.latitude = position.coords.latitude.toString();
    // });
  }

  public getAuthToken(){
    return this.userStore.getAuthToken();
  }

  public getUserId(){
    return this.userStore.getUserId();
  }

  public detectDevice() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
  }
  public isMobile() {
    this.isMobilevar = this.deviceService.isMobile();
  }

  public isTablet() {
    this.isTabletvar = this.deviceService.isTablet();
  }

  public isDesktop() {
    this.isDesktopvar = this.deviceService.isDesktop();
  }

  getCurrentUser(): Observable<boolean> {
    const url = this.AuthServer + '/aspnetusers/checklogin';
    return this.http.get<boolean>(url);
  }


  async get365Login() {
    // let result = await this.msalService.loginPopup(OAuth365Settings.scopes)
    // .catch((reason) => {
    //   // this.alertsService.add('Login failed', JSON.stringify(reason, null, 2));
    //   console.log('Login failed', JSON.stringify(reason, null, 2));
    // });
    // if (result) {
    //   this.authenticated365 = true;
    //   console.log('office 365 login ok');
    // }
  }

  public async Logout365() {
    // let result = await this.msalService.logout();
    // this.authenticated365 = false;
    // console.log('office 365 logout ok');
  }

  getLogin(username: string, password: string) {
    const loginUrl = this.AuthServer + '/aspnetusers/authenticate';
    let devtype = 'Unknown';
    if (this.deviceService.isMobile() === true) {
      devtype = 'Mobile';
    } else if (this.deviceService.isTablet() === true) {
      devtype = 'Tablet';
    } else if (this.deviceService.isDesktop() === true) {
      devtype = 'Desktop';
    }

    const clientApp = 'ePractice';
    const clientVersion = '0.0.1';
    const clientDevice = devtype;
    const clientOS = this.deviceService.os;
    const clientOSVersion = this.deviceService.os_version;
    const clientBrowser = this.deviceService.browser;
    const clientBrowserVersion = this.deviceService.browser_version;
    const clientLongitude = this.longitude.toString();
    const clientLatitude = this.latitude.toString();

    return this.http
      .post<any>(loginUrl, {
        username,
        password,
        clientApp,
        clientVersion,
        clientDevice,
        clientOS,
        clientOSVersion,
        clientBrowser,
        clientBrowserVersion,
        clientLongitude,
        clientLatitude
      })
      .pipe(
        map(
          user => {
            // login successful if there's a user in the response
            if (user && user.token) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              this.mytokenKey = user.token;
              // this.myuserDisplayName = user.firstName + ' ' + user.lastName;
              this.myuserDisplayName = user.displayName;
              this.myuserFirstName = user.firstName;
              this.myuserPhotoURL =
                environment.authserverBaseurl + user.photoURL;
              this.myuserid = user.id;
              // console.log('userid:', this.myuserid);

              sessionStorage.setItem('currentUser', JSON.stringify(user));
              console.log('about to get office365 login');
              this.get365Login();
            }
            try {
              this.googleAnalyticsService.eventEmitter(
                'user login',
                'login',
                'login',
                'click',
                1
              );
            } catch (e) {}

            return user;
          },
          error => { // unreachable code ?????
            try {
              console.log('unable to log in: ', error);
              this.alertservice.error(
                'Error - unable to log in: /n' + error.error.message ||
                  error.status
              );
              const auditModel: AuditModel = {
                userId: this.myuserid,
                siteId: null,
                eventCategory: 'Error',
                eventCode: 'UserAuth',
                details:
                  'User authenticated failed - ' + error.error.message ||
                  error.status,
                reportedBy: 'ePractice',
                reason: '',
                patientId: null
              };
              //this.userService.addAuditLog(auditModel).subscribe();
            } catch (e) {}
          }
        )
      );
  }

  changePassword(
    username: string,
    password: string,
    authenticatorcode: string
  ) {
    const changepasswordUrl = this.AuthServer + '/aspnetusers/changepassword';

    const userid = this.myuserid;

    return this.http
      .post<any>(changepasswordUrl, { userid, password, authenticatorcode })
      .pipe(
        map(
          response => {
            console.log('change password response: ', response);
            // if (response && response.code === 'OK') {
            return 'OK';
            // }
          },
          error => {
            try {
              this.alertservice.error(
                'Error - unable to change password: /n' + error.error.message ||
                  error.status
              );
            } catch (e) {}
          }
        )
      );
  }

  getAuthenticator(id: string) {
    const getauthenticatorUrl =
      this.AuthServer + '/aspnetusers/getauthenticator';
    return this.http
      .post<any>(getauthenticatorUrl, { id })
      .pipe(
        map(
          response => {
            console.log('get authenticator response: ', response);
            // if (response && response.code === 'OK') {
            return response;
            // }
          },
          error => {
            try {
              this.alertservice.error(
                'Error - unable to change password: /n' + error.error.message ||
                  error.status
              );
            } catch (e) {}
          }
        )
      );
  }

  getIs2FAEnabled(username: string) {
    const is2faenabledUrl = this.AuthServer + '/aspnetusers/is2faenabled';
    return this.http
      .post<any>(is2faenabledUrl, { username })
      .pipe(
        map(
          response => {
            console.log('is2faenabled response: ', response);
            return response;
          },
          error => {}
        )
      );
  }

  verifyAuthenticator(authcode: string, id: string) {
    const verifyauthenticatorUrl =
      this.AuthServer + '/aspnetusers/verifyauthenticator';
    return this.http
      .post<any>(verifyauthenticatorUrl, { id, authcode })
      .pipe(
        map(
          response => {
            console.log('verify code response: ', response);
            if (response && response.code === 'OK') {
              return response;
            }
          },
          error => {
            try {
              this.alertservice.error(
                'Error - unable to verify authenticator: /n' +
                  error.error.message || error.status
              );
            } catch (e) {}
          }
        )
      );
  }

  // Silently request an access token for Office365 from Microsoft Graph API
  // async getAccess365Token(): any {
  // let result = await this.msalService.acquireTokenSilent(OAuth365Settings.scopes)
  //   .catch((reason) => {
  //     console.log('[GraphAPI] Get token failed ' + JSON.stringify(reason, null, 2));
  //   });

  // if (result) console.log('[GraphAPI] Token acquired ' + result);
  // if (result) sessionStorage.setItem('office365Token', result);
  // return result;
}

