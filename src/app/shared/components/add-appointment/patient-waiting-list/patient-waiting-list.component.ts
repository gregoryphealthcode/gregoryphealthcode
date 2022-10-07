import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WaitingListModel } from 'src/app/shared/services/appointment.service';
import { WaitingListService } from 'src/app/shared/services/waiting-list-service';
import notify from 'devextreme/ui/notify';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { GridBase } from 'src/app/shared/base/grid.base';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-patient-waiting-list',
  templateUrl: './patient-waiting-list.component.html',
  styleUrls: ['./patient-waiting-list.component.scss']
})
export class PatientWaitingListComponent extends GridBase implements OnInit {
  @Input() patientId: string;
  @Input() patientName: string;
  @Output() closed = new EventEmitter<any>();

  public records: WaitingListModel[] = [];

  constructor(
    private waitingListService: WaitingListService,
    private appMessages: AppMessagesService,
    private spinnerService: SpinnerService,
    ) {
    super();
  }

  ngOnInit() {
    this.getPatientWaitingList();
  }

  getPatientWaitingList() {
    this.controllerUrl = `${environment.baseurl}/waitingList/`;
    this.setupDataSource({
      key: 'id',
      loadParamsCallback: () => [
        { name: 'patientId', value: this.patientId },
      ]
    });
  }

  public delete(e) {
    const callback = () => {
      this.spinnerService.start();
      this.waitingListService.removeFromWaitingList(e.data.id).subscribe(
        (x) => {
          this.spinnerService.stop();
          this.appMessages.showSuccessSnackBar("Patient removed from waiting list.")
          this.refreshData();
        },
        (e) => { this.spinnerService.stop(); this.appMessages.showApiErrorNotification(e) }
      );
    };

    this.appMessages.showDeleteConfirmation(callback, 'Are you sure you want to delete this waiting list entry?');
  }
}