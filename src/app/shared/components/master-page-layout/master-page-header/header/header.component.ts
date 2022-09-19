import {
  Component, NgModule, OnInit, Input,
  Output, EventEmitter, ViewChild, OnDestroy
} from '@angular/core';
import { SitePanelComponent } from '../../../site-panel/site-panel.component';
import { Router} from '@angular/router';
import {
  DxPopupComponent,  DxLookupComponent, DxContextMenuComponent
} from 'devextreme-angular';
import { confirm } from 'devextreme/ui/dialog';
import { Location } from '@angular/common';
import { AppInfoService, ScreenService } from '../../../../services';
import { UserStore } from '../../../../stores/user.store';
import { SitesStore } from '../../../../stores/sites.store';
import { AuthService } from '../../../../services/auth.service';
import { LockScreenService } from '../../../../services/lock-screen.service';
import { AppMessagesService } from '../../../../services/app-messages.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogTemplateComponent } from '../../../dialog/dialog-template.component';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  public issmallscreen = false;

  userMenuItems = [{
    text: 'Profile',
    icon: 'fas fa-id-card',
    onClick: () => {
      this.router.navigate(['preferences/profile']);
    }
  },
  {
    text: 'Change Password',
    icon: 'fas fa-key',
    beginGroup: true,
    onClick: () => {
      this.router.navigate(['preferences/change-password']);
    }
  },
  {
    text: 'Enable 2 Factor Authentication',
    icon: 'fas fa-mobile-alt',
    onClick: () => {
      this.router.navigate(['pages/setup2-fa']);
    }
  },
  {
    text: 'Configure Dashboard',
    icon: 'fas fa-cog',
    disabled: !this.isHomePage(),
    onClick: () => {
      this.appMessages.showDashboardConfigurationPanel();
    }
  },
  {
    text: 'Lock Screen',
    icon: 'fas fa-lock',
    beginGroup: true,
    diabled: true,
    onClick: () => {
      this.lockScreenService.showLockOutScreen();//
    }

  },
  {
    text: 'Change Site',
    icon: 'fas fa-door-open',
    beginGroup: true,
    diabled: true,
    onClick: () => {
      this.authService.routeToSelectSite();
    }

  },
  {
    text: 'Logout',
    icon: 'runner',
    beginGroup: true,
    onClick: () => {
      const dialogRef = this.dialog.open(DialogTemplateComponent, {
        width: '250px',
        data: {
          title: 'Log out',
          message: 'Are you sure?',
        },
        disableClose: true,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === true)
        this.authService.logOut();
      });
    }
  }
  ];

  public isHomePage() {
    if (this.router.url.includes('/home')) {return true; } else {return false; }
  }

  constructor(
    public _location: Location, private router: Router,
    public lockScreenService: LockScreenService, private siteStore: SitesStore,
    private userStore: UserStore,
    public appInfo: AppInfoService,
    public authService: AuthService,
    screenService: ScreenService,
    public dialog: MatDialog,
    private appMessages: AppMessagesService) {

      if(this.userStore.isMedSecUser())
      {
        this.userMenuItems.unshift({
          text: 'MedSec',
          icon: 'fas fa-clinic-medical',
          onClick: () => {
            this.authService.unselectSite().subscribe(()=>
            this.router.navigate(['/medsec/']))
          }
        },)
      }


      if (screenService.sizes['screen-x-small'] || screenService.sizes['screen-small']) { this.issmallscreen = true; }

  }

  onQuickMenuItemClick(e) {
    console.log('quick menu item clicked: ', e);
  }

  ngOnDestroy(): void {

  }

  ngOnInit() {
  }
}

