import { merge, } from "rxjs";
import { tap } from "rxjs/operators";
import { AppInfoService, PatientDetailsModel, PatientReferenceNumber, PatientTelecom, ReferenceNumberTypes, TelecomTypes, } from "src/app/shared/services";
import { AddressTypeViewModel, SitesService } from "src/app/shared/services/sites.service";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Directive, OnInit, ViewChild, } from "@angular/core";
import { SpinnerService } from "src/app/shared/services/spinner.service";
import { AddEditPatientBase } from "./patient-add-edit-base";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { DxTextBoxComponent } from "devextreme-angular";
import { PostcodeToAddressResponseModel } from "src/app/shared/components/postcode-to-address/postcode-to-address.service";
import { showSuccessSnackbar } from "src/app/shared/helpers/other";
import { ContactModel, } from "src/app/shared/services/contact.service";
import { PatientInsurerViewModel, PatientService, } from "src/app/shared/services/patient.service";
import { SitesStore } from "src/app/shared/stores/sites.store";
import { requiredIfValidator } from "../../helpers/form-helper";
import { AutoPopModel } from "../../services/billing.service";
import { UserService } from "../../services/user.service";

@Directive()
export abstract class AddPatientBase extends AddEditPatientBase implements OnInit {
  @ViewChild("postcode") postcodeText: DxTextBoxComponent;

  public autoPopModel: AutoPopModel;
  public possibleDuplicates: PatientDetailsModel[];
  public showPossibleDuplicatesPopup: boolean;
  public duplicateDetails: PatientDetailsModel;
  public displayDuplicates: boolean;
  public isSitePatientzone: boolean;
  public insurers: PatientInsurerViewModel[] = [];
  public contacts: ContactModel[] = [];
  public autoPopInsurer: PatientInsurerViewModel;
  public autoPopContact: string;

  addressTypes: AddressTypeViewModel[];
  telecomTypesAlwaysAdd: TelecomTypes[] = [];
  enteredTelecomTypes: PatientTelecom[] = [];

  selectedReferenceNumber: PatientReferenceNumber;
  referenceNumberTypes: ReferenceNumberTypes[] = [];
  enterReferenceNumbers: PatientReferenceNumber[] = [];
  patientId: string;
  postcodeForm: FormGroup;
  addressForm: FormGroup;
  postcode: string;
  postcodeLabel = "Postcode";
  addressNeeded = false;

  httpRequest = (x: any) => this.request(x);
  protected abstract afterSaved: (x: any) => void;

  constructor(
    private siteService: SitesService,
    private siteStore: SitesStore,
    private snackBar: MatSnackBar,
    public spinnerService: SpinnerService,
    public appInfo: AppInfoService,
    public router: Router,
    public patientService: PatientService,
    private formBuilder: FormBuilder,
    private userSite: UserService,
  ) {
    super(siteService, appInfo, patientService);
  }

  ngOnInit(): void {
    this.onSuccessfullySaved = this.onSaved;

    this.subscription.add(
      merge(
        this.getSitePatientzone$(),
        this.getReferenceDataPoints$(),
        this.getTelecomTypes$(),
        this.getTitles$(),
        this.getAddressTypes$()
      ).subscribe()
    );

    this.setupForm();

    this.subscribeToDateOfBirthChanges();
    this.subscribeToDuplicateChanges();

    this.subscription.add(this.editForm.get("postcode").valueChanges.subscribe(x => {
      this.postcode = x;

      if (x && x.length > 0) {
        this.addressNeeded = true;
        this.postcodeLabel = "Postcode *";
      }
      else {
        this.addressNeeded = false;
        this.postcodeLabel = "Postcode";
      }

      this.updateControls();
    }));

    this.subscription.add(this.editForm.get("address1").valueChanges.subscribe(x => {
      if (x && x.length > 0) {
        this.addressNeeded = true;
        this.postcodeLabel = "Postcode *";
      }
      else {
        this.addressNeeded = false;
        this.postcodeLabel = "Postcode";
      }

      this.updateControls();
    }));

    this.subscription.add(this.editForm.get("addressTypeId").valueChanges.subscribe(x => {
      if (x) {
        this.addressNeeded = true;
        this.postcodeLabel = "Postcode *";
      }
      else {
        this.addressNeeded = false;
        this.postcodeLabel = "Postcode";
      }

      this.updateControls();
    }));
  }

  updateControls() {
    this.editForm.controls["addressTypeId"].updateValueAndValidity({ emitEvent: false });
    this.editForm.controls["address1"].updateValueAndValidity({ emitEvent: false });
    this.editForm.controls["postcode"].updateValueAndValidity({ emitEvent: false });
  }

  getSitePatientzone$() {
    return this.siteService.getSitePatientzone().pipe(tap((data) => {
      this.isSitePatientzone = data;
    }));
  }

  getReferenceDataPoints$() {
    return this.siteService.getPatientReferenceNumberTypes().pipe(
      tap((data) => {
        const arr = this.getReferenceNumbersFormArray();
        data.forEach((element) => {
          if (element.autoIncrement) {
            const refNumber = new PatientReferenceNumber();
            refNumber.refNoType = element.numberType;
            refNumber.refNoValue = `${element.prefix}${element.nextNumber}${element.suffix}`;
            refNumber.nextNumber = element.nextNumber;
            refNumber.autoincrement = true;
            refNumber.description = element.description;
            this.enterReferenceNumbers.push(refNumber);
            let control = this.formBuilder.group(({
              id: element.numberType,
              value: [`${element.prefix}${element.nextNumber}${element.suffix}`, Validators.maxLength(50)],
              description: element.description,
              visible: true,
            }
            ));
            arr.push(control);
          }
          else {
            if (element.alwaysAdd) {
              const refNumber = new PatientReferenceNumber();
              refNumber.refNoType = element.numberType;
              refNumber.refNoValue = `${element.prefix}${element.nextNumber}${element.suffix}`;
              refNumber.nextNumber = element.nextNumber;
              refNumber.autoincrement = false;
              refNumber.description = element.description;
              this.enterReferenceNumbers.push(refNumber);
              let control = this.formBuilder.group(({
                id: element.numberType,
                value: ['', Validators.maxLength(50)],
                description: element.description,
                visible: false,
              }
              ));
              arr.push(control);
            }
          }
        });
      })
    );
  }

  getTelecomTypes$() {
    return this.siteService.getTelecomTypes().pipe(
      tap((value) => {
        this.telecomTypesAlwaysAdd = value.filter((x) => x.alwaysAdd === true);
        const arr = this.getTelecomsFormArray();
        this.telecomTypesAlwaysAdd.forEach((element) => {
          const telecom = new PatientTelecom();
          telecom.telecomSystem = element.telecomType;
          telecom.telecomTypeId = element.uniqueNo;
          this.enteredTelecomTypes.push(telecom);
          let control;
          if (element.telecomType == 4) {
            control = this.formBuilder.group((
              {
                id: element.telecomType,
                type: element.uniqueNo,
                description: element.description,
                value: ["", [Validators.pattern(this.appInfo.getEmailFormat()), Validators.maxLength(50)]]
              }
            ));
          }
          else {
            control = this.formBuilder.group((
              {
                id: element.telecomType,
                type: element.uniqueNo,
                description: element.description,
                value: ["", [Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/)]]
              }
            ));
          }
          arr.push(control);
        });
      })
    );
  }

  postcodeResolverAddressSelectHandler(value: PostcodeToAddressResponseModel) {
    this.updateFormAddressLines(
      value.line_1,
      value.line_2,
      value.line_3,
      value.post_Town
    );
  }

  private updateFormAddressLines(
    line1: string,
    line2: string,
    line3: string,
    line4: string
  ) {
    this.editForm.patchValue({
      address1: line1,
      address2: line2,
      address3: line3,
      address4: line4,
    });
  }

  private setupForm() {
    this.editForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(50)]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(50)]),
      birthDate: new FormControl(null, [Validators.required, this.dateValidator()]),
      gender: new FormControl(null, [Validators.required]),
      identifiesAs: new FormControl(null, null),
      title: new FormControl(null, [Validators.required]),
      initials: new FormControl(null, Validators.maxLength(10)),
      sendViaPatientzone: new FormControl(true, null),
      noChase: new FormControl(false, null),
      onStop: new FormControl(false, null),
      addressTypeId: new FormControl(null, requiredIfValidator(() => this.addressNeeded)),
      address1: new FormControl(null, [requiredIfValidator(() => this.addressNeeded), Validators.maxLength(50)]),
      address2: new FormControl(null, Validators.maxLength(50)),
      address3: new FormControl(null, Validators.maxLength(50)),
      address4: new FormControl(null, Validators.maxLength(50)),
      postcode: new FormControl(null, [requiredIfValidator(() => this.addressNeeded), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
      primaryAddress: new FormControl({ value: true }, null),
      billingAddress: new FormControl(null, null),
      telecoms: new FormArray([]),
      referenceNumbers: new FormArray([])
    });

    if (this.autoPopModel) {
      this.editForm.patchValue(
        {
          firstName: this.autoPopModel.patientFirstName,
          lastName: this.autoPopModel.patientLastName,
          title: "Dr",
          birthDate: this.autoPopModel.patientBirthDate,
          gender: this.autoPopModel.patientGender,
          addressTypeId: 1,
          address1: this.autoPopModel.patientAddressLine1,
          address2: this.autoPopModel.patientAddressLine2,
          address3: this.autoPopModel.patientAddressLine3,
          address4: this.autoPopModel.patientAddressLine4,
          postcode: this.autoPopModel.patientPostcode
        }
      )
    }
  }

  populateForm(data) {
    this.autoPopModel = data;
    this.autoPopContact = data.contactId;

    this.autoPopInsurer = new PatientInsurerViewModel();
    this.autoPopInsurer.insurerId = data.insurerId;
    this.autoPopInsurer.insurerName = data.insurerName;
    this.autoPopInsurer.isPrimary = true;
    this.insurers.push(this.autoPopInsurer);
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

  getReferenceNumbersFormArray() {
    return this.editForm.controls.referenceNumbers as FormArray;
  }

  getTelecomsFormArray() {
    return this.editForm.controls.telecoms as FormArray;
  }

  getAddressTypes$() {
    return this.siteService.getAddressTypes().pipe(
      tap((value) => {
        this.addressTypes = value;
      })
    );
  }

  confirmAdd() {
    this.showPossibleDuplicatesPopup = false;
    this.duplicateDetails.forceAdd = true;
    this.patientService.addPatient(this.duplicateDetails).subscribe(x => {
      this.onSaved(x);
    });
  }

  getModelFromForm() {
    const model = super.getModelFromForm();
    model.insurers = this.insurers;
    model.contacts = this.contacts;
    return model;
  }

  request(model) {
    model.primaryAddress = true;
    model.billingAddress = true;
    model.insurers = this.insurers;
    model.contacts = this.contacts;
    this.duplicateDetails = model;

    return this.patientService.addPatient(model);
  }

  protected onSaved(data) {
    if (!data.success) {
      this.possibleDuplicates = data.duplicatePatients;
      this.showPossibleDuplicatesPopup = true;
    } else {
      showSuccessSnackbar(this.snackBar, "Patient details saved successfully");
      this.afterSaved(data);
    }
  }

  showDuplicates() {
    this.showPossibleDuplicatesPopup = true;
    this.displayDuplicates = true;
  }

  closeDuplicate() {
    this.showPossibleDuplicatesPopup = false;
    this.displayDuplicates = false;
    this.spinnerService.stop();
  }

  clearAddress() {
    this.addressNeeded = false;
    this.postcodeLabel = "Postcode";

    this.editForm.controls["addressTypeId"].setValue(null);
    this.editForm.controls["address1"].setValue(null);
    this.editForm.controls["postcode"].setValue(null);

    this.updateControls();
  }
}