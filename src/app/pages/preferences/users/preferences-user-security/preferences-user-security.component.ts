import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DxDataGridComponent } from 'devextreme-angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import notify from 'devextreme/ui/notify';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { UserStore } from 'src/app/shared/stores/user.store';

interface ISitesAccessRoles {
  UniqueNo: number;
  SiteAccessRole: string;
  SiteId: string;
  AccessRole: string;
  AccessLevel: string;
}

interface IAccessLevelBits {
  AccessLevelBit: number;
  Description: string;
  Category: string;
  Action: string;
  TableName: string;
  Role1: boolean;
  Role2: boolean;
  Role3: boolean;
  Role4: boolean;
  Role5: boolean;
  Role6: boolean;
  Role7: boolean;
  Role8: boolean;
  Role9: boolean;
}

@Component({
  selector: 'app-preferences-user-security',
  templateUrl: './preferences-user-security.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./preferences-user-security.component.scss']
})
@AutoUnsubscribe
export class PreferencesUserSecurityComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  events: Array<string> = [];
  selectedItemKeys: any[] = [];
  sitesaccessroles: ISitesAccessRoles[] = [];
  accesslevelbits: IAccessLevelBits[] = [];
  numRoles: number;

  constructor(
    private http: HttpClient,
    public changeDetectorRef: ChangeDetectorRef,
    private siteStore: SitesStore,
    private userStore: UserStore) {
  }

  public updateAccessRoleTable(sitesaccessrolechange): Observable<boolean> {
    const url = `${environment.baseurl}/SiteAccessRoles/UpdateAccessBit`;
    return this.http.post<boolean>(url, sitesaccessrolechange);
  }

  updateSecurityRoleSetting(sitesaccessrolesUniqueNo, newvalue, oldvalue, rolename, accessbit) {
    const description = rolename + ' : ' + accessbit + ' (' + this.accesslevelbits.find(x => x.AccessLevelBit === accessbit).Description
      + ') changed from ' + oldvalue + ' to ' + newvalue;

    this.updateAccessRoleTable({
      UserId: this.userStore.getUserId(),
      OldValue: oldvalue,
      NewValue: newvalue,
      AccessBitChanged: accessbit,
      Description: description,
      UniqueNo: sitesaccessrolesUniqueNo
    }).subscribe(value => {
    }, error => {
      notify('Error updating security role.', 'error');
    });
  }

  tickbox1Changed(e) {
    this.updateSecurityRoleSetting(
      this.sitesaccessroles[0].UniqueNo,
      e.value,
      e.previousValue,
      this.sitesaccessroles[0].AccessRole,
      this.dataGrid.focusedRowKey);
  }

  tickbox2Changed(e) {
    this.updateSecurityRoleSetting(
      this.sitesaccessroles[1].UniqueNo,
      e.value,
      e.previousValue,
      this.sitesaccessroles[1].AccessRole,
      this.dataGrid.focusedRowKey);
  }

  tickbox3Changed(e) {
    this.updateSecurityRoleSetting(
      this.sitesaccessroles[2].UniqueNo,
      e.value,
      e.previousValue,
      this.sitesaccessroles[2].AccessRole,
      this.dataGrid.focusedRowKey);
  }

  tickbox4Changed(e) {
    this.updateSecurityRoleSetting(
      this.sitesaccessroles[3].UniqueNo,
      e.value,
      e.previousValue,
      this.sitesaccessroles[3].AccessRole,
      this.dataGrid.focusedRowKey);
  }

  tickbox5Changed(e) {
    this.updateSecurityRoleSetting(
      this.sitesaccessroles[4].UniqueNo,
      e.value,
      e.previousValue,
      this.sitesaccessroles[4].AccessRole,
      this.dataGrid.focusedRowKey);
  }

  tickbox6Changed(e) {
    this.updateSecurityRoleSetting(
      this.sitesaccessroles[5].UniqueNo,
      e.value,
      e.previousValue,
      this.sitesaccessroles[5].AccessRole,
      this.dataGrid.focusedRowKey);
  }

  tickbox7Changed(e) {
    this.updateSecurityRoleSetting(
      this.sitesaccessroles[6].UniqueNo,
      e.value,
      e.previousValue,
      this.sitesaccessroles[6].AccessRole,
      this.dataGrid.focusedRowKey);
  }

  tickbox8Changed(e) {
    this.updateSecurityRoleSetting(
      this.sitesaccessroles[7].UniqueNo,
      e.value,
      e.previousValue,
      this.sitesaccessroles[7].AccessRole,
      this.dataGrid.focusedRowKey);
  }

  tickbox9Changed(e) {
    this.updateSecurityRoleSetting(
      this.sitesaccessroles[8].UniqueNo,
      e.value,
      e.previousValue,
      this.sitesaccessroles[8].AccessRole,
      this.dataGrid.focusedRowKey);
  }

  focusedRowChanged(e) {
    console.log('focused row changed: ', e);
  }

  ngOnInit() {
  }
}
