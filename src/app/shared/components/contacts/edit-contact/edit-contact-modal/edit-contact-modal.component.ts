import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AppInfoService } from "src/app/shared/services/app-info.service";

@Component({
  selector: "app-edit-contact-modal",
  templateUrl: "./edit-contact-modal.component.html",
  styleUrls: ["./edit-contact-modal.component.scss"],
})
export class EditContactModalComponent implements OnInit {
  constructor(public appInfo: AppInfoService
  ) { }

  @Input() set contactId(value: any) {
    if (value && value.id) {
      this._contactId = value.id;
      this.show = true;
    }
  }
  get contactId() {
    return this._contactId;
  }
  @Input() contactClassification: number;

  @Output() saved = new EventEmitter<any>();

  private _contactId: string;

  show: boolean;

  ngOnInit() { }
}