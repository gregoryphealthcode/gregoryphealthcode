import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { GroupAdminService } from '../../groups-page/group-admin.service';
import { GetAdminUserDetailsModel, UserAdminService } from '../user-admin.service';

@Component({
  selector: 'app-epractice-user-view',
  templateUrl: './epractice-user-view.component.html',
  styleUrls: ['./epractice-user-view.component.scss']
})
export class EpracticeUserViewComponent extends SubscriptionBase implements OnInit {
  public selectedRecord: any;
  public user: GetAdminUserDetailsModel;
  public userId: string;
  public siteLinked = false;
  public groupLinked = false;

  constructor(
    private appMessages: AppMessagesService,
    private userService: UserAdminService,
    private groupService: GroupAdminService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.subscription.add(
      this.route.params.subscribe((params) => {
        this.userId = params.userId;
        this.refreshData();
      })
    );
  }

  public editClicked() {
    this.selectedRecord = { id: this.userId };
  }

  saved(e) {
    if (e.success) {
      this.appMessages.showSuccessSnackBar("User added.");
    }

    if (e.errors) {
      this.appMessages.showFailedSnackBar(e.errors[0]);
    }

    this.refreshData();
  }

  unlinkGroupClicked(data){
    this.groupLinked = false;
    this.userService.unlinkUserSite(this.userId, null, data.groupId).subscribe(x => {
      if (x.success)
        this.groupLinked = true;
      else
        this.appMessages.showApiErrorNotification(x.errors);
    });
  }

  unlinkSiteClicked(data){
    this.siteLinked = false;
    this.userService.unlinkUserSite(this.userId, data.siteId, null).subscribe(x => {
      if (x.success)
        this.siteLinked = true;
      else
        this.appMessages.showApiErrorNotification(x.errors);
    });
  }

  refreshData() {
    this.subscription.add(
      this.userService.get(this.userId).subscribe(
        x => this.user = x)
    );
  }
}
