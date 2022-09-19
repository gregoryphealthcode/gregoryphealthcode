import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { InvoiceAddEditService } from '../invoice-add-edit.service';

@Component({
  selector: 'app-invoice-cancel',
  templateUrl: './invoice-cancel.component.html',
  styleUrls: ['./invoice-cancel.component.scss']
})
export class InvoiceCancelComponent extends ReactiveFormBase implements OnInit {
  @Input() invoiceId;

  reasons = [
    "Incorrect Patient Details",
    "Incorrect Service Items",
    "Invoice Created in Error",
  ]

  constructor(
    public invoiceService: InvoiceAddEditService, public appInfo: AppInfoService
  ) {
    super();
  }

  protected httpRequest = x => this.invoiceService.cancelInvoice(x);

  ngOnInit() {
    this.setupForm();
  }

  setupForm() {
    this.editForm = new FormGroup({
      invoiceId: new FormControl(this.invoiceId),
      cancelledReason: new FormControl(null, Validators.required),
    });
  }
}
