import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { environment } from 'src/environments/environment';
import { UserAdminService } from '../../epractice-users-page/user-admin.service';
import { GroupAdminService } from '../../groups-page/group-admin.service';

@Component({
  selector: 'app-group-link-popup',
  templateUrl: './group-link-popup.component.html',
  styleUrls: ['./group-link-popup.component.scss']
})
export class GroupLinkPopupComponent extends GridBase implements OnInit {
  @Input() userId: string;
  @Input() siteId: string;

  @Output() updated = new EventEmitter<any>();
  @Output() groupLinked = new EventEmitter();

  public showPopup: boolean;
  controllerUrl: string;

  constructor(
    private appMessage: AppMessagesService,
    private userAdmin: UserAdminService,
    private groupAdmin: GroupAdminService, public appInfo: AppInfoService

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
    this.controllerUrl = `${environment.baseurl}/group/`;
    this.setupDataSource({
      key: 'groupId',
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

    if (this.siteId) {
      arr.push({
        name: 'notLinkedToSiteId', value: this.siteId
      })
    }

    return arr;
  }

  saved(e) {
    if (e.success) {
      this.appMessage.showSuccessSnackBar("Group added");
      this.updated.emit();
      this.refreshData();
    }
    if (e.errors) {
      this.appMessage.showApiErrorNotification(e);
    }
  }

  addLink(e) {
    if (this.userId) {
      this.userAdmin.addUserSite(this.userId, null, e.data.groupId).subscribe(x => {
        if (x.success) {
          this.showPopup = false;
          this.groupLinked.emit();
        }
        else {
          this.appMessage.showApiErrorNotification(x.errors);
        }
      })
    }
    if (this.siteId) {
      this.groupAdmin.addGroupSite(this.siteId, e.data.groupId).subscribe(x => {
        if (x.success) {
          this.showPopup = false;
          this.groupLinked.emit();
        }
        else {
          this.appMessage.showApiErrorNotification(x.errors);
        }
      })
    }
  }
}