import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { ErrorData } from 'src/app/shared/models/ErrorData';
import { InvoiceAddEditStoreService } from '../invoice-add-edit-store.service';
import { invoiceSections } from '../invoice.sections';

@Component({
  selector: 'app-invoice-step-section',
  templateUrl: './invoice-step-section.component.html',
  styleUrls: ['./invoice-step-section.component.scss']
})
export class InvoiceStepSectionComponent extends SubscriptionBase implements OnInit {
  @Input() set errors(value: ErrorData[]) {
    if (value) {
      this._errors = value.filter(x => x.sectionIndex === this.index);
    }
  };
  get errors(): ErrorData[] {
    return this._errors
  };
  @Input() index: number;
  @Input() isReview;

  @Output() errorClicked = new EventEmitter();

  private _errors: ErrorData[];
  public showHelp = false;
  public sectionDetails: any;

  constructor(
    public store: InvoiceAddEditStoreService
  ) {
    super()
  }

  ngOnInit() {
    this.sectionDetails = invoiceSections.find(x => x.index === this.index);

    this.addToSubscription(
      this.store.errors$.pipe(
        tap(x => this.errors = x)
      ))
  }
}