import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AppInfoService } from "src/app/shared/services/app-info.service";
import { ContactTelecomModel, TelecomsViewModel } from "src/app/shared/services/contact.service";

@Component({
  selector: "app-contact-telecom-edit-modal",
  templateUrl: "./contact-telecom-edit-btn.component.html",
  styleUrls: ["./contact-telecom-edit-btn.component.scss"],
})
export class ContactTelecomEditBtnComponent implements OnInit {
  constructor( public appInfo: AppInfoService) { }

  @Input() set telecomId(value: any) {
    if (value && value.id) {
      if (value.id === "0") {
        this.isNew = true;
      }
      else {
        this._telecomId = value.id
        this.isNew = false;
      }
      this.show = true;
    }
  }
  get telecomId() {
    return this._telecomId;
  }

  @Input() set contact(x: any) {    
    if (x) {
      this._contact = x;
      if (x.telecoms) {
        this.telecoms = x.telecoms;
      }
      this.isOrganisation = x.contactType.contactClassificationId > 1;
    }
  }
  get contact() {
    return this._contact;
  }

  @Input() telecoms: TelecomsViewModel[];

  @Output() saved = new EventEmitter<any>();

  private _telecomId: string;
  private _contact: string;

  isOrganisation: boolean;
  show: boolean;
  isNew: boolean;

  ngOnInit() { }
}