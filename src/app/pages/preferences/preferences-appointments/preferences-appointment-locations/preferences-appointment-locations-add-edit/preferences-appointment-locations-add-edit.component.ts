import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { PostcodeToAddressResponseModel } from 'src/app/shared/components/postcode-to-address/postcode-to-address.service';

@Component({
  selector: 'app-preferences-appointment-locations-add-edit',
  templateUrl: './preferences-appointment-locations-add-edit.component.html',
  styleUrls: ['./preferences-appointment-locations-add-edit.component.scss']
})
export class PreferencesAppointmentLocationsAddEditComponent extends PopupReactiveFormBase implements OnInit {
 
  constructor(

  ) {
    super();
  }

  protected controllerName = "appointmentLocations";
  protected onOpened = (data) => {
    this.setupForm();
    this.setup(data);
  };

  ngOnInit() {
  }

  private setupForm() {
    this.editForm = new FormGroup({
      locationId: new FormControl(null),
      locationName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      //hcCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      address1: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      address2: new FormControl(null, Validators.maxLength(50)),
      address3: new FormControl(null, Validators.maxLength(50)),
      address4: new FormControl(null, Validators.maxLength(50)),
      postcode: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
      active: new FormControl(true)
    });
  }

  postcodeResolverAddressSelectHandler(value: PostcodeToAddressResponseModel) {
    this.updateFormAddressLines(value.line_1, value.post_Town, value.line_3, value.county);
  }

  private updateFormAddressLines(line1: string, line2: string, line3: string, line4: string) {
    this.editForm.patchValue({ address1: line1 });
    this.editForm.patchValue({ address2: line2 });
    this.editForm.patchValue({ address3: line3 });
    this.editForm.patchValue({ address4: line4 });
  }
}