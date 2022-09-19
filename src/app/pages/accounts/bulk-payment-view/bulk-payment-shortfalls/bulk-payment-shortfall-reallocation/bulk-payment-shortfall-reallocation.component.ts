import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import notify from 'devextreme/ui/notify';
import { switchMap, tap } from 'rxjs/operators';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { PostcodeToAddressResponseModel } from 'src/app/shared/components/postcode-to-address/postcode-to-address.service';
import { requiredIfValidator } from 'src/app/shared/helpers/form-helper';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { DocumentsStoreService } from 'src/app/shared/services/documents-store.service';
import { AddressTypeViewModel, SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { TemplateService, TemplateViewModel } from 'src/app/shared/services/template.service';
import { GetInvoicePayorResponseModel, InvoiceAddEditService } from '../../../invoice-add-edit/invoice-add-edit.service';
import { InvoicePaymentNotificationsService } from '../../../invoice-add-edit/invoice-payment-notifications/invoice-payment-notifications.service';
import { BulkPaymentViewStore } from '../../account-bulk-payment-store.service';

@Component({
  selector: 'app-bulk-payment-shortfall-reallocation',
  templateUrl: './bulk-payment-shortfall-reallocation.component.html',
  styleUrls: ['./bulk-payment-shortfall-reallocation.component.scss'],
  providers: [DocumentsStoreService], 
})
export class BulkPaymentShortfallReallocationComponent extends ReactiveFormBase implements OnInit {
  @Input() invoiceId: string;
  @Input() patientId: string;
  @Input() bulkPaymentTransactionId: string;
  @Input() patientAddress: AddressModel;
  @Input() balanceDue: number;
  @Input() checkDetails: boolean;

  @Output() closePopup = new EventEmitter();
  @Output() saved = new EventEmitter();

  relatedPayors: GetInvoicePayorResponseModel[] = [];
  templates: TemplateViewModel[] = [];
  payorType: number;
  payorDetails: boolean;
  contactClassification: number;
  addressTypes: AddressTypeViewModel[] = [];
  caption: string = "First Name";
  isSitePatientzone: boolean;
  sendViaPatientzone: boolean;
  payorTypes = [
    { id: 3, value: "Contact" },
    { id: 1, value: "Insurer" },
    { id: 2, value: "Patient" },
    { id: 4, value: "Related Person" },
  ]

  constructor(
    public store: BulkPaymentViewStore,
    public siteService: SitesService,
    private dataService: InvoiceAddEditService,
    private invoicePaymentService: InvoicePaymentNotificationsService,
    private spinnerService: SpinnerService,
    public appInfo: AppInfoService,
    private templateService: TemplateService,
    private documentsService: DocumentsStoreService,
  ) {
    super();
  }

  protected httpRequest = x => null;

  ngOnInit() {
    this.setupForm();
    this.getTemplates();
    this.getAddressTypes();

    if (this.checkDetails) {
      this.editForm.patchValue({ patientId: this.patientId, payorId: this.patientId, type: 2 });
      this.store.getPayorInfo$(this.patientId, 2);
    }

    this.store.getRelatedPayors$(this.patientId);
    this.getSitePatientzone();

    this.subscription.add(this.editForm.get("payorId").valueChanges.subscribe(x => {
      if (x) {
        this.payorType = this.relatedPayors.find(y => y.payorId == x)?.type;
        this.editForm.patchValue({ type: this.payorType });
        this.store.getPayorInfo$(x, this.payorType);        
      }
    }));

    this.addToSubscription(
      this.store.relatedPayors$.pipe(tap(x => this.relatedPayors = x))
    )

    this.addToSubscription(
      this.store.payorInfo$.pipe(tap(x => {
        if (x) {
          this.payorDetails = true;
          this.payorType = x.type;
          if (x.contactClassification) {
            this.contactClassification = x.contactClassification;
            if (this.contactClassification != 1)
              this.caption = "Name";
          }

          if (!x.address) {
            if (this.payorType == 1) {
              x.address = this.patientAddress;
              this.caption = "Name";
            }

            x.address = {
              address1: undefined, address2: undefined, address3: undefined, address4: undefined,
              addressTypeId: undefined, postcode: undefined, country: undefined
            }
          }

          if (this.payorType == 1) {
            this.editForm.controls["insRegistrationNumber"].setValidators(Validators.required);
          }
          if (this.payorType != 1 && this.contactClassification == 1) {
            this.editForm.controls["lastName"].setValidators([Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$')]);
          }

          this.fillForm(x);
        }
      }))
    )

    this.subscription.add(this.editForm.get('sendViaPatientzone').valueChanges.subscribe(x => {
      this.sendViaPatientzone = x;
      this.editForm.get('email').updateValueAndValidity();
    }))
  }

  fillForm(x) {
    this.editForm.patchValue({ firstName: x.firstName, 
      lastName: x.lastName,
      email: x.email,
      mobileNo: x.mobileNo,
      insRegistrationNumber: x.insRegistrationNumber,
      insScheme: x.insScheme,
      insRenewalDate: x.insRenewalDate,
      sendViaPatientzone: x.sendViaPatientzone });
    this.editForm.get("address").patchValue({ address1: x.address.address1,
      address2: x.address.address2,
      address3: x.address.address3,
      address4: x.address.address4,
      country: x.address.country,
      postcode: x.address.postcode,
      addressTypeId: x.address.addressTypeId });
  }

  getTemplates() {
    this.templateService.getSiteTemplates(14).subscribe(data => {
      this.templates = data;
    })
  }

  getSitePatientzone() {
    this.siteService.getSitePatientzone().subscribe(data => {
      this.isSitePatientzone = data;
    })
  }

  getAddressTypes() {
      this.siteService.getAddressTypes().subscribe((value) => {
        this.addressTypes = value;
      });   
  }

  setupForm() {
    this.editForm = new FormGroup({
      invoiceId: new FormControl(this.invoiceId),
      patientId: new FormControl(this.patientId),
      bulkPaymentTransactionId: new FormControl(this.bulkPaymentTransactionId),
      templateId: new FormControl(undefined, requiredIfValidator(() => this.payorType != 1)),
      type: new FormControl(undefined),
      payorId: new FormControl(undefined, requiredIfValidator(() => !this.checkDetails)),
      originalPayorType: new FormControl(this.store.payorType),
      amount: new FormControl(this.balanceDue, [requiredIfValidator(() => !this.checkDetails), Validators.max(this.balanceDue)]),
      firstName: new FormControl(undefined, [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$')]),
      lastName: new FormControl(undefined),
      email: new FormControl(undefined, [requiredIfValidator(() => this.sendViaPatientzone), Validators.pattern(this.appInfo.getEmailFormat()), Validators.maxLength(50)]),
      mobileNo: new FormControl(undefined, [Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/)]),
      insRegistrationNumber: new FormControl(undefined),
      insScheme: new FormControl(undefined),
      insRenewalDate: new FormControl(undefined),
      sendViaPatientzone: new FormControl(undefined),
      address: new FormGroup({
        address1: new FormControl(undefined, [Validators.required, Validators.maxLength(50)]),
        address2: new FormControl(undefined, Validators.maxLength(50)),
        address3: new FormControl(undefined, Validators.maxLength(50)),
        address4: new FormControl(undefined, Validators.maxLength(50)),
        postcode: new FormControl(undefined, [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
        addressTypeId: new FormControl(undefined, Validators.required),
      }),
    });
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

  save() {
    this.spinnerService.start()
    let model = this.getModelFromForm();

    if (this.checkDetails)
      this.dataService.updatePayorDetails(model).subscribe(x => {
        this.spinnerService.stop();
        if (x.success) {
          this.store.removePayorInfo$();
          this.editForm.reset();
          notify("Payor details updated", "success");
          this.saved.emit();
        }
        if (x.errors) {
          notify(x.errors[0], "error");
        }
      },
      (e) => {        
        this.spinnerService.stop();
        notify(e.error.errors[0], "error");
      }
      );
    else {
      this.dataService.updatePayorDetails(model).pipe(switchMap(x => this.add(model))).subscribe(x => {
        this.spinnerService.stop();
        if (x.success) {
          this.store.removePayorInfo$();
          this.editForm.reset();
          notify("Reallocation Payment Saved Successfully", "success");
          this.documentsService.openPdfInPopup({ correspondenceId: x.data.correspondenceId })
          this.saved.emit(x.data);
        }
        if (x.errors) {
          this.spinnerService.stop();
          notify(x.errors[0], "error");
        }
      },
        (e) => {
          this.spinnerService.stop();
          notify(e.error.errors[0], "error");
        }
      );
    }
  }

  add(model) {
    return this.invoicePaymentService.addPaymentNotification(model);
  }

  close() {
    this.store.removePayorInfo$();
    this.editForm.reset();
    this.closePopup.emit()
  }
}

class AddressModel {
  addressTypeId: number | null;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  country: string;
  postcode: string;
}