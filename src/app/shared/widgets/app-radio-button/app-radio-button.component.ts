import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-radio-button",
  templateUrl: "./app-radio-button.component.html",
  styleUrls: ["./app-radio-button.component.scss"],
})
export class AppRadioButtonComponent implements OnInit {
  @Output() selected = new EventEmitter();
  @Input() text: string;
  @Input() checkedValue: any;
  @Input() value = undefined;
  @Output() valueChange = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  clicked() {
    if(this.value != this.checkedValue){
      this.value = this.checkedValue;
      this.valueChange.emit(this.checkedValue);
    }
  }
}
