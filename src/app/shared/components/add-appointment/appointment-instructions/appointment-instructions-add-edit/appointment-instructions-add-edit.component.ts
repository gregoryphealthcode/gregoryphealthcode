import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { AppointmentInstructionsViewModel, AppointmentService, InstructionsViewModel } from 'src/app/shared/services/appointment.service';

@Component({
  selector: 'app-appointment-instructions-add-edit',
  templateUrl: './appointment-instructions-add-edit.component.html',
  styleUrls: ['./appointment-instructions-add-edit.component.scss']
})
export class AppointmentInstructionsAddEditComponent extends ReactiveFormBase implements OnInit {
  @Input() appointmentId: string;
  @Input() appointmentInstructions: AppointmentInstructionsViewModel;
  @Input() isNew: boolean;

  @Output() saved = new EventEmitter();
  @Output() closed = new EventEmitter();
  
  instructions: InstructionsViewModel[] = [];
  editForm: FormGroup;  
  template;
  chooseFromTemplate = false;
  fromTemplate = "No";
  public options = [
    "Yes",
    "No"
  ];

  constructor(
    private appointmentServices: AppointmentService,
  ) 
  { 
    super();
  }

  protected httpRequest = (x: any) => {
    if (this.isNew)
    return this.appointmentServices.addAppointmentInstructions(x);
    else
    return this.appointmentServices.updateAppointmentInstructions(x);
  };

  onSuccessfullySaved = (x) => {
    this.saved.emit(x)    
  };

  ngOnInit() {
    this.getAppointmentInstructions();
    this.setupForm();
    if (!this.isNew) {        
        this.populateForm(this.appointmentInstructions);
    }

    this.subscription.add(this.editForm.controls.options.valueChanges.subscribe(e => {
      var info = this.instructions.find(x => x.id == e);
      this.editForm.patchValue({title: info.title});
      this.editForm.patchValue({text: info.text});
      this.editForm.patchValue({isDirections: info.isDirections});
    }));
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

  private setupForm() {
    this.editForm = new FormGroup({
      appointmentInstructionsId: new FormControl(null),
      appointmentId: new FormControl(this.appointmentId),
      options: new FormControl(null),
      title: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      text: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      isDirections: new FormControl(null),
    });
  }

  optionChanged(e) {
    if (e.value == "Yes")
      this.chooseFromTemplate = true;
    else 
      this.chooseFromTemplate = false;
  }
}
