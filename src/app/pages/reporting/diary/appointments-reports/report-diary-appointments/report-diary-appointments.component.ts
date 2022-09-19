import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { GridBase } from 'src/app/shared/base/grid.base';
import { formatDate } from '@angular/common';
import { MedSecSiteSelectorComponent } from 'src/app/shared/components/med-sec-site-selector/med-sec-site-selector/med-sec-site-selector.component';
import { GridWithStateStoreDirective } from 'src/app/shared/directives/grid-with-state-store.directive';
import { UserStore } from 'src/app/shared/stores/user.store';

@Component({
  selector: 'app-report-diary-appointments',
  templateUrl: './report-diary-appointments.component.html',
  styleUrls: ['./report-diary-appointments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportDiaryAppointmentsComponent extends GridBase implements OnInit {
  @ViewChild(MedSecSiteSelectorComponent) siteSelector: MedSecSiteSelectorComponent;
  @ViewChild(GridWithStateStoreDirective) gridWithStateStoreDirective: GridWithStateStoreDirective;

  dataSource: any;
  startDate = moment().subtract(90, 'days').toDate();
  endDate = moment().add(30, 'days').toDate();
  fileName = "AppointmentsReport(Default)-" + formatDate(new Date(), "dd-MM-yyyy", 'en');
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

    this.controllerUrl = `${environment.baseurl}/appointment/`;
    this.setupDataSource({
      key: 'appointmentId',
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
          hint: "Refresh grid",
          onClick: () => this.refreshData(),
        }
      });
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
    this.fileName = "AppointmentsReport(" + e + ")-" + formatDate(new Date(), "dd-MM-yyyy", 'en');
  }

  customiseDuration(data) {
    let text = "";
    var hours = Math.floor(data.value / 60);
    var minutes = data.value % 60;
    if (hours > 0)
      text += hours + "hrs ";
    return text += minutes + "mins";
  }

  getDayTime(rowData) {
    try {
      if (rowData.startTime) {
        return (moment(new Date(rowData.startTime))).format('HH:mm').toString();
      }
      if (rowData.endTime) {
        return (moment(new Date(rowData.endTime))).format('HH:mm').toString();
      }
    }
    catch (e) { return null; }
  }

  calculateFilterExpression(filterValue, selectedFilterOperation) {
    const column = this as any;

    if (new Date(arguments[0])) {
      arguments[0] = (moment(new Date(arguments[0]))).format('HH:mm').toString();
    }

    if (selectedFilterOperation === "between" && Array.isArray(filterValue)) {
      const filterExpression = [
        [column.dataField, ">=", (moment(new Date(filterValue[0]))).format('HH:mm').toString()],
        "and",
        [column.dataField, "<=", (moment(new Date(filterValue[1]))).format('HH:mm').toString()]
      ];
      return filterExpression;
    }
    else {
      const filterExpression = [
        [column.dataField, selectedFilterOperation, (moment(new Date(filterValue))).format('HH:mm').toString()],
      ];
      return filterExpression;
    }

    return column.defaultCalculateFilterExpression.apply(column, arguments);
  }

  openSiteSelectorModelHandler() {
    this.siteSelector.show();
  }

  siteSelectorHandler() {
    this.gridWithStateStoreDirective.save();
  }
}