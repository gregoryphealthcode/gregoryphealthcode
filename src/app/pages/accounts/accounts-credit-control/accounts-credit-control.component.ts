import { Component, OnInit } from "@angular/core";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";

@Component({
  selector: 'app-accounts-credit-control',
  templateUrl: './accounts-credit-control.component.html',
  styleUrls: ['./accounts-credit-control.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})
@AutoUnsubscribe
export class AccountsCreditControlComponent implements OnInit {
  public selectedIndex = 0;

  constructor(
  ) {

  } 

  ngOnInit() {

  }
}