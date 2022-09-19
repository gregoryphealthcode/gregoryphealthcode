
export interface GetUserDetailsResponseModel {
  firstName: string;
  lastName: string;
  displayName: string;
  photoURL: string;
  hasPin: boolean;
  locked?: boolean;
  incorrectPinAttempts?: number;
}



