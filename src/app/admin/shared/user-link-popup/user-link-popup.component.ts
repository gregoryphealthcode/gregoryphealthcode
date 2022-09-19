import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { environment } from 'src/environments/environment';
import { UserAdminService } from '../../epractice-users-page/user-admin.service';

@Component({
  selector: 'app-user-link-popup',
  templateUrl: './user-link-popup.component.html',
  styleUrls: ['./user-link-popup.component.scss']
})
export class UserLinkPopupComponent extends GridBase implements OnInit {
  @Input() siteId: string;
  @Input() groupId: string;
  
  @Output() updated = new EventEmitter<any>();
  @Output() userLinked = new EventEmitter();

  public showPopup: boolean;

  constructor(
    private appMessage: AppMessagesService,
    private userAdmin: UserAdminService,
    public appInfo: AppInfoService
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
    this.getUsers();
  }

  getUsers() {
    this.controllerUrl = `${environment.baseurl}/user/`;
    this.setupDataSource({
      key: 'userId',
      loadParamsCallback: () => this.getLoadParams()
    });
  }

  private getLoadParams() {
    let arr = [];

    if (this.siteId) {
      arr.push({
        name: 'notLinkedToSiteId', value: this.siteId
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
      this.appMessage.showSuccessSnackBar("User added");
      this.updated.emit();
      this.refreshData();
    }
    if (e.errors) {
      this.appMessage.showApiErrorNotification(e);
    }
  }

  addLink(e) {
    this.userAdmin.addUserSite(e.data.userId, this.siteId, this.groupId).subscribe(x => {
      this.showPopup = false;
      this.userLinked.emit();
    })
  }
}
