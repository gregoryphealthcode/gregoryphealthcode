import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  @Output()
  stateChanged: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  public start() {
    this.stateChanged.emit(true);
  }

  public stop() {
    this.stateChanged.emit(false);
  }
}
