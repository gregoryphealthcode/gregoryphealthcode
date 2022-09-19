import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CheckIfAuthorisedGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {

    return this.canAccess();
  }

  private canAccess(){
    return this.authService.checkIfAuthorised().pipe(
      map((authorised: boolean) => {
        if (!authorised) {
          this.authService.logOut();
          return false;
        }

        return true;
      })
    );
  }

}
