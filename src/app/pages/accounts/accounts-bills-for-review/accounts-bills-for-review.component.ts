import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceDataModel, InvoiceItemDataModel } from 'src/app/shared/services/billing.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { AppInfoService } from 'src/app/shared/services';
import { BasicPatientDetailsViewModel } from 'src/app/shared/services/patient.service';
import { GridBase } from 'src/app/shared/base/grid.base';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-accounts-bills-for-review',
  templateUrl: './accounts-bills-for-review.component.html',
  styleUrls: ['./accounts-bills-for-review.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' },
})

@AutoUnsubscribe
export class AccountsBillsForReviewComponent extends GridBase implements OnInit {
  private searchTerms = new BehaviorSubject<any>(undefined);
  searchTermValue: string = "";

  patientId: string;
  patientdetailsPatientId: any = null;
  selectedRowData: any;
  showPanel = false;
  selectedPatient: BasicPatientDetailsViewModel;

  constructor(
    private router: Router,
    public appInfo: AppInfoService
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
        { name: 'status', value: 'Review' }
      ],
      loadUrl: "getInvoicesByStatus" 
    });
  }

  reloadData() {
    this.getInvoices();
  }

  public onSearchInputChangedHandler() {
    this.searchTerms.next(this.searchTermValue);
  }

  onFocusedRowChanged(e) {
    this.selectedRowData = e.row.data;
    this.patientId = e.row.data.patientId;
    this.showPanel = true;
  }

  patientSelectedHandler(patientId) {
    this.router.navigate([`/patient-details/${patientId}`]);
  }

  invoiceSelectedHandler(invoiceId) {
    const patientId = this.patientdetailsPatientId;
    this.router.navigate(['/accounts/review-invoice'], { queryParams: { patientId, invoiceId } });
  }

  openInvoice(e) {
    let invoiceId = e.key;
    this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId } });
  }
}