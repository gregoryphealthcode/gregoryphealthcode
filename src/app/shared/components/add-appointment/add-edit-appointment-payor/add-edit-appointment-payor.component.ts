import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppointmentAddEditStoreService } from '../appointment-add-edit-store.service';

@Component({
  selector: 'app-add-edit-appointment-payor',
  templateUrl: './add-edit-appointment-payor.component.html',
  styleUrls: ['./add-edit-appointment-payor.component.scss']
})
export class AddEditAppointmentPayorComponent implements OnInit {
  @Output() payorSelected = new EventEmitter();

  constructor(
    public store: AppointmentAddEditStoreService
    ) { }

  ngOnInit() {
  }

  payorSelectedHandler() {
    this.payorSelected.emit();
  }
}