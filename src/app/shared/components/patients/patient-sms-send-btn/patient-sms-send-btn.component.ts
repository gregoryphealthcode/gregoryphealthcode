import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { CorrespondenceService, SMSTextSendModel } from 'src/app/shared/services/correspondence.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-patient-sms-send-modal',
  templateUrl: './patient-sms-send-btn.component.html',
  styleUrls: ['./patient-sms-send-btn.component.scss']
})
export class PatientSmsSendBtnComponent extends ReactiveFormBase implements OnInit {
  constructor
    (
      private correspondenceService: CorrespondenceService,
      private spinnerService: SpinnerService,
    ) {
    super();
  }

  @Input() patientId: string;
  @Output() saved = new EventEmitter(); 
  @Output() formClosed = new EventEmitter();

  messageCount: number = 0;

  protected httpRequest = (x) => {
    return this.correspondenceService.sendSMSText(x);
  }

  onSuccessfullySaved = (x) => {
    this.saved.emit(x);
  }

  ngOnInit() {
    this.setupForm();
    this.getPatientSmsDetails();

    this.editForm.get("messageText").valueChanges.subscribe(x => {
      console.log(x);
      if (x != null)
      this.messageCount = x.length;
    });
  }

  setupForm() {
    this.editForm = new FormGroup({
      siteId: new FormControl(null, null),
      patientId: new FormControl(null, null),
      userId: new FormControl(null, null),
      recipientName: new FormControl(null, null),
      recipientType: new FormControl(null, null),
      phoneNumber: new FormControl(null, [Validators.required, Validators.maxLength(16), Validators.pattern(/^(\+\d{1,4}[- ]?)?\d{11}$/)]),
      messageText: new FormControl(null, [Validators.required]),
      senderTag: new FormControl(null, null),
    });
  }
  
  getPatientSmsDetails() {
    this.correspondenceService.getPatientSMSDetails(this.patientId).subscribe(x => {
      super.populateForm(x);
    })
  }

  closeForm() {
    this.formClosed.emit();
  }
}
