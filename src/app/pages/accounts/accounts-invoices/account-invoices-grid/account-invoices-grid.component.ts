import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { BasicPatientDetailsViewModel } from 'src/app/shared/services/patient.service';
import { UserStore } from 'src/app/shared/stores/user.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-invoices-grid',
  templateUrl: './account-invoices-grid.component.html',
  styleUrls: ['./account-invoices-grid.component.scss']
})
export class AccountInvoicesGridComponent extends GridBase implements OnInit {
  @Input() status: string;

  patientId: string;
  patientdetailsPatientId: any = null;
  selectedRowData: any;
  showPanel = false;
  selectedPatient: BasicPatientDetailsViewModel;
  searchValue = "";

  constructor(
    public userStore: UserStore,
    private router: Router,
    public appInfo: AppInfoService,
  ) {
    super();
  }

  ngOnInit() {
    this.getInvoices();
  }

  getInvoices() {
    this.controllerUrl = `${environment.baseurl}/billing/`;
    this.setupDataSource({
      key: 'invoiceId',
      loadParamsCallback: () => [
        { name: 'status', value: this.status },
      ], loadCallback: (x) => {
        if (sessionStorage.getItem('searchTerm')) {
          this.searchValue = sessionStorage.getItem('searchTerm');
          sessionStorage.removeItem('searchTerm');
        }
      },
      loadUrl: "getInvoicesByStatus"
    });
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
    this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId } });
  }

  quickeBill(patientId: string, invoiceId: string) {
    this.router.navigate(['/accounts/invoice'], { queryParams: { patientId, invoiceId, isDraft: true } });
  }

  openInvoice(e) {
    let invoiceId = e.key;
    sessionStorage.setItem('invoiceTab', this.status);
    sessionStorage.setItem("searchTerm", this.searchBoxValue);
    this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId } });
  }
}
