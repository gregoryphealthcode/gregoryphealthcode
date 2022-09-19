import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserStore } from '../stores/user.store';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService,
    private userStore: UserStore) {}

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

        if(!this.userStore.isAdmin()){
          return false;
        }

        return true;
      })
    );
  }

}
