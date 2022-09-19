import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { environment } from 'src/environments/environment';
import { UserAdminService } from '../../epractice-users-page/user-admin.service';
import { GroupAdminService } from '../../groups-page/group-admin.service';

@Component({
  selector: 'app-site-link-popup',
  templateUrl: './site-link-popup.component.html',
  styleUrls: ['./site-link-popup.component.scss']
})
export class SiteLinkPopupComponent extends GridBase implements OnInit {
  @Input() userId: string;
  @Input() groupId: string;

  @Output() updated = new EventEmitter<any>();
  @Output() siteLinked = new EventEmitter();

  public showPopup: boolean;

  constructor(
    private appMessage: AppMessagesService,
    private userAdmin: UserAdminService,
    private groupAdmin: GroupAdminService,   public appInfo: AppInfoService
  ) {
    super()
  }

  ngOnInit() {
  }

  close() {
    this.showPopup = false;
  }

  show() {
    this.showPopup = true;
    this.getSites();
  }

  getSites() {
    this.controllerUrl = `${environment.baseurl}/site/`;
    this.setupDataSource({
      key: 'siteId',
      loadParamsCallback: () => this.getLoadParams()
    });
  }

  private getLoadParams() {
    let arr = [];

    if (this.userId) {
      arr.push({
        name: 'notLinkedToUserId', value: this.userId
      })
    }

    if (this.groupId) {
      arr.push({
        name: 'notLinkedToGroupId', value: this.groupId
      })
    }

    return arr;
  }

  saved(e) {
    if (e.success) {
      this.appMessage.showSuccessSnackBar("Site added");
      this.updated.emit();
      this.refreshData();
    }
    if (e.errors) {
      this.appMessage.showApiErrorNotification(e);
    }
  }

  addLink(e) {
    if (this.userId) {
      this.userAdmin.addUserSite(this.userId, e.data.siteId).subscribe(x => {
        if (x.success) {
          this.showPopup = false;
          this.siteLinked.emit();
        }
        else {
          this.appMessage.showApiErrorNotification(x.errors);
        }
      })
    }
    if (this.groupId) {
      this.groupAdmin.addGroupSite(e.data.siteId, this.groupId).subscribe(x => {
        if (x.success) {
          this.showPopup = false;
          this.siteLinked.emit();
        }
        else {
          this.appMessage.showApiErrorNotification(x.errors);
        }
      })
    }
  }
}