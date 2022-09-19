import { Injectable } from '@angular/core';
import { GetUserDetailsResponseModel } from '../models/UserLoginResponseViewModel';


@Injectable({
  providedIn: 'root'
})
export class UserStore {
  private get storeUserKeyName() {return 'user';}
  private get storeTokenKeyName() {return 'token';}
  //private storedUser: UserViewModel;
  private storedUser: GetUserDetailsResponseModel;
  private storedToken: string;

  public hasToken(): boolean {
    if (this.storedToken) {
      return true;
    }
    return false;
  }

  public hasValidToken() {
    const exp = this.getJsonFromToken().exp;
    const date = new Date(exp * 1000);
    const hasValidToken = date > new Date();
    return hasValidToken;
  }

  public clear() {
    this.storedUser = null;
    this.storedToken = null;
    sessionStorage.removeItem(this.storeUserKeyName);
    sessionStorage.removeItem(this.storeTokenKeyName);
    localStorage.removeItem(this.storeUserKeyName);
  }

  public store(user: GetUserDetailsResponseModel) {
    this.storedUser = user;
    sessionStorage.setItem(this.storeUserKeyName, JSON.stringify(user));
  }

  public storeToken(token: string) {
    if(token.length === 0) throw 'token cant be found';
    this.storedToken = token;
    sessionStorage.setItem(this.storeTokenKeyName, token);
  }

  public userPinHasBeenSet(){
    this.storedUser.hasPin = true;
    this.store(this.storedUser);
  }

  public getAuthToken(): string {
    if (this.storedToken) {
      return this.storedToken;
    }
    return undefined;
  }

  public getUserId(): string {
    this.throwErrorIfNoUser();
    return this.getJsonFromToken().user_id;//
  }

  private getJsonFromToken(){
    const jsonData = atob(this.storedToken.split('.')[1]);
    return JSON.parse(jsonData);
  }

  public getDisplayName(): string {
    this.throwErrorIfNoUser();
    return this.storedUser.displayName;
  }

  public getPhotoUrl(): string {
    this.throwErrorIfNoUser();
    return this.storedUser.photoURL;
  }


  public hydrateUserFromStorage() {
    const userData = sessionStorage.getItem(this.storeUserKeyName);
    const token = sessionStorage.getItem(this.storeTokenKeyName);

    if (userData) {
      this.storedUser = JSON.parse(userData);
      this.storedToken = token;
    }
  }

  private throwErrorIfNoUser(){
    if (!this.hasToken()){
      throw new Error('Error getting user details. Please make sure you are logged in!');
    }
  }

  public increaseIncorrectPinAttempts(){
    this.throwErrorIfNoUser();
    this.storedUser.incorrectPinAttempts += 1;
    this.store(this.storedUser);
  }

  public unlockUser(){
    this.throwErrorIfNoUser();
    this.storedUser.incorrectPinAttempts = 0;
    this.storedUser.locked = false;
    this.store(this.storedUser);
  }

  public getSiteId(){
    this.throwErrorIfNoUser();
    const siteId = this.getJsonFromToken().site_id;
    if(!siteId){
      throw new Error('Error getting user site id. Please make you have selected a site!');
    }
    return siteId;
  }

  public hasSelectedASite(){
    this.throwErrorIfNoUser();
    const siteId = this.getJsonFromToken().site_id;
    if(siteId) { return true; }
    return false;
  }

  public hasPin(){
    this.throwErrorIfNoUser();
    return this.storedUser.hasPin;
  }

  public getFirstName(){
    this.throwErrorIfNoUser();
    return this.storedUser.firstName;
  }

  public getAccessKey(){
    this.throwErrorIfNoUser();
    return this.getJsonFromToken().acc_key;
  }

  public getUserType(): number{
    this.throwErrorIfNoUser();
    return this.getJsonFromToken().user_type;
  }

  public isMedSecUser(){
    return this.getUserType() == 1;
  }

  public isAdmin(): boolean{
    return this.getUserType() == 5;
  }

  public lockUser(){
    this.throwErrorIfNoUser();
    this.storedUser.locked = true;
    this.store(this.storedUser);
  }

  public checkIfLocked(){
    this.throwErrorIfNoUser();
    return this.storedUser.locked;
  }

  public roleAllowsAccess(requiredAccessLevelBit) {
    try {
      if (this.getAccessKey()[requiredAccessLevelBit - 1] === '1') {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
