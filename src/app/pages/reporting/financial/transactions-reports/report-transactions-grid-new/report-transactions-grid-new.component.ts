import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { UserStore } from 'src/app/shared/stores/user.store';
import { MedSecSiteSelectorComponent } from 'src/app/shared/components/med-sec-site-selector/med-sec-site-selector/med-sec-site-selector.component';
import { GridWithStateStoreDirective } from 'src/app/shared/directives/grid-with-state-store.directive';

@Component({
  selector: 'app-report-transactions-grid-new',
  templateUrl: './report-transactions-grid-new.component.html',
  styleUrls: ['./report-transactions-grid-new.component.scss']
})
export class ReportTransactionsGridNewComponent extends GridBase implements OnInit {
  @ViewChild(MedSecSiteSelectorComponent) siteSelector: MedSecSiteSelectorComponent;
  @ViewChild(GridWithStateStoreDirective) gridWithStateStoreDirective: GridWithStateStoreDirective;

  startDate = moment().subtract(90, 'days').toDate();
  endDate = new Date(Date.now());
  fileName = "TransactionsReport(Default)-" + formatDate(new Date(), "dd-MM-yyyy", 'en');
  isMedSec = false;
  toolbarItems = null;

  constructor(
    public appInfo: AppInfoService,
    public userStore: UserStore,
  ) {
    super()
  }

  ngOnInit() {
    this.isMedSec = this.userStore.isMedSecUser();

    this.controllerUrl = `${environment.baseurl}/transactions/`;
    this.setupDataSource({
      key: 'uniqueNo',
      loadParamsCallback: () => [
        { name: 'startDate', value: this.startDate ? this.startDate.toISOString() : undefined },
        { name: 'endDate', value: this.endDate ? this.endDate.toISOString() : undefined },
      ],
    });
  }

  onToolbarPreparing(e) {
    const dataGrid = e.component;
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
        locateInMenu: 'auto',
        options: {
          elementAttr: { id: 'FromDateBox' },
          width: 130,
          displayFormat: this.appInfo.getDateFormat,
          value: this.startDate,
          type: 'date',
          hint: 'Select from date',
          onValueChanged: this.startDateChanged.bind(this)
        }
      },
      {
        location: 'before',
        caption: 'To',
        widget: 'dxDateBox',
        locateInMenu: 'auto',
        options: {
          elementAttr: { id: 'ToDateBox' },
          width: 130,
          displayFormat: this.appInfo.getDateFormat,
          value: this.endDate,
          type: 'date',
          hint: 'Select to date',
          onValueChanged: this.endDateChanged.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          icon: 'refresh',
          type: 'default',
          hint: 'Refresh grid',
          onClick: () => this.refreshData(),
        }
      },
    );
  }

  onOptionChanged(e) {
    const element = this.toolbarItems.filter(x => x.name == 'expander')[0];
    element.visible = this.appInfo.isDatagridGrouped(e.component);
  }

  startDateChanged(e) {
    this.startDate = e.value;
    this.refreshData();
  }

  endDateChanged(e) {
    this.endDate = e.value;
    this.refreshData();
  }

  calculateAge(rowData) {
    try {
      if (rowData.patientBirthDate) {
        const timeDiff = Math.abs(Date.now() - new Date(rowData.patientBirthDate).getTime());
        const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        return age;
      }
    } catch (e) { return '0'; }
  }

  stateSelectedHandler(e) {
    this.fileName = "TransactionsReport(" + e + ")-" + formatDate(new Date(), "dd-MM-yyyy", 'en');
  }

  openSiteSelectorModelHandler() {
    this.siteSelector.show();
  }

  siteSelectorHandler() {
    this.gridWithStateStoreDirective.save();
  }
}