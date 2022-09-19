import { Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import Guid from 'devextreme/core/guid';
import { Subscription } from 'rxjs';
import { InvoicePayorTypeEnum } from 'src/app/pages/accounts/invoice-add-edit/invoice-add-edit.service';
import { PatientTelecom } from 'src/app/shared/services';
import { PatientService } from 'src/app/shared/services/patient.service';
import { FormControlBase } from '../../app-form/app-form-control.base';

@Component({
  selector: 'app-patient-telecom-select-dropdown',
  templateUrl: './patient-telecom-select-dropdown.component.html',
  styleUrls: ['./patient-telecom-select-dropdown.component.scss']
})
export class PatientTelecomSelectDropdownComponent extends FormControlBase implements OnInit, OnDestroy {
  @Output() patientTelecomSelected = new EventEmitter<PatientTelecom>();
  selectedItem: Guid;

  @Input() public set patientId(value) {
    if (value) {
      this._patientId = value;
      this.subscription.add(
        this.patientService.getPatientPhoneNumbers(value).subscribe(
          x => {
            this.patientTelecoms = x;
            this.selectedItem = x.find(x => x.primary === true).telecomId;
          }
        )
      )
    }
  }
  public get patientId() { return this._patientId; }
  private _patientId: any;

  public patientTelecoms: PatientTelecom[];
  public selectedPayorTypeId: InvoicePayorTypeEnum;

  private subscription = new Subscription();
  constructor(@Optional() @Self() control: NgControl,
    private patientService: PatientService) {
    super(control);
  }

  ngOnInit() {
  }

  dropdownValueChangedHandler(e) {
    if (e.value) {
      if (this.patientTelecoms) {
        const selectedItem = this.patientTelecoms.find(y => y.telecomId === e.value);
        if (selectedItem) {
          this.patientTelecomSelected.emit(selectedItem);
        }
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

