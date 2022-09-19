import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { CorrespondenceService, SMSTextSendModel } from 'src/app/shared/services/correspondence.service';
import { PatientService } from 'src/app/shared/services/patient.service';
import { forkJoin } from 'rxjs';
import { AppInfoService } from 'src/app/shared/services/app-info.service';

@Component({
  selector: 'app-patient-sms-add',
  templateUrl: './patient-sms-add.component.html',
  styleUrls: ['./patient-sms-add.component.scss']
})
export class PatientSmsAddComponent extends PopupReactiveFormBase implements OnInit {
  messageCount: number = 0;
  patientId = '';
  smsTextSendModel: SMSTextSendModel;

  constructor(
    private correspondenceService: CorrespondenceService, public appInfo: AppInfoService
  ) {
    super();
  }

  protected controllerName = "sms";
  protected onOpened = (data) => {
    this.patientId = data.patientId;

    this.setupForm();
    this.getData(data.patientId);
    this.setup(data);
  }

  ngOnInit() {
    this.smsTextSendModel = new SMSTextSendModel();
  }

  setupForm() {
    this.editForm = new FormGroup({
      siteId: new FormControl(null, null),
      patientId: new FormControl(null, null),
      userId: new FormControl(null, null),
      recipientName: new FormControl(null, null),
      recipientType: new FormControl(null, null),
      phoneNumber: new FormControl(null, [Validators.required, Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/)]),
      messageText: new FormControl(null, [Validators.required]),
      senderTag: new FormControl(null, null)
    });

    this.editForm.get("messageText").valueChanges.subscribe(x => {
      if (x != null)
        this.messageCount = x.length;
    });
  }

  getData(patientId) {
    forkJoin([
      this.correspondenceService.getPatientSMSDetails(patientId)
    ]).subscribe(([smsDetails]) => {
      this.smsTextSendModel = smsDetails;
      super.populateForm(smsDetails);
    });
  }

  patientTelecomSelectedHandler(e) {
    this.editForm.patchValue({ phoneNumber: e.telecomValue });
  }

}