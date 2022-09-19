import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ReactiveFormBase } from "src/app/shared/base/reactiveForm.base";
import { AppInfoService } from "src/app/shared/services/app-info.service";
import { NewPayorModel, PricingMatrixService } from "src/app/shared/services/pricing-matrix.service";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";

@Component({
  selector: 'app-accounts-guideline-pricing-add-payor',
  templateUrl: 'accounts-guideline-pricing-add-payor.component.html',
  styleUrls: ['accounts-guideline-pricing-add-payor.component.scss']
})

@AutoUnsubscribe
export class AccountsGuidelinePricingAddPayorComponent extends ReactiveFormBase implements OnInit {
  @Output() closePopup = new EventEmitter()

  payorTypes: string[] = [
    "Contact",
    "Insurer",
  ];

  type: string;

  dataSource: NewPayorModel[] = [];

  contacts: NewPayorModel[] = [];
  insurers: NewPayorModel[] = [];

  constructor(
    private pricingMatrixService: PricingMatrixService, public appInfo: AppInfoService
  ) {
    super();
  }

  protected httpRequest = x => {
    if (this.type == "Contact")
      return this.pricingMatrixService.addManagedContactPayor(x);

    if (this.type == "Insurer")
      return this.pricingMatrixService.addManagedInsurerPayor(x);
  };

  ngOnInit() {
    this.getInsurers();
    this.getContacts();
    this.setupForm();

    this.subscription.add(
      this.editForm.get("type").valueChanges.subscribe(x => {
        this.type = x;
        if (this.type == "Contact") {
          this.contacts.sort(function (a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) { return 1; }
            return 0;
          })
          this.dataSource = this.contacts;
        }
        if (this.type == "Insurer") {
          this.insurers.sort(function (a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          })
          this.dataSource = this.insurers;
        }
      })
    );
  }

  setupForm() {
    this.editForm = new FormGroup({
      type: new FormControl(null, Validators.required),
      id: new FormControl(null, Validators.required),
    });
  }

  getInsurers() {
    this.pricingMatrixService.getPayorInsurers().subscribe(data => {
      this.insurers = data;
    })
  }

  getContacts() {
    this.pricingMatrixService.getPayorContacts().subscribe(data => {
      this.contacts = data;
    })
  }
}