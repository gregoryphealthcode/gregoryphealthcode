import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AppInfoService, PatientTelecom } from '../../services';
import { Router } from '@angular/router';
import { BillingService, InvoiceAppointmentDetailsDataModel, InvoiceItemDataModel } from '../../services/billing.service';
import { BasicPatientDetailsViewModel, PatientBalanceViewModel, PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-invoice-summary-view',
  templateUrl: './invoice-summary-view.component.html',
  styleUrls: ['./invoice-summary-view.component.scss']
})
export class InvoiceSummaryViewComponent implements OnInit { 
  @Input() isDraft: boolean;
  @Input() showInvoiceItems: boolean;
  @Input() patientId: string;

  @Input() set invoice(value: any) {
    if (value) {
      this._invoice = value;
      this.invoiceId = value.invoiceId;
      this.getData();
    }
  }
  get invoice() {
    return this._invoice;
  }

  @Output() invoiceSelected = new EventEmitter<string>();

  private invoiceId: string;

  patientDetails: BasicPatientDetailsViewModel = new BasicPatientDetailsViewModel();
  _invoice: any;
  recordAdmitDate = false;
  episode: InvoiceAppointmentDetailsDataModel = new InvoiceAppointmentDetailsDataModel();
  patientBalance: PatientBalanceViewModel = new PatientBalanceViewModel();
  telecoms: PatientTelecom[] = [];

  constructor(
    private billingService: BillingService,
    private router: Router,
    public appInfo: AppInfoService,
    private patientService: PatientService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

  onPatientSelected() {
    this.invoiceSelected.emit(this.invoiceId);
  }

  showPatientDetails() {
    this.router.navigate([`/patient-details/${this.patientId}`]);
  }

  createInvoice() {
    const patientId = this.patientId;
    const invoiceId = this.invoiceId;
    sessionStorage.setItem('returnUrl', 'accounts/draft-invoices');
    this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId } });
  }

  getData() {
    forkJoin([
      this.patientService.getBasicPatientDetails(this.patientId),
      this.patientService.getPatientBalance(this.patientId),
      this.patientService.getPatientTelecoms(this.patientId),
      this.billingService.getInvoiceEpisode(this.invoiceId)
    ]).subscribe(([basicDetails, balance, telecoms, episode]) => {
      if (episode) {
        this.episode = episode;
        this.getEpisodeType(episode.appointmentTypeId);
      }
      this.patientDetails = basicDetails;
      this.telecoms = telecoms;
      this.patientBalance = balance;
    });
  }

  private getEpisodeType(value) {
    this.recordAdmitDate = false;
    switch (value) {
      case 'D':
        this.recordAdmitDate = true;
        break;
      case 'I':
        this.recordAdmitDate = true;
        break;
      case 'O':
        this.recordAdmitDate = false;
        break;
      case 'V':
        this.recordAdmitDate = false;
        break;
    }
  }
}