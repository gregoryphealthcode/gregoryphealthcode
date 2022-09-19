import { NgModule, Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { DxFormModule, DxButtonModule, DxPopupModule, DxBoxModule, DxCheckBoxModule, DxDataGridModule, DxContextMenuModule, DxSwitchModule, DxToolbarModule, DxPopupComponent, DxSelectBoxModule } from 'devextreme-angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppInfoService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { MomentModule } from 'ngx-moment';
import { saveAs } from 'file-saver';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { UserStore } from 'src/app/shared/stores/user.store';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { PatientAccountsInvoiceItemsModule } from '../patient-accounts-invoice-items/patient-accounts-invoice-items.module';
import { PatientAccountsTransactionsModule } from '../patient-accounts-transactions/patient-accounts-transactions.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BillingModule } from '../../accounts/billing/billing.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { GridBase } from 'src/app/shared/base/grid.base';
import Guid from 'devextreme/core/guid';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { DocumentsStoreService } from 'src/app/shared/services/documents-store.service';
import { PdfPreviewPopupModule } from 'src/app/shared/components/pdf-preview-popup/pdf-preview-popup.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { InvoiceModule } from '../../accounts/invoice-add-edit/invoice.module';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { InvoiceAddEditService } from '../../accounts/invoice-add-edit/invoice-add-edit.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-patient-accounts',
  templateUrl: './patient-accounts.component.html',
  styleUrls: ['./patient-accounts.component.scss'],
  providers: [DocumentsStoreService]
})

@AutoUnsubscribe
export class PatientAccountsComponent extends GridBase implements OnInit {
  @ViewChild('invoiceprintpopup') invoiceprintPopup: DxPopupComponent;
  @ViewChild('invprintIframe') invprintIframe: ElementRef;

  @Input() patientId: Guid;
  @Input() patientName: string;
  @Input() tabIndex: number;

  private searchTerms = new BehaviorSubject<string>(undefined);
  public selectedInvoice: any;

  invoiceId: string;
  searchTerm = '';
  searchField = '';
  documentApiUrl = environment.documentApiUrl;
  invprintBlobUrl: SafeUrl;
  selectedRowsData: any;

  unpaid = true;
  hideCancelledInvoices = true;

  contextMenuItems = [
    {
      text: 'Reprint Invoice',
      icon: 'fas fa-print'
    },
    {
      text: 'Preview Printed Invoice',
      icon: 'fas fa-eye'
    },
    { text: 'Download As PDF', icon: 'fas fa-download' },
  ];

  newInvoiceButtonOptions = {
    text: 'New Invoice',
    hint: 'click to create new invoice',
    stylingMode: 'filled',
    width: 'auto',
    type: 'default',
    onClick: () => {
      this.quickeBill(this.patientId);
    }
  };

  printStatementButtonOptions = {
    text: 'Print Statement',
    hint: 'click to print patient statement',
    stylingMode: 'filled',
    width: 'auto',
    type: 'default'
  };

  paymentButtonOptions = {
    text: 'Receive Payment',
    hint: 'click to receive payment',
    stylingMode: 'filled',
    width: 'auto',
    type: 'default'
  };


  constructor(
    public appInfo: AppInfoService,
    private userStore: UserStore,
    private http: HttpClient,
    private router: Router,
    private siteStore: SitesStore,
    private documentsService: DocumentsStoreService,
    private invoiceService: InvoiceAddEditService,
    private appMessage: AppMessagesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getPatientInvoices();

    this.subscription.add(
      this.searchTerms
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap((x) => {
            if (x !== undefined) this.refreshData();
          })
        )
        .subscribe()
    );
  }

  getPatientInvoices() {
    if (this.patientId != undefined) {
      this.controllerUrl = `${environment.baseurl}/patientInvoice/`;
      this.setupDataSource({
        key: 'invoiceId',
        loadParamsCallback: () => [
          { name: 'patientId', value: this.patientId },
          { name: 'unpaid', value: this.unpaid },
          { name: 'hideCancelledInvoices', value: this.hideCancelledInvoices },
          { name: 'searchTerm', value: this.searchTerm },
          { name: 'searchField', value: this.searchField },
        ],
      });
    }
  }

  invoiceprintpopupshown() {
    this.invprintIframe.nativeElement.contentWindow.print();
  }

  quickeBill(patientId: Guid) {
    sessionStorage.setItem('tabIndex', this.tabIndex.toString());
    this.router.navigate(['/accounts/invoice'], { queryParams: { patientId: patientId } });
  }

  checkboxChanged(e) {
    this.unpaid = !this.unpaid;
    this.getPatientInvoices();
  }

  checkboxHideCancelledInvoicesChanged(e) {
    this.hideCancelledInvoices = !this.hideCancelledInvoices;
    this.getPatientInvoices();
  }

  clearSearch() {
    this.searchTerm = '';
    this.refreshData();
  }

  search(e) {
    this.searchTerm = e.target.value;
    this.searchTerms.next(this.searchTerm);
  }

  onFocusedRowChanged(e) {
    this.invoiceId = e.row.data.invoiceId;
    this.selectedRowsData = e.row.data;
  }

  onRowPrepared(e): void {
    e.rowElement.style.height = '20px';
  }

  printInvoice(data) {
    if (data.correspondenceId) {
      this.subscription.add(
        this.documentsService.openPdfInPopup({ correspondenceId: data.correspondenceId }).subscribe()
      )
    }

  }

  clone(e) {
    this.invoiceService.cloneInvoice(e.data.invoiceId).subscribe(data => {
      const invoiceId = data.data;
      this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId } });
    },
      error => {
        this.appMessage.showApiErrorNotification(error);
      }
    );
  }

  public downloadInvoiceAsPDF(InvNo, InvoiceId, UniqueNo) {
    const invoiceDetails = {
      userId: this.userStore.getUserId(),
      invoiceId: InvoiceId,
      uniqueNo: UniqueNo,
      token: null
    };
    const options = {
      headers: { Authorization: 'Bearer ' + this.userStore.getAuthToken() },
      responseType: 'blob' as 'json'
    };
    this.http.post<any>(`${environment.documentApiUrl}/Home/GetPDFInvoice`, invoiceDetails, options).subscribe((res: Blob) => {
      saveAs(res, this.patientName + '_Invoice_' + InvNo + '.pdf');
    });
  }

  public previewInvoiceAsPDF(InvoiceId, UniqueNo) {
    const invoiceDetails = {
      userId: this.userStore.getUserId(),
      invoiceId: InvoiceId,
      uniqueNo: UniqueNo,
      token: null
    };
    const options = {
      headers: { Authorization: 'Bearer ' + this.userStore.getAuthToken() },
      responseType: 'blob' as 'json'
    };
    this.http.post<any>(`${environment.documentApiUrl}/Home/GetPDFInvoice`, invoiceDetails, options).subscribe((res: Blob) => {
      const blobUrl = URL.createObjectURL(res);
      const win = window.open(blobUrl, '_blank');
    });
  }

  editInvoice(e) {
    if (e.data.statusId !== 5) {
      const invoiceId = this.invoiceId;
      sessionStorage.setItem('tabIndex', this.tabIndex.toString());
      this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId } });
    }
  }

  handleItemClickEvent(e) {
    const itemIndex = e.itemIndex;
    if (itemIndex === 1) { // preview printed invoice
      this.previewInvoiceAsPDF(this.selectedRowsData.InvoiceId, this.selectedRowsData.UniqueNo);
    }
    if (itemIndex === 2) { // download invoice as pdf
      this.downloadInvoiceAsPDF(this.selectedRowsData.InvoiceNumber, this.selectedRowsData.InvoiceId, this.selectedRowsData.UniqueNo);
    }
  }

  setSearchItem(e) {
    this.refreshData();
  }

  cloneInvoice(e) {
    this.appMessage.showAskForConfirmationModal("Are you sure?", "Are you sure you want to copy this invoice?", () => {
      this.invoiceService.cloneInvoice(e.data.invoiceId).subscribe(data => {
        if (data.success) {
          const invoiceId = data.data;
          this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId } });
        }
        else {
          this.appMessage.showApiErrorNotification(data.errors[0]);
        }
      });
    });
  }

  getInfo(e) {
  }
}

@NgModule({
  declarations: [PatientAccountsComponent],
  imports: [
    DxDataGridModule, DxBoxModule, DxButtonModule, DxContextMenuModule, DxCheckBoxModule,
    CommonModule, DxFormModule, DxSwitchModule, DxToolbarModule, DxPopupModule,
    MomentModule, PatientAccountsInvoiceItemsModule, PatientAccountsTransactionsModule,
    MatIconModule, MatButtonModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule,
    BillingModule, DirectivesModule, PopUpFormModule, PdfPreviewPopupModule,
    AppButtonModule, InvoiceModule, GridSearchTextBoxModule, DxSelectBoxModule
  ],
  exports: [PatientAccountsComponent]
})

export class PatientAccountsModule { }
