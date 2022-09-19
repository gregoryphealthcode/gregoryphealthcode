import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from '../../base/subscribtion.base';
import { AppInfoService } from '../../services';
import { SitesStore } from '../../stores/sites.store';
import { BillingService, InvoiceDataModel, InvoiceAppointmentDetailsDataModel, GetBulkPaymentShortFallsViewModel } from '../../services/billing.service';
import { SpinnerService } from '../../services/spinner.service';
import { StatusCode } from 'src/app/_helpers/StatusCode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DxDataGridComponent } from 'devextreme-angular';
import { CorrespondenceTypes } from '../../models/CorrespondenceTypes';
import { DocumentTemplateViewModel, SitesService } from '../../services/sites.service';
import { ErrorDialogTemplateComponent } from '../dialog/error-dialog-template.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-bulk-payments-reallocation',
  templateUrl: './bulk-payments-reallocation.component.html',
  styleUrls: ['./bulk-payments-reallocation.component.scss']
})
@AutoUnsubscribe
export class BulkPaymentsReallocationComponent extends SubscriptionBase implements OnInit {
  constructor(public appInfo: AppInfoService,
    private siteStore: SitesStore,
    private billingService: BillingService, private spinner: SpinnerService,
    private snackBar: MatSnackBar, private site: SitesService, private dialog: MatDialog) {
    super();
  }

  @ViewChild('reallocationGrid') reallocationGrid: DxDataGridComponent;

  @Input() hasPatientZone = true;
  @Input()
  get reallocations(): GetBulkPaymentShortFallsViewModel[] {
    return this._reallocations;
  }
  set reallocations(value: GetBulkPaymentShortFallsViewModel[]) {
    this._reallocations = value;
  }

  @Output() onNoDefaultTemplatesFound = new EventEmitter<boolean>()
  @Output() saveAddress = new EventEmitter();
  @Output() formClosed = new EventEmitter();

  private _reallocations: GetBulkPaymentShortFallsViewModel[];

  reallocate: true;
  templates: DocumentTemplateViewModel[] = [];
  errors: any[] = [];
  showPanel = false;
  showAddress = false;
  showTelecoms = false;
  patientId: string;
  siteId: string;
  focusedRowKey = -1;
  noReallocate = true;
  correspondenceType: string;

  ngOnInit(): void {
    this.getTemplates();

  }

  save() {
    this.spinner.start();
    let counter = 0;

    this.reallocations.forEach(val => {
      if (val.reallocation === true) {
        const invoiceVM = new InvoiceDataModel();
        const selectedSite = this.siteStore.getSelectedSite();

        invoiceVM.status = 'issued';
        invoiceVM.siteId = val.siteId;
        invoiceVM.parentId = val.invoiceId;
        invoiceVM.patientId = val.patientId;
        invoiceVM.totalGross = val.balanceDue;
        invoiceVM.fullName = val.patientName;
        invoiceVM.recipientId = val.patientId;
        invoiceVM.invoiceNumber = val.invoiceNumber;
        invoiceVM.totalNett = val.balanceDue;
        invoiceVM.invoiceEpisode = new InvoiceAppointmentDetailsDataModel();
        invoiceVM.siteRef = selectedSite.siteRef;

        if (val.shortfallLetter.templateId.toLowerCase() !== 'none') {
          this.subscription.add(this.billingService.reallocateBulkInvoiceAmount(invoiceVM, val.shortfallLetter.templateId, this.hasPatientZone).subscribe(value => {
            counter += 1;
            if (value.isSuccess && value.statusCode === StatusCode.success) {
              val.completed = 'true';
              if (this.reallocations.length === counter) {
                this.noReallocate = true;
                this.spinner.stop();
                this.snackBar.open('Saved', 'Close', {
                  panelClass: 'badge-success',
                  duration: 3000
                });
                this.formClosed.emit();
              }
            }
            if (!value.isSuccess && value.statusCode == StatusCode.PatientZoneError) {
              const result = JSON.parse(value.payload);

              this.showErrors(result);
              this.errors = result;
              this.spinner.stop();
              val.completed = 'false';
            }
          },
            error => {
              this.spinner.stop();
              this.snackBar.open('An error occurred', 'Close', {
                panelClass: 'badge-danger',
                duration: 3000
              });
            }));
        }
      }
    });
  }

  onFocusedRowChanged(e) {
    if (e.row.data.status !== null) {
      this.patientId = e.row.data.patientId;
      this.siteId = e.row.data.siteId;
      this.showPanel = true;
      if (e.row.data.statusCode === StatusCode.MissingBillingAddress) {
        this.showAddress = true;
        this.showTelecoms = false;
      }
      if (e.row.data.statusCode === StatusCode.MissingEmail || e.row.data.statusCode === StatusCode.InvalidMobileNumber) {
        this.showTelecoms = true;
        this.showAddress = false;
      }
    }
  }

  refresh(val) {
  }

  close() {
    this.formClosed.emit();
  }

  updateShortfallLetterValue(e, f) {
    f.shortfallLetter = e.value;
    this.correspondenceType = f.value;
  }

  updateValue(e, f) {
    f.reallocation = e.value;
    const res = this.reallocations.find(x => x.reallocation === true);
    if (res === undefined) {
      this.noReallocate = true;
    }
    else {
      this.noReallocate = false;
    }

  }
  updateSendValue(e, f) {
    f.sendElectronically = e.value;
  }

  getTemplates() {
    this.subscription.add(this.site.getTemplatesByType(CorrespondenceTypes.Reallocation).subscribe(data => {
      this.templates = data;
      const defaultTemplate = this.templates.find(x => x.default === true);

      if (defaultTemplate) {
        this.correspondenceType = defaultTemplate.templateId;
      }

      var pzTemplate = data.find(x => x.isPatientZone);

      if (!pzTemplate) {
        pzTemplate = defaultTemplate;

        if (pzTemplate) {
          this.correspondenceType = pzTemplate.templateId;
        }
      }

      if (!this.correspondenceType) {
        this.onNoDefaultTemplatesFound.emit(true);
      }
    }));
  }

  showErrors(errorMessage) {
    const dialogRef = this.dialog.open(ErrorDialogTemplateComponent, {
      width: '550px',
      data: {
        title: 'Errors',
        errorData: errorMessage
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.errors = errorMessage;
      }
    });
  }
}