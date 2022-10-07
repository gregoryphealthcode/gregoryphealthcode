import { Component, OnInit,} from '@angular/core';
import { WaitingListModel, AppointmentViewModel } from 'src/app/shared/services/appointment.service';
import { AppInfoService } from 'src/app/shared/services';
import { SpecialistViewModel } from 'src/app/shared/models/SpecialistViewModel';
import { Router } from '@angular/router';
import { GridBase } from 'src/app/shared/base/grid.base';
import { PatientService } from 'src/app/shared/services/patient.service';

@Component({
  selector: 'app-waiting-list-all',
  templateUrl: './waiting-list.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
  styleUrls: ['./waiting-list.component.scss'],
})

export class WaitingListAllComponent extends GridBase implements OnInit {
  showAppointmentPopup: boolean;
  appointmentDataItem: AppointmentViewModel;
  showBillingAddress = false;
  nextApt: AppointmentViewModel = new AppointmentViewModel();
  isViewAppointmentsShown = false;
  isPatientDetailsPopupShown = false;
  patientId: string;
  patientdetailsPatientId: any = null;
  patientDetails: any;
  selectedrowData: WaitingListModel;
  waitingListItem: WaitingListModel;
  ownerSelected: string;
  showPanel = false;
  isEdit = false;
  showWaitingListPopup: boolean;
  appointmentOwners: SpecialistViewModel[];
  apptTypeSelected: string;
  selectedRecord: any;
  fromDate;
  toDate;
  dateFormat;

  constructor(
    public appInfo: AppInfoService,
    private router: Router,
    private patientService: PatientService,
  ) {
    super();
  }

  ngOnInit() {
  }

  patientSelectedHandler(e) {
    this.patientId = e;
    this.patientService
      .getPatientDetails(this.patientId).subscribe(data => {
        this.patientDetails = data;
        this.showPanel = true;
      })
  }

  showPatientDetails() {
    this.router.navigate([`/patient-details/${this.patientId}`]);
  }
}
