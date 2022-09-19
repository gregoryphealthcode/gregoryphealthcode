import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { MatDialog } from '@angular/material/dialog';
import { SitesService } from 'src/app/shared/services/sites.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppInfoService, PatientTelecom, TelecomTypes } from 'src/app/shared/services';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientService } from 'src/app/shared/services/patient.service';
import { DialogTemplateComponent } from 'src/app/shared/components/dialog/dialog-template.component';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import Guid from 'devextreme/core/guid';

@Component({
  selector: 'app-patient-telecoms-edit',
  templateUrl: './patient-telecoms-edit.component.html',
  styleUrls: ['./patient-telecoms-edit.component.scss']

})

@AutoUnsubscribe
export class PatientTelecomsEditComponent extends ReactiveFormBase implements OnInit {
  @Input() telecomId: string;
  @Input() telecoms: PatientTelecom[];
  @Input() patientId: Guid;
  @Input() isNew: boolean;

  @Output() saveTelecom = new EventEmitter();
  @Output() formClosed = new EventEmitter();

  editForm: FormGroup;
  telecomTypes: TelecomTypes[] = [];
  telecom: PatientTelecom;
  caption: string = "Value";
  telecomType: string = "";

  constructor(
    private siteService: SitesService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private patientService: PatientService,
    private dialog: MatDialog,
    private appMessage: AppMessagesService,
    private appInfo: AppInfoService
  ) {
    super();
  }

  protected httpRequest = x => {
    x.patientId = this.patientId;
    if (this.isNew)
      return this.patientService.addPatientTelecom(x);
    else {
      x.telecomId = this.telecom.telecomId;
      return this.patientService.updatePatientTelecom(x);
    }
  };

  onSuccessfullySaved = (x) => {
    this.saveTelecom.emit(true);
  };

  ngOnInit(): void {
    this.getTelecomTypes();
    this.setupForm();

    if (!this.isNew) {
      this.getTelecomDetails();
    }

      this.subscription.add(this.editForm.get('telecomTypeId').valueChanges.subscribe(x => {
        this.checkPrimary(x);
        let type = this.telecomTypes.find(y => y.uniqueNo == x).telecomType;
        switch (type) {
          case 4:
            this.editForm.get('telecomValue').setValidators([Validators.required, Validators.pattern(this.appInfo.getEmailFormat()), Validators.maxLength(50)]);
            this.caption = "Email address";
            break;
          case 6:
            this.editForm.get('telecomValue').setValidators([Validators.required, Validators.maxLength(50)]);
            this.caption = "Website address";
            break;
          default:
            this.editForm.get('telecomValue').setValidators([Validators.required, Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/)]);
            this.caption = "Number";
            break;
        }
      }));
  }

  getTelecomTypes() {
    this.siteService.getTelecomTypes().subscribe(data => {
      this.telecomTypes = data;      
    });
  }

  setupForm() {
    this.editForm = new FormGroup({
      telecomTypeId: new FormControl(null, [Validators.required]),
      telecomValue: new FormControl(null, [Validators.required]),
      preferred: new FormControl(null, null),
      primary: new FormControl(null, null)
    });
  }

  getTelecomDetails() {
    this.spinnerService.start();
    this.patientService
      .getPatientTelecomDetails(this.telecomId)
      .subscribe((x) => {
        this.telecom = x;
        super.populateForm(x);
        this.spinnerService.stop();
      });
  }

  checkPrimary(type) {
    if (this.telecoms.filter(x => x.telecomTypeId == type).length == 0) {
      this.editForm.patchValue({ primary: true });
      this.editForm.get("primary").disable();
    }
  }

  populateForm(value) {
    super.populateForm(value);
  }

  discard() {
    this.editForm.reset();
  }
}
