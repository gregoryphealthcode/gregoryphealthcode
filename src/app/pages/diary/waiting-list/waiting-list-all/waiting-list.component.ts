import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { WaitingListModel, AppointmentViewModel } from 'src/app/shared/services/appointment.service';
import { AppInfoService, PatientTelecom, PatientReferenceNumber } from 'src/app/shared/services';
import { WaitingListService } from 'src/app/shared/services/waiting-list-service';
import { DxPopupComponent } from 'devextreme-angular';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { UserService } from 'src/app/shared/services/user.service';
import { SpecialistViewModel } from 'src/app/shared/models/SpecialistViewModel';
import { forkJoin } from 'rxjs';
import { PatientService, PatientBalanceViewModel, BasicPatientDetailsViewModel } from 'src/app/shared/services/patient.service';
import { Address } from 'src/app/shared/services/contact.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { Router } from '@angular/router';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { showErrorSnackbar, showSuccessSnackbar } from 'src/app/shared/helpers/other';

@Component({
  selector: 'app-waiting-list-all',
  templateUrl: './waiting-list.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
  styleUrls: ['./waiting-list.component.scss'],
})

@AutoUnsubscribe
export class WaitingListAllComponent extends SubscriptionBase implements OnInit, AfterViewInit {
  @ViewChild('patientpopup') patientPopup: DxPopupComponent;
  @ViewChild('waitingListPopup') waitingListPopup: DxPopupComponent;
  @ViewChild('patientDetailsPopup') patientDetailsPopup: DxPopupComponent;

  showAppointmentPopup: boolean;
  appointmentDataItem: AppointmentViewModel;
  patientBalance: PatientBalanceViewModel = new PatientBalanceViewModel;
  telecoms: PatientTelecom[] = [];
  addresses: Address[] = [];
  referenceNumbers: PatientReferenceNumber[] = [];
  showBillingAddress = false;
  primaryAdress: Address;
  billingAdress: Address;
  filterValue: Array<any>;
  nextApt: AppointmentViewModel = new AppointmentViewModel();
  isViewAppointmentsShown = false;
  isPatientDetailsPopupShown = false;
  siteId: string;
  waitingList: WaitingListModel[] = [];
  patientId: string;
  patientdetailsPatientId: any = null;
  patientDetails: BasicPatientDetailsViewModel = new BasicPatientDetailsViewModel();
  selectedrowData: WaitingListModel;
  waitingListItem: WaitingListModel;
  ownerSelected: string;
  showPanel = false;
  isEdit = false;
  showWaitingListPopup: boolean;
  appointmentOwners: SpecialistViewModel[];
  apptTypeSelected: string;
  selectedRecord: any;

  constructor(
    private waitingListService: WaitingListService,
    private changeDetectorRef: ChangeDetectorRef,
    public appInfo: AppInfoService,
    private siteStore: SitesStore,
    private userService: UserService,
    private patientService: PatientService,
    private spinnerService: SpinnerService,
    private router: Router,
    private appMessage: AppMessagesService,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  calculateDiaryOwnerName(e) {
    try {
      return this.appointmentOwners.find(x => x.id === e).name;
    } catch (err) { return ''; }
  }

  onFocusedRowChanged(e) {
    this.selectedrowData = e.row.data;
    this.patientId = e.row.data.patientId;
    this.waitingListItem = this.selectedrowData;
    forkJoin([
      this.patientService.getBasicPatientDetails(this.patientId),
      this.patientService.getPatientBalance(this.patientId),
      this.patientService.getPatientTelecoms(this.patientId),
      this.patientService.getPatientReferenceNumbers(this.patientId),
      this.patientService.getAddresses(this.patientId)])
      .subscribe(([basicDetails, balance, telecoms, referenceNumbers, address]) => {
        this.patientDetails = basicDetails;
        this.telecoms = telecoms;
        this.patientBalance = balance;
        this.referenceNumbers = referenceNumbers;
        this.addresses = address;
        this.setAddresses(address);
        this.showPanel = true;
        this.changeDetectorRef.detectChanges();
      });
  }

  calculateAgeValue(rowData) {
    try {
      if (rowData.birthDate) {
        const timeDiff = Math.abs(Date.now() - new Date(rowData.birthDate).getTime());
        const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        return age;
      }
    } catch (e) { return '0'; }
  }

  private setAddresses(addresses: Address[]) {
    for (const i in addresses) {
      if (addresses[i].billingAddress === true) {
        this.billingAdress = addresses[i];
        break;
      }
    }
    for (const i in addresses) {
      if (addresses[i].primaryAddress === true) {
        this.primaryAdress = addresses[i];
        break;
      }
    }
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.push({
      widget: 'dxButton',
      showText: 'never',
      options: {
        stylingMode: 'filled', type: 'default',
        icon: 'fa fa-cog',
        text: '',
        onClick: e.component.showColumnChooser,
      },
      location: 'after'
    });
  }

  ngAfterViewInit(): void {
    this.getWaitingList();
  }

  showAdd() {
    this.waitingListItem = new WaitingListModel();
    this.patientId = undefined;
    this.showWaitingListPopup = true;
  }
  getAppointmentOwners(siteId: string) {
    this.userService.getConsultantsForSite(siteId).subscribe(value => {
      this.appointmentOwners = value.filter(item => item.active !== false);
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnInit(): void {
    this.spinnerService.start();
    this.siteId = this.siteStore.getSelectedSite().siteId;
    this.getAppointmentOwners(this.siteId);
  }

  editHandler(cellInfo) {
    this.selectedRecord = { id: cellInfo.data.waitingListId, data: cellInfo.data }
    console.log(this.selectedRecord);
  }

  getWaitingList() {
    this.subscription.add(this.waitingListService.getWaitingList(this.siteId).subscribe(value => {
      this.waitingList = value;
      this.spinnerService.stop();
      this.changeDetectorRef.detectChanges();
    }));
  }

  removeFromWaitingList(e) {
    const text = `You are about to remove this patient from the waiting list?`;
    this.appMessage.showAskForConfirmationModal(
      `Delete ${e.data.patientName} from waiting list`,
      text,
      () => this.confirmDelete(e.data.waitingListId),
      () => { }
    );
    return;
  }

  confirmDelete(id) {
    this.spinnerService.start();
    this.subscription.add(this.waitingListService.removeFromWaitingList(id).subscribe(() => {
      showSuccessSnackbar(this.snackBar, 'Patient removed from waiting list');
      this.getWaitingList();
      this.spinnerService.stop();
    },
      error => {
        showErrorSnackbar(this.snackBar);
        this.spinnerService.stop();
      }));
  }

  addAppointment(e) {
    this.patientId = e.patientId;
    const tempowner = this.appointmentOwners.find(x => x.id === e.ownerId);
    this.ownerSelected = tempowner.id.toString();
    this.apptTypeSelected = e.appointmentTypeId;
    this.appointmentDataItem = new AppointmentViewModel();
    this.appointmentDataItem.patientId = this.patientId;
    this.showAppointmentPopup = true;
  }

  showPatientDetails() {
    this.router.navigate([`/patient-details/${this.patientId}`]);
  }

  closePopup() {
    this.isEdit = false;
    this.showWaitingListPopup = false;
    this.getWaitingList();
  }
}