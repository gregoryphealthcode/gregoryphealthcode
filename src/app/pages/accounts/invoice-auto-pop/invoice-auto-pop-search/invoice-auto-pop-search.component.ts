import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppointmentListViewModel, AppointmentService } from 'src/app/shared/services/appointment.service';
import { AutoPopClaimModel, BillingService, } from 'src/app/shared/services/billing.service';
import { UserStore } from 'src/app/shared/stores/user.store';

@Component({
  selector: 'app-invoice-auto-pop-search',
  templateUrl: './invoice-auto-pop-search.component.html',
  styleUrls: ['./invoice-auto-pop-search.component.scss']
})
export class InvoiceAutoPopSearchComponent extends ReactiveFormBase implements OnInit {  
  @Output() formClosed = new EventEmitter();

  hospitals: AppointmentListViewModel[] = [];
  claims: AutoPopClaimModel[] = [];
  maxDate = new Date();
  editForm: FormGroup;
  selectedClaim;

  constructor(
    private billingService: BillingService,
    public appInfo: AppInfoService,
    public appointmentService: AppointmentService,
    public userStore: UserStore,
  ) {
    super();
  }

  protected httpRequest = (x: any) => null;

  ngOnInit() {
    this.getHospitals();
    this.setupForm();
  }

  getHospitals() {
    const siteId = this.userStore.getSiteId();
    this.appointmentService.getAppointmentLocations(siteId).subscribe(data => {
      this.hospitals = data;
    })
  }

  setupForm() {
    this.editForm = new FormGroup({
      lastName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(50)]),
      birthDate: new FormControl(null, [Validators.required, this.dateValidator()]),
      treatmentDate: new FormControl(null, [Validators.required, this.dateValidator()]),
      treatmentHospital: new FormControl(null, Validators.required),
    })
  }

  dateValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const todaysTime = new Date().getTime();
      if (!(control && control.value)) {
        return null;

      }
      const d = new Date(control.value).getTime();
      return d > todaysTime
        ? { invalidDate: 'You cannot use future dates' }
        : null;
    }
  }

  search() {
    var model = this.getModelFromForm();
    this.billingService.searchAutoPopClaims(model).subscribe(data => {
      this.claims = data;
    })
  }

  download(e) {
    this.billingService.downloadAutoPopClaim(e).subscribe(x => {
      if (x.isSuccess) {
        this.claims = this.claims.filter(y => y.id != e.id);
      }
    });
  }

  onFocusedRowChanged(e) {
    this.selectedClaim = e.row.key;
  }
}