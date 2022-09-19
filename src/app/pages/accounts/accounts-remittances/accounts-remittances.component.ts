import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { RemittanceModel } from 'src/app/shared/services/remittance.service';
import { UserStore } from 'src/app/shared/stores/user.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-accounts-remittances',
  templateUrl: './accounts-remittances.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
  styleUrls: ['./accounts-remittances.component.scss']
})
export class AccountsRemittancesComponent extends GridBase implements OnInit {
  constructor(
    private appInfo: AppInfoService,
    private userStore: UserStore
  ) {
    super()
  }

  public dateFormat: string;
  public remittance: RemittanceModel;
  public insurer: string;
  public currencySymbol: string;
  public currencyCode: string;
  public records: any;
  public showArchived: boolean;
  public showPanel = false;

  ngOnInit() {
    const siteId = this.userStore.getSiteId();
    this.dateFormat = this.appInfo.getDateFormatBySite(siteId);
    this.currencySymbol = this.appInfo.getCurrencySymbol;
    this.currencyCode = this.appInfo.getCurrencyCodeBySite(siteId);

    this.getRemittances();
  }

  getRemittances() {
    this.controllerUrl = `${environment.baseurl}/hcRemittance/`;
    this.setupDataSource(
      {
        loadParamsCallback: () => [
          { name: 'archived', value: this.showArchived }
        ],
        loadCallback: (x) => {
          this.records = x.data;
          if (this.remittance)
            this.remittance = this.records.filter(x => x.id == this.remittance.id)[0]; 
        }
      }
    );
  }

  onFocusedRowChanged(e) {
    this.remittance = e.row.data;
    this.showPanel = true;
  } 

  checkboxChanged(e) {
    this.showArchived = e.checked;
    this.refreshData();
  }

  changedHandler(e) {  
    this.refreshData();         
  }
}