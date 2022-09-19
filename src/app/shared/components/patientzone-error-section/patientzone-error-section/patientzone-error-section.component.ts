import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorData } from 'src/app/shared/models/ErrorData';

@Component({
  selector: 'app-patientzone-error-section',
  templateUrl: './patientzone-error-section.component.html',
  styleUrls: ['./patientzone-error-section.component.scss']
})
export class PatientZoneErrorSectionComponent implements OnInit {

  @Output() editClicked = new EventEmitter();

  @Input() title: string;

  @Input() errors : ErrorData[];

  public showError = true;

  constructor() { }

  ngOnInit() {
  }

}
