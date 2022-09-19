import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { AppInfoService } from 'src/app/shared/services';
import notify from 'devextreme/ui/notify';
import { DatePipe } from '@angular/common';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { Router } from '@angular/router';
import { PatientInsurerService, PatientInsurerModel } from 'src/app/shared/services/patient-insurer.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';

@Component({
  selector: 'app-patient-insurers',
  styleUrls: ['./patient-insurers.component.scss'],
  templateUrl: './patient-insurers.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
})

@AutoUnsubscribe
export class PatientInsurersComponent extends SubscriptionBase implements OnInit {
  @Input() patientId: string;
  @Input() popUp = false;
  @Input() patientName: string;

  @Output() insurerAdded = new EventEmitter<string>();
  @Output() insurerChanged = new EventEmitter();

  patientInsurers: PatientInsurerModel[] = [];
  viewModel: PatientInsurerModel;
  isNew = false;
  patientInsurerId: string;
  insurerDetails: PatientInsurerModel;
  showPopup: boolean;

  constructor(
    public appInfo: AppInfoService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private patientInsurerService: PatientInsurerService,
    private appMessage: AppMessagesService
    ) {
    super();
  }

  ngOnInit() {
    this.getPatientInsurers();
  }

  getFormattedDate(d) {
    const shortdateformat = 'dd/MM/yyyy';
    const datePipe = new DatePipe('en-US');
    try {
      if (d) {
        return datePipe.transform(new Date(d), shortdateformat);
      }
    } catch (e) { console.log('error: ', e); return ''; }
  }

  policyExpired(d: any) {
    try {
      const numDays: number = ((Date.parse(d)).valueOf() - Date.now().valueOf()) / (1000 * 3600 * 24);
      if (numDays <= 0) { return (true); } else { return (false); }
    } catch (e) {
      return (false);
    }
  }

  hidePopup() {
    this.showPopup = false;
  }

  policyNearingExpiry(d: any) {
    try {
      const numDays: number = ((Date.parse(d)).valueOf() - Date.now().valueOf()) / (1000 * 3600 * 24);
      if (numDays > 0 && numDays <= 30) { return (true); } else { return (false); }
    } catch (e) {
      return (false);
    }
  }

  getPatientInsurers() {
    this.subscription.add(this.patientInsurerService.getPatientInsurers(this.patientId).subscribe(data => {
      this.patientInsurers = data;
      this.changeDetectorRef.detectChanges();
    }));
  }

  getInsurerDetails() {
    this.subscription.add(this.patientInsurerService.getPatientInsurerDetails(this.patientInsurerId).subscribe(data => {
      this.insurerDetails = data;
      this.isNew = false;
      this.showPopup = true;
      this.changeDetectorRef.detectChanges();
    }))
  }

  doubleClickHandled(e) {
    this.patientInsurerId = e.data.patientInsurerId;
    this.getInsurerDetails();
  }

  delete(e) {
    this.showPopup = false;

    const callback = () => {
      this.subscription.add(this.patientInsurerService.deletePatientInsurer(e).subscribe(data => {
        this.getPatientInsurers();
  
        this.viewModel = new PatientInsurerModel();
        notify('Insurer unlinked', 'success');
        this.insurerChanged.emit();
        this.changeDetectorRef.detectChanges();
      },
        error => {
          notify('An error occurred', 'error');
        }));
    }

    this.appMessage.showDeleteConfirmation(callback, "Are you sure you want to unlink this insurer?", "Unlink Insurer");  
  }

  deleteClicked(e) {
    this.delete(e.data.patientInsurerId);
  }

  editClicked(e) {
    this.patientInsurerId = e.data.patientInsurerId;
    this.getInsurerDetails()
  }

  add() {
    this.insurerDetails = null;
    this.isNew = true;
    this.showPopup = true;
  }

  savedInsurerHandler(e) {
    this.showPopup = false;
    this.getPatientInsurers();
    if (e) {
      if (this.isNew) {
        notify('Insurer added', 'success');
      } else {
        notify('Insurer Amended', 'success');
      }
      this.viewModel = new PatientInsurerModel();
      this.changeDetectorRef.detectChanges();
      this.insurerChanged.emit();
    }
  }

  newInvoice(e) {
    const patientId = this.patientId;
    const insurerId = e.data.insurerId;

    this.router.navigate(['/accounts/invoice'], { queryParams: { patientId } });
  }

  calculateInsurerDetails(rowData) {
    return {
      insurerName: rowData.insurerName,
      logoUrl: rowData.logoUrl
    };
  }
}