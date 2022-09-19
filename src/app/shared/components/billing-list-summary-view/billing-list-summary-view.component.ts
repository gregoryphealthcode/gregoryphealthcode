import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from '../../base/subscribtion.base';
import { AppInfoService, PatientReferenceNumber, PatientTelecom } from '../../services';
import { AppointmentService, GetAppointmentResponseModel } from '../../services/appointment.service';
import { BasicPatientDetailsViewModel, PatientBalanceViewModel, PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-billing-list-summary-view',
  templateUrl: './billing-list-summary-view.component.html',
  styleUrls: ['./billing-list-summary-view.component.scss']
})
@AutoUnsubscribe
export class BillingListSummaryViewComponent extends SubscriptionBase implements OnInit {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public appInfo: AppInfoService,
    private patientService: PatientService,
    private router: Router,
    private appointmentService: AppointmentService) {
    super();
  }

  @Input() get patientId(): string {
    return this._patientId;
  }
  set patientId(value: string) {
    if (value !== undefined && value !== null) {
      this._patientId = value;
      this.getData();
    }
  }

  @Input() get appointmentId(): string {
    return this._appointmentId;
  }
  set appointmentId(value: string) {
    if (value !== undefined && value !== null) {
      this._appointmentId = value;
      this.getAppointment()
    }
  }

  private _patientId: string;
  private _appointmentId: string;

  patientDetails: BasicPatientDetailsViewModel = new BasicPatientDetailsViewModel();
  appointment: GetAppointmentResponseModel;
  patientBalance: PatientBalanceViewModel = new PatientBalanceViewModel();
  telecoms: PatientTelecom[] = [];
  referenceNumbers: PatientReferenceNumber[] = [];

  ngOnInit() {
  }

  getData() {
    forkJoin([
      this.patientService.getBasicPatientDetails(this.patientId),
      this.patientService.getPatientBalance(this.patientId),
      this.patientService.getPatientTelecoms(this.patientId),
      this.patientService.getPatientReferenceNumbers(this.patientId)]).subscribe(([basicDetails, balance, telecoms, referenceNumbers]) => {
        this.patientDetails = basicDetails;
        this.telecoms = telecoms;
        this.patientBalance = balance;
        this.referenceNumbers = referenceNumbers;
        this.changeDetectorRef.detectChanges();
      });
  }

  getAppointment() {
    this.subscription.add(this.appointmentService.getAppointment(this.appointmentId).subscribe(data => {
      this.appointment = data;
    }));
  }

  showPatientDetails() {
    this.router.navigate([`/patient-details/${this.patientId}`]);
  }

  createInvoice() {
    sessionStorage.setItem('returnUrl', '/accounts/billing-list');
    this.router.navigate(['/accounts/invoice'], {
      queryParams: { patientId: this.patientId, appointmentId: this.appointmentId }
    });
  }
}