import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map,tap } from 'rxjs/operators';
import { UserStore } from '../stores/user.store';
import { SitesStore } from '../stores/sites.store';

@Injectable({
  providedIn: 'root'
})
export class MedSecAuthGuardService implements CanActivate {
  constructor(private authService: AuthService,
    private userStore: UserStore,
    private siteStore: SitesStore) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.canAccess(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
      return this.canAccess(route);
    }

  canAccess(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.checkIfAuthorised().pipe(
      map((authorised: boolean) => {
        if (!authorised) {
          this.authService.logOut();
          return false;
        }

        if (!this.userStore.hasPin()) {
          this.authService.routeToPinSetup();
          return false;
        }

        const accessKey = this.userStore.getAccessKey();
        
        return true;
        /* if (route.data.accesskey) {
          if(route.data.accesskey === 1)
          {
            return true;
          }
          if (accessKey[route.data.accesskey - 1] === '1') {
            return true;
          }
          this.authService.routeToAccessDeniedPage(route.routeConfig.path);
          return false;
        } else {
          console.log('!!!! No permissions found for this page: ', route.data);
          return true;
        } */
      })
    );
  }
}
