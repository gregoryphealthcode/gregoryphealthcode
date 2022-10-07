import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { AppointmentService } from 'src/app/shared/services/appointment.service';

@Component({
  selector: 'app-preferences-appointment-instructions-add-edit',
  templateUrl: './preferences-appointment-instructions-add-edit.component.html',
  styleUrls: ['./preferences-appointment-instructions-add-edit.component.scss']
})
export class PreferencesAppointmentInstructionsAddEditComponent extends PopupReactiveFormBase implements OnInit {
  constructor(
    private appointmentService: AppointmentService,
  ) {
    super()
  }

  protected controllerName = "lluAppointmentInstructions";
  protected onOpened = (data) => {
    this.setupForm();
    this.setup(data);
    if (this.isNew) {
      this.editForm.patchValue({id: null});
    }
  };

  ngOnInit() {
    this.setupForm();    
  }

  protected populateForm(x) {      
    super.populateForm(x);
  }

  private setupForm() {
    this.editForm = new FormGroup({
      id: new FormControl(null),
      title: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      text: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      isDirections: new FormControl(null),
    });
  }
}