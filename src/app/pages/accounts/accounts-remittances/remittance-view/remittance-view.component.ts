import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import Guid from 'devextreme/core/guid';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { RemittanceModel, RemittanceService } from 'src/app/shared/services/remittance.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-remittance-view',
  templateUrl: './remittance-view.component.html',
  styleUrls: ['./remittance-view.component.scss']
})
export class RemittanceViewComponent extends GridBase implements OnInit {
  constructor(
    private appInfo: AppInfoService,
    private remittanceService: RemittanceService,
  ) {
    super()
  }

  @Input() remittance: RemittanceModel;
  @Input() insurer: string;

  @Output() remittanceChanged = new EventEmitter<Guid>();

  currencySymbol: string;

  ngOnInit() {
    this.currencySymbol = this.appInfo.getCurrencySymbol;
    this.getRemittanceDetails();
  }

  getRemittanceDetails() {
    this.controllerUrl = `${environment.baseurl}/hcRemittance/`;
    this.setupDataSource({
      loadParamsCallback: () => [{ name: 'remittanceId', value: this.remittance.id }],
      loadUrl: 'getLines'
    });
  }

  unarchive() {
    this.remittanceService.unarchiveRemittance(this.remittance.id).subscribe(x => {
      this.remittanceChanged.emit(this.remittance.id);
    });
  }

  archive() {
    this.remittanceService.archiveRemittance(this.remittance.id).subscribe(x => {
      this.remittanceChanged.emit(this.remittance.id);
    });
  }

  export() {
    this.dataGrid.instance.exportToExcel(false);
  }
}