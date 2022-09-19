import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRMainHubService {

  private connecting: boolean;
  private hubConnection: signalR.HubConnection;

  private accessToken: string;
  private callBacks: any[] = [];
  private siteId: string;

  constructor() { }

  public setAccessToken(token: string){
    this.accessToken = token;
  }

  public startConnection = (mainUrl: string) => {
    if (!this.hubConnection && this.accessToken) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(mainUrl + `/mainhub`,
        { accessTokenFactory: () => {
          return this.accessToken;
       }})
        .configureLogging(signalR.LogLevel.Information)
        .build();
    }

    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Disconnected && !this.connecting) {
      this.connecting = true;
      this.hubConnection
        .start()
        .then(() => {
          this.connecting = false;
          this.attachListeners();
          if(this.siteId){
            this.invokeUserSelectedSite();
          }
        })
        .catch(err => { this.connecting = false; console.log('Error while starting connection: ' + err);});
    }
  }

  public stopConnection() {
    if (this.hubConnection) {
      this.hubConnection
        .stop()
        .then(() => 'signalR connection stopped')
        .catch(err => console.log('Error while stopping connection: ' + err));
    }

  }

  private attachListeners() { // this will run when the hub starts

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.callBacks.length; i++) {
      this.hubConnection.on(this.callBacks[i].method, this.callBacks[i].callback);
    }

    this.callBacks = [];
  }

  public addListener(method, callback: (data) => void) {

    if (this.alreadyConnected()) { // if hub already instantiated
     this.hubConnection.on(method, callback);
    } else {
      if (this.callBacks.some(x => x.method === method && x.callback === callback)) { // check if it has been already added to the list
       } else {
        this.callBacks.push({
          method,
          callback
        });
      }

    }

  }

  private alreadyConnected(){
    return this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected;
  }

  public removeListener(method, callback?) {
    if (this.hubConnection) { // if hub already instantiated
      if (callback) {
        this.hubConnection.off(method,callback);
      } else {
        this.hubConnection.off(method);
      }
    }
  }

  public userSelectedSite(siteId: string){
    this.siteId = siteId;

    if (this.alreadyConnected()) { // if hub already instantiated
      this.invokeUserSelectedSite();
     }
  }

  private invokeUserSelectedSite(){
    if(this.siteId){
      this.hubConnection.invoke('UserSelectedSite', this.siteId)
      .then(()=>this.siteId= undefined)
      .catch(err => {
        this.siteId= undefined;
        console.error(err);});
    }

  }
}
