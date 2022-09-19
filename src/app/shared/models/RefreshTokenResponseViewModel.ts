export interface RefreshTokenResponseViewModel extends AuthTokenResponseViewModel {}

export interface AuthTokenResponseViewModel {
  response: AuthTokenResponse;
  token: string;
}

export enum AuthTokenResponse {
  UserNotFound,
  Unauthorized,
  Ok
}
