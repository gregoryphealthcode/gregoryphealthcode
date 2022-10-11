import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Guid from 'devextreme/core/guid';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { ContactService, linkedDepartmentModel } from 'src/app/shared/services/contact.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { PostcodeToAddressResponseModel } from '../../postcode-to-address/postcode-to-address.service';

@Component({
  selector: 'edit-add-contact-department',
  templateUrl: './edit-contact-department.component.html',
  styleUrls: ['./edit-contact-department.component.scss']
})
export class EditContactDepartmentComponent extends ReactiveFormBase implements OnInit {
  constructor(
    private spinnerService: SpinnerService,
    private contactService: ContactService,
  ) {
    super();
  }

  @Input() isNew = false;
  @Input() departmentId: Guid;
  @Input() contactId: Guid;
  @Input() siteId: Guid;

  @Output() saveDepartment = new EventEmitter();
  @Output() formClosed = new EventEmitter();

  editForm: FormGroup;
  department: linkedDepartmentModel;
  contactClassification: number;

  protected httpRequest = (x) => { 
    x.contactId = this.contactId;
    if (this.isNew)
      return this.contactService.addDepartment(x);
    else {
      x.departmentId = this.departmentId;
      return this.contactService.updateDepartment(x);
    }
  }

  onSuccessfullySaved = (x) => {
    this.saveDepartment.emit(x);
   }

  ngOnInit() {
    this.setupForm();
    this.getContactDetails();
    if (!this.isNew) {
      this.getDepartmentDetails();
    }
  }

  getContactDetails() {
    this.spinnerService.start();
    this.contactService.getContactDetails(this.contactId).subscribe(x => {
      this.contactClassification = x.contactType.contactClassificationId;
      this.spinnerService.stop();
    })
  }

  getDepartmentDetails() {
    this.spinnerService.start();
    this.contactService
      .getDepartmentDetails(this.departmentId)
      .subscribe((x) => {
        this.department = x;
        super.populateForm(x);
        this.spinnerService.stop();
      });
  }

  setupForm() {
    this.editForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      contactEmail: new FormControl(null, [Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"), Validators.maxLength(50)]),
      contactNumber: new FormControl(null, [Validators.pattern('^[0-9 ]*$'), Validators.maxLength(12)]),
      postcode: new FormControl(null, [Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
      address1: new FormControl(null, Validators.maxLength(50)),
      address2: new FormControl(null, Validators.maxLength(50)),
      address3: new FormControl(null, Validators.maxLength(50)),
      address4: new FormControl(null, Validators.maxLength(50)),
      inactive: new FormControl(null, null),
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