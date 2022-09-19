import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DxNumberBoxComponent } from 'devextreme-angular/ui/number-box';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { InvoiceAddEditStoreService } from 'src/app/pages/accounts/invoice-add-edit/invoice-add-edit-store.service';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { InvoiceServicesStoreService } from '../invoice-services-store.service';


@Component({
  selector: 'app-service-procedure',
  templateUrl: './service-procedure.component.html',
  styleUrls: ['./service-procedure.component.scss']
})
export class ServiceProcedureComponent extends SubscriptionBase implements OnInit {
  @ViewChild("searchBox") searchBox: ElementRef;
  @ViewChild("procedureCostTextBox") inputName: DxNumberBoxComponent;

  @Input() get service(): any { return this._service; }
  set service(value: any) {
    this._service = value;
    this.fee = this._service.fee;
    this.serviceFee.next(this.fee);
  }

  @Input() showFee: boolean;

  private _service;
  private searchTerms = new BehaviorSubject<string>('');  
  private serviceFee = new BehaviorSubject<number>(0);

  procedureCodes: any;
  term = '';
  fee = 0;  

  constructor(
    public store: InvoiceServicesStoreService,
    public invoiceStore: InvoiceAddEditStoreService,
    public appInfo:AppInfoService
  ) {
    super()
  }

  ngOnInit() {
    this.subscription.add(
      this.searchTerms
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap((x) => this.store.getProcedureCodes(x)),
          tap((x) => {
            this.procedureCodes = x;
          })
        )
        .subscribe()
    );

    this.subscription.add(
      this.serviceFee
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap((x) => {
            if (x !== undefined) {
              let value = Math.round((x + Number.EPSILON) * 100) / 100; 
              this.fee = value;
            }
          })
        )
        .subscribe()
    );
  }

  searchForProcedureCode(e) {
    this.searchTerms.next(e.target.value);
  }

  addProcedureHandler(data, service) {
    this.term = "";
    this.searchTerms.next("");
    this.store.addProcedure(data, service);
    this.searchBox.nativeElement.focus();
  }

  keyUpFunction() {
    if (!this.term) {
      this.inputName.instance.focus();
    }
  }

  onFeeChanged(e) {
    this.serviceFee.next(e.value);
  }
}