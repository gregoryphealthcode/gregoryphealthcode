import { Injectable, NgZone } from '@angular/core';
import { Subscription, fromEvent, merge, BehaviorSubject, interval, of } from 'rxjs';
import { UserStore } from '../stores/user.store';
import { UserService, AuditModel } from './user.service';
import { AuthService, UserAuthenticationEventType } from './auth.service';
import { tap } from 'rxjs/internal/operators/tap';
import { startWith, debounceTime, filter } from 'rxjs/operators';
import 'zone.js/dist/zone-patch-rxjs';

enum LockEventType {
  Lock,
  Unlock
}

@Injectable(
  { providedIn: 'root' }
  )
export class LockScreenService {
  private maxPinAttempts = 5;
  private minutesUntilLock = 10; // 10 minutes
  private minutesUntilLogout = 30; // 30 minutes after lock out

  private subscription: Subscription;
  private logOutTimer: NodeJS.Timer;
  private minutesUntilLogOutTimer: NodeJS.Timer;

  private pinRequired = new BehaviorSubject<boolean>(undefined);
  public pinRequired$ = this.pinRequired.asObservable();

  private incorrectPinAttempts = new BehaviorSubject<number>(0);
  public incorrectPinAttempts$ = this.incorrectPinAttempts.asObservable();

  private minutesUntilLogOut = new BehaviorSubject<number>(
    this.minutesUntilLogout
  );
  public minutesUntilLogOut$ = this.minutesUntilLogOut.asObservable();

  private auditLogMap = new Map([
    [
      LockEventType.Lock,
      { eventCode: 'UserLock', details: 'User Locked System.' }
    ],
    [
      LockEventType.Unlock,
      { eventCode: 'UserLock', details: 'System unlocked.' }
    ]
  ]);

  private authenticationEventsMap = new Map([
    [UserAuthenticationEventType.Login, () => this.start()],
    [UserAuthenticationEventType.LogOut, () => this.stop()]
  ]);

  constructor(
    private userStore: UserStore,
    private userService: UserService,
    private authService: AuthService,
    private zone: NgZone
  ) {
    this.authService.authenticationEvents$.subscribe(x => {
      const callback = this.authenticationEventsMap.get(x);
      if (callback) {
        callback();
      }
    });

    const userLocked = this.userStore.checkIfLocked();
    if (userLocked) {
      this.showLockOutScreen();
    }
  }

  private start() {
    this.clearTimers();

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.zone.runOutsideAngular(() =>
      this.onIdle().subscribe(() => {
        this.zone.run(() => this.showLockOutScreen());//
      })
    );
  }

  private onIdle() {
    let keyIsIdle = false;
    let mouseIsIdle = false;

    const onKeyIdle = fromEvent(document, 'keydown').pipe(
      startWith(0),
      tap(()=> keyIsIdle = false),
      debounceTime(this.minutesUntilLock * 60 * 1000),
      tap(()=> keyIsIdle = true)
    );

    const onMouseIdle = fromEvent(document, 'mousemove').pipe(
      startWith(0),
      tap(()=> mouseIsIdle = false),
      debounceTime(this.minutesUntilLock * 60 * 1000),
      tap(()=> mouseIsIdle = true)
    );

    const moveMerge = merge(onKeyIdle, onMouseIdle).pipe(
      filter(x => keyIsIdle && mouseIsIdle && !this.pinRequired.value)
    );

    return moveMerge;
  }

  private stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.clearTimers();
    this.pinRequired.next(false);
    this.incorrectPinAttempts.next(0);
  }

  public showLockOutScreen() {
    this.pinRequired.next(true);
    this.userStore.lockUser();
    this.clearTimers();
    this.setLogOutTimer();
    this.setMinutesUntilLogOutTimer();
    this.recordLog(LockEventType.Lock);
  }

  public checkPin(pin: string) {
    const sub = this.userService.validatePin(pin).subscribe(
      x =>{
        if(!x.valid){
          this.onIncorrectPin();
          return;
        }
        this.unlockUser();
        sub.unsubscribe();
      }
    );
  }

  private onIncorrectPin(){
    this.increaseIncorrectPinAttempts();

    if (this.incorrectPinAttempts.value === this.maxPinAttempts) {
      this.recordLog(LockEventType.Lock);
      this.authService.logOut();
    }
  }

  public clearTimers() {
    if (this.logOutTimer) {
      clearTimeout(this.logOutTimer);
    }

    if (this.minutesUntilLogOutTimer) {
      clearTimeout(this.minutesUntilLogOutTimer);
    }
  }

  private increaseIncorrectPinAttempts() {
    this.userStore.increaseIncorrectPinAttempts(); // update session storage
    this.incorrectPinAttempts.next(this.incorrectPinAttempts.value + 1);
  }

  private unlockUser() {
    this.userStore.unlockUser(); // update session storage
    this.incorrectPinAttempts.next(0);
    this.pinRequired.next(false);
    this.clearTimers();
    this.recordLog(LockEventType.Unlock);
  }

  private setMinutesUntilLogOutTimer() {
    this.minutesUntilLogOut.next(this.minutesUntilLogout);
    if (this.minutesUntilLogOutTimer) {
      clearTimeout(this.minutesUntilLogOutTimer);
    }

    this.minutesUntilLogOutTimer = setInterval(() => {
      this.minutesUntilLogOut.next(this.minutesUntilLogOut.value - 1);
    }, 60 * 1000);
  }

  private recordLog(event: LockEventType) {
    const log = this.auditLogMap.get(event);
    const auditModel: AuditModel = {
      userId: this.userStore.getUserId(),
      siteId: this.getSiteId(),
      eventCategory: 'Info',
      eventCode: log.eventCode,
      details: log.eventCode,
      reportedBy: 'ePractice',
      reason: '',
      patientId: null
    };

    // const sub = this.userService
    //   .addAuditLog(auditModel)
    //   .subscribe(() => sub.unsubscribe());
  }

  private getSiteId() {
    let siteId;
    if (this.userStore.hasSelectedASite()) {
      siteId = this.userStore.getSiteId();
    }
    return siteId;
  }

  private setLogOutTimer() {
    if (this.logOutTimer) { clearTimeout(this.logOutTimer); }

    this.logOutTimer = setTimeout(() => {
      this.authService.logOut();
    }, this.minutesUntilLogout * 60 * 1000);
  }
}
