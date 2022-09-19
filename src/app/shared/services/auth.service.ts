import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { tap, startWith, map, switchMap, catchError } from "rxjs/operators";
import { AuditModel, UserService } from "./user.service";
import { UserDeviceDetectorService } from "./user-device-detector.service";
import { buildLoginRequest } from "../mappers/userLoginRequest";
import { GetUserDetailsResponseModel } from "../models/UserLoginResponseViewModel";
import { SignalRMainHubService } from "./signal-rmain-hub.service";
import { UserStore } from "../stores/user.store";
import { Router } from "@angular/router";
import { GoogleAnalyticsService } from "./google-analytics.service";
import { Observable, of, BehaviorSubject, Subscription } from "rxjs";
import { AppInfoService } from ".";
import { SitesStore } from "../stores/sites.store";
import { HealthCodeAuthService } from "./healthcode-auth.service";
import { AuthTokenResponse} from "../models/RefreshTokenResponseViewModel";

export enum UserAuthenticationEventType {
  Login,
  LogOut,
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private authenticationEvents =
    new BehaviorSubject<UserAuthenticationEventType>(undefined);
  public authenticationEvents$ = this.authenticationEvents.asObservable();
  public authenticated365 = false;
  private subscription = new Subscription();

  constructor(
    private userDeviceDetector: UserDeviceDetectorService,
    private signalRService: SignalRMainHubService,
    private userStore: UserStore,
    private siteStore: SitesStore,
    private userService: UserService,
    private router: Router,
    public googleAnalyticsService: GoogleAnalyticsService,
    private appInfo: AppInfoService,
    private healthCodeAuthService: HealthCodeAuthService
  ) {
    this.userStore.hydrateUserFromStorage();

    if (this.userStore.hasToken()) {
      this.authenticationEvents.next(UserAuthenticationEventType.Login);
      this.startSignalR();

      if (
        this.userStore.hasSelectedASite() &&
        this.siteStore.anySitesInStorage() &&
        !this.userStore.isMedSecUser()
      ) {
        this.siteStore.hydrateFromStorage();
        const selectedSiteId = this.siteStore.getSelectedSite().siteId;
        this.signalRService.userSelectedSite(selectedSiteId);
      }
    }
  }

  public checkIfAuthorised(): Observable<boolean> {
    if (!this.userStore.hasToken()) {
      return of(false);
    }

    if (!this.userStore.hasValidToken()) {
      return this.refreshToken();
    }

    return of(true);
  }

  private refreshToken() {
    return this.userService.refreshToken().pipe(
      map((x) => {
        if (x.response === AuthTokenResponse.Ok) {
          this.userStore.storeToken(x.token);
          return true;
        } else {
          return false;
        }
      }),
      catchError((e) => {
        return of(false);
      })
    );
  }

  public login(username: string, password: string) {
    const deviceDetails = this.userDeviceDetector.getDeviceDetails();
    const request = buildLoginRequest(username, password, deviceDetails);

    return this.userService.login(request).pipe(
      tap(response => this.userStore.storeToken(response.token)),
      switchMap(() => this.userService.getUserDetails()),
      tap(userDetails => this.onSuccessfullyLoggedIn(userDetails))
    );
  }

  public getSites() {
    return this.userService.getAllowedSites().pipe(tap((x) => this.siteStore.setStores(x)));
  }

  public selectSite(siteId: string) {
    return this.userService.selectSite(siteId).pipe(
      tap((x) => {
        this.userStore.storeToken(
          x.token
        );

        if (this.userStore.isMedSecUser()) {
          return;
        }

        this.appInfo.setupHelpHero(
          this.userStore.getUserId(),
          this.userStore.getFirstName(),
          this.userStore.getDisplayName()
        );

        this.signalRService.userSelectedSite(siteId);
      })
    );
  }

  public unselectSite() {
    return this.userService.unselectSite().pipe(
      tap((x) => {
        this.userStore.storeToken(
          x.token
        );
      })
    );
  }


  public logOut() {
    this.addAuditLogEntry();
    sessionStorage.clear();
    this.stopSignalR();
    this.emitGoogleAnalyticsEvent();
    this.authenticationEvents.next(UserAuthenticationEventType.LogOut);
    this.routeToLogin();
  }

  public routeToAccessDeniedPage(path: string) {
    this.router.navigate(["pages/access-not-allowed"], {
      queryParams: { deniedroute: path },
    });
  }

  public routeToLogin() {
    if (environment.enableLocalAuth) {
      this.router.navigate(["/identity/login"]);
      return;
    }

    const returnUrl = this.router.routerState.snapshot.url;

    this.subscription.add(
      this.userService.getStateAndNonceToken().subscribe((x) => {
        const externalUrl = this.healthCodeAuthService.buildLoginUrl(
          x.state,
          x.nonce,
          returnUrl
        );
        window.open(externalUrl, "_self");
      })
    );
  }

  public postAuth(code: string, state: string) {
    state = this.healthCodeAuthService.getStateToken(state);

    return this.userService.onPostAuth({ code, stateToken: state }).pipe(
      tap(response => this.userStore.storeToken(response.token)),
      switchMap(() => this.userService.getUserDetails()),
      tap(userDetails => this.onSuccessfullyLoggedIn(userDetails))
    );
  }



  public setupPin(pin: string) {
    const id = this.userStore.getUserId();
    return this.userService.setupPin({ id, pin }).pipe(
      tap((x) => {
        if (x && x.success) {
          this.userStore.userPinHasBeenSet();
        }
      })
    );
  }

  private emitGoogleAnalyticsEvent() {
    this.googleAnalyticsService.eventEmitter(
      "user logoff",
      "logoff",
      "logoff",
      "click",
      2
    );
  }

  private addAuditLogEntry() {
    if (!this.userStore.hasToken()) {
      return; // no user found in storage
    }

    const userId = this.userStore.getUserId();

    const auditModel: AuditModel = {
      userId,
      siteId: null,
      eventCategory: "Info",
      eventCode: "LogOff",
      details: "User Logged Off.",
      reportedBy: "ePractice",
      reason: "",
      patientId: null,
    };
    //this.userService.addAuditLog(auditModel).subscribe();
  }

  private onSuccessfullyLoggedIn(userDetails: GetUserDetailsResponseModel) {
    // store user
    this.userStore.store(userDetails);

    // start SignalR
    this.startSignalR();

    // lockscreen service, setup and start timer
    this.authenticationEvents.next(UserAuthenticationEventType.Login);

    if (userDetails.hasPin) {
      if (this.userStore.isMedSecUser()) {
        this.router.navigate(["/medsec/"]);
      } else {
        this.routeToSelectSite();
      }
    } else {
      this.routeToPinSetup();
    }
  }

  public routeToSelectSite() {
    this.router.navigate(["/identity/select-site"]);
  }

  public routeToPinSetup() {
    this.router.navigate(["/identity/setup-pin"]);
  }

  private stopSignalR() {
    this.signalRService.stopConnection();
  }

  private startSignalR() {
    this.signalRService.setAccessToken(this.userStore.getAuthToken());
    this.signalRService.startConnection(environment.baseurl); // start SignalR connection, page reload
  }
}
