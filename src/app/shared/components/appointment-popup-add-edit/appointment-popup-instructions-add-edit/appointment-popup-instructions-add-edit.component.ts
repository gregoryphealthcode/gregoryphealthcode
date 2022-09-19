import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { AppointmentInstructionsViewModel, AppointmentService, InstructionsViewModel } from 'src/app/shared/services/appointment.service';

@Component({
  selector: 'app-appointment-popup-instructions-add-edit',
  templateUrl: './appointment-popup-instructions-add-edit.component.html',
  styleUrls: ['./appointment-popup-instructions-add-edit.component.scss']
})
export class AppointmentPopupInstructionsAddEditComponent extends PopupReactiveFormBase implements OnInit {
  appointmentId: string;
  appointmentInstructions: AppointmentInstructionsViewModel;
  instructions: InstructionsViewModel[] = [];
  fromTemplate = false;

  options = [
    "Yes",
    "No"
  ];

  constructor(
    private appointmentServices: AppointmentService,
  ) {
    super();
  }

  protected controllerName = "appointmentInstructions";
  protected onOpened = (data) => {
    if (data.appointmentId)
      this.appointmentId = data.appointmentId;

    this.getAppointmentInstructions();
    this.setupForm();
    this.setup(data);
  }

  ngOnInit() {
    
  }

  getAppointmentInstructions() {
    this.appointmentServices.getlluAppointmentInstructions().subscribe(data => {
      this.instructions = data;
      this.instructions.sort(function (a, b) {
        if (a.title < b.title) return -1;
        if (a.title > b.title) { return 1; }
        return 0;
      })
    })
  }

  setupForm() {
    this.editForm = new FormGroup({
      appointmentInstructionsId: new FormControl(null),
      appointmentId: new FormControl(this.appointmentId),
      options: new FormControl(null),
      title: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      text: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      isDirections: new FormControl(null),
    }); 

    this.subscription.add(this.editForm.get('options').valueChanges.subscribe(x => {
      if (x) {
        let instruction = this.instructions.find(y => y.id == x);
        this.editForm.patchValue({
          title: instruction.title,
          text: instruction.text,
          isDirections: instruction.isDirections,
        });
      }
    }))
  }

  optionChanged(e) {
    if (e.value == "Yes")
      this.fromTemplate = true;
    else
      this.fromTemplate = false;
  }
}
