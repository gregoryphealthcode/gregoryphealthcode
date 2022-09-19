import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { AppInfoService } from 'src/app/shared/services';
import { InvoiceAddEditStoreService } from '../../invoice-add-edit-store.service';

@Component({
  selector: 'app-invoice-details-edit',
  templateUrl: './invoice-details-edit.component.html',
  styleUrls: ['./invoice-details-edit.component.scss']
})
export class InvoiceDetailsEditComponent extends ReactiveFormBase implements OnInit, OnChanges {
  protected httpRequest: (x: any) => Observable<any>;
  @Input() isViewVisible: any;
  @ViewChild('gouprOne') gouprOneSelector: ElementRef;


  constructor(
    public store: InvoiceAddEditStoreService,
    public appInfo: AppInfoService,
    private formBuilder: FormBuilder,
  ) {
    super();
  }
  public maxDate = new Date();

  ngOnInit() {
    this.setupForm();

    this.subscription.add(
      this.store.invoiceMainDetails$.subscribe(
        x => { if (x) this.populateForm(x); }
      )
    );

    this.subscribeToInvoiceDateChange();
  }

  private setupForm() {
    this.editForm = this.formBuilder.group({
      invoiceNo: [undefined, [Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 \\\'-/.<>,_=+#@:;]*$')]],
      authCode: [undefined, Validators.maxLength(50)],
      invoiceDate: [new Date()],
    });
  }

  save() {
    const record = this.getModelFromForm();
    this.store.setInvoiceMainDetails(record);
  }

  subscribeToInvoiceDateChange() {
    this.subscription.add(
      this.editForm
        .get('invoiceDate')
        .valueChanges
        .pipe(tap(x => {
          if (!x) { return }

          let d = new Date(x);
          let now = new Date();
          if (d.getTime() > now.getTime()) {
            this.editForm.controls['invoiceDate'].setValue(now);
          }

          const userTimezoneOffset = d.getTimezoneOffset() * 60000;
          x = new Date(d.getTime() - userTimezoneOffset).toUTCString();
        })
        ).subscribe()
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      const focussableElements = this.appInfo.getHtmlElements(this.gouprOneSelector);
      if (focussableElements[0]) focussableElements[0].focus();
    }, 750);
  }
}