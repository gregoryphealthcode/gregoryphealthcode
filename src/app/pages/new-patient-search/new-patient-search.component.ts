import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Moment } from "moment";
import * as moment from "moment";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { SubscriptionBase } from "src/app/shared/base/subscribtion.base";
import { PatientService, BasicPatientDetailsViewModel, GetPatientSearchTabsCountResponseModel, } from "src/app/shared/services/patient.service";
import { AppInfoService } from "src/app/shared/services";
import { AppointmentService, AppointmentViewModel, } from "src/app/shared/services/appointment.service";
import { UserStore } from "src/app/shared/stores/user.store";
import { MedSecSiteSelectorComponent } from "src/app/shared/components/med-sec-site-selector/med-sec-site-selector/med-sec-site-selector.component";
import { AuthService } from "src/app/shared/services/auth.service";

@Component({
  selector: "app-new-patient-search",
  templateUrl: "./new-patient-search.component.html",
  host: { class: "d-flex flex-column flex-grow-1" },
  styleUrls: ["./new-patient-search.component.scss"],
})
@AutoUnsubscribe
export class NewPatientSearchComponent extends SubscriptionBase implements OnInit {
  @ViewChild(MedSecSiteSelectorComponent) siteSelector: MedSecSiteSelectorComponent;

  @Input() showDetails = true;
  @Input() setFocus = false;
  @Input() showActionButton: boolean;
  @Input() searchInput: string;

  showBtnRow1 = true;
  showBtnRow2 = false;
  nextApt: AppointmentViewModel = new AppointmentViewModel();
  showAddPatient: boolean;
  patientAdded: boolean;
  siteId: string;
  filterValue: Array<any>;
  patient: BasicPatientDetailsViewModel;
  showPanel = false;
  value = "";
  showAppointmentPopup: boolean;
  appointmentDataItem: AppointmentViewModel;
  minutesUntilSearch = 1;
  patientsCount: GetPatientSearchTabsCountResponseModel;
  startDate = new Date().toISOString();

  constructor(
    private router: Router,
    private appInfo: AppInfoService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private userStore: UserStore,
    private authService: AuthService
  ) {
    super();
    this.appInfo.getReturnUrl(this.router.url);
  }

  public getDate(): Moment {
    return moment();
  }

  convertAgo() {
    return "{{e.InvoiceDate | amTimeAgo}}";
  }

  rowFocusedHandler(patient: BasicPatientDetailsViewModel) {
    this.patient = patient;
    this.showPanel = !!patient;
  }

  ngOnInit() {
    this.showActionButton = true;

    this.getTabCounts();
  }

  getTabCounts() {
    this.patientService
      .getPatientSearchTabsCounts(this.startDate.toString())
      .subscribe((x) => {
        if (x.totalPatientsCount > 99) {
          x.totalPatientsCount = "99+";
        }
        this.patientsCount = x;
      });
  }

  patientSavedHandler(e) {
    this.showAddPatient = false;
    this.patientAdded = true;

    if (this.userStore.isMedSecUser()) {
      this.unselectSite(this.router.navigate([`/patient-details/${e}`]));
    } else {
      this.router.navigate([`/patient-details/${e}`])
    }
  }

  add() {
    if (this.userStore.isMedSecUser() && !this.userStore.hasSelectedASite()) {
      this.siteSelector.show();
    } else {
      this.showAddPatient = true;
    }
  }

  closedPatientPopupHandler() {
    this.showAddPatient = false;
    this.unselectSite();
  }

  addAppointment() {    
    this.showAppointmentPopup = true;
  }

  createInvoice() {
    this.router.navigate(["/accounts/invoice"], {
      queryParams: { patientId: this.patient.patientId.toString() },
    });
  }

  reloadNextApt() {
    this.subscription.add(
      this.appointmentService
        .getNextAppointment(this.patient.patientId.toString())
        .subscribe((data) => {
          this.nextApt = data;
        })
    );
  }

  patientSelectedHandler(patientId) {
    if (this.userStore.isMedSecUser()) {
      this.subscription.add(
        this.authService
          .selectSite(this.patient.siteId.toString())
          .subscribe(() =>
            this.router.navigate([`/patient-details/${patientId}`])
          )
      );
    } else {
      this.router.navigate([`/patient-details/${patientId}`]);
    }
  }

  startDateChanged(e) {
    this.startDate = e;
    this.getTabCounts();
  }

  closedHandler() {
    this.showAppointmentPopup = false;
  }

  private unselectSite(callback?) {
    if (this.userStore.isMedSecUser()) {
      this.subscription.add(
        this.authService.unselectSite().subscribe(() => {
          if (callback) {
            callback();
          }
        })
      );
    }
  }
}
