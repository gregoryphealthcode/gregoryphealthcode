import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceItemDataModel } from 'src/app/shared/services/billing.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { AppInfoService } from 'src/app/shared/services';
import { BasicPatientDetailsViewModel } from 'src/app/shared/services/patient.service';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GridBase } from 'src/app/shared/base/grid.base';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-draft-invoices',
  templateUrl: './draft-invoices.component.html',
  styleUrls: ['./draft-invoices.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})

@AutoUnsubscribe
export class DraftInvoicesComponent extends GridBase implements OnInit {
  private searchTerms = new BehaviorSubject<any>(undefined);
  searchTermValue: string = "";

  patientId: string;
  patientdetailsPatientId: any = null;
  selectedRowData: any;
  showPanel = false;
  selectedPatient: BasicPatientDetailsViewModel;

  constructor(
    private router: Router,
    public appInfo: AppInfoService,
  ) {
    super();
  }

  ngOnInit() {
    this.getInvoices();

    this.subscription.add(
      this.searchTerms
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap((x) => {
            if (x !== undefined) this.reloadData();
          })
        )
        .subscribe()
    );
  }

  getInvoices() {
    this.controllerUrl = `${environment.baseurl}/billing/`;
    this.setupDataSource({
      key: 'invoiceId',
      loadParamsCallback: () => [
        { name: 'searchValue', value: this.searchTermValue },
        { name: 'status', value: 'draft' }
      ],
      loadUrl: "getInvoicesByStatus" 
    });
  }

  reloadData() {
    this.getInvoices();
  }

  onFocusedRowChanged(e) {
    this.selectedRowData = e.row.data;
    this.patientId = e.row.data.patientId;
    this.showPanel = true;
  }

  public onSearchInputChangedHandler() {
    this.searchTerms.next(this.searchTermValue);
  }

  patientSelectedHandler(patientId) {
    this.router.navigate([`/patient-details/${patientId}`]);
  }

  invoiceSelectedHandler(invoiceId) {
    this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId } });
  }

  quickeBill(patientId: string, invoiceId: string) {
    this.router.navigate(['/accounts/invoice'], { queryParams: { patientId, invoiceId, isDraft: true } });
  }
}