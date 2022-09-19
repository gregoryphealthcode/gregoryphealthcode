import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxTextBoxComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { AppInfoService } from 'src/app/shared/services';
import { UserStore } from 'src/app/shared/stores/user.store';
import { UserService } from 'src/app/shared/services/user.service';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent extends SubscriptionBase implements OnInit, AfterViewInit {
  @ViewChild('passwordEdit') passwordEdit: DxTextBoxComponent;

  password = '';
  confirmpassword = '';
  authenticatorCode = '';
  isLoadPanelVisible = false;

  constructor(
    private userStore: UserStore,
    public appInfo: AppInfoService,
    private userService: UserService,
    private router: Router) {
    super()
  }

  passwordComparison = () => {
    return this.password;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      try {
        this.passwordEdit.instance.focus();
      } catch { }
    }, 750);
  }

  onChangePasswordClick(args) {
    this.isLoadPanelVisible = true;
    if (!args.validationGroup.validate().isValid) {
      this.isLoadPanelVisible = false;
      return;
    }

    this.subscription.add(
      this.userService.changePassword(this.userStore.getUserId(), this.password, this.authenticatorCode)
        .subscribe(() => {
          this.router.navigate(['/']);
        },
          error => {
            this.isLoadPanelVisible = false;
            try {
              // this.alertservice.error('Error: \n' + error.error.message );
              notify('Error: \n' + error.error.message, 'error');
            } catch (e) { }
          }
        ));
  }
}