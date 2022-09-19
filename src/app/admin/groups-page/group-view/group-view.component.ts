import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { UserAdminService } from '../../epractice-users-page/user-admin.service';
import { GetAdminGroupDetailsModel, GroupAdminService } from '../group-admin.service';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.scss']
})
export class GroupViewComponent extends SubscriptionBase implements OnInit {
  public selectedRecord: any;
  public group: GetAdminGroupDetailsModel;
  public groupId: string;
  public siteLinked = false;
  public userLinked = false;

  constructor(
    private appMessages: AppMessagesService,
    private groupService: GroupAdminService,
    private userService: UserAdminService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.subscription.add(
      this.route.params.subscribe((params) => {
        this.groupId = params.groupId;
        this.refreshData();
      })
    );
  }

  public editClicked() {
    this.selectedRecord = { id: this.groupId };
  }

  saved(e) {
    if (e.success) {
      this.appMessages.showSuccessSnackBar("Group added.");
    }

    if (e.errors) {
      this.appMessages.showFailedSnackBar(e.errors[0]);
    }

    this.refreshData();
  }

  unlinkUserClicked(data) {
    this.userLinked = false;
    this.userService.unlinkUserSite(data.userId, null, this.groupId).subscribe(x => {
      if (x.success)
        this.userLinked = true;
      else
        this.appMessages.showApiErrorNotification(x.errors);
    });
  }

  unlinkSiteClicked(data) {
    this.siteLinked = false;
    this.groupService.unlinkGroupSite(data.siteId, this.groupId).subscribe(x => {
      if (x.success)
        this.siteLinked = true;
      else
        this.appMessages.showApiErrorNotification(x.errors);
    });
  }

  refreshData() {
    this.subscription.add(
      this.groupService.get(this.groupId).subscribe(
        x => this.group = x)
    );
  }
}
