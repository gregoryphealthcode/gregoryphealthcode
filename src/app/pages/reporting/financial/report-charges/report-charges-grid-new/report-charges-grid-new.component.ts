import { Component, OnInit, ViewChild, } from '@angular/core';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { UserStore } from 'src/app/shared/stores/user.store';
import { GridWithStateStoreDirective } from 'src/app/shared/directives/grid-with-state-store.directive';
import { MedSecSiteSelectorComponent } from 'src/app/shared/components/med-sec-site-selector/med-sec-site-selector/med-sec-site-selector.component';

@Component({
  selector: 'app-report-charges-grid-new',
  templateUrl: './report-charges-grid-new.component.html',
  styleUrls: ['./report-charges-grid-new.component.scss']
})
export class ReportChargesGridNewComponent extends GridBase implements OnInit {
  @ViewChild(MedSecSiteSelectorComponent) siteSelector: MedSecSiteSelectorComponent;
  @ViewChild(GridWithStateStoreDirective) gridWithStateStoreDirective: GridWithStateStoreDirective;

  constructor(
    public appInfo: AppInfoService,
    public userStore: UserStore,
  ) { super() }

  startDate = moment().subtract(90, 'days').toDate();
  endDate = new Date(Date.now());
  fileName = "ChargesReport(Default)-" + formatDate(new Date(), "dd-MM-yyyy", 'en');
  isMedSec = false;
  toolbarItems = null;

  ngOnInit() {
    this.isMedSec = this.userStore.isMedSecUser();

    this.controllerUrl = `${environment.baseurl}/charges/`;
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

  calculatePatientName(data) {
    return data.patientLastName + ", " + data.patientFirstName + " " + data.patientTitle;
  }

  calculateAgeValue(rowData) {
    try {
      if (rowData.patientBirthDate) {
        const timeDiff = Math.abs(Date.now() - new Date(rowData.patientBirthDate).getTime());
        const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        return age;
      }
    } catch (e) { return '0'; }
  }

  calculateLOSValue(rowData) {
    if (rowData.admissionDate && rowData.dischargeDate) {
      const totalMinutes = Math.abs(new Date(rowData.dischargeDate).getTime() - new Date(rowData.admissionDate).getTime());
      // let text = "";
      var days = Math.floor(totalMinutes / (1000 * 3600 * 24));
      return days;
      // var hours = Math.floor(days % 24);
      // var minutes = hours % 60;
      // if (days > 0)
      //   text += days + "days ";
      // if (hours > 0)
      //   text += hours + "hrs ";
      // return text += minutes + "mins";
    }
  }

  stateSelectedHandler(e) {
    this.fileName = "ChargesReport(" + e + ")-" + formatDate(new Date(), "dd-MM-yyyy", 'en');
  }

  openSiteSelectorModelHandler() {
    this.siteSelector.show();
  }

  siteSelectorHandler() {
    this.gridWithStateStoreDirective.save();
  }
}