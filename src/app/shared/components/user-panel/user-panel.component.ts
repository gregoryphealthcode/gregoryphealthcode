import { Component, NgModule, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxListModule } from 'devextreme-angular';
import { DxContextMenuModule } from 'devextreme-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { UserStore } from '../../stores/user.store';
import { environment } from 'src/environments/environment';
import { SitesService } from '../../services/sites.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from '../../base/subscribtion.base';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
@AutoUnsubscribe
export class UserPanelComponent extends SubscriptionBase implements OnInit {
  @Input()
  menuItems: any;

  @Input()
  menuMode: string;

  public myphotourl;
  public PhotoURL;
  public myusername: string = null;
  public showUserName = true;

  constructor(private userStore: UserStore,  private sanitizer: DomSanitizer, private siteService : SitesService) {
    super();
  }

  ngOnInit() {
    //this.myphotourl = this.userStore.getPhotoUrl();
    // const myUrl = environment.authserverBaseurl + this.userStore.getPhotoUrl()
   //  this.PhotoURL  = this.sanitizer.bypassSecurityTrustStyle(`url('${myUrl}')`

    // );
    /* 
   if (this.myphotourl === '' || this.myphotourl === null) {
      this.PhotoURL = 'assets/img/defaultuserprofile.png';
    }
    else
    {
      this.subscription.add(this.siteService.getPhotoFile(this.myphotourl).subscribe(photo => {
        const blob = new Blob([photo.body], {type:  photo.body.type});
        const blobUrl = URL.createObjectURL(blob);
        this.PhotoURL = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
      },
      error => {
        this.PhotoURL = 'assets/img/defaultuserprofile.png';
      }));

    } */

    const myUrl = environment.authserverBaseurl + this.userStore.getPhotoUrl();
    this.myphotourl = this.sanitizer.bypassSecurityTrustUrl(myUrl);
    this.myusername = this.userStore.getDisplayName();
  }
}

@NgModule({
  imports: [DxListModule, DxContextMenuModule, CommonModule],
  declarations: [UserPanelComponent],
  exports: [UserPanelComponent]
})
export class UserPanelModule {}
