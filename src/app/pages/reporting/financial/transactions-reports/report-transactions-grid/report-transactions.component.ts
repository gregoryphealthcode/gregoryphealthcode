import { ViewChild, Component, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe, } from '@angular/common';
import { DxDataGridComponent, DxPopupComponent, } from 'devextreme-angular';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import ODataStore from 'devextreme/data/odata/store';
import Query from 'devextreme/data/query';
import * as $ from 'jquery';
import * as moment from 'moment';
import DateBox from 'devextreme/ui/date_box';

@Component({
  selector: 'app-report-transactions',
  templateUrl: './report-transactions.component.html',
  styleUrls: ['./report-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportTransactionsGridComponent implements OnInit, AfterViewInit {
  @ViewChild(DxDataGridComponent) transactionsGrid: DxDataGridComponent;
  @ViewChild('patientpopup') patientPopup: DxPopupComponent;

  dataSource: any;
  popupVisible = true;
  expanded = false;
  showVAT = false;
  saveReportLayout = false;
  items: any;
  patientdetailsPatientId: any;
  patientdetailsMode: any;
  advancedMode = false;
  detailDataSource = {};
  patientDataSource = {};
  payorNameDataSource = {};
  startdate = moment().subtract(90, 'days').toDate();
  enddate = new Date(Date.now());
  selectTransactionTypeId = null;
  gluEDIInsurersDataStore: ODataStore;
  gluEDIInsurers: any[] = [];
  toolbarItems = null;

  constructor(
    public appInfo: AppInfoService
  ) {
    this.gluEDIInsurersDataStore.load().then(data => {
      const selectedData = Query(data).sortBy('InsurerName').toArray();
      this.gluEDIInsurers = selectedData;
    }, error => {
      console.log('error loading datastore: ', error);
    }
    );
  }

  isMoneyOwed(amount: number) {
    if (amount > 0) { return true; } else { return false; }
  }


  getItems(invoiceid: any) {

  }

  getExpandedPatient(patientid: any) {
  }

  public getEDIInsurers() {
    return this.gluEDIInsurers;
  }


  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
  }

  collapseAllClick(e) {
  }

  refreshDataGrid() {
    this.transactionsGrid.instance.option('loadPanel.enabled', true);
    this.transactionsGrid.instance.refresh();
  }

  startdateChanged(e) {
    console.log('start date changed: ', e.value);
    this.startdate = e.value;
    this.updateFilter();
  }

  enddateChanged(e) {
    console.log('end date changed: ', e.value);
    this.enddate = e.value;
    this.updateFilter();
  }

  presetdatesChanged(e) {
    console.log('preset dates changed: ', e.itemData.value);
    if (e.itemData.value === 'today') {
      this.startdate = moment().toDate();
      this.enddate = moment().toDate();
    };

    if (e.itemData.value === 'thismonth') {
      this.startdate = moment().startOf('month').toDate();
      this.enddate = moment().endOf('month').toDate();
    };
    if (e.itemData.value === 'previousmonth') {
      this.startdate = moment().subtract(1, 'month').startOf('month').toDate();
      this.enddate = moment().subtract(1, 'month').endOf('month').toDate();
    };
    if (e.itemData.value === 'previous30') {
      this.startdate = moment().subtract(30, 'days').toDate();
      this.enddate = moment().toDate();
    };
    if (e.itemData.value === 'thisquarter') {
      this.startdate = moment().startOf('quarter').toDate();
      this.enddate = moment().endOf('quarter').toDate();
    }
    if (e.itemData.value === 'previousquarter') {
      this.startdate = moment().subtract(1, 'quarter').startOf('quarter').toDate();
      this.enddate = moment().subtract(1, 'quarter').endOf('quarter').toDate();
    }
    if (e.itemData.value === 'thiscalyear') {
      this.startdate = moment().startOf('year').toDate();
      this.enddate = moment().endOf('year').toDate();
    };
    if (e.itemData.value === 'previouscalyear') {
      this.startdate = moment().subtract(1, 'year').startOf('year').toDate();
      this.enddate = moment().subtract(1, 'year').endOf('year').toDate();
    };
    if (e.itemData.value === 'thisfyear') {
      this.startdate = new Date(this.appInfo.getFinancialYearStart);
      this.enddate = new Date(this.appInfo.getFinancialYearEnd);
    };
    if (e.itemData.value === 'previousfyear') {
      this.startdate = moment(this.appInfo.getFinancialYearStart).subtract(1, 'year').toDate();
      this.enddate = moment(this.appInfo.getFinancialYearEnd).subtract(1, 'year').toDate();
    };
    const element1 = document.getElementById('FromDateBox');
    const fromdatebox = DateBox.getInstance(element1) as DateBox;
    fromdatebox.option('value', this.startdate);
    const element2 = document.getElementById('ToDateBox');
    const todatebox = DateBox.getInstance(element2) as DateBox;
    todatebox.option('value', this.enddate);

  }

  filterChanged(e) {
    console.log('filter changed');
    this.transactionsGrid.instance.option('loadPanel.enabled', true);
    this.transactionsGrid.instance.clearFilter();
    this.selectTransactionTypeId = e.value;
    this.updateFilter();
  }

  updateFilter() {
    const ds = this.transactionsGrid.instance.getDataSource();

    if (this.selectTransactionTypeId === null) {
      ds.filter([['TransactionDate', '>=', this.startdate], 'and', ['TransactionDate', '<=', this.enddate]]);
    } else {
      ds.filter(
        [
          ['TransactionTypeId', '=', this.selectTransactionTypeId], 'and',
          ['TransactionDate', '>=', this.startdate], 'and',
          ['TransactionDate', '<=', this.enddate]
        ]);
    }
    ds.load();
    this.transactionsGrid.instance.refresh();
    this.transactionsGrid.instance.pageIndex(1);
  }

  onToolbarPreparing(e) {

    console.log('toolbar preparing');
    this.toolbarItems = e.toolbarOptions.items;
    const searchPanel = $.grep(this.toolbarItems, function (item: any) {
      return item.name === 'searchPanel';
    })[0];
    searchPanel.location = 'before';
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        caption: 'From',
        widget: 'dxDateBox',
        options: {
          elementAttr: { id: 'FromDateBox' },
          width: 130,
          displayFormat: this.appInfo.getDateFormat,
          value: this.startdate,
          type: 'date',
          onValueChanged: this.startdateChanged.bind(this)
        }
      },
      {
        location: 'before',
        caption: 'To',
        widget: 'dxDateBox',
        options: {
          elementAttr: { id: 'ToDateBox' },
          width: 130,
          displayFormat: this.appInfo.getDateFormat,
          value: this.enddate,
          type: 'date',
          onValueChanged: this.enddateChanged.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxSelectBox',
        options: {
          width: 150,
          dropDownOptions: { width: '250px' },
          splitButton: true,
          text: 'Dates',
          displayExpr: 'text',
          keyExpr: 'value',
          useSelectMode: false,
          type: 'default',
          items: this.appInfo.presetReportDates,
          onItemClick: this.presetdatesChanged.bind(this)
        }
      },

      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
          onClick: this.refreshDataGrid.bind(this)
        }
      },
    );
  }

  onOptionChanged(e) {
    const element = this.toolbarItems.filter(x => x.name == 'expander')[0];
    element.visible = this.appInfo.isDatagridGrouped(e.component);
  }

  calculateAgeValue(rowData) {
    try {
      if (rowData.Invoice.Patient.BirthDate) {
        const timeDiff = Math.abs(Date.now() - new Date(rowData.Invoice.Patient.BirthDate).getTime());
        const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        return age;
      }
    } catch (e) { return '0'; }
  }

  calculateTransactionDate(rowData) {
    const shortdateformat = 'dd/MM/yyyy';
    const datePipe = new DatePipe('en-US');
    try {
      if (rowData.InvoiceDate) {
        return datePipe.transform(new Date(rowData.InvoiceDate), shortdateformat);
      }
    } catch (e) { console.log('error: ', e); return '0'; }
  }

  calculatePayorName(rowData) {
    try {
      const that = this;
      const InvoiceTo = rowData.Invoice.InvoiceType.toUpperCase();
      if (InvoiceTo === 'PATIENT' && rowData.Invoice.PatientId === rowData.PayorId) { return 'Patient'; }
      if (InvoiceTo === 'INSURER' || rowData.Invoice.PatientId !== rowData.PayorId) {
        try {
          const tmp = that.gluEDIInsurers.find(x => x.EDIInsurerId._value === rowData.PayorId._value);
          return tmp.InsurerName;
        } catch (e) {
          return rowData.PayorName;
        }
      }
      return rowData.PayorName;
    } catch (e) { }
  }


  calculateRecipientName(rowData) {
    try {
      const that = this;
      const InvoiceTo = rowData.Invoice.InvoiceType.toUpperCase();
      if (InvoiceTo === 'PATIENT' && rowData.Invoice.PatientId._value === rowData.Invoice.RecipientId._value) { return 'Patient'; }
      if (InvoiceTo === 'INSURER' || rowData.Invoice.PatientId._value !== rowData.Invoice.RecipientId._value) {
        try {
          const tmp = that.gluEDIInsurers.find(x => x.EDIInsurerId._value === rowData.Invoice.RecipientId._value);
          return tmp.InsurerName;
        } catch (e) {
          return rowData.Invoice.InvoiceType;
        }
      }
      return rowData.Invoice.InvoiceType;
    } catch (e) { }
  }

  getPatientNumber(rowData) {
    try {
      return rowData.Invoice.Patient.Patient_ReferenceNumbers[0].RefNoValue;
    } catch (e) { return ''; }
  }

  showPatient(patientid) {
    this.patientdetailsPatientId = patientid;
    this.patientPopup.instance.show();
  }

  patientpopupshown() {
    console.log('patient popup shown, loading patient:', this.patientdetailsPatientId);
  }

  onContentReady(e) {
    e.component.option('loadPanel.enabled', false);
  }

  onGridResize(e) {
    console.log('grid resize');
    this.transactionsGrid.height = e.height;
  }

  reprintinvoiceClicked(e) {
  }
  downloadpdfClicked(e) {
  }
  addpaymentClicked(e) {
  }
  sendreminderClicked(e) {
  }
}
