import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { UserAdminService } from '../../epractice-users-page/user-admin.service';
import { GroupAdminService } from '../../groups-page/group-admin.service';
import { GetAdminSiteDetailsModel, MigrationResponse, SiteAdminService } from '../site-admin.service';

@Component({
  selector: 'app-site-view',
  templateUrl: './site-view.component.html',
  styleUrls: ['./site-view.component.scss']
})
export class SiteViewComponent extends SubscriptionBase implements OnInit {
  public selectedRecord: any;
  public site: GetAdminSiteDetailsModel;
  public siteId: string;
  public groupLinked = false;
  public userLinked = false;
  public migrationResponse: MigrationResponse;

  constructor(
    private appMessages: AppMessagesService,
    private siteService: SiteAdminService,
    private userService: UserAdminService,
    private groupService: GroupAdminService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private siteStore: SitesStore
  ) {
    super();
  }

  ngOnInit() {
    this.subscription.add(
      this.route.params.subscribe((params) => {
        this.siteId = params.siteId;
        this.refreshData();
      })
    );
  }

  public editClicked() {
    this.selectedRecord = { id: this.siteId };
  }

  saved(e) {
    if (e.success) {
      this.appMessages.showSuccessSnackBar("Site added.");
    }
    if (e.errors) {
      this.appMessages.showFailedSnackBar(e.errors[0]);
    }

    this.refreshData();
  }

  unlinkUserClicked(data) {
    this.userLinked = false;
    this.userService.unlinkUserSite(data.userId, this.siteId, null).subscribe(x => {
      if (x.success)
        this.userLinked = true;
      else
        this.appMessages.showApiErrorNotification(x.errors);
    });
  }

  unlinkGroupClicked(data) {
    this.groupLinked = false;
    this.groupService.unlinkGroupSite(this.siteId, data.groupId).subscribe(x => {
      if (x.success)
        this.groupLinked = true;
      else
        this.appMessages.showApiErrorNotification(x.errors);
    });
  }

  refreshData() {
    this.subscription.add(
      this.siteService.get(this.siteId).subscribe(
        x => this.site = x)
    );
  }

  migrateSiteData() {
    this.spinnerService.start();
    let siteRef = this.siteStore.getSiteRef(this.siteId);
    this.siteService.migrateSiteData(siteRef).subscribe(data => {
      if (data.success) {
        this.appMessages.showSuccessSnackBar("Site date migrated");
        this.spinnerService.stop();
        this.migrationResponse = data.data;
      }
    },
    e => {
      this.spinnerService.stop();
      this.appMessages.showApiErrorNotification(e);
    })
  }
}