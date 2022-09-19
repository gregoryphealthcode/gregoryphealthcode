import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { ContactService } from 'src/app/shared/services/contact.service';

@Component({
  selector: 'app-contact-type-add-edit',
  templateUrl: './contact-type-add-edit.component.html',
  styleUrls: ['./contact-type-add-edit.component.scss']
})
export class ContactTypeAddEditComponent extends PopupReactiveFormBase implements OnInit {
  globalContactTypes: any[];

  constructor(
    private contactService: ContactService, public appInfo: AppInfoService
  ) {
    super()
  }

  protected controllerName = "contactTypes";
  protected onOpened = (data) => {
    this.getDropdownsData();
    this.setup(data);
    if (this.isNew)
      this.patch();
  };

  ngOnInit() {
    this.getDropdownsData();
    this.setupForm();
  }

  private setupForm() {
    this.editForm = new FormGroup({
      id: new FormControl(undefined),
      typeId: new FormControl(undefined, Validators.required),
      description: new FormControl(undefined, Validators.required),
      backgroundColor: new FormControl(undefined, Validators.required),
      active: new FormControl(true),
    });
  }

  patch() {
    this.editForm.patchValue({ id: null });
    this.editForm.patchValue({ active: true });
  }


  private getDropdownsData() {
    this.addToSubscription(
      this.contactService.getGlobalContactTypes().pipe(tap(
        x => this.globalContactTypes = x
      ))
    )
  }
}