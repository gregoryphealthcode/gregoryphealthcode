import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-patient-referrers-grid-new',
  templateUrl: './patient-referrers-grid-new.component.html',
  styleUrls: ['./patient-referrers-grid-new.component.scss']
})
export class PatientReferrersGridNewComponent extends GridBase implements OnInit {
  selectedRowsData = null;
  fileName = "InvoicesReport(Default)-" + formatDate(new Date(), "dd-MM-yyyy", 'en');

  constructor(
    public appInfo: AppInfoService,
  ) {
    super()
  }

  ngOnInit() {
    this.controllerUrl = `${environment.baseurl}/patientReferrer/`;
    this.setupDataSource({
      key: 'uniqueNo',
      /* loadParamsCallback: () => [
        
      ], */
    });
  }

  onToolbarPreparing(e) {
    const dataGrid = e.component;
    const toolbarItems = e.toolbarOptions.items;
    const searchPanel = $.grep(toolbarItems, function (item: any) {
      return item.name === 'searchPanel';
    })[0];
    if (searchPanel !== undefined) {
      searchPanel.location = 'before';
    }
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          icon: 'spinnext',
          type: 'default',
          hint: "Expand all",
          onClick(e) {
            const expanding = e.component.option('icon') === 'spinnext';
            dataGrid.option('grouping.autoExpandAll', expanding);
            e.component.option('icon', expanding ? 'spindown' : 'spinnext');
            e.component.option('hint', expanding ? 'Collapse all' : 'Expand all');
          },
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
          onClick: () => this.refreshData(),
        }
      });
  }

  calculateAge(rowData) {
    try {
      if (rowData.birthDate) {
        const timeDiff = Math.abs(Date.now() - new Date(rowData.birthDate).getTime());
        const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        return age;
      }
    } catch (e) { return '0'; }
  }

  onFocusedRowChanged(e) {
    this.selectedRowsData = e.row.data;
  }

  stateSelectedHandler(e) {
    this.fileName = "InvoicesReport(" + e + ")-" + formatDate(new Date(), "dd-MM-yyyy", 'en');
  }
}