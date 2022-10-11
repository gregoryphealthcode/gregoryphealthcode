import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { EMPTY } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SubscriptionBase } from '../../base/subscribtion.base';
import { AppMessagesService } from '../../services/app-messages.service';
import { AppointmentViewModel } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { PatientService } from '../../services/patient.service';
import { UserStore } from '../../stores/user.store';
import { PatientQuickSearchPopupComponent } from '../patients/patient-quick-search/patient-quick-search-popup/patient-quick-search-popup.component';

@Component({
  selector: 'app-add-edit-appointment-popup',
  templateUrl: './add-edit-appointment-popup.component.html',
  styleUrls: ['./add-edit-appointment-popup.component.scss']
})
export class AddEditAppointmentPopupComponent extends SubscriptionBase implements AfterViewInit {
  constructor(
    private patientService: PatientService,
    private appMessagesService: AppMessagesService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private userStore: UserStore
  ) {
    super();
  }

  @ViewChild(PatientQuickSearchPopupComponent) patientSearch: PatientQuickSearchPopupComponent;

  @Input() public appointmentDataItem: AppointmentViewModel;

  @Output() closed = new EventEmitter();
  @Output() saved = new EventEmitter<any>();

  public showAppointmentPopup: boolean;
  public patientSearchShow: boolean;

  ngAfterViewInit() {
    if (!this.appointmentDataItem) {
      this.appointmentDataItem = new AppointmentViewModel();
      this.patientSearch.show();
      this.cd.detectChanges();
      return;
    }

    if (this.appointmentDataItem) {
      if (this.appointmentDataItem.sessionId || this.appointmentDataItem.appointmentId) {
        this.setSiteId(this.appointmentDataItem.siteId);
      }

      if (this.appointmentDataItem.appointmentId) {
        this.showAppointmentPopup = true;
        this.cd.detectChanges();
        return;
      }

      if (!this.appointmentDataItem.patientId) {
        this.patientSearch.show();
        this.cd.detectChanges();
        return;
      }
    }

    this.showAppointmentPopup = true;
    this.cd.detectChanges();
  }

  closedHandler() {
    const callback = () => {
      this.showAppointmentPopup = false;
      this.closed.emit();
    }

    if (this.userStore.isMedSecUser()) {
      this.unselectSite(callback)
    } else {
      callback();
    }
  }

  savedHandler(item) {
    const callback = () => {
      this.showAppointmentPopup = false;
      this.saved.emit(item);
    }

    if (this.userStore.isMedSecUser()) {
      this.unselectSite(callback)
    } else {
      callback();
    }
  }

  patientSelectedHandler(patient: any) {
    const patientId = patient.patientId;
    this.appointmentDataItem.patientId = patientId;
    this.patientService
      .getPatientBalance(patientId)
      .pipe(
        switchMap((x: any) => {
          if (x.onStop) {
            const message = 'Patient is currently on stop so we will not be able to create an appointment.';
            this.appMessagesService.showSwallError(message, 'Unable to add an appointment');
            this.closedHandler();
            return EMPTY;
          }
          else {
            return this.authService.selectSite(patient.siteId).pipe(tap(() => this.showAppointmentPopup = true))
          }
        }))
      .subscribe();
  }

  private setSiteId(siteId) {
    if (this.userStore.isMedSecUser()) {
      this.authService.selectSite(siteId).subscribe(() => { });
    }
  }

  private unselectSite(callback?) {
    this.subscription.add(
      this.authService.unselectSite().subscribe(() => {
        if (callback) {
          callback();
        }
      })
    );
  }
}
