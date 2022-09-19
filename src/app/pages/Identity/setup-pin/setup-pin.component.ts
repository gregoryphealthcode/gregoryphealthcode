import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';

@Component({
  selector: 'app-setup-pin',
  templateUrl: './setup-pin.component.html',
  styleUrls: ['./setup-pin.component.scss']
})
export class SetupPinComponent extends SubscriptionBase implements OnInit {
  public pinValue: string;

  constructor(
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
  }

  setupPin() {
    this.subscription.add(
      this.authService.setupPin(this.pinValue)
        .subscribe(x => {
          if (x && x.success) {
            this.authService.routeToSelectSite();
          }
        })
    );
  }
}