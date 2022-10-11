import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit-contact-department-modal',
  templateUrl: './edit-contact-department-modal.component.html',
  styleUrls: ['./edit-contact-department-modal.component.scss']
})
export class EditContactDepartmentModalComponent implements OnInit {
  @Input() set departmentId(value: any) {
    if (value && value.id) {
      if (value.id === "0") {
        this.isNew = true;
      } else {
        this._departmentId = value.id;
        this.isNew = false;
      }

      this.show = true;
    }
  }
  get departmentId() {
    return this._departmentId;
  }

  @Input() set contact(x: any) {
    if (x) {
      this._contact = x;
    }
  }
  get contact() {
    return this._contact;
  }

  @Output() saved = new EventEmitter<any>();

  private _departmentId: string;  
  private _contact: string;

  show: boolean;
  isNew: boolean;  

  constructor() {}

  ngOnInit() {}
}