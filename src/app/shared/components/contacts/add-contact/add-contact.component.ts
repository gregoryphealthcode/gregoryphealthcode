import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ContactTypeViewModel } from "src/app/shared/models/ContactTypeViewModel";
import { AppInfoService, ContactTelecom, TelecomTypes, TitlesViewModel } from "src/app/shared/services";
import { ContactService, ContactTelecomModel, lluContactTypeModel } from "src/app/shared/services/contact.service";
import { SitesService } from "src/app/shared/services/sites.service";
import { SitesStore } from "src/app/shared/stores/sites.store";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { PostcodeToAddressResponseModel } from "../../postcode-to-address/postcode-to-address.service";
import { ReactiveFormBase } from "src/app/shared/base/reactiveForm.base";
import Guid from "devextreme/core/guid";
import { tap } from "rxjs/operators";
import { requiredIfValidator } from "src/app/shared/helpers/form-helper";

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})

@AutoUnsubscribe
export class AddContactComponent extends ReactiveFormBase implements OnInit {
  @Input() contactClassification: number;
  @Input() fromInvoice: boolean;
  @Input() parentId: string;
  @Input() departmentId: string;

  @Output() contactId = new EventEmitter<Guid>();

  title: string;
  postcode: string;
  addressTypes: any;
  telecomTypesAlwaysAdd: TelecomTypes[] = [];
  editForm: FormGroup;
  contactTypes: lluContactTypeModel[] = [];
  titles: TitlesViewModel[];
  enteredTelecomTypes: ContactTelecom[] = [];
  sendViaPatientzone = true;
  isPayor = false;
  postcodeLabel = "Postcode";
  address1Label = "Address 1";
  typeLabel = "Type";
  helperText = "";
  isSitePatientzone: boolean;
  addressNeeded = false;

  constructor(
    public router: Router,
    private siteService: SitesService,
    private changeDetectorRef: ChangeDetectorRef,
    private contactService: ContactService,
    private siteStore: SitesStore,
    private formBuilder: FormBuilder,
    public appInfo: AppInfoService
  ) {
    super();
  }

  protected httpRequest = x => {
    if (this.departmentId)
      return this.contactService.updateDepartment(x);
    else {
      if (this.contactClassification !== 3)
        return this.contactService.addContact(x)
      if (this.contactClassification === 3)
        return this.contactService.addDepartment(x);
    }
  };

  protected onSuccessfullySaved = x => {
    this.departmentId = null;
    this.editForm.reset();
    this.contactId.emit(x.data.contactId);
    if (this.successMessage) { this.showSuccessMessage(this.successMessage) };
    this.saved.emit(x);
  }

  ngOnInit(): void {
    if (this.contactClassification === 1) {
      this.title = "New Person";
      this.helperText = "Contacts added here will be available to link to any patient you choose. If you wish to add a related person solely to a single patient use 'Related Persons' in the patient details screen.\n\nContact Type is used to help categorise and group your contacts providing easier filtering and searching.";
    }
    else if (this.contactClassification === 2) {
      this.title = "New Organisation";
      this.helperText = "Organisations added here will be available to link to any patient you choose. If you wish to add a related person solely to a single patient use 'Related Persons' in the patient details screen.\n\n Organisation Type is used to help categorise and group your contacts providing easier filtering and searching.";
    }
    else if (this.contactClassification === 3) {
      this.title = this.departmentId ? "Edit Department" : "New Department";
      this.helperText = "Departments added here will be available to link to any person you choose.";
    }

    if (this.fromInvoice) {
      this.isPayor = true;
      this.postcodeLabel = "Postcode *";
    }

    this.getSitePatientzone();
    this.getContactTypes();
    this.getTitles();
    this.getTelecomTypes();
    this.getAddressTypes();

    this.setupForm();

    if (this.departmentId) {
      this.contactService.getDepartmentDetails(this.departmentId).subscribe(x => {
        if (x) {
          this.editForm.patchValue({ contactId: x.contactId });
          this.editForm.patchValue({ contactType: this.contactTypes[0] });
          this.editForm.patchValue({ displayName: x.displayName });
          this.editForm.patchValue({ isPayor: x.isPayor });
          this.editForm.patchValue({ sendViaPatientzone: x.sendViaPatientzone });
          this.editForm.patchValue({ inactive: x.inactive });
          this.editForm.patchValue({ inactiveReason: x.inactiveReason });
          this.editForm.patchValue({ addressTypeId: x.addressTypeId });
          this.editForm.patchValue({ address1: x.address1 });
          this.editForm.patchValue({ address2: x.address2 });
          this.editForm.patchValue({ address3: x.address3 });
          this.editForm.patchValue({ address4: x.address4 });
          this.editForm.patchValue({ postcode: x.postcode });
          let group = this.getTelecomsFormArray() as FormArray;
          group.controls.forEach(control => {
            let value = x.telecoms.find(y => y.telecomType == control.value.type)?.value;
            control.patchValue({ value: value });
          });
        }
      });
    }

    this.subscription.add(this.editForm.get('postcode').valueChanges.subscribe(x => {
      this.postcode = x

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

    this.subscription.add(this.editForm.get('sendViaPatientzone').valueChanges.subscribe(x => {
      this.sendViaPatientzone = x;

      this.updateControls();
    }));

    this.subscription.add(this.editForm.get('isPayor').valueChanges.pipe(tap(x => {
      this.isPayor = x;

      if (x) {
        this.postcodeLabel = "Postcode *";
      }
      else {
        this.postcodeLabel = "Postcode";
      }

      this.updateControls();

    })).subscribe());

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

  getSitePatientzone() {
    this.siteService.getSitePatientzone().subscribe(data => {
      this.isSitePatientzone = data;
    })
  }

  updateControls() {
    this.editForm.controls["addressTypeId"].updateValueAndValidity({ emitEvent: false });
    this.editForm.controls["address1"].updateValueAndValidity({ emitEvent: false });
    this.editForm.controls["postcode"].updateValueAndValidity({ emitEvent: false });
    let length = this.getTelecomsFormArray().length;
    for (let i = 0; i < length; i++) {
      let c = this.getTelecomsFormArray().controls[i] as FormGroup;
      Object.keys(c.controls).forEach(field => {
        c.controls[field].updateValueAndValidity({ emitEvent: false });
      });
    }
  }

  getContactTypes() {
    this.subscription.add(this.contactService.getLocalContactTypes(this.contactClassification).subscribe((value) => {
      this.contactTypes = value;
      this.contactTypes.sort(function (a, b) {
        if (a.contactType < b.contactType) return -1;
        if (a.contactType > b.contactType) return 1;
        return 0;
      });
      if (this.contactClassification === 3)
        this.editForm.patchValue({ contactType: value[0] });

      this.changeDetectorRef.detectChanges();
    })
    );
  }

  getTitles() {
    this.subscription.add(
      this.siteService.getTitlesForSite().subscribe((value) => {
        this.titles = value;
        this.titles.sort(function (a, b) {
          if (a.title < b.title) return -1;
          if (a.title > b.title) { return 1; }
          return 0;
        });
        this.changeDetectorRef.detectChanges();
      })
    );
  }

  getTelecomTypes() {
    this.subscription.add(
      this.siteService.getContactTelecomTypes()
        .subscribe((value) => {
          if (this.contactClassification === 1) {
            this.telecomTypesAlwaysAdd = value.filter((x) => x.alwaysAdd === true && x.isOrganisation === false);
          }
          else {
            this.telecomTypesAlwaysAdd = value.filter((x) => x.alwaysAdd === true && x.isOrganisation === true);
          }
          this.addTelecomControls();
        }));
  }

  private addTelecomControls() {
    const arr = this.getTelecomsFormArray();
    this.telecomTypesAlwaysAdd.forEach((element) => {
      const telecom = new ContactTelecom();
      telecom.telecomSystem = element.telecomType;
      telecom.telecomTypeId = element.uniqueNo;
      this.enteredTelecomTypes.push(telecom);
      let control;
      if (element.telecomType == 4) {
        control = this.formBuilder.group((
          {
            type: element.uniqueNo,
            description: element.description,
            value: [element.value, [requiredIfValidator(() => this.isPayor && this.sendViaPatientzone), Validators.pattern(this.appInfo.getEmailFormat()), Validators.maxLength(50)]],
          }
        ));
      }
      else {
        control = this.formBuilder.group((
          {
            type: element.uniqueNo,
            description: element.description,
            value: [element.value, [Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/)]],
          }
        ));
      }
      arr.push(control);
    });
  }

  getTelecomsFormArray() {
    return this.editForm.controls.telecoms as FormArray;
  }

  getAddressTypes() {
    this.siteService.getAddressTypes().subscribe((value) => {
      this.addressTypes = value;
      this.changeDetectorRef.detectChanges();
    });
  }

  postcodeResolverAddressSelectHandler(value: PostcodeToAddressResponseModel) {
    this.updateFormAddressLines(value.line_1, value.line_2, value.post_Town, value.county);
    this.changeDetectorRef.detectChanges();
  }

  private setupForm() {
    this.editForm = new FormGroup({
      parentId: new FormControl(this.parentId, null),
      contactId: new FormControl(null, null),
      contactType: new FormControl('', Validators.compose([Validators.required])),
      displayName: new FormControl('', Validators.compose([requiredIfValidator(() => this.contactClassification !== 1), Validators.maxLength(100)])),
      lastName: new FormControl('', Validators.compose([requiredIfValidator(() => this.contactClassification === 1), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 \'-]*$')])),
      firstName: new FormControl('', Validators.compose([requiredIfValidator(() => this.contactClassification === 1), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 \'-]*$')])),
      title: new FormControl('', Validators.compose([requiredIfValidator(() => this.contactClassification === 1)])),
      knownAs: new FormControl(null, Validators.maxLength(25)),
      isPayor: new FormControl(this.isPayor, null),
      sendViaPatientzone: new FormControl(true, null),
      inactive: new FormControl(false, null),
      inactiveReason: new FormControl('', Validators.maxLength(50)),
      jobTitle: new FormControl(null, Validators.maxLength(50)),
      qualifications: new FormControl(null, Validators.maxLength(20)),
      addressTypeId: new FormControl(null, requiredIfValidator(() => this.addressNeeded || this.isPayor)),
      address1: new FormControl(null, [requiredIfValidator(() => this.addressNeeded || this.isPayor), Validators.maxLength(50)]),
      address2: new FormControl(null, Validators.maxLength(50)),
      address3: new FormControl(null, Validators.maxLength(50)),
      address4: new FormControl(null, Validators.maxLength(50)),
      postcode: new FormControl(null, [requiredIfValidator(() => this.addressNeeded || this.isPayor), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
      telecoms: new FormArray([]),
    });
  }

  private updateFormAddressLines(line1: string, line2: string, line3: string, line4: string) {
    this.editForm.patchValue({ address1: line1 });
    this.editForm.patchValue({ address2: line2 });
    this.editForm.patchValue({ address3: line3 });
    this.editForm.patchValue({ address4: line4 });
  }

  setTelecomAlwaysAddValues(telecoms: ContactTelecomModel[]) {
    telecoms.forEach((data) => {
      const item = this.telecomTypesAlwaysAdd.find((x) => x.uniqueNo === data.type);
      if (item !== undefined) {
        item.value = data.value;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  public getFormGroupControlValue(formGroup: FormGroup, controlName: string) {
    return formGroup.controls[controlName].value;//
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
