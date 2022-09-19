import { ViewChild, Component, OnInit, } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent } from 'devextreme-angular';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { confirm } from 'devextreme/ui/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-preferences-users',
  templateUrl: './preferences-users.component.html',
  styleUrls: ['./preferences-users.component.scss']
})
export class PreferencesUsersComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  @ViewChild('userdetailspopup') newTemplatePopup: DxPopupComponent;

  dataSource: any;
  selectedFileName = '';
  preflabellocation = 'left';


  constructor(
    public appInfo: AppInfoService) {
  }

  form_fieldDataChanged(e) {
  }

  public calculateAgo(e) {
    console.log('e:', e);
    const d = e.User.LastLogin;
    const myTimeAgo: string = moment(d).fromNow();
    return myTimeAgo;
  }

  ngOnInit(): void {

  }

  cancelClicked() {
    this.newTemplatePopup.instance.hide();
  }

  onFocusedRowChanged(e) {
  }

  refreshDataGrid() {
    this.dataGrid.instance.option('loadPanel.enabled', true);
    this.dataGrid.instance.refresh();
  }

  disableUser() {
    const result = confirm('<i>Are you sure you want to deactivate this user...?</i>', 'Confirm ');
    result.then((dialogResult) => {
      console.log(dialogResult);
      if (dialogResult === true) {
      }
    });
  }

  addUser() {
  }

  editUser() {
  }

  onToolbarPreparing(e) {
    console.log('toolbar preparing');
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          text: 'Edit User',
          icon: 'fas fa-user-edit',
          type: 'default',
          onClick: this.editUser.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          text: 'Add User',
          icon: 'fas fa-user-plus',
          type: 'default',
          onClick: this.addUser.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          text: 'Deactivate User',
          icon: 'fas fa-trash-alt',
          type: 'default',
          onClick: this.disableUser.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
          onClick: this.refreshDataGrid.bind(this)
        }
      });
  }

  onContentReady(e) {
    e.component.option('loadPanel.enabled', false);
  }
}
