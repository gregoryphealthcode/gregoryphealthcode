import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RelatedPersonsViewModel, RelatedPersonService } from '../../services/related-person.service';
import { AppInfoService, TitlesViewModel } from '../../services';
import { PostcodeToAddressResponseModel } from '../postcode-to-address/postcode-to-address.service';
import { RelatedPersonsTypeViewModel, SitesService } from '../../services/sites.service';
import Guid from 'devextreme/core/guid';
import { ReactiveFormBase } from '../../base/reactiveForm.base';
import { SitesStore } from '../../stores/sites.store';
import { requiredIfValidator } from '../../helpers/form-helper';

@Component({

  selector: 'app-related-persons-edit',
  templateUrl: './related-persons-edit.component.html',
  styleUrls: ['./related-persons-edit.component.scss']
})

@AutoUnsubscribe
export class RelatedPersonsEditComponent extends ReactiveFormBase implements OnInit {
  constructor(
    public appInfo: AppInfoService,
    private siteService: SitesService,
    private relatedPersonsService: RelatedPersonService,
    private siteStore: SitesStore,
  ) {
    super();
  }

  @Input() relatedPersonId: Guid;
  @Input() patientId: Guid;
  @Input() isEdit: boolean;

  @Input() public set fromInvoice(value) {
    if (value) {
      this._fromInvoice = value;
      this.payor = value;
    }
  }
  public get fromInvoice() { return this._fromInvoice; }
  private _fromInvoice: boolean;

  gluRelatedPersonTypes: RelatedPersonsTypeViewModel[] = [];
  relatedPersonDetails: RelatedPersonsViewModel;
  editForm: FormGroup;
  titles: TitlesViewModel[] = [];
  title: string;
  postcode: string;
  sendViaPatientzone = true;
  payor = false;
  isSitePatientzone: boolean;
  addressNeeded = false;

  httpRequest = x => {
    if (this.isEdit) {
      x.relatedPersonId = this.relatedPersonId;
      return this.relatedPersonsService.updateRelatedPerson(x);
    }
    else {
      x.patientId = this.patientId;
      return this.relatedPersonsService.addRelatedPerson(x);
    }
  }

  ngOnInit(): void {
    if (this.isEdit)
      this.title = "Edit Related Person";
    else
      this.title = "Add Related Person";

    this.getSitePatientzone();
    this.getTitles();
    this.getRelatedPersonTypes();
    this.setupForm();

    if (this.relatedPersonId) {
      this.relatedPersonsService.getRelatedPersonDetails(this.relatedPersonId).subscribe(x => {
        this.relatedPersonDetails = x;
        this.populateForm(this.relatedPersonDetails);
      })
    }

    this.subscription.add(this.editForm.get('postcode').valueChanges.subscribe(x => {
      this.postcode = x;
      if (x && x.length > 0)
        this.addressNeeded = true;
      else
        this.addressNeeded = false;

      this.updateControls();
    }));

    this.subscription.add(this.editForm.get('sendViaPatientzone').valueChanges.subscribe(x => {
      this.sendViaPatientzone = x;

      this.updateControls();
    }));

    this.subscription.add(this.editForm.get('isPayor').valueChanges.subscribe(x => {
      this.payor = x;

      this.updateControls();
    }));

    this.subscription.add(this.editForm.get("address1").valueChanges.subscribe(x => {
      if (x && x.length > 0)
        this.addressNeeded = true;
      else
        this.addressNeeded = false;

      this.updateControls();
    }));
  }

  updateControls() {
    this.editForm.controls.address1.updateValueAndValidity({ emitEvent: false });
    this.editForm.controls.postcode.updateValueAndValidity({ emitEvent: false });
    this.editForm.controls.email.updateValueAndValidity({ emitEvent: false });
  }

  getSitePatientzone() {
    this.siteService.getSitePatientzone().subscribe(data => {
      this.isSitePatientzone = data;
    })
  }

  protected getTitles() {
    this.subscription.add(this.siteService.getTitlesForSite().subscribe(data => {
      this.titles = data;
      this.titles.sort(function (a, b) {
        if (a.title < b.title) return -1;
        if (a.title > b.title) { return 1; }
        return 0;
      });
    }));
  }

  getRelatedPersonTypes() {
    this.subscription.add(this.siteService.getRelatedPersonTypes().subscribe(x => {
      this.gluRelatedPersonTypes = x;
      this.gluRelatedPersonTypes.sort(function (a, b) {
        if (a.description < b.description) return -1;
        if (a.description > b.description) { return 1; }
        return 0;
      });
    }));
  }

  populateForm(x) {
    super.populateForm(x)
  }

  private setupForm() {
    this.editForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 \'-]*$')]),
      lastName: new FormControl(null, [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 \'-]*$')]),
      title: new FormControl(null, null),
      email: new FormControl(null, [requiredIfValidator(() => this.fromInvoice || (this.payor && this.sendViaPatientzone)), Validators.pattern(this.appInfo.getEmailFormat()), Validators.maxLength(50)]),
      address1: new FormControl(null, [requiredIfValidator(() => this.fromInvoice || this.payor || this.addressNeeded), Validators.maxLength(50)]),
      address2: new FormControl(null, Validators.maxLength(50)),
      address3: new FormControl(null, Validators.maxLength(50)),
      address4: new FormControl(null, Validators.maxLength(50)),
      postcode: new FormControl(null, [requiredIfValidator(() => this.fromInvoice || this.payor || this.addressNeeded), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
      contactNumber: new FormControl(null, [Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/)]),
      comments: new FormControl(null, Validators.compose([Validators.maxLength(200)])),
      sendViaPatientzone: new FormControl(true, null),
      isPayor: this.fromInvoice ? new FormControl(true, null) : new FormControl(false, null),
      relationshipToPatient: new FormControl(null, Validators.compose([Validators.required]))
    });
  }

  postcodeResolverAddressSelectHandler(value: PostcodeToAddressResponseModel) {
    this.updateFormAddressLines(value.line_1, value.post_Town, value.line_2, value.county);
  }

  private updateFormAddressLines(line1: string, line2: string, line3: string, line4: string) {
    this.editForm.patchValue({ address1: line1 });
    this.editForm.patchValue({ address2: line2 });
    this.editForm.patchValue({ address3: line3 });
    this.editForm.patchValue({ address4: line4 });
  }
}
