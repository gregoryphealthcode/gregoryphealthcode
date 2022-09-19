import { Directive, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SignalRBase } from './signalR.base';

@Directive()
export class SubscriptionBase implements OnDestroy{
  protected subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected addToSubscription(obs: Observable<any>){
    this.subscription.add(
      obs.subscribe()
    )
  }

}

type Constructor<T extends SignalRBase> = new (...args: any[]) => T;
// use this if the component uses Subscription and SignalR
export function SubscriptionAndSignalRBase<T extends Constructor<SignalRBase>>(constructor: T = SignalRBase as any) {
  return class extends constructor {
    protected subscription = new Subscription();

    ngOnDestroy() {
      this.subscription.unsubscribe();
      if (super.ngOnDestroy) super.ngOnDestroy();
    }
  };
}


