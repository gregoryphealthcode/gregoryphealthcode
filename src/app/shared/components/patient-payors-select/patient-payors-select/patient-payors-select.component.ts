import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { tap } from "rxjs/operators";
import { GetInvoicePayorResponseModel, InvoiceAddEditService, } from "src/app/pages/accounts/invoice-add-edit/invoice-add-edit.service";
import { SubscriptionBase } from "src/app/shared/base/subscribtion.base";
import { AppInfoService } from "src/app/shared/services";
import { AppMessagesService } from "src/app/shared/services/app-messages.service";
import { GetPatientQuickDetailsResponse, PatientService } from "src/app/shared/services/patient.service";

@Component({
  selector: "app-patient-payors-select",
  templateUrl: "./patient-payors-select.component.html",
  styleUrls: ["./patient-payors-select.component.scss"],
})
export class PatientPayorsSelectComponent extends SubscriptionBase implements OnInit {
  @Output() payorSelected = new EventEmitter<GetInvoicePayorResponseModel>();

  @Input() public set patientId(value) {
    if (value) {
      this._patientId = value;
      this.subscription.add(this.getPayors$(value).subscribe());
      this.addToSubscription(this.patientService.getPatientQuickDetails(value).pipe(tap(x => this.patient = x)))
    }
  }
  public get patientId() {
    return this._patientId;
  }
  private _patientId: any;

  nextIndex = 0;
  previousIndex = 0;
  showNextButton: boolean;
  showPreviousButton = false;

  disableButton = true;

  public showPatientDetailsPopup: boolean;
  public showEditPayorFormPopup: boolean;
  public showRelatedEdit: boolean;
  public patient: GetPatientQuickDetailsResponse;

  selectedItem: GetInvoicePayorResponseModel;
  payors: GetInvoicePayorResponseModel[];
  slides: GetInvoicePayorResponseModel[] = [];

  constructor(
    private dataService: InvoiceAddEditService,
    private appMessage: AppMessagesService,
    public appInfo: AppInfoService,
    private patientService: PatientService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.patientId) {
      this.getPatientPayorsAndDetails();
    }
  }

  getPatientPayorsAndDetails() {
    this.dataService.getPayors(this.patientId).pipe(tap(x => {
      this.payors = x;
      const chunkSize = this.payors.length > 3 ? 3 : this.payors.length;
      this.chunk(this.payors, chunkSize);
    })).subscribe();

    this.patientService.getPatientQuickDetails(this.patientId).pipe(tap(x => {
      this.patient = x
    })).subscribe();
  }

  private getPayors$(patientId) {
    return this.dataService
      .getPayors(patientId)
      .pipe(tap(x => {
        this.payors = x;
        const chunkSize = this.payors.length > 3 ? 3 : this.payors.length;
        this.chunk(this.payors, chunkSize);
      }))
  }

  showEditPayorPopup(payor: GetInvoicePayorResponseModel, event?: MouseEvent) {
    if (event) {
      event.cancelBubble = true;
    };

    this.selectedItem = payor;
    this.showEditPayorFormPopup = true;
  }

  payorUpdatedHandler() {
    this.subscription.add(this.getPayors$(this.patientId).subscribe(
      x => {
        if (this.selectedItem) {
          this.selectedItem = x.find(y => y.payorId === this.selectedItem.payorId);
          this.payorSelected.emit(this.selectedItem);
          this.showEditPayorFormPopup = false;
          return;
        }
      }
    ));
  }

  public addedPayor(payorId) {
    this.subscription.add(this.getPayors$(this.patientId).subscribe(
      () => {
        const selectedItem = this.payors.find(y => y.payorId === payorId);
        this.selectPayor(selectedItem);
      }
    ));
  }

  selectPayor(payor: GetInvoicePayorResponseModel) {
    if (payor.invalid) {
      this.showEditPayorPopup(payor);
      return;
    }

    this.payorSelected.emit(payor);
  }


  choosePayor(payor: GetInvoicePayorResponseModel) {
    if (this.showPatientDetailsPopup === true
    ) {
      return;
    }

    if (payor.type === 2 && this.patient.age < 18) {
      this.warnUnderage(payor);
    } else {
      this.selectPayor(payor);
    }
  }

  nextInsurer(next) {
    this.slides.shift();
    this.slides.push(this.payors[next]);
    this.nextIndex = next + 1;
    this.previousIndex = this.previousIndex + 1;
    this.showButtons();
  }

  previousInsurer(previous) {
    this.slides.pop();
    this.slides.unshift(this.payors[previous - 1]);
    this.previousIndex = previous - 1;
    this.nextIndex = this.nextIndex - 1;
    this.showButtons();
  }


  showButtons() {
    this.showNextButton = this.payors.length > this.nextIndex;
    this.showPreviousButton = this.slides[0].payorId !== this.payors[0].payorId;
  }

  public refreshList() {
    this.subscription.add(
      this.getPayors$(this.patientId)
        .subscribe()
    )
  }

  chunk(arr: any, chunkSize: any) {
    this.slides = [];
    for (let i = 0; i < chunkSize; i += 1) {
      this.slides.push(arr[i]);
    }
    this.nextIndex = chunkSize;
    this.showNextButton = arr.length > chunkSize;
  }
  warnUnderage(value) {
    const text = `This patient is underage. Are you sure you want to invoice them?`;
    this.appMessage.showAskForConfirmationModal(
      `Invoice Patient`,
      text,
      () => this.selectPayor(value),
      () => { }
    );
    return;
  }

  needsRenewal(e : Date | null) {
    if (e && new Date(e).getTime() <= new Date().getTime())
      return true;

    return false;
  }

  needsRenewalLabel(e : Date | null) {
    if (e && new Date(e).getTime() <= new Date().getTime())
      return "Policy lapsed on";

    return "Policy lapses on";
  }
}
