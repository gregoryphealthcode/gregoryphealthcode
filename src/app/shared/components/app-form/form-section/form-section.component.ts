import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-form-section',
  templateUrl: './form-section.component.html',
  styleUrls: ['./form-section.component.scss']
})
export class FormSectionComponent implements OnInit {
  constructor() { }
  
  @Input() title: string;
  @Input() layout: 'row' | 'column' = 'column'
  @Input() helperText: string;
  @Input() showDanger: boolean;
  @Input() showAllBtn: boolean;
  @Input() showInfo: boolean = true;
  @Input() showWarning: boolean;
  @Input() showTitleUnderline: boolean;
  @Input() showAddButton: boolean;
  @Input() showHelpButton: boolean = true;
  @Input() count: number;
  @Input() isSubHeading: boolean = false;

  @Output() showAllClicked = new EventEmitter()
  @Output() addClicked = new EventEmitter()
  
  showHelp = false;
  dangerMessageToggle = true;
  warningMessageToggle = true;
  helperTexts: Array<string>;

  @HostBinding('class') class = this.layout === 'column' ? 'flex-column' : 'flex-row';

  ngOnInit() {
    if (this.helperText)
      this.helperTexts = this.helperText.split('\\n');
  }
}