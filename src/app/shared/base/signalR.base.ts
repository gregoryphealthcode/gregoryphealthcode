import { Directive, OnDestroy } from '@angular/core';
import { SignalRMainHubService } from '../services/signal-rmain-hub.service';

@Directive()
export class SignalRBase implements OnDestroy{

  private callbacks = new Map();

  constructor(private signalRHub: SignalRMainHubService) {
  }

  ngOnDestroy(): void {
    this.callbacks.forEach((value,key)=>
        this.signalRHub.removeListener(key, value)
      )
  }

  addSignalRListener(methodName: string, callback: any){
    this.callbacks.set(methodName,callback);
    this.signalRHub.addListener(methodName, callback);
  }

}
