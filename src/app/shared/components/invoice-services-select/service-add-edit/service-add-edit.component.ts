import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output, } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { BehaviorSubject, } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap, tap, } from "rxjs/operators";
import { InvoiceAddEditStoreService } from "src/app/pages/accounts/invoice-add-edit/invoice-add-edit-store.service";
import { SubscriptionBase } from "src/app/shared/base/subscribtion.base";
import { SpecialistViewModel } from "src/app/shared/models/SpecialistViewModel";
import { AppInfoService } from "src/app/shared/services";
import { EpisodeTypes, IndustryStandardCodesViewModel, UserService, } from "src/app/shared/services/user.service";
import { InvoiceServicesStoreService } from "../invoice-services-store.service";
import { GetInvoiceServiceResponseModel } from "../invoice-services.service";

@Component({
  selector: "app-service-add-edit",
  templateUrl: "./service-add-edit.component.html",
  styleUrls: ["./service-add-edit.component.scss"],
})
export class ServiceAddEditComponent extends SubscriptionBase implements OnInit, AfterContentInit {
  @Input() owners: SpecialistViewModel[];
  @Input() episodeTypes: EpisodeTypes[];
  @Input() showFee: boolean;
  @Input() appointmentId: string;
  @Output() serviceAdded = new EventEmitter();

  private searchTerms = new BehaviorSubject<string>('');

  fromAppointment = false;
  editForm: FormGroup;
  serviceTypes: IndustryStandardCodesViewModel[] = [];
  startDate: Date;
  endDate: Date;
  future = new Date();
  maxDate = this.future.setDate(this.future.getDate() + 30);
  service: GetInvoiceServiceResponseModel = new GetInvoiceServiceResponseModel();

  private serviceFee = new BehaviorSubject<number>(this.service ? this.service.fee : 0);

  constructor(
    private userService: UserService,
    private appInfo: AppInfoService,
    public store: InvoiceServicesStoreService,
    public invoiceStore: InvoiceAddEditStoreService,
  ) {
    super();
  }

  ngOnInit() {
    this.setupForm();  

    this.subscription.add(
      this.searchTerms
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap((x) => this.userService.searchIndustryCodes(x)),
          tap((x) => {
            this.serviceTypes = x;
          })
        )
        .subscribe()
    );

    this.addToSubscription(
      this.store.currentService$.pipe(tap(x => { this.service = x }))
    )

    this.subscription.add(
      this.serviceFee
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap((x) => {
            if (x !== undefined) {
              let value = Math.round((x + Number.EPSILON) * 100) / 100;
              this.service.fee = value;
            }
          })
        )
        .subscribe()
    );

    this.subscription.add(this.editForm.get('start').valueChanges.subscribe(x => {
      this.service.startTime = x;
      this.startDateUpdated(x);
    }))

    this.subscription.add(this.editForm.get('end').valueChanges.subscribe(x => {
      this.service.endTime = x;
      this.endDateUpdated(x);
    }))

    this.subscription.add(this.editForm.get('service').valueChanges.subscribe(x => {
      this.service.code = x;
      this.userService.searchIndustryCodes(x).subscribe(y => {
        this.serviceTypes = y;
        this.setService(x);
      })      
    }))

    this.subscription.add(this.editForm.get('provider').valueChanges.subscribe(x => {
      this.service.ownerId = x;
      this.ownerChanged(x);
    }))

    this.subscription.add(this.editForm.get('episode').valueChanges.subscribe(x => {
      this.service.episodeTypeId = x;
      this.episodeTypeChanged(x);
    }))

    this.subscription.add(this.editForm.get('units').valueChanges.subscribe(x => {
      this.service.units = x;
      this.unitsChanged(x);
    }))

    this.subscription.add(this.editForm.get('fee').valueChanges.subscribe(x => {
      this.service.fee = x;
      this.onFeeChanged(x);
    }))
  }

  ngAfterContentInit() {
    if (this.service) {
      this.editForm.patchValue({
        start: this.service?.startTime,
        end: this.service?.endTime,
        service: this.service?.code,
        provider: this.service?.ownerId,
        episode: this.service?.episodeTypeId,
        units: this.service?.units,
        fee: this.service?.fee,
      })
    }
  }

  public get isInvalid() {
    const hasMainDetails = this.service.startTime && this.service.endTime && this.service.episodeTypeId && this.service.ownerId && this.service.units && this.service.code;

    if (!hasMainDetails) return true;

    if (!this.showFee) return false;

    if (this.service.requiresProcedure) {
      return false; //we do need a fee now
    }

    return !(this.service.fee >= 0);
  }

  searchForIndustryCode(searchfor: string) {
    this.searchTerms.next(searchfor);
  }

  setService(e) {
    this.invoiceStore.setSectionToEdit(true);    
    this.service.requiresProcedure = this.serviceTypes.find(x => x.code == e)?.requiresProcedureCode;
  }

  startDateUpdated(e) {
    this.invoiceStore.setSectionToEdit(true);
    this.startDate = new Date(e);

    if (this.endDate) {
      if (this.startDate.getTime() > this.endDate.getTime()) {
        this.endDate = this.startDate;
        this.service.endTime = this.endDate;
      }
    }

    this.service.startTime = this.startDate;
  }

  endDateUpdated(e) {
    this.invoiceStore.setSectionToEdit(true);
    this.endDate = new Date(e);

    if (this.startDate) {
      if (this.endDate.getTime() < this.startDate.getTime()) {
        this.startDate = this.endDate;
        this.service.startTime = this.startDate;
      }
    }

    this.service.endTime = this.endDate;
  }

  getDateFormat(): string {
    return this.appInfo.getDateFormat;
  }

  calculateFee() {
    this.invoiceStore.setSectionToEdit(true);
    return this.store.getFee(this.service);
  }

  saveHandler() {
    this.serviceAdded.emit();
  }

  onFeeChanged(e) {
    this.invoiceStore.setSectionToEdit(true);
    this.serviceFee.next(e);
  }

  ownerChanged(e) {
    this.invoiceStore.setSectionToEdit(true);
  }

  episodeTypeChanged(e) {
    this.invoiceStore.setSectionToEdit(true);
  }

  unitsChanged(e) {
    this.invoiceStore.setSectionToEdit(true);
  }

  setupForm() {
    this.editForm = new FormGroup({
      start: new FormControl(null),
      end: new FormControl(null),
      service: new FormControl(null),
      provider: new FormControl(null),
      episode: new FormControl(null),
      units: new FormControl(1),
      fee: new FormControl(0),
    });
  }
}