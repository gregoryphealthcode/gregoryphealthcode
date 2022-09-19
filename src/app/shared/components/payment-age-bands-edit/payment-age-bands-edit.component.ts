import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { PopupReactiveFormBase } from '../../base/popupReactiveForm.base';

@Component({
  selector: 'app-payment-age-bands-edit',
  templateUrl: './payment-age-bands-edit.component.html',
  styleUrls: ['./payment-age-bands-edit.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})

@AutoUnsubscribe
export class PaymentAgeBandsEditComponent extends PopupReactiveFormBase implements OnInit {

  protected controllerName = "paymentAge";
  protected onOpened = (data) => {
    this.setup(data);
  };

  constructor(
  ) {
    super();
  }

  ngOnInit(): void {
    this.setupForm();
  }

  setupForm() {
    this.editForm = new FormGroup({
      paymentAgeId:  new FormControl(undefined),
      description: new FormControl(undefined),
      band1Start: new FormControl(undefined),
      band1End: new FormControl(undefined),
      band2Start: new FormControl(undefined),
      band2End: new FormControl(undefined),
      band3Start: new FormControl(undefined),
      band3End: new FormControl(undefined),
      band4Start: new FormControl(undefined),
      band4End: new FormControl(undefined)
    });
  }
}
