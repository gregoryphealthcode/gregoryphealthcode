import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Guid from 'devextreme/core/guid';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { UserService } from 'src/app/shared/services/user.service';
import { WaitingListService } from 'src/app/shared/services/waiting-list-service';
import { UserStore } from 'src/app/shared/stores/user.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.scss']
})
export class WaitingListComponent extends GridBase implements OnInit {
  @Input() selectedRecord: any;
  @Input() get selectedPractitioners(): Guid[] {
    return this._selectedPractitioners;
  }
  set selectedPractitioners(value: Guid[]) {
    this._selectedPractitioners = value;
    if (this._selectedPractitioners) {
      this.getWaitingList();
    }
  }

  @Input() get updateWaitingList(): boolean {
    return this._updateWaitingList;
  }
  set updateWaitingList(value: boolean) {
    this._updateWaitingList;
    if (value)
      this.getWaitingList();
  }

  @Output() waitingListId = new EventEmitter<string>();

  private _selectedPractitioners: Guid[];
  private _updateWaitingList: boolean;

  dateFormat;
  controllerUrl: string;
  hasPatientId: any;
  fromDate: any;
  toDate: any;
  action: string;
  includeUnassignedChecked: boolean = false;

  constructor(
    private waitingListService: WaitingListService,
    public appInfo: AppInfoService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    public userStore: UserStore,
    private appMessages: AppMessagesService, private authService: AuthService,
  ) {
    super();
  }

  ngOnInit() {
    this.dateFormat = this.appInfo.getDateFormat;

    this.getWaitingList();

  }

  getWaitingList() {
    this.controllerUrl = `${environment.baseurl}/waitingList/`;
    this.setupDataSource({
      key: 'id',
      loadParamsCallback: () => [
        { name: 'patientId', value: this.hasPatientId },
        { name: 'fromDate', value: this.fromDate ? new Date(this.fromDate.getTime() - (this.fromDate.getTimezoneOffset() * 60000)).toISOString() : undefined },
        { name: 'toDate', value: this.toDate ? new Date(this.toDate.getTime() - (this.toDate.getTimezoneOffset() * 60000)).toISOString() : undefined },
        { name: 'includeUnassignedChecked', value: this.includeUnassignedChecked ?? false },
        { name: 'selectedPractitioners', value: JSON.stringify(this.selectedPractitioners) }
      ]
    });
  }

  reloadData() {
    this.getWaitingList();
  }

  onInactiveChanged() {
    this.includeUnassignedChecked = !this.includeUnassignedChecked;
    this.reloadData();
  }

  onFocusedRowChanged(e) {

  }

  public editClicked(e) {
    this.action = "Edit";
    if (this.userStore.isMedSecUser()) {
      this.authService.selectSite(e.data.siteId).subscribe(x => {
        this.selectedRecord = { id: e.data.id, patientId: e.data.patientId };
      });
    } else {
      this.selectedRecord = { id: e.data.id, patientId: e.data.patientId };
    }
  }

  public deleteClicked(e) {
    const callback = () => {
      this.spinnerService.start();
      this.waitingListService.removeFromWaitingList(e.data.id).subscribe(
        (x) => {
          this.spinnerService.stop();
          this.appMessages.showSuccessSnackBar("Patient removed from waiting list.")
          this.reloadData();
        },
        (e) => { this.spinnerService.stop(); this.appMessages.showApiErrorNotification(e) }
      );
    };

    this.appMessages.showDeleteConfirmation(callback, 'Are you sure you want to delete this waiting list entry?');
  }

  dateChanged() {
    this.reloadData();
  }

  bookClicked(e) {
    this.waitingListId.emit(e.data.id);
  }
}
