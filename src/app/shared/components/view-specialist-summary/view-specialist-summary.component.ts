import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SpecialistViewModel } from '../../models/SpecialistViewModel';

@Component({
  selector: 'app-view-specialist-summary',
  templateUrl: './view-specialist-summary.component.html',
  styleUrls: ['./view-specialist-summary.component.scss']
})
export class ViewSpecialistSummaryComponent implements OnInit {

  constructor() { }

  @Output() editSpecialist = new EventEmitter<string>();
  @Input() showTopButtons = true;
  @Input() set specialist (value: SpecialistViewModel){
    if(value){
      this._specialist = value;
    }
  }
  get specialist(){return this._specialist;}

  private _specialist : SpecialistViewModel;
  ngOnInit() {

  }

  onSpecialistSelected(){
    this.editSpecialist.emit(this.specialist.id.toString());
  }

}
