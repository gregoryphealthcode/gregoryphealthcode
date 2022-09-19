import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DxTextBoxComponent, } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { map, tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { PostcodeSelectAddressComponent } from 'src/app/shared/components/postcode-select-address/postcode-select-address.component';
import { PostcodeToAddressResponseModel } from 'src/app/shared/components/postcode-to-address/postcode-to-address.service';
import { SiteViewModel } from 'src/app/shared/models/SiteViewModel';
import { MedsecSitesViewModel, } from 'src/app/shared/models/UserAllowedSitesViewModel';
import { AppInfoService, TitlesViewModel } from 'src/app/shared/services';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Address } from 'src/app/shared/services/contact.service';
import { PatientZoneService } from 'src/app/shared/services/patient-zone.service';
import { SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { DirectDebitDetails, PatientZoneViewModel, PZPracticeDetails, PZUser, PZUserDetails, RegisterPractitionerViewModel, UserService } from 'src/app/shared/services/user.service';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { UserStore } from 'src/app/shared/stores/user.store';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { StatusCode } from 'src/app/_helpers/StatusCode';

@Component({
  selector: 'app-patientzone-registration',
  templateUrl: './patientzone-registration.component.html',
  styleUrls: ['./patientzone-registration.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1 py-3 px-4' },
})
@AutoUnsubscribe
export class PatientzoneRegistrationComponent extends SubscriptionBase implements OnInit {
  @ViewChild('postcodeSelectContactAddressComponent') postcodeSelectContactAddressComponent: PostcodeSelectAddressComponent;
  @ViewChild('postcodeValue') postcodeValue: DxTextBoxComponent;

  @Input() get isMedsec(): boolean {
    return this._isMedsec;
  }
  set isMedsec(value: boolean) {
    if (value) {
      this.isSingleSpecialist = false;
      this.getListOfSites();
      this.getBureauSettings();
    }
    else {
      this.getSiteDetails();
      this.getSitePreferences();
      this.getTitles();
    }
    this._isMedsec = value;
  }

  private _isMedsec: boolean;
  patientZoneVM: PatientZoneViewModel = new PatientZoneViewModel();
  practiceVM: PZPracticeDetails = new PZPracticeDetails();
  userDetailsVM: PZUserDetails = new PZUserDetails();
  directDebitVM: DirectDebitDetails = new DirectDebitDetails();
  lluTitles: TitlesViewModel[] = [];
  showRegisterPractitioner: boolean;
  errors: any[] = [];
  sites: MedsecSitesViewModel[] = [];
  medSecSettings: any;
  isPZRegistered = false;
  registrationReference = '';
  isPZPending = false
  isSingleSpecialist = false;
  form: FormGroup;
  emailControl: AbstractControl;
  termsControl: AbstractControl;
  mobileControl: AbstractControl;
  number: string;
  email: string;
  terms: boolean;
  siteId: string;
  siteRef: string;
  showAddressLines = false;
  postcode: string;
  userDetailsPostcode: string;
  showRegPanel = false;
  siteVM: SiteViewModel = new SiteViewModel();

  bankAcounts = [
    "Organisation",
    "Practitioner"
  ];

  constructor(
    private userService: UserService,
    public router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private spinner: SpinnerService,
    private siteStore: SitesStore,
    private siteService: SitesService,
    private patientZoneService: PatientZoneService,
    private authService: AuthService,
    public appInfo: AppInfoService
  ) {
    super();
    this.setupForm();
  }

  postcodeResolverAddressSelectHandler(value: PostcodeToAddressResponseModel) {
    this.updateFormAddressLines(value.line_1, value.post_Town, value.line_3, value.county);
    this.showAddressLines = true;
  }

  postcodeResolverUserDetailsAddressSelectHandler(value: PostcodeToAddressResponseModel) {
    this.updateUserDetailsFormAddressLines(value.line_1, value.post_Town, value.line_3, value.county);
    this.showAddressLines = true;
  }

  getSiteDetails() {
    const selectedSite = this.siteStore.getSelectedSite();
    this.siteId = selectedSite.siteId;
    this.siteRef = selectedSite.siteRef;
  }

  ngOnInit(): void {
    this.practiceVM.userDetails = new PZUser();
    this.practiceVM.address = new Address();
    this.userDetailsVM.address = new Address();
    this.userDetailsVM.user = new PZUser();

    this.subscription.add(this.form.get('postcode').valueChanges.subscribe(x => this.postcode = x));

    this.subscription.add(this.form.get('userDetailsPostcode').valueChanges.subscribe(x => this.userDetailsPostcode = x));
  }

  checkSubscriptionToPZ() {
    this.subscription.add(this.siteService.isSitePatientZoneEnabled().pipe(tap(data => {
      this.isPZRegistered = data;
      this.changeDetectorRef.detectChanges();
    }),
      map((data => {
        if (data === false) {
          this.siteService.isSitePatientZonePending().pipe(tap(data => {
            if (data !== '') {
              this.registrationReference = data;
              this.isPZPending = true;
              this.changeDetectorRef.detectChanges();
            }
          }), map(data => {
            if (data === '') {
              this.siteService.isSingleSpecialist().pipe(tap(data => {
                this.isSingleSpecialist = data;
              })).subscribe();
            }
          })).subscribe()
        }
      }))).subscribe());
  }

  getSitePreferences() {
    this.subscription.add(this.siteService.getSitePreferences().subscribe(data => {
      this.siteVM = data;
      this.checkSubscriptionToPZ();
      this.form.get('practiceId').patchValue(data.hcCode);
      this.form.patchValue({ firstName: data.firstName });
      this.form.patchValue({ lastName: data.lastName });
      this.form.patchValue({ title: data.title === undefined ? 'Mr' : data.title });
      this.form.patchValue({ address1: data.address1 });
      this.form.patchValue({ address2: data.address2 });
      this.form.patchValue({ address3: data.address3 });
      this.form.patchValue({ address4: data.address4 });
      this.form.patchValue({ postcode: data.postcode });
    }));
  }

  allCaps(e) {
    let textcontent = e.component._$textEditorInputContainer[0].firstChild.value;
    textcontent = textcontent.toUpperCase();
    e.component._$textEditorInputContainer[0].firstChild.value = textcontent;
  }

  firstLetterCaps(e) {
    let textcontent = e.component._$textEditorInputContainer[0].firstChild.value;
    if (textcontent.length === 1) { textcontent = textcontent.toUpperCase(); }
    if (textcontent.length > 2) {

      if (textcontent[textcontent.length - 2] === ' ' || textcontent[textcontent.length - 2] === '\'') {
        let s = '' + textcontent[(textcontent.length - 1)];
        s = s.toUpperCase();
        textcontent = textcontent.slice(0, textcontent.length - 1);
        textcontent = textcontent + s[0];
      }
    }
    e.component._$textEditorInputContainer[0].firstChild.value = textcontent;
  }

  validateMedsec() {
    this.getFormData();

    if (!this.isPZRegistered) {
      this.validateClick();
    }
    else {
      const model = new RegisterPractitionerViewModel();

      this.sites.forEach(element => {
        console.log(element);
      });
      this.patientZoneService.registerPractioner(model).subscribe(value => {
        if (value.isSuccess && value.statusCode === StatusCode.success) {
          this.spinner.stop();
          this.changeDetectorRef.detectChanges();
          notify('Registration pending', 'success');
          this.isPZPending = true;

        }
        else if (!value.isSuccess) {
          const result = JSON.parse(value.payload);
          this.errors = result;
          this.changeDetectorRef.detectChanges();
          this.spinner.stop();
        }
      },
        error => {
          notify('An error occurred', 'error');
          this.spinner.stop();
        });
    }
  }

  validateClick() {
    this.spinner.start();
    this.patientZoneVM.siteId = this.siteId;
    this.getFormData();

    if (this.isSingleSpecialist) {
      this.patientZoneVM.practiceDetails.registrationType = "SINGLE";
    }
    else {
      if (this.isMedsec) {
        this.patientZoneVM.practiceDetails.registrationType = "MEDSEC";
        this.patientZoneVM.siteId = this.medSecSettings.bureauId;
      }
      else {
        this.patientZoneVM.practiceDetails.registrationType = "PRACTICE";
      }
    }

    this.patientZoneService.registerOrganisation(this.patientZoneVM).subscribe(value => {
      if (value.isSuccess && value.statusCode === StatusCode.success) {
        this.spinner.stop();
        this.changeDetectorRef.detectChanges();

        notify('Registration pending', 'success');
        this.isPZPending = true;

      }
      else if (!value.isSuccess) {
        const result = JSON.parse(value.payload);

        this.errors = result;
        this.changeDetectorRef.detectChanges();
        this.spinner.stop();
      }
    },
      error => {
        notify('An error occurred', 'error');
        this.spinner.stop();
      });
  }

  useAddress() {
    this.updateUserDetailsFormAddressLines(this.form.get('address1').value, this.form.get('address2').value, this.form.get('address3').value, this.form.get('address4').value);
    this.form.patchValue({ userDetailsPostcode: this.form.get('postcode').value });
    if (this.isSingleSpecialist) {
      this.form.patchValue({ userDetailsFirstName: this.form.get('firstName').value });
      this.form.patchValue({ userDetailsLastName: this.form.get('lastName').value });
      this.form.patchValue({ userDetailsTitle: this.form.get('title').value });
    }
  }

  getTitles() {
    this.subscription.add(this.userService.getTitlesForSite(this.siteId).subscribe(data => {
      this.lluTitles = data;
    }));
  }

  private updateFormAddressLines(line1: string, line2: string, line3: string, line4: string) {
    this.form.patchValue({ address1: line1 });
    this.form.patchValue({ address2: line2 });
    this.form.patchValue({ address3: line3 });
    this.form.patchValue({ address4: line4 });
  }

  private updateUserDetailsFormAddressLines(line1: string, line2: string, line3: string, line4: string) {
    this.form.patchValue({ userDetailsAddress1: line1 });
    this.form.patchValue({ userDetailsAddress2: line2 });
    this.form.patchValue({ userDetailsAddress3: line3 });
    this.form.patchValue({ userDetailsAddress4: line4 });
  }

  private setupForm() {
    const phoneNumber = '/^((\+44(\s\(0\)\s|\s0\s|\s)?)|0)7\d{3}(\s)?\d{6}$/';

    this.form = new FormGroup({
      terms: new FormControl(false, [Validators.required, Validators.requiredTrue]),
      mobile: new FormControl(null, Validators.compose([Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/), Validators.required])),
      userDetailsEmail: new FormControl(false, [Validators.pattern(this.appInfo.getEmailFormat()), Validators.required]),
      address1: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      address2: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      address3: new FormControl(null, Validators.maxLength(50)),
      address4: new FormControl(null, Validators.maxLength(50)),
      postcode: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
      userDetailsAddress1: new FormControl(null, Validators.required),
      userDetailsAddress2: new FormControl(null, Validators.required),
      userDetailsAddress3: new FormControl(null, null),
      userDetailsAddress4: new FormControl(null, null),
      userDetailsPostcode: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
      userDetailsLastName: new FormControl(null, null),
      userDetailsFirstName: new FormControl(null, null),
      userDetailsTitle: new FormControl(null, null),
      accountName: new FormControl(null, null),
      sortCode: new FormControl(false, [Validators.maxLength(8)]),
      accountNumber: new FormControl(null, [Validators.maxLength(8), Validators.minLength(8)]),
      bankName: new FormControl(null, null),
      firstName: new FormControl(null, null),
      lastName: new FormControl(null, null),
      title: new FormControl(null, null),
      practiceName: new FormControl(null, null),
      practiceId: new FormControl(null, null)
    });

    this.termsControl = this.form.controls.terms;
    this.mobileControl = this.form.controls.mobile;
  }


  checkPending() {
    this.spinner.start();
    this.subscription.add(this.patientZoneService.getRegistrationStatus(this.registrationReference, this.siteId).subscribe(value => {
      if (value.isSuccess && value.statusCode === StatusCode.success) {
        this.changeDetectorRef.detectChanges();
        this.spinner.stop();
        notify('Registration succesful', 'success');
        this.checkSubscriptionToPZ();
      }

      if (!value.isSuccess && value.statusCode === StatusCode.PatientZoneRegistrationPending) {
        this.changeDetectorRef.detectChanges();
        this.spinner.stop();
        notify('Registration still pending', 'error');
      }

      if (!value.isSuccess && value.statusCode === StatusCode.PatientZoneError) {
        const result = JSON.parse(value.payload);
        this.errors = result;
        this.spinner.stop();
        this.changeDetectorRef.detectChanges();
      }
    },
      error => {
        this.spinner.stop();
        notify('An error occurred', 'error');
      }));
  }

  getListOfSites() {
    this.subscription.add(this.authService.getSites().subscribe(data => {
      data.forEach(element => {
        const site = new MedsecSitesViewModel();
        site.siteId = element.siteId;
        site.siteName = element.siteName;
        site.isSelected = false;
        site.useOwnBank = 'Organisation';
        site.displayName = element.displayName;
        site.payeeProvider = element.payeeProvider;
        site.isPatientZoneEnabled = element.isPatientZoneEnabled;
        site.firstName = element.firstName;
        site.lastName = element.lastName;
        site.title = element.title;
        site.address1 = element.address1;
        site.address2 = element.address2;
        site.address3 = element.address3;
        site.address4 = element.address4;
        site.postcode = element.postcode;
        this.sites.push(site);
      });
    }));
  }

  getFormData() {
    this.patientZoneVM.bankDetails = new DirectDebitDetails();
    this.patientZoneVM.bankDetails.accountName = this.form.get('accountName').value
    this.patientZoneVM.bankDetails.accountNumber = this.form.get('accountNumber').value
    this.patientZoneVM.bankDetails.bankName = this.form.get('bankName').value
    this.patientZoneVM.bankDetails.sortCode = this.form.get('sortCode').value

    this.patientZoneVM.practiceDetails = new PZPracticeDetails();
    this.patientZoneVM.practiceDetails.practiceId = this.form.get('practiceId').value;
    this.patientZoneVM.practiceDetails.practiceName = this.form.get('practiceName').value;

    this.patientZoneVM.practiceDetails.address = new Address();
    this.patientZoneVM.practiceDetails.address.address1 = this.form.get('address1').value;
    this.patientZoneVM.practiceDetails.address.address2 = this.form.get('address2').value;
    this.patientZoneVM.practiceDetails.address.address3 = this.form.get('address3').value;
    this.patientZoneVM.practiceDetails.address.address4 = this.form.get('address4').value;
    this.patientZoneVM.practiceDetails.address.postcode = this.form.get('postcode').value;

    this.patientZoneVM.userDetails = new PZUserDetails();
    this.patientZoneVM.userDetails.email = this.form.get('userDetailsEmail').value;
    this.patientZoneVM.userDetails.mobile = this.form.get('mobile').value;

    this.patientZoneVM.userDetails.user = new PZUser();
    this.patientZoneVM.userDetails.user.firstName = this.form.get('userDetailsFirstName').value;
    this.patientZoneVM.userDetails.user.lastName = this.form.get('userDetailsLastName').value;
    this.patientZoneVM.userDetails.user.title = this.form.get('userDetailsTitle').value;

    this.patientZoneVM.userDetails.address = new Address();
    this.patientZoneVM.userDetails.address.address1 = this.form.get('userDetailsAddress1').value;
    this.patientZoneVM.userDetails.address.address2 = this.form.get('userDetailsAddress2').value;
    this.patientZoneVM.userDetails.address.address3 = this.form.get('userDetailsAddress3').value;
    this.patientZoneVM.userDetails.address.address4 = this.form.get('userDetailsAddress4').value;
    this.patientZoneVM.userDetails.address.postcode = this.form.get('userDetailsPostcode').value;
  }

  getBureauSettings() {
    throw ('to bind to new MedSec APIs')
    // this.subscription.add(this.medsecService.getBureauSettings().subscribe(data => {
    //   this.medSecSettings = data;
    //   this.isPZRegistered = data.isPZEnabled;
    //   this.isPZPending = (data.pzRegistrationReference !== '' && data.pzRegistrationReference !== null) && !data.isPZEnabled;

    //   this.changeDetectorRef.detectChanges();
    // }));
  }
}
