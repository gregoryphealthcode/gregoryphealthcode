import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-preferences-templates',
  templateUrl: './preferences-templates.component.html',
  styleUrls: ['./preferences-templates.component.scss'],  
  encapsulation: ViewEncapsulation.None,
})
export class PreferencesTemplatesComponent implements OnInit {
  @Input() isMedsec: boolean;

  constructor() { }

  ngOnInit() {
  }

}
