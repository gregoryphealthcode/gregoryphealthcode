import { Component, Input, OnInit } from '@angular/core';
import { TreeListSearchOptions } from '@devexpress/analytics-core/analytics-widgets-internal';
import Guid from 'devextreme/core/guid';
import { filterByMaxYear, MonthData, sumBy, toMonthData } from 'src/app/shared/helpers/array-helper';
import { AppInfoService } from 'src/app/shared/services';
import { RemittanceModel } from 'src/app/shared/services/remittance.service';
import { UserStore } from 'src/app/shared/stores/user.store';

@Component({
  selector: 'app-remittances-header',
  templateUrl: './remittances-header.component.html',
  styleUrls: ['./remittances-header.component.scss']
})
export class RemittancesHeaderComponent implements OnInit {
  constructor(
    private userStore: UserStore,
    private appInfoService: AppInfoService,
  ) { }

  @Input() public set record(value: RemittanceModel) {
    if (value) {
      this._record = value;
      this.setup(value);
    }
  }
  public get record() {
    return this._record;
  }

  @Input() public currencySymbol: string;

  private _record

  public totalAmount: number;
  public totalClaimed: number;
  public totalShortfall: number;
  public itemsCount: number;
  public totalClaimsCount: number;
  public dataSource = [];
  public areaChartDataSource: MonthData[];
  public siteId: Guid;
  public dateFormat: string;

  ngOnInit() {
    this.siteId = this.userStore.getSiteId();
    this.dateFormat = this.appInfoService.getDateFormatBySite(this.siteId);
    this.setup(this.record);
  }

  setup(record: any) {
    this.totalClaimed = record.totalAmount;
    this.totalClaimsCount = record.totalClaims;
    this.totalShortfall = record.totalShortfall;
    this.totalAmount = this.totalClaimed + this.totalShortfall;
    this.itemsCount = record.length;

    this.setDataSource();
  }

  private setAreaChartDataSource(records: any[]) {
    records = filterByMaxYear(records, 'dateCreated');
    this.areaChartDataSource = toMonthData(records, 'dateCreated');
  }

  private setDataSource() {
    this.dataSource = [
      { name: "claimed", val: this.totalClaimed, color: 'rgb(29, 178, 245)' },
      { name: "shortfall", val: this.totalShortfall, color: 'rgb(245, 86, 74)' }
    ];
  }

  customizePoint(pointInfo: any) {
    return { color: pointInfo.data.color };
  }
}