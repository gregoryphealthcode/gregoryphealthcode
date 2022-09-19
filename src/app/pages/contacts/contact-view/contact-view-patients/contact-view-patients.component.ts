import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AppInfoService } from 'src/app/shared/services';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { linkedPatientModel } from 'src/app/shared/services/contact.service';
import { ContactViewStore } from '../contact-view-store.service';

@Component({
  selector: 'app-contact-view-patients',
  templateUrl: './contact-view-patients.component.html',
  styleUrls: ['./contact-view-patients.component.scss']
})
export class ContactViewPatientsComponent extends SubscriptionBase implements OnInit {
  patients: linkedPatientModel[];
  dateFormat = this.appInfo.getDateFormat;

  @Output() patientSelected = new EventEmitter<linkedPatientModel>();

  constructor(
    public store: ContactViewStore,
    private router: Router,
    private appInfo: AppInfoService
  ) {
    super()
  }

  ngOnInit() {
    this.addToSubscription(
      this.store.patients$.pipe(tap(x => {
        if (x) {
          this.patients = x;
        }
      }))
    )
  }

  viewPatient(e) {
    this.router.navigate(["/patient-details/" + e.data.patientId]);
  }

  public doubleClickHandled(e) {
    this.viewPatient(e)
  }

  public onFocusedRowChanged(e) {
    this.patientSelected.emit(e.row.data);
  }
}