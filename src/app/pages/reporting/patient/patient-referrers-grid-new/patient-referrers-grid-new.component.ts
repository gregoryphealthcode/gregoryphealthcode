import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridBase } from 'src/app/shared/base/grid.base';
import { MedSecSiteSelectorComponent } from 'src/app/shared/components/med-sec-site-selector/med-sec-site-selector/med-sec-site-selector.component';
import { GridWithStateStoreDirective } from 'src/app/shared/directives/grid-with-state-store.directive';
import { AppInfoService } from 'src/app/shared/services';
import { UserStore } from 'src/app/shared/stores/user.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-patient-referrers-grid-new',
  templateUrl: './patient-referrers-grid-new.component.html',
  styleUrls: ['./patient-referrers-grid-new.component.scss']
})
export class PatientReferrersGridNewComponent extends GridBase implements OnInit {
  @ViewChild(MedSecSiteSelectorComponent) siteSelector: MedSecSiteSelectorComponent;
  @ViewChild(GridWithStateStoreDirective) gridWithStateStoreDirective: GridWithStateStoreDirective;

  selectedRowsData = null;
  fileName = "ReferrerReport(Default)-" + formatDate(new Date(), "dd-MM-yyyy", 'en');
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

    this.controllerUrl = `${environment.baseurl}/patientReferrer/`;
    this.setupDataSource({
      key: 'uniqueNo',
      /* loadParamsCallback: () => [
        
      ], */
    });
  }

  onToolbarPreparing(e) {
    const dataGrid = e.component;
    this.toolbarItems = e.toolbarOptions.items;
    const searchPanel = $.grep(this.toolbarItems, function (item: any) {
      return item.name === 'searchPanel';
    })[0];
    if (searchPanel !== undefined) {
      searchPanel.location = 'before';
    }
    e.toolbarOptions.items.unshift(

      {
        location: 'after',
        widget: 'dxButton',
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
    if (!this.isMedSec)
      this.fileName = "InvoicesReport(" + e + ")-" + formatDate(new Date(), "dd-MM-yyyy", 'en');
  }

  openSiteSelectorModelHandler() {
    this.siteSelector.show();
  }

  siteSelectorHandler() {
    this.gridWithStateStoreDirective.save();
  }
}