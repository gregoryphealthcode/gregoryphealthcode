import { NgModule, ViewChild, Component, OnInit, AfterViewInit, Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClientModule, } from '@angular/common/http';
import {
  DxContextMenuModule, DxBoxModule, DxButtonModule, DxCheckBoxModule, DxFormModule, DxDropDownBoxModule,
  DxListModule, DxTextBoxModule, DxResponsiveBoxModule,
  DxSelectBoxModule, DxPopupModule, DxRangeSelectorModule, DxToolbarModule,
  DxResizableModule, DxScrollViewModule, DxChartModule, DxPieChartModule, DxChartComponent, DxLoadPanelModule
} from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import ODataStore from 'devextreme/data/odata/store';
import { PercentPipe } from '@angular/common';
import Query from 'devextreme/data/query';
import { UserStore } from 'src/app/shared/stores/user.store';
import * as moment from 'moment';
import DateBox from 'devextreme/ui/date_box';

@Component({
  selector: 'app-graph-transactions',
  templateUrl: './graph-transactions.component.html',
  styleUrls: ['./graph-transactions.component.scss']
})

export class GraphTransactionsComponent implements OnInit, AfterViewInit {
  @ViewChild('chart1') chart1: DxChartComponent;
  @ViewChild('chart2') chart2: DxChartComponent;
  @ViewChild('chart3') chart3: DxChartComponent;
  @ViewChild('chart4') chart4: DxChartComponent;

  startdate = moment().subtract(90, 'days').toDate();
  enddate = new Date(Date.now());
  pipe: any = new PercentPipe('en-US');
  dataSource: any;
  popupVisible = true;
  expanded = false;
  showVAT = false;
  saveReportLayout = false;
  items: any;
  isLoadPanelVisible: boolean = true;
  byMethod: any[] = [];
  payorNameDataSource = {};
  selectStatus = '';
  EpisodeDataStore: ODataStore;
  episodeTypes: any[] = [];
  invoicesDataStore: ODataStore;
  invoices: any[] = [];

  startdateOptions = {
    width: 130,
    elementAttr: { id: 'FromDateBox' },
    displayFormat: this.appInfo.getDateFormat,
    value: this.startdate,
    type: 'date',
    onValueChanged: this.startdateChanged.bind(this)
  };

  enddateOptions = {
    width: 130,
    elementAttr: { id: 'ToDateBox' },
    displayFormat: this.appInfo.getDateFormat,
    value: this.startdate,
    type: 'date',
    onValueChanged: this.enddateChanged.bind(this)
  };

  presetdatesOptions = {
    width: 75,
    dropDownOptions: { width: '250px' },
    splitButton: true,
    text: 'Dates',
    displayExpr: 'text',
    keyExpr: 'value',
    useSelectMode: false,
    type: 'default',
    items: this.appInfo.presetReportDates,
    onItemClick: this.presetdatesChanged.bind(this)
  };

  constructor(
    private userStore: UserStore,
    public appInfo: AppInfoService,
    private changeDetectorRef: ChangeDetectorRef
  ) {

    //this.loadInvoiceData();
  }

  screen(width) {
    return (width < 700) ? 'sm' : 'lg';
  }

  customizeLabel(arg) {
    return '£ ' + arg.valueText + ' (' + arg.percentText + ')';
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
    console.log('preset dates changed: ', e.value);
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
    this.updateFilter();
  }

  updateFilter() {
    this.loadInvoiceData();
  }

  loadInvoiceData() {
    this.isLoadPanelVisible = true;
    // load array of invoices which are issued (ie not draft/awaiting review) that still have a due amount
    const loadoptions = {
      filter: [['TransactionDate', '>=', this.startdate], 'and', ['TransactionDate', '<=', this.enddate]],
      select: ['UniqueNo', 'TransactionDate', 'PaidAmount', 'TransactionTypeId', 'MethodId',
        'Invoice.InvoiceNumber', 'Invoice.InvoiceDate'],
      expand: ['TransactionType', 'Method', 'Invoice',
        'Invoice.Patient',]
    }

    this.invoicesDataStore.load(loadoptions).then(data => {
      const selectedData = Query(data)
        .sortBy('InvoiceDate').toArray();
      this.invoices = selectedData;
      const datePipe = new DatePipe('en-US');
      this.invoices.forEach(inv => {
        inv.Month = datePipe.transform(new Date(inv.TransactionDate), 'MMM yyyy');
        inv.Method = inv.Method.Description;
        inv.Type = inv.TransactionType.Description;
        if (this.byMethod.find(x => x.Method === inv.Method)) {
          this.byMethod.find(x => x.Method === inv.Method).Count =
            this.byMethod.find(x => x.Method === inv.Method).Count + 1;
        } else {
          this.byMethod.push({ Method: inv.Method, Count: 1 });
        }

      })
      this.chart1.instance.render();
      this.chart2.instance.render();
      this.chart3.instance.render();
      this.chart4.instance.render();
      this.isLoadPanelVisible = false;
      this.changeDetectorRef.detectChanges();
    }, error => {
      console.log('error loading datastore: ', error);
    })
  }


  public renderGraphs() {
    setTimeout(function () {
      try {
        this.chart1.instance.render();
        this.chart2.instance.render();
        this.chart3.instance.render();
        this.chart4.instance.render();
      } catch (e) {
      }
    }, 1500);
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.renderGraphs();
  }

  collapseAllClick(e) {
  }

  onContentReady(e) {
    e.component.option('loadPanel.enabled', false);
  }

  onGridResize(e) {
    console.log('grid resize');
  }
}


@Pipe({ name: 'gridCellData' })
export class GridCellDataPipe implements PipeTransform {
  transform(gridData: any) {
    return gridData.data[gridData.column.caption.toLowerCase()];
  }
}

@NgModule({
  imports: [DxBoxModule, DxButtonModule, DxContextMenuModule, DxCheckBoxModule,
    CommonModule, DxDropDownBoxModule, DxButtonModule, DxPopupModule,
    DxListModule, DxTextBoxModule, DxResponsiveBoxModule, HttpClientModule, DxChartModule, DxPieChartModule,
    DxSelectBoxModule, DxRangeSelectorModule, DxResizableModule, DxScrollViewModule, DxLoadPanelModule,
    DxToolbarModule],
  declarations: [GraphTransactionsComponent, GridCellDataPipe],
  exports: [GraphTransactionsComponent, GridCellDataPipe]
})

export class GraphTransactionsModule { }
