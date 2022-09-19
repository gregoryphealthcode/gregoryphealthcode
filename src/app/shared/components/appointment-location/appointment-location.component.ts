import { AppInfoService } from '../../services';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { PostcodeToAddressResponseModel } from '../postcode-to-address/postcode-to-address.service';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';

@Component({
  selector: 'app-appointment-location',
  templateUrl: './appointment-location.component.html',
  styleUrls: ['./appointment-location.component.scss'],
  providers: [AppInfoService],
})

@AutoUnsubscribe
export class AppointmentLocationComponent extends ReactiveFormBase implements OnInit {
  constructor(
    public appInfo: AppInfoService,
    private appointmentService: AppointmentService,
  ) {
    super();    
  }

  @Input() public siteId: string;
  @Input() isNew: boolean;

  @Output() formClosed = new EventEmitter();

  editForm: FormGroup;
  postcode: string;

  protected httpRequest = (x) => {
    if (this.isNew)
    return this.appointmentService.addAppointmentLocation(x);
  };

  onSuccessfullySaved = (x) => {
    this.formClosed.emit();
  };

  ngOnInit() {
    this.setupForm();
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

  private setupForm() {
    this.editForm = new FormGroup({
      locationName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      hcCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      address1: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      address2: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      address3: new FormControl(null, Validators.maxLength(50)),
      address4: new FormControl(null, Validators.maxLength(50)),
      postcode: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
    });
  }
}
