import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GetInvoicePayorResponseModel, InvoiceAddEditService, InvoicePayorTypeEnum } from 'src/app/pages/accounts/invoice-add-edit/invoice-add-edit.service';
import { FormControlBase } from '../../app-form/app-form-control.base';

@Component({
  selector: 'app-patient-payor-select-dropdown',
  templateUrl: './patient-payor-select-dropdown.component.html',
  styleUrls: ['./patient-payor-select-dropdown.component.scss']
})
export class PatientPayorSelectDropdownComponent extends FormControlBase implements OnInit, OnDestroy {
  @Output() payorSelected = new EventEmitter<GetInvoicePayorResponseModel>();

  @Input() payorId: string;
  @Input() showInsurers = false;
  @Input() public set patientId(value) {
    if (value) {

      this._patientId = value;
      this.subscription.add(
        this.payorsService.getPayors(value).subscribe(
          x => {
            if (!this.showInsurers) {
              x = x.filter(el => el.type !== InvoicePayorTypeEnum.Insurer);
            }
            if (this.payorId)
              x = x.filter(el => el.payorId != this.payorId);
            this.payors = x;
          }
        )
      )
    }
  }
  public get patientId() { return this._patientId; }
  private _patientId: any;

  public showEditPayorFormPopup: boolean;
  public payors: GetInvoicePayorResponseModel[];
  public selectedPayorTypeId: InvoicePayorTypeEnum;

  private subscription = new Subscription();

  constructor(@Optional() @Self() control: NgControl,
    private payorsService: InvoiceAddEditService) { super(control); }

  ngOnInit() {
  }

  payorUpdatedHandler() {
    this.showEditPayorFormPopup = false;
    this.subscription.add(
      this.getPayors$(this.patientId).subscribe());
  }

  selectPayor(payorId) {
    if (payorId.data && payorId.data.patientInsurerId)
      payorId = payorId.data.patientInsurerId;
    this.value = payorId;
    if (this.payors) {
      const payor = this.payors.find(y => y.payorId === payorId);
      if (payor.invalid) {
        this.showEditPayorPopup(payorId);
        return;
      }
    }
  }

  showEditPayorPopup(payorId, event?: MouseEvent) {
    if (event) {
      event.cancelBubble = true;
    };

    const payor = this.payors.find(y => y.payorId === payorId);
    this.selectedPayorTypeId = payor.type;
    this.showEditPayorFormPopup = true;
  }

  dropdownValueChangedHandler(e) {
    if (e.value) {
      if (this.payors) {
        const payor = this.payors.find(y => y.payorId === e.value);
        if (payor) {
          this.payorSelected.emit(payor);
        }
      }
    }
  }

  public addedPayor(payorId) {
    this.subscription.add(this.getPayors$(this.patientId).subscribe(
      () => {
        this.selectPayor(payorId);
      }
    ));
  }

  private getPayors$(patientId) {
    return this.payorsService.getPayors(patientId)
      .pipe(tap(x => {
        this.payors = x;
      }))
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
