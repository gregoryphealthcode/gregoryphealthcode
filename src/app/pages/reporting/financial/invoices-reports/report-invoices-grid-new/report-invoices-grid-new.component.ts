import { Component, OnInit, ViewChild } from '@angular/core';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { SafeUrl } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { DocumentsService } from 'src/app/shared/services/documents.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { BillingService } from 'src/app/shared/services/billing.service';
import { UserStore } from 'src/app/shared/stores/user.store';
import { element } from 'protractor';
import { MedSecSiteSelectorComponent } from 'src/app/shared/components/med-sec-site-selector/med-sec-site-selector/med-sec-site-selector.component';
import { GridWithStateStoreDirective } from 'src/app/shared/directives/grid-with-state-store.directive';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-report-invoices-grid-new',
  templateUrl: './report-invoices-grid-new.component.html',
  styleUrls: ['./report-invoices-grid-new.component.scss'],
})
export class ReportInvoicesGridNewComponent extends GridBase implements OnInit {
  @ViewChild(MedSecSiteSelectorComponent) siteSelector: MedSecSiteSelectorComponent;
  @ViewChild(GridWithStateStoreDirective) gridWithStateStoreDirective: GridWithStateStoreDirective;

  startDate;
  endDate;
  selectedRowsData = null;
  showVAT = false;
  invprintBlobUrl: SafeUrl;
  fileName = "InvoicesReport(Default)-" + formatDate(new Date(), "dd-MM-yyyy", 'en');
  isMedSec = false;
  showCancelled: boolean = false;
  toolbarItems = null;

  contextMenuItems = [
    {
      text: 'Print Invoice',
      icon: 'fas fa-print'
    },
    {
      text: 'Download As PDF',
      icon: 'fas fa-download'
    },
  ];

  constructor(
    public appInfo: AppInfoService,
    private documentsService: DocumentsService,
    private appMessages: AppMessagesService,
    private billingService: BillingService,
    public userStore: UserStore,
  ) {
    super();
  }

  ngOnInit() {
    this.isMedSec = this.userStore.isMedSecUser();

    if (this.isMedSec) {
      const year = new Date().getFullYear();
      this.startDate = new Date(year + '-04-01')
      this.endDate = new Date((year + 1) + '-03-31')
    }
    else {
      this.startDate = new Date(this.appInfo.getFinancialYearStart);
      this.endDate = new Date(this.appInfo.getFinancialYearEnd);
    }

    this.controllerUrl = `${environment.baseurl}/invoice/`;
    this.setupDataSource({
      key: 'uniqueNo',
      loadParamsCallback: () => [
        { name: 'startDate', value: this.startDate ? this.startDate.toISOString() : undefined },
        { name: 'endDate', value: this.endDate ? this.endDate.toISOString() : undefined },
        { name: 'showCancelled', value: this.showCancelled ? this.showCancelled : false },
      ],
    });
  }

  onToolbarPreparing(e) {
    const dataGrid = e.component;
    // e.multiline = true;
    e.toolbarOptions.multiline = true;
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
          elementAttr: { id: 'ToDateBox' },
          width: 130,
          displayFormat: this.appInfo.getDateFormat,
          value: this.endDate,
          type: 'date',
          hint: "Select to date",
          onValueChanged: this.endDateChanged.bind(this)
        }
      },
      {
        location: 'center',
        widget: 'dxCheckBox',
        locateInMenu: 'auto',
        options: {
          name: 'checkbox',
          text: 'Include Cancelled',
          width: 130,
          value: this.showCancelled,
          type: 'boolean',
          hint: "Select to date",
          elementAttr: {
            class: "mt-3"
          },
          onValueChanged: this.statusChanged.bind(this)
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

  statusChanged(e) {
    this.showCancelled = e.value;
    this.refreshData();
  }

  onFocusedRowChanged(e) {
    this.selectedRowsData = e.row.data;
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

  handleItemClickEvent(e) {
    if (this.selectedRowsData.correspondenceId) {
      if (e.itemIndex == 0) {
        this.subscription.add(this.documentsService.viewCorrespondence(this.selectedRowsData.correspondenceId).subscribe())
      }
      if (e.itemIndex == 1) {
        this.downloadFile(this.selectedRowsData);
      }
    }
    else {
      this.appMessages.showFailedSnackBar("PDF invoice could not be found or has not been generated");
    }
  }

  stateSelectedHandler(e) {
    this.fileName = "InvoicesReport(" + e + ")-" + formatDate(new Date(), "dd-MM-yyyy", 'en');
  }

  downloadFile(x) {
    this.billingService.getInvoicePdf(x.invoiceId).subscribe(data => {
      if (data) {
        var blob = this.b64toBlob(data.fileAsBase64String);
        saveAs(blob, data.fileName);
      }
    })
  }

  b64toBlob: any = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }


  checkboxChanged(e) {
    // if (e.source.name == "Active")
    //   this.inactive = !this.inactive;
    // if (e.source.name == "Debtors")
    //   this.debtors = !this.debtors;
    // if (e.source.name == "Deceased")
    //   this.deceased = !this.deceased;
    // this.reloadData();
  }

  openSiteSelectorModelHandler() {
    this.siteSelector.show();
  }

  siteSelectorHandler() {
    this.gridWithStateStoreDirective.save();
  }
}
