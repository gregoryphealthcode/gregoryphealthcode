import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { GluAppointmentPatientStatusEnum, GluAppointmentStatus } from 'src/app/shared/services/appointment.service';
import { AppointmentAddEditStoreService } from '../appointment-add-edit-store.service';

@Component({
  selector: 'app-appointment-complete',
  templateUrl: './appointment-complete.component.html',
  styleUrls: ['./appointment-complete.component.scss']
})
export class AppointmentCompleteComponent extends ReactiveFormBase implements OnInit {
  @Input() patientStatusId: GluAppointmentPatientStatusEnum;
  @Input() statusId: GluAppointmentStatus;

  @Output() saved = new EventEmitter<boolean>();

  attend = false;
  invoice = false;

  constructor(
    public store: AppointmentAddEditStoreService,
    private messages: AppMessagesService,
  ) {
    super();
  }

  protected httpRequest = x => {
    let status = GluAppointmentPatientStatusEnum.DidNotAttend;
    if (this.attend)
      status = GluAppointmentPatientStatusEnum.Confirmed;

    return this.store.completeAppointment(status, x.createInvoice);
  }

  onSuccessfullySaved = (x) => {
    this.saved.emit(this.invoice);
  }

  ngOnInit() {
    this.setupForm();

    if (this.patientStatusId === GluAppointmentPatientStatusEnum.Arrived || this.patientStatusId === GluAppointmentPatientStatusEnum.Confirmed) {
      this.attend = true;
    }
  }

  setupForm() {
    this.editForm = new FormGroup({
      patientAttend: new FormControl(false, Validators.required),
      createInvoice: new FormControl(false, Validators.required),
    });
  }
}