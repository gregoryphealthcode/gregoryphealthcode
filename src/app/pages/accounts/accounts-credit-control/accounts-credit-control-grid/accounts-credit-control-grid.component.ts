import { Component, OnInit, } from '@angular/core';
import { AppInfoService } from 'src/app/shared/services';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { UserStore } from 'src/app/shared/stores/user.store';
import { GridBase } from 'src/app/shared/base/grid.base';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { formatDate } from '@angular/common';
import { BillingService, CreditControlBandDropDownEnum, CreditControlModel } from 'src/app/shared/services/billing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounts-credit-control-grid',
  templateUrl: './accounts-credit-control-grid.component.html',
  styleUrls: ['./accounts-credit-control-grid.component.scss']
})
export class AccountsCreditControlGridComponent extends GridBase implements OnInit {
  showTransaction = false;
  showPanel = false;
  selectedRowData = null;
  selectedSite: any = null;
  creditControl: CreditControlModel[] = [];

  public invprintBlobUrl: SafeUrl;

  fileName = "CreditControl-" + formatDate(new Date(), "dd-MM-yyyy", 'en');
  creditControlBandDropDownEnum: typeof CreditControlBandDropDownEnum;

  band1PlusVisibility: Boolean;
  band2PlusVisibility: Boolean;
  band3PlusVisibility: Boolean;
  band4PlusVisibility: Boolean;

  selectedStatus = "";
  statuses = [];

  selectedContact = 0;
  contactTypes = [
    { id: 0, value: 'All' },
    { id: -1, value: 'Patient' },
    { id: -2, value: 'Insurer' },
    { id: -3, value: 'Related Person' },
    { id: 1, value: 'GP' },
    { id: 2, value: 'Solicitor' },
    { id: 3, value: 'Clinician' },
    { id: 4, value: 'Supplier' },
    { id: 5, value: 'Court' },
    { id: 6, value: 'Pharmacy' },
    { id: 7, value: 'Laboratory' },
    { id: 8, value: 'Anaesthetist' },
    { id: 9, value: 'Sports Club' },
    { id: 10, value: 'Hospital' },
    { id: 11, value: 'Private Medical Insurer' },
    { id: 12, value: 'Department' },
    { id: 13, value: 'Law Firm' },
    { id: 14, value: 'Bank' },
    { id: 15, value: 'GP Practice' },
  ]
  fromDate;
  toDate;
  dateFormat;

  constructor(
    public appInfo: AppInfoService,
    public billingService: BillingService,
    public userStore: UserStore,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.creditControlBandDropDownEnum = CreditControlBandDropDownEnum;
    this.dateFormat = this.appInfo.getDateFormat;

    this.contactTypes.sort(function (a, b) {

      if (a.value < b.value) return -1;
      if (a.value > b.value) { return 1; }
      return 0;
    })

    this.setBands();
    this.getCreditControl();

    if (this.billingService.selectedCreditControlRecord) {
      this.showPanel = true;
      this.selectedRowData = this.billingService.selectedCreditControlRecord;
    }

  }

  getCreditControl() {
    this.controllerUrl = `${environment.baseurl}/billing/`;
    this.setupDataSource({
      key: 'invoiceId',
      loadParamsCallback: () => [
        { name: 'status', value: this.selectedStatus },
        { name: 'contactType', value: this.selectedContact },
        { name: 'fromDate', value: this.fromDate ? new Date(this.fromDate.getTime() - (this.fromDate.getTimezoneOffset() * 60000)).toISOString() : undefined },
        { name: 'toDate', value: this.toDate ? new Date(this.toDate.getTime() - (this.toDate.getTimezoneOffset() * 60000)).toISOString() : undefined }
      ],
      loadCallback: (x) => {
      },
      loadUrl: "getCreditControl"
    });
  }

  reloadData() {
    this.getCreditControl();
  }

  onFocusedRowChanged(e) {
    if (e.row) {
      if (e.row.rowType == "group") {
        this.showPanel = false;
        if (!e.row.isExpanded)
          e.component.expandRow(e.row.key);
      }
      else {
        this.showPanel = true;
        this.selectedRowData = e.row.data;
        this.billingService.selectedCreditControlRecord = e.row.data;
      }
    }
  }

  export() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    exportDataGrid({
      component: this.dataGrid.instance,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), this.fileName + '.xlsx');
      });
    });
  }

  openInvoice(e) {
    if (e.rowType != "group") {
      let invoiceId = e.key;
      this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId } });
    }
  }

  contactChanged() {
    this.reloadData();
  }

  statusChanged(e) {
    this.selectedStatus = e.selectedItem.value;
    this.setVisibility(this.selectedStatus === this.creditControlBandDropDownEnum.band1.toString() ? this.creditControlBandDropDownEnum.band1
      : this.selectedStatus === this.creditControlBandDropDownEnum.band2.toString() ? this.creditControlBandDropDownEnum.band2
        : this.selectedStatus === this.creditControlBandDropDownEnum.band3.toString() ? this.creditControlBandDropDownEnum.band3
          : this.selectedStatus === this.creditControlBandDropDownEnum.band4.toString() ? this.creditControlBandDropDownEnum.band4
            : 0);
    this.reloadData();
  }

  setVisibility(bandValue: Number) {
    for (var i = 1; i <= 5; i++) {
      this['band' + i + 'PlusVisibility'] = (bandValue <= i);
    }
  }

  setBands() {
    this.statuses.push({ value: this.creditControlBandDropDownEnum.band1.toString(), text: 'Band 1+' });
    this.statuses.push({ value: this.creditControlBandDropDownEnum.band2.toString(), text: 'Band 2+' });
    this.statuses.push({ value: this.creditControlBandDropDownEnum.band3.toString(), text: 'Band 3+' });
    this.statuses.push({ value: this.creditControlBandDropDownEnum.band4.toString(), text: 'Band 4+' });
    this.selectedStatus = this.creditControlBandDropDownEnum.band1.toString();
    this.setVisibility(this.creditControlBandDropDownEnum.band1);
  }

  dateChanged() {
    this.refreshData();
  }
}
