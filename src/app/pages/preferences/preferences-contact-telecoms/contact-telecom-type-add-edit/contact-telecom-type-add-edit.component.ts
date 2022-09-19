import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { ContactTelecomTypeService } from '../contact-telecom-type.service';

@Component({
  selector: 'app-contact-telecom-type-add-edit',
  templateUrl: './contact-telecom-type-add-edit.component.html',
  styleUrls: ['./contact-telecom-type-add-edit.component.scss']
})
export class ContactTelecomTypeAddEditComponent extends PopupReactiveFormBase implements OnInit {
  types: any[];

  protected controllerName = "contactTelecomTypes";
  protected onOpened = (data) => {
    this.getDropdownsData();
    this.setup(data);
  };

  constructor(
    private dataService: ContactTelecomTypeService, public appInfo: AppInfoService
  ) {
    super()
  }

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    this.editForm = new FormGroup({
      alwaysAdd: new FormControl(undefined),
      description: new FormControl(undefined, Validators.maxLength(25)),
      typeId: new FormControl(undefined),
      isOrganisation: new FormControl(undefined),
      id: new FormControl(undefined),
    });
  }

  private getDropdownsData() {
    this.addToSubscription(
      this.dataService.getGlobalContactTelecomTypes().pipe(tap(
        x => this.types = x
      ))
    )
  }
}