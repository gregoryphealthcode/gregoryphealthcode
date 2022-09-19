import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Guid from 'devextreme/core/guid';
import { SpecialistViewModel } from 'src/app/shared/models/SpecialistViewModel';

@Component({
  selector: 'app-preferences-appointment-owner-preview',
  templateUrl: './preferences-appointment-owner-preview.component.html',
  styleUrls: ['./preferences-appointment-owner-preview.component.scss']
})
export class PreferencesAppointmentOwnerPreviewComponent implements OnInit { 
  @Input() showTopButtons = true;
  @Input() set specialist (value: SpecialistViewModel){
    if(value){
      this._specialist = value;
    }
  }
  get specialist(){return this._specialist;}

  @Output() editSpecialist = new EventEmitter<Guid>();

  private _specialist : SpecialistViewModel;
  
  constructor() { }

  ngOnInit() {

  }

  onSpecialistSelected(){
    this.editSpecialist.emit(this.specialist.id);
  }
}