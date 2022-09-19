import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location} from '@angular/common';
import { UserStore } from '../../stores/user.store';
import { SubscriptionBase } from '../../base/subscribtion.base';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-page-wrapper',
  templateUrl: './app-page-wrapper.component.html',
  styleUrls: ['./app-page-wrapper.component.scss']
})
export class AppPageWrapperComponent extends SubscriptionBase implements OnInit {  
  constructor(
    private router: Router, 
    public location: Location,
    private userStore: UserStore,
    private authService: AuthService,
    ) {
      super();
     }

  @Input() title: string;
  @Input() hasBackButton = true;
  @Input() hasTabs = false;
  @Input() backPagePath: string;

  ngOnInit() {
  }

  backButtonClicked(){
    if(this.backPagePath){
      if (this.userStore.isMedSecUser() == true) {
        this.unselectSite();
        this.backPagePath = '/medsec' + this.backPagePath;
      }
      this.router.navigate([this.backPagePath]);
      return;
    }
    this.location.back();
  }

  private unselectSite(callback?) {
    if (this.userStore.isMedSecUser()) {
      this.subscription.add(
        this.authService.unselectSite().subscribe(() => {
          if (callback) {
            callback();
          }
        })
      );
    }
  }
}
