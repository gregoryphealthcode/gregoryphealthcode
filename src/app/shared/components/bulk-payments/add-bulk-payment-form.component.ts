import { Component, EventEmitter, OnInit, Output, } from "@angular/core";
import { AppInfoService } from "src/app/shared/services";
import { BillingService, PayorModel } from "src/app/shared/services/billing.service";
import { GenericViewModel, MethodTypeModel, UserService } from "src/app/shared/services/user.service";
import { UserStore } from "src/app/shared/stores/user.store";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PopupReactiveFormBase } from "../../base/popupReactiveForm.base";
import DataSource from "devextreme/data/data_source";
import { ContactService } from "../../services/contact.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-add-bulk-payment-form",
  templateUrl: "./add-bulk-payment-form.component.html",
  styleUrls: ["./add-bulk-payment-form.component.scss"],
})
export class AddBulkPaymentFormComponent extends PopupReactiveFormBase implements OnInit {
  public methods: MethodTypeModel[] = [];
  public payors: DataSource;
  public payorList: PayorModel[] = [];
  public payorType = [
    { value: 'insurer', viewValue: 'Insurer', subValue: 'insurer' },
    { value: 'patient', viewValue: 'Patient', subValue: 'patient' },
    { value: 'related', viewValue: 'Related Person', subValue: 'related' },
  ];

  constructor(
    public appInfo: AppInfoService,
    public userStore: UserStore,
    private siteService: UserService,
    private billingService: BillingService,
    private contactService: ContactService, private authService: AuthService,

  ) {
    super();
  }

  protected controllerName = "bulkPayments";
  protected onOpened = (data) => {
    this.getContactTypes();
    this.getMethodTypes();
    this.setupForm();
    this.setup(data);
  };

  ngOnInit() {
    this.getMethodTypes();
    this.setupForm();
  }

  getContactTypes() {
    this.contactService.getLocalContactTypes(null).subscribe(x => {
      if (x) {
        x.forEach(type => {
          this.payorType.push({ value: type.typeDescription.toLowerCase(), viewValue: type.description, subValue: 'contact' });
        });
      }
    })
  }

  getMethodTypes() {
    return this.siteService.getPaymentMethodTypes().subscribe(x => {
      this.methods = x;
    });
  }

  setupForm() {
    this.editForm = new FormGroup({
      type: new FormControl("", [Validators.required]),
      payorId: new FormControl("", [Validators.required]),
      payorName: new FormControl(null),
      payorType: new FormControl(null),
      dateCreated: new FormControl(null, [Validators.required]),
      total: new FormControl(0, [Validators.required]),
      methodId: new FormControl(null, [Validators.required]),
      payorRef: new FormControl("", [Validators.maxLength(50)]),
      comments: new FormControl("", [Validators.maxLength(500)])
    })

    this.subscription.add(this.editForm.get('type').valueChanges.subscribe(x => {
      if (x) {
        const sub = this.payorType.find(y => y.value == x)?.subValue;
        this.billingService.getPayors(x, sub).subscribe(data => {
          this.payorList = data;
          this.payorList.sort(function (a, b) {
            if (a.payorName < b.payorName) return -1;
            if (a.payorName > b.payorName) { return 1; }
            return 0;
          })

          this.payors = new DataSource({
            store: {
              data: this.payorList,
              type: 'array',
            },
            paginate: true,
            pageSize: 50,
          })
        });
      }
    }
    ));

    this.subscription.add(this.editForm.get('payorId').valueChanges.subscribe(x => {
      if (x) {
        this.editForm.patchValue({ payorName: this.payorList.find(y => y.payorId == x)?.payorName });
        this.editForm.patchValue({ payorType: this.payorList.find(y => y.payorId == x)?.payorType });
      }
    }));
  }

  protected populateForm(model: any): void {
    super.populateForm(model);
    this.editForm.patchValue({ dateCreated: new Date() });
  }

  closeForm() {
    this.unselectSite();
  }

  private unselectSite() {
    if (this.userStore.isMedSecUser()) {
      this.subscription.add(
        this.authService.unselectSite().subscribe(() => {
          super.closeForm();
        })
      );
    } else {
      super.closeForm();
    }
  }
}
