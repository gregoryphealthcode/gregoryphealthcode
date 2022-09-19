import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorData } from 'src/app/shared/models/ErrorData';

@Component({
  selector: 'app-invoice-error-section',
  templateUrl: './invoice-error-section.component.html',
  styleUrls: ['./invoice-error-section.component.scss']
})
export class InvoiceErrorSectionComponent implements OnInit {
  @Input() title: string;
  @Input() errors: ErrorData[];

  @Output() editClicked = new EventEmitter();

  public showError = true;

  constructor() { }

  ngOnInit() {
  }
}
