import { ChangeDetectorRef, Directive, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ReactiveFormBase } from "../../base/reactiveForm.base";
import { requiredIfValidator } from "../../helpers/form-helper";
import { AppInfoService } from "../../services";
import { InsurersViewModel, MethodTypeModel, UserService } from "../../services/user.service";
import { UserStore } from "../../stores/user.store";
import { tap } from "rxjs/operators";
import { PayorModel } from "../../services/billing.service";

@Directive()
export abstract class AddEditBulkPaymentBase extends ReactiveFormBase implements OnInit {
  @Input() siteId;

  public lluInvoiceTypes: any[] = [];
  public methods: MethodTypeModel[] = [];
  public payors: PayorModel[] = [];
  public payorName: string;

  constructor(
    private changeDetRef: ChangeDetectorRef,
    public appInfo: AppInfoService,
    private siteService: UserService,
    public userStore: UserStore
  ) {
    super();
  }

  ngOnInit() {
    this.getInsurers$();
    this.setupForm();
    this.getMethodTypes$();
    this.getInsurers$();
  }

  private setupForm() {
    this.editForm = new FormGroup({
      bulkPaymentId: new FormControl(null),
      payorType: new FormControl("", [Validators.required]),
      dateCreated: new FormControl(null, [Validators.required]),
      payorId: new FormControl("", [Validators.required]),
      payorName: new FormControl("", [Validators.required]),
      siteId: new FormControl("", [requiredIfValidator(() => this.isNewAndMedsecUser)]),
      total: new FormControl(0, [Validators.required]),
      allocated: new FormControl(0),
      unallocated: new FormControl(0),
      shortFalls: new FormControl(0),
      methodId: new FormControl(null),
      payorRef: new FormControl("", [Validators.maxLength(10)]),
      comments: new FormControl("", [Validators.maxLength(500)])
    })
  }

  public get isNewAndMedsecUser() {
    return this.isNew && this.userStore.isMedSecUser();
  }

  protected getMethodTypes$() {
    this.siteService.getPaymentMethodTypes().subscribe(x => {
      this.methods = x;
    });
  }

  private getInsurers$() {
    this.siteService.getSitePayors().subscribe(data => {
      this.payors = data;
      const payorId = this.getFormPropertyValue('payorId');
      if (payorId) {
        this.payorName = this.payors.find(i => i.payorId === payorId)?.payorName;
      }

      this.changeDetRef.detectChanges();
    })
  }
}
