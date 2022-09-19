import { Component, OnInit, ViewChild } from '@angular/core';
import { LockScreenService } from '../../services/lock-screen.service';
import { UserStore } from '../../stores/user.store';
import { SubscriptionBase } from '../../base/subscribtion.base';
import { AuthService } from '../../services/auth.service';
import { tap } from 'rxjs/operators';
import { AppInfoService } from '../../services/app-info.service';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './pin-required-modal.component.html',
  styleUrls: ['./pin-required-modal.component.scss']
})
export class PinRequiredModalComponent extends SubscriptionBase {
  public show$ = this.lockScreenService.pinRequired$.pipe(
    tap(x => {
      if (x) {
        this.pinValue = undefined;
      }
    })
  );
  public incorrectPinAttempts$ = this.lockScreenService.incorrectPinAttempts$;
  public minutesUntilLogOut$ = this.lockScreenService.minutesUntilLogOut$;
  public pinValue: string;

  constructor(private lockScreenService: LockScreenService, public appInfo: AppInfoService) {
    super();
  }

  onLockScreenInit(e) {
    // !!! disable Escape key from closing lock screen !!!
    e.component.registerKeyHandler('escape', (x: any) => {
      x.stopPropagation();
    });
  }

  onUnlockClick(e) {
    this.lockScreenService.checkPin(this.pinValue);
  }
}
