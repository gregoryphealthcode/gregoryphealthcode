import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: 'app-preferences-documents',
  templateUrl: './preferences-documents.component.html',
  styleUrls: ['./preferences-documents.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PreferencesDocumentsComponent implements OnInit { 
  constructor() { }

  ngOnInit() {
  }

}
