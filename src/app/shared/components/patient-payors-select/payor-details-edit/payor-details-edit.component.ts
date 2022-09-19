import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { InvoiceAddEditService } from 'src/app/pages/accounts/invoice-add-edit/invoice-add-edit.service';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { requiredIfValidator } from 'src/app/shared/helpers/form-helper';
import { AppInfoService, TelecomTypes } from 'src/app/shared/services';
import { AddressTypeViewModel, SitesService } from 'src/app/shared/services/sites.service';
import { PostcodeToAddressResponseModel } from '../../postcode-to-address/postcode-to-address.service';

@Component({
  selector: 'app-payor-details-edit',
  templateUrl: './payor-details-edit.component.html',
  styleUrls: ['./payor-details-edit.component.scss']
})
export class PayorDetailsEditComponent extends ReactiveFormBase implements OnInit {

  @Output() updated = new EventEmitter();
  @Output() closed = new EventEmitter();

  onSuccessfullySaved = (x) => this.updated.emit(x)

  @Input() payorId: string;
  @Input() payorTypeId: number;

  addressTypes: AddressTypeViewModel[] = [];
  telecomTypes: TelecomTypes[] = [];
  public showAddressLines = false;
  public postcode: string;
  public isInsurer: boolean;
  public address: boolean;
  contactClassification;
  caption: string;
  isSitePatientzone: boolean;

  protected httpRequest = x => this.dataService.updatePayorDetails(x);

  constructor(
    private dataService: InvoiceAddEditService,
    private siteService: SitesService,
    private cd: ChangeDetectorRef,
    public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit() {
    if (this.payorTypeId == 1)
      this.caption = "Name";
    else
      this.caption = "First Name";

    this.getSitePatientzone();
    this.getPayor();
    this.getAddressTypes();
    this.setupForm();

    this.subscription.add(
      this.editForm.get('sendViaPatientzone').valueChanges
        .pipe(tap(x => {
          const email = this.editForm.controls["email"];
          const mobileNo = this.editForm.controls["mobileNo"];

          if (x) {
            email.setValidators([requiredIfValidator(() => !this.isInsurer), Validators.pattern(this.appInfo.getEmailFormat()), Validators.maxLength(50)]);
            mobileNo.setValidators([Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/)]);
          }
          else {
            email.setValidators([Validators.pattern(this.appInfo.getEmailFormat()), Validators.maxLength(50)]);
            mobileNo.setValidators([Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/)]);
          }
          email.updateValueAndValidity();
          mobileNo.updateValueAndValidity();
        }))
        .subscribe()
    )
  }

  getSitePatientzone() {
    this.siteService.getSitePatientzone().subscribe(data => {
      this.isSitePatientzone = data;
    })
  }

  private getPayor() {
    this.subscription.add(
      this.dataService.getPayor(this.payorId, this.payorTypeId).subscribe(x => {
        if (x.contactClassification) {
          this.contactClassification = x.contactClassification;
          if (this.contactClassification == 2 || this.contactClassification == 3)
            this.caption = "Name";
        }

        this.isInsurer = x.type === 1;

        if (!x.address) {
          this.address = false;
          x.address = {
            address1: undefined, address2: undefined, address3: undefined, address4: undefined,
            addressTypeId: undefined, postcode: undefined, country: undefined
          }
        }
        else
          this.address == true;

        if (this.isInsurer) {
          this.editForm.controls["insRegistrationNumber"].setValidators(Validators.required);
        }
        if (!this.isInsurer && this.contactClassification == 1) {
          this.editForm.controls["lastName"].setValidators([Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$')]);
        }

        this.populateForm(x);
        //this.cd.detectChanges();
      })
    )
  }


  private setupForm() {
    this.editForm = new FormGroup({
      firstName: new FormControl(undefined, [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$')]),
      lastName: new FormControl(undefined),
      email: new FormControl(undefined, [Validators.pattern(this.appInfo.getEmailFormat()), Validators.maxLength(50)]),
      mobileNo: new FormControl(undefined, [Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/)]),
      insRegistrationNumber: new FormControl(undefined),
      insScheme: new FormControl(undefined),
      insRenewalDate: new FormControl(undefined),
      payorId: new FormControl(undefined),
      type: new FormControl(undefined),
      sendViaPatientzone: new FormControl(false),
      address: new FormGroup({
        address1: new FormControl(undefined, [Validators.required, Validators.maxLength(50)]),
        address2: new FormControl(undefined, Validators.maxLength(50)),
        address3: new FormControl(undefined, Validators.maxLength(50)),
        address4: new FormControl(undefined, Validators.maxLength(50)),
        postcode: new FormControl(undefined, [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
        addressTypeId: new FormControl(undefined, Validators.required),
      })
    });
  }

  public postcodeResolverAddressSelectHandler(value: PostcodeToAddressResponseModel) {
    let address = this.editForm.controls.address as FormGroup;
    address.patchValue({ address1: value.line_1, address2: value.post_Town, address4: value.county });
  }

  getAddressTypes() {
    this.subscription.add(
      this.siteService.getAddressTypes().subscribe((value) => {
        this.addressTypes = value;
      })
    );
  }
}