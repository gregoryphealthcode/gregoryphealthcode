import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { PopupReactiveFormBase } from "src/app/shared/base/popupReactiveForm.base";

@Component({
  selector: "app-waiting-list-add-edit-popup",
  templateUrl: "./waiting-list-add-edit-popup.component.html",
  styleUrls: ["./waiting-list-add-edit-popup.component.scss"],
})
export class WaitingListAddEditPopupComponent extends PopupReactiveFormBase implements OnInit {
  public get title() {
    if (!this.data) {
      return 'wait'
    }
    
    if (!this.data.data) {
      return 'wait 2'
    }

    return this.data.data.patientName + ' - ' + this.data.data.appointmentType;
  }

  constructor() {
    super();
  }

  protected controllerName = "waitingList";
  protected onOpened = (data) => {
    this.setup(data);
  };

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    this.editForm = new FormGroup({
      id: new FormControl(undefined),
      notes: new FormControl(undefined),
      priority: new FormControl(undefined),
    });
  }
}