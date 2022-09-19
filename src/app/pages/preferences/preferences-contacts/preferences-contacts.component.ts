import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit } from "@angular/core";

@Component({
  selector: 'app-preferences-contacts',
  templateUrl: './preferences-contacts.component.html',
  styleUrls: ['./preferences-contacts.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferencesContactsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
