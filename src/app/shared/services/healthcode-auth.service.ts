import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from './user.service';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HealthCodeAuthService {
  constructor() {}

  public buildLoginUrl(
    stateToken: string,
    nonceToken: string,
    returnUrl: string
  ) {
    const state = `sessionid<{${stateToken}}>callbackurl<{${returnUrl}}>`;
    const postLoginRedirectUrl = environment.healthCode.redirectPath;

    const cliendIdParam = `client_id=${environment.healthCode.clientId}`;
    const responseTypeParam = 'response_type=code';
    const scopeParam = `scope=${environment.healthCode.scope}`;
    const redirectUriParam = `redirect_uri=${encodeURIComponent(postLoginRedirectUrl)}`;
    const stateParam = `state=${encodeURIComponent(state)}`;
    const nonceParam = `nonce=${encodeURIComponent(nonceToken)}`;

    const query = cliendIdParam +
      '&' +
      responseTypeParam +
      '&' +
      scopeParam +
      '&' +
      redirectUriParam +
      '&' +
      stateParam +
      '&' +
      nonceParam

    return environment.healthCode.mainUrl + '/' +
      environment.healthCode.authorizePath + '?prompt=login&' +
      query

  }

  public getStateToken(state: string) {
    const findings = state.match(/sessionid<{(.*)}>callbackurl/);
    return findings[1];
  }

}
