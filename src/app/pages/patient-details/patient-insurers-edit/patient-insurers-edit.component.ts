import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { Component, OnDestroy, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, } from "@angular/core";
import { UserService, InsurersViewModel, } from "src/app/shared/services/user.service";
import { PatientInsurerService, PatientInsurerModel, } from "src/app/shared/services/patient-insurer.service";
import { AppInfoService } from "src/app/shared/services";
import { tap } from "rxjs/operators";
import { of } from "rxjs";
import { ReactiveFormBase } from "src/app/shared/base/reactiveForm.base";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AutoPopModel } from "src/app/shared/services/billing.service";
import { thickness } from "devexpress-reporting/scopes/reporting-chart-internal";

@Component({
  selector: "app-patient-insurers-edit",
  templateUrl: "./patient-insurers-edit.component.html",
  styleUrls: ["./patient-insurers-edit.component.scss"],
})
@AutoUnsubscribe
export class PatientInsurersEditComponent extends ReactiveFormBase implements OnDestroy, OnInit {
  @Input() isNew: boolean;
  @Input() commitOnSave = true;
  @Input() insurerDetails: PatientInsurerModel;
  @Input() existingInsurers: string[];
  @Input() patientId: string;
  @Input() isNewPatient: boolean;

  @Output() saved = new EventEmitter();
  @Output() formClosed = new EventEmitter();
  @Output() insurerAdded = new EventEmitter<string>();

  insurers: InsurersViewModel[] = [];
  appMessage: any;
  gotMembershipNo = false;
  gettingMembershipNo = false;
  getMembershipNoError: string;

  constructor(
    private userSite: UserService,
    public appInfo: AppInfoService,
    public patientInsurerService: PatientInsurerService,
  ) {
    super();
  }

  onSuccessfullySaved = (x) => {
    if (this.isNewPatient)
      x.insurerName = this.insurers.find(z => z.insurerId === x.insurerId).insurerName;
    this.insurerAdded.emit(x.patientInsurerId);
    this.saved.emit(x)
  };

  protected httpRequest = (x) => {
    if (!this.commitOnSave) {
      //don't commit changes to the db
      let z = of(x);
      return z;
    }

    if (this.isNew) {
      x.patientId = this.patientId;
      return this.patientInsurerService.addPatientInsurer(x);

    } else {
      return this.patientInsurerService.updatePatientInsurer(x);
    }
  };

  ngOnInit(): void {
    this.getInsurers();
    this.setupForm();
    this.onControlValueChanges("registrationNumber", x => this.getMembershipNoError = undefined);
  }

  private setupForm() {
    this.editForm = new FormGroup({
      patientInsurerId: new FormControl(null),
      insurerId: new FormControl(null, Validators.required),
      registrationNumber: new FormControl(undefined, Validators.maxLength(20)),
      scheme: new FormControl(undefined, Validators.maxLength(200)),
      renewalDate: new FormControl(undefined),
      isPrimary: new FormControl(false)
    });
    if (this.insurerDetails)
      this.populateForm(this.insurerDetails);
  }

  getInsurers() {
    this.subscription.add(
      this.userSite.getInsurers().subscribe((data) => {
        this.insurers = data;
        this.insurers.sort(function (a, b) {
          if (a.insurerName < b.insurerName) return -1;
          if (a.insurerName > b.insurerName) { return 1; }
          return 0;
        })
      })
    );
  }

  getMembershipNo() {
    const insurerId = this.getFormPropertyValue('insurerId');

    if (!insurerId) {
      return;
    }

    if (!this.patientId) {
      this.patientId = this.insurerDetails.patientId;
    }

    this.gettingMembershipNo = true;

    this.addToSubscription(this.patientInsurerService.getMembershipNo(this.patientId, insurerId).pipe(tap((x) => {
      if (x.response === 0) {
        //Failed
        this.getMembershipNoError = x.membershipNo;
      } else {
        this.setFormPropertyValue('registrationNumber', x.membershipNo);
        this.gotMembershipNo = true;
      }      
      this.gettingMembershipNo = false;
    })));
  }
}