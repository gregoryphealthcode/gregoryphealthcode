import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SubscriptionBase } from "src/app/shared/base/subscribtion.base";
import { MedsecSitesViewModel } from "src/app/shared/models/UserAllowedSitesViewModel";
import { PatientZoneService } from "src/app/shared/services/patient-zone.service";
import { SpinnerService } from "src/app/shared/services/spinner.service";
import { DirectDebitDetails, PatientZoneViewModel, PZPracticeDetails, PZUser, PZUserDetails, RegisterPractitionerViewModel } from "src/app/shared/services/user.service";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { StatusCode } from "src/app/_helpers/StatusCode";
import notify from 'devextreme/ui/notify';
import { AppInfoService } from "src/app/shared/services/app-info.service";

@Component({
  selector: 'app-patientzone-register-practitioner',
  templateUrl: './patientzone-register-practitioner.component.html',
  styleUrls: ['./patientzone-register-practitioner.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' },
})
@AutoUnsubscribe
export class PatientZoneRegisterPractitionerComponent extends SubscriptionBase implements OnInit {
  @Input() medsecId: string;
  @Input() sites: MedsecSitesViewModel[];

  @Output() formClosed = new EventEmitter();

  showBankDetails: boolean;
  errors: any[] = [];
  practitionerSelected = new MedsecSitesViewModel();
  bankAcounts = [
    "Organisation",
    "Practitioner"
  ];

  constructor(
    private spinnerService: SpinnerService, public appInfo: AppInfoService,
    private changeDetectorRef: ChangeDetectorRef,
    private patientZoneService: PatientZoneService) {
    super();
    // this.setupForm();
  }

  ngOnInit(): void {

  }

  validate() {
    this.spinnerService.start();
    const model = new RegisterPractitionerViewModel();
    model.siteId = this.medsecId;
    model.PatientZoneViewModel = [];
    this.sites.forEach(element => {
      if (element.isSelected) {
        const pz = new PatientZoneViewModel();
        pz.bankDetails = new DirectDebitDetails();
        pz.bankDetails.accountName = element.accountName;
        pz.bankDetails.accountNumber = element.accountNumber;
        pz.bankDetails.bankName = element.bankName;
        pz.bankDetails.sortCode = element.sortCode;

        pz.practiceDetails = new PZPracticeDetails();
        pz.practiceDetails.practiceId = element.payeeProvider;
        pz.practiceDetails.practitionerCode = element.payeeProvider
        pz.practiceDetails.practiceName = element.displayName;
        pz.practiceDetails.useOrganisationBank = element.useOwnBank === 'Practitioner' ? 'N' : 'Y';
        pz.userDetails = new PZUserDetails();
        pz.userDetails.email = element.emailAddress;

        pz.userDetails.mobile = element.telephone;
        pz.userDetails.user = new PZUser();
        pz.userDetails.user.firstName = element.firstName;
        pz.userDetails.user.lastName = element.lastName
        pz.userDetails.user.title = element.title;

        pz.siteId = element.siteId; // ???
        model.PatientZoneViewModel.push(pz);
      }
    });
    if (model.PatientZoneViewModel.length > 0) {
      this.patientZoneService.registerPractioner(model).subscribe(value => {
        if (value.isSuccess && value.statusCode === StatusCode.success) {
          this.spinnerService.stop();
          this.changeDetectorRef.detectChanges();

          notify('Registration pending', 'success');
          // this.isPZPending = true;

        }
        else if (!value.isSuccess) {
          const result = JSON.parse(value.payload);

          this.errors = result;
          this.changeDetectorRef.detectChanges();
          this.spinnerService.stop();
        }
      },
        error => {
          notify('An error occurred', 'error');
          this.spinnerService.stop();
        });
    }
  }

  close() {
    this.formClosed.emit();
  }

  onValueChanged(e, data) {
    if (data.isSelected && e.value === 'Practitioner') {
      this.practitionerSelected = data;
      this.showBankDetails = true;
    }
  }

  selectAll(e) {
    if (e.value === true) {
      this.sites.forEach(element => {
        if (!element.isPatientZoneEnabled) {
          element.isSelected = true;
        }

      });
    }
  }
}