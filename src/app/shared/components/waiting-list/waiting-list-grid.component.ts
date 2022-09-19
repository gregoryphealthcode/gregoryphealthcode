import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GridBase } from '../../base/grid.base';
import { SpecialistViewModel } from '../../models/SpecialistViewModel';
import { AppInfoService } from '../../services';
import { AppMessagesService } from '../../services/app-messages.service';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/spinner.service';
import { UserService } from '../../services/user.service';
import { WaitingListService } from '../../services/waiting-list-service';
import { UserStore } from '../../stores/user.store';
import { MedSecSiteSelectorComponent } from '../med-sec-site-selector/med-sec-site-selector/med-sec-site-selector.component';

@Component({
  selector: 'app-waiting-list-grid',
  templateUrl: './waiting-list-grid.component.html',
  styleUrls: ['./waiting-list-grid.component.scss']
})
export class WaitingListGridComponent extends GridBase implements OnInit {
  @ViewChild(MedSecSiteSelectorComponent) siteSelector: MedSecSiteSelectorComponent;

  @Input() hasPatientId: string;

  @Output() selectedPatient = new EventEmitter<string>()

  selectedRecord: any;
  patientId: string;
  appointmentOwners: SpecialistViewModel[];
  action: string;
  fromDate;
  toDate;
  dateFormat;

  constructor(
    private waitingListService: WaitingListService,
    public appInfo: AppInfoService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private userStore: UserStore,
    private appMessages: AppMessagesService, private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.dateFormat = this.appInfo.getDateFormat;

    this.getWaitingList();
    this.getAppointmentOwners();
  }

  getWaitingList() {
    this.controllerUrl = `${environment.baseurl}/waitingList/`;
    this.setupDataSource({
      key: 'id',
      loadParamsCallback: () => [
        { name: 'patientId', value: this.hasPatientId },
        { name: 'fromDate', value: this.fromDate ? new Date(this.fromDate.getTime() - (this.fromDate.getTimezoneOffset() * 60000)).toISOString() : undefined },
        { name: 'toDate', value: this.toDate ? new Date(this.toDate.getTime() - (this.toDate.getTimezoneOffset() * 60000)).toISOString() : undefined }
      ]
    });
  }

  getAppointmentOwners() {
    this.userService.getConsultantsForSite().subscribe(value => {
      this.appointmentOwners = value.filter(item => item.active !== false);
    });
  }

  reloadData() {
    this.getWaitingList();
  }

  onFocusedRowChanged(e) {
    this.patientId = e.row.data.patientId;
    this.selectedPatient.emit(e.row.data.patientId);
  }

  add() {
    if (this.userStore.isMedSecUser() && !this.userStore.hasSelectedASite()) {
      this.siteSelector.show();
    } else {
      this.addClicked();
    }
  }

  public addClicked() {
    this.action = "Add";
    if (this.hasPatientId)
      this.selectedRecord = { id: '00000000-0000-0000-0000-000000000000', patientId: this.hasPatientId, fromPatient: true };
    else
      this.selectedRecord = { id: '00000000-0000-0000-0000-000000000000' };
  }

  public editClicked(e) {
    this.action = "Edit";
    if (this.userStore.isMedSecUser()) {
      this.authService.selectSite(e.data.siteId).subscribe(x => {
        this.selectedRecord = { id: e.data.id };
      });
    } else {
      this.selectedRecord = { id: e.data.id };
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
}
