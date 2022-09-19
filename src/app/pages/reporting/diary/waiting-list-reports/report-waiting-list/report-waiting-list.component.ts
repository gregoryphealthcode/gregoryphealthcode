import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { GridBase } from 'src/app/shared/base/grid.base';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';
import { WaitingListModel } from 'src/app/shared/services/appointment.service';
import * as moment from 'moment';
import { UserStore } from 'src/app/shared/stores/user.store';
import { MedSecSiteSelectorComponent } from 'src/app/shared/components/med-sec-site-selector/med-sec-site-selector/med-sec-site-selector.component';
import { GridWithStateStoreDirective } from 'src/app/shared/directives/grid-with-state-store.directive';

@Component({
  selector: 'app-report-waiting-list',
  templateUrl: './report-waiting-list.component.html',
  styleUrls: ['./report-waiting-list.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportWaitingListComponent extends GridBase implements OnInit {
  @ViewChild(MedSecSiteSelectorComponent) siteSelector: MedSecSiteSelectorComponent;
  @ViewChild(GridWithStateStoreDirective) gridWithStateStoreDirective: GridWithStateStoreDirective;

  startDate = moment().subtract(90, 'days').toDate();
  endDate = moment().add(30, 'days').toDate();
  dataSource: any;
  fileName = "WaitingListReport(Default)-" + formatDate(new Date(), "dd-MM-yyyy", 'en');
  records: WaitingListModel[] = [];
  isMedSec = false;
  toolbarItems = null;

  constructor(
    public appInfo: AppInfoService,
    public userStore: UserStore,
  ) {
    super();
  }

  ngOnInit() {
    this.isMedSec = this.userStore.isMedSecUser();

    this.controllerUrl = `${environment.baseurl}/waitingList/`;
    this.setupDataSource({
      key: 'id',
      loadParamsCallback: () => [
        { name: 'fromDate', value: this.startDate ? this.startDate.toISOString() : undefined },
        { name: 'toDate', value: this.endDate ? this.endDate.toISOString() : undefined },
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
    e.toolbarOptions.items.unshift({
      location: 'before',
    },

      {
        location: 'before',
        caption: 'From',
        widget: 'dxDateBox',
        locateInMenu: 'auto',
        options: {
          width: 110,
          displayFormat: this.appInfo.getDateFormat,
          value: this.startDate,
          type: 'date',
          hint: "Select from date",
          onValueChanged: this.startDateChanged.bind(this)
        }
      },
      {
        location: 'before',
        caption: 'To',
        widget: 'dxDateBox',
        locateInMenu: 'auto',
        options: {
          width: 110,
          displayFormat: this.appInfo.getDateFormat,
          value: this.endDate,
          type: 'date',
          hint: "Select to date",
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
      });
  }

  onOptionChanged(e) {
    const element = this.toolbarItems.filter(x => x.name == 'expander')[0];
    element.visible = this.appInfo.isDatagridGrouped(e.component);
  }

  calculateAgeValue(rowData) {
    try {
      if (rowData.birthDate) {
        const timeDiff = Math.abs(Date.now() - new Date(rowData.birthDate).getTime());
        const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        return age;
      }
    } catch (e) { return '0'; }
  }

  stateSelectedHandler(e) {
    this.fileName = "WaitingListReport(" + e + ")-" + formatDate(new Date(), "dd-MM-yyyy", 'en');
  }

  startDateChanged(e) {
    this.startDate = e.value;
    this.refreshData();
  }

  endDateChanged(e) {
    this.endDate = e.value;
    this.refreshData();
  }

  openSiteSelectorModelHandler() {
    this.siteSelector.show();
  }

  siteSelectorHandler() {
    this.gridWithStateStoreDirective.save();
  }

  customiseDuration(data) {
    let text = "";
    var hours = Math.floor(data.value / 60);
    var minutes = data.value % 60;
    if (hours > 0)
      text += hours + "hrs ";
    return text += minutes + "mins";
  }
}
