import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { Component, OnInit, Input, EventEmitter, Output, } from "@angular/core";
import { SitesService } from "src/app/shared/services/sites.service";
import { SpinnerService } from "src/app/shared/services/spinner.service";
import { MatDialog } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ContactService, TelecomsViewModel, } from "src/app/shared/services/contact.service";
import { DialogTemplateComponent } from "../../dialog/dialog-template.component";
import Guid from "devextreme/core/guid";
import { ReactiveFormBase } from "src/app/shared/base/reactiveForm.base";
import { AppInfoService, TelecomTypes } from "src/app/shared/services";

@Component({
  selector: "app-contact-telecom-edit",
  templateUrl: "./contact-telecom-edit.component.html",
  styleUrls: ["./contact-telecom-edit.component.scss"],
})
@AutoUnsubscribe
export class ContactTelecomEditComponent extends ReactiveFormBase implements OnInit {
  @Input() isNew = false;
  @Input() telecomId: Guid;
  @Input() contactId: Guid;
  @Input() siteId: Guid;
  @Input() telecoms: TelecomsViewModel[];
  @Input() isOrganisation: boolean;

  @Output() saveTelecom = new EventEmitter();
  @Output() deleteTelecom = new EventEmitter();
  @Output() formClosed = new EventEmitter();

  editForm: FormGroup;
  telecomTypes: TelecomTypes[] = [];
  telecom: TelecomsViewModel;
  caption: string = "Value";

  constructor(
    private siteService: SitesService,
    private spinnerService: SpinnerService,
    private contactService: ContactService,
    private dialog: MatDialog,
    private appInfo: AppInfoService
  ) {
    super();
  }

  get value() {
    return this.editForm.get('value') as FormControl;
  }

  protected httpRequest = (x) => {
    x.contactId = this.contactId;
    if (this.isNew)
      return this.contactService.addContactTelecom(x);
    else {
      x.telecomId = this.telecomId;
      return this.contactService.updateContactTelecom(x);
    }
  };

  onSuccessfullySaved = (x) => {
    this.saveTelecom.emit(x);
  };

  ngOnInit(): void {
    this.getTelecomTypes();
    this.setupForm();

    this.subscription.add(this.editForm.get('type').valueChanges.subscribe(x => {
      this.checkPrimary(x);
      switch (x) {
        case 4:
          this.editForm.get('value').setValidators([Validators.required, Validators.pattern(this.appInfo.getEmailFormat()), Validators.maxLength(50)]);
          this.caption = "Email address";
          break;
        case 6:
          this.editForm.get('value').setValidators([Validators.required, Validators.maxLength(50)]);
          this.caption = "Website address";
          break;
        default:
          this.editForm.get('value').setValidators([Validators.required, Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/)]);
          this.caption = "Number";
          break;
      }
    }));
  }

  getTelecomTypes() {
    this.siteService.getContactTelecomTypes().subscribe((value) => {
      if (!this.isOrganisation) {
        this.telecomTypes = value.filter((x) => x.isOrganisation === false);
      }
      else {
        this.telecomTypes = value.filter((x) => x.isOrganisation === true);
      }
    })
  }

  getTelecomDetails() {
    this.spinnerService.start();
    this.contactService.getContactTelecomDetails(this.telecomId).subscribe((x) => {
      this.telecom = x;
      this.populateForm(x);
      this.spinnerService.stop();
    });
  }

  setupForm() {
    this.editForm = new FormGroup({
      type: new FormControl(null, Validators.required),
      value: new FormControl(null, Validators.required),
      preferred: new FormControl(null, null),
      primary: new FormControl(null, null)
    });

    if (!this.isNew) {
      this.getTelecomDetails();
    }
  }

  checkPrimary(type) {
    if (this.telecoms.filter(x => x.type == type).length == 0) {
      this.editForm.patchValue({ primary: true });
      this.editForm.get("primary").disable();
    }
  }

  discard() {
    this.formClosed.emit();
  }

  delete() {
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogTemplateComponent, {
      width: "250px",
      data: {
        title: "Are you sure?",
        message: "Are you sure you want to delete this contact detail?",
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteTelecom.emit(this.telecomId);
      }
    });
  }
}
