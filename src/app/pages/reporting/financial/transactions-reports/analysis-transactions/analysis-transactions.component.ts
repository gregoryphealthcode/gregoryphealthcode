import { NgModule, ViewChild, Component, OnInit, AfterViewInit, Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {
  DxContextMenuModule, DxBoxModule, DxButtonModule, DxCheckBoxModule, DxDropDownBoxModule,
  DxListModule, DxTextBoxModule, DxResponsiveBoxModule,
  DxSelectBoxModule, DxPopupModule, DxRangeSelectorModule,
  DxResizableModule, DxScrollViewModule, DxChartModule, DxPieChartModule, DxChartComponent,
  DxPivotGridModule, DxPivotGridComponent, DxLoadPanelModule
} from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import ODataStore from 'devextreme/data/odata/store';
import { PercentPipe } from '@angular/common';
import Query from 'devextreme/data/query';
import config from 'devextreme/core/config';

@Component({
  selector: 'app-analysis-transactions',
  templateUrl: './analysis-transactions.component.html',
  styleUrls: ['./analysis-transactions.component.scss']
})
export class AnalysisTransactionsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DxPivotGridComponent) pivotGrid: DxPivotGridComponent;
  @ViewChild(DxChartComponent) chart: DxChartComponent;

  pipe: any = new PercentPipe('en-US');
  dataSource: any;
  isLoadPanelVisible: boolean = true;
  startdate = new Date('1990-01-01');
  enddate = new Date(Date.now());
  invoicesDataStore: ODataStore;
  invoices: any[] = [];
  pivotGridDataSource: any;

  constructor(
    public appInfo: AppInfoService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    config({ defaultCurrency: 'GBP' });
    this.isLoadPanelVisible = true;

    const loadoptions = {
      filter: [['TransactionDate', '>=', this.startdate], 'and', ['TransactionDate', '<=', this.enddate]],
      select: ['UniqueNo', 'TransactionDate', 'PaidAmount', 'TransactionTypeId', 'MethodId',
        'Invoice.InvoiceNumber', 'Invoice.InvoiceDate'],
      expand: ['TransactionType', 'Method', 'Invoice',
        'Invoice.Patient',]
    };
    this.invoicesDataStore.load(loadoptions).then(data => {
      const selectedData = Query(data)
        .sortBy('StartDateTime').toArray();
      this.invoices = selectedData;

      this.invoices.forEach(invoice => {
        invoice.DayOfWeek = this.getDayOfWeek(invoice.InvoiceDate);
      });

      this.pivotGridDataSource = {
        fields: [
          {
            caption: 'Method',
            dataField: 'Method.Description',
            width: 150,
            area: 'row'
          },
          {
            caption: 'Type',
            width: 120,
            dataField: 'TransactionType.Description',
            area: 'row',
            sortBySummaryField: 'Total'
          },
          {
            dataField: 'TransactionDate',
            dataType: 'date',
            area: 'column'
          }, {
            groupName: 'date',
            groupInterval: 'month',
            visible: false
          }, {
            caption: 'Amount',
            dataField: 'PaidAmount',
            dataType: 'number',
            summaryType: 'sum',
            format: 'currency',
            area: 'data'
          },
        ],
        store: this.invoices
      };
      this.isLoadPanelVisible = false;
      this.changeDetectorRef.detectChanges();
    }, error => {
      console.log('error loading datastore: ', error);
    }
    );
  }

  ngOnInit(): void {

  }

  screen(width) {
    return (width < 700) ? 'sm' : 'lg';
  }

  customizeLabel(arg) {
    return '£ ' + arg.valueText + ' (' + arg.percentText + ')';
  }

  renderGraphs() {
  }

  getDayOfWeek(date) {
    let dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  }

  getDOW(date) {
    return new Date(date).getDay();
  }

  ngAfterViewInit(): void {
    this.pivotGrid.instance.bindChart(this.chart.instance, {
      dataFieldsDisplayMode: 'splitPanes',
      alternateDataFields: false
    });
  }

  collapseAllClick() {
  }

  onContentReady(e) {
    e.component.option('loadPanel.enabled', false);
  }

  onGridResize() {
    console.log('grid resize');
  }

  ngOnDestroy(): void {
    console.log('invoices-analysis component destroyed.');
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
    DxListModule, DxTextBoxModule, DxResponsiveBoxModule, DxChartModule, DxPieChartModule,
    DxSelectBoxModule, DxRangeSelectorModule, DxResizableModule, DxScrollViewModule, DxChartModule,
    DxPivotGridModule, DxLoadPanelModule],
  declarations: [AnalysisTransactionsComponent, GridCellDataPipe],
  exports: [AnalysisTransactionsComponent, GridCellDataPipe]
})

export class AnalysisTransactionsModule { }
