import { Injectable, Injector } from '@angular/core';

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { UserStore } from '../stores/user.store';
import { catchError, tap, filter, take, switchMap, mergeMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BearerInterceptor implements HttpInterceptor {
  private excludeUrlsArray = ['login'];
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private refreshTokenInProgress = false;

  constructor(private userStore: UserStore, private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // bypass
    if(request.url.includes('refreshToken')){
      request = this.addAccessToken(request); // add new access token
      return this.handleNext(request, next);
    }

    if (
      this.excludeUrlsArray.some(substring => request.url.includes(substring))
    ) {
      return next.handle(request);
    }

    return this.handle(request, next);
  }

  private handle(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    if (this.refreshTokenInProgress) {
      // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
      // – which means the new token is ready and we can retry the request again
      return this.refreshTokenSubject
        .pipe(filter(result => result !== null))
        .pipe(take(1))
        .pipe(
          switchMap(() => this.handleNext(this.addAccessToken(request), next))
        );
    } else {
      this.refreshTokenInProgress = true;
      // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
      this.refreshTokenSubject.next(null);

      return this.authService.checkIfAuthorised().
      pipe(mergeMap(x => {
          this.refreshTokenInProgress = false;
          this.refreshTokenSubject.next(x);
          request = this.addAccessToken(request); // add new access token
          return this.handleNext(request, next);
        }));
    }
  }

  private addAccessToken(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.userStore.getAuthToken();

    if (token && token.length > 0) {
      request = request.clone({
        setHeaders: {
          Accept: 'application/json;odata=verbose,text/plain, */*; q=0.01', // Not sure why we need this
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }

    return request;
  }

  public handleNext(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(this.handleError),
      tap(
        event => {
          if (event instanceof HttpResponse) {
          }
        },
        error => {
          if (error.status) {
            switch (Number(error.status)) {
            case 400: // do nothing, api returned badRequest
              break;
            case 401: // do nothing, api returned forbidden
              break;
            default:
              // this.appMessages.showErrorNotification("Unexpected error. Please contact your system administrator.");
              break;
            }
          }
        }
      ));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.log(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(error);
  };
}
