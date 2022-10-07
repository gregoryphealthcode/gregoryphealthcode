import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridComponent, DxPopupComponent } from 'devextreme-angular';
import notify from "devextreme/ui/notify";
import { switchMap, tap } from 'rxjs/operators';
import { AddEditBulkPaymentBase } from 'src/app/shared/components/bulk-payments/add-edit-bulk-payment-form.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BillingService } from 'src/app/shared/services/billing.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UserStore } from 'src/app/shared/stores/user.store';

@Component({
  selector: 'app-bulk-payment-details',
  templateUrl: './bulk-payment-details.component.html',
  styleUrls: ['./bulk-payment-details.component.scss']
})
export class BulkPaymentDetailsComponent extends AddEditBulkPaymentBase implements OnInit {
  constructor(
    public appInfo: AppInfoService,
    public userStore: UserStore,
    private router: Router,
    private authService: AuthService,
    siteService: UserService,
    private appMessage: AppMessagesService,
    private changeDetectorRef: ChangeDetectorRef,
    private billingService: BillingService,
    private spinnerService: SpinnerService
  ) {
    super(changeDetectorRef, appInfo, siteService, userStore);
    this.isNew = false;
  }

  httpRequest = (x: any) => this.save$(x);

  @Input() bulkPaymentId: string;
  @Input() isNew = false;
  @Input() isPopup = false;
  @Output() closePopup = new EventEmitter();
  @Output() siteIdChanged = new EventEmitter<string>();

  @ViewChild(DxDataGridComponent) bulkPaymentsGrid: DxDataGridComponent;
  @ViewChild("allocationPopup") allocationPopup: DxPopupComponent;
  @ViewChild("reallocationPopup") reallocationPopup: DxPopupComponent;
  @ViewChild("deletePopup") deletePopup: DxPopupComponent;

  total: string;
  email: string;

  payorTypeDDL: string;
  linkedTo: any[] = [];

  tabs = [
    {
      id: 1,
      title: "Outstanding Invoices",
      template: "OutstandingInvoicesTemplate",
    },
    {
      id: 2,
      title: "Payment Allocation",
      template: "PaymentAllocationTemplate",
    },
  ];

  ngOnInit() {
    super.ngOnInit()
    this.getBulkPayment(this.bulkPaymentId);
  }

  save$(x) {
    this.spinnerService.start();

    if (this.isNew) {
      this.setFormPropertyValue('unallocated', this.getFormPropertyValue('total'))
    }

    return this.billingService.updateBulkPayment(x)
      .pipe(tap(x => {
        notify('Payment saved successfully.', 'success');
      },
        (error: any) => this.appMessage.showApiErrorNotification(error)),
        switchMap(() => this.getBulkPayment$(this.bulkPaymentId))
      );
  }

  getBulkPayment(id: string) {
    this.spinnerService.start();
    this.subscription.add(
      this.getBulkPayment$(id).subscribe(
        (data) => {
          this.spinnerService.stop();
        },
        (error) => {
          notify("An error occurred.", "error");
          this.spinnerService.stop();
        }
      )
    )
  }

  private getBulkPayment$(id: string) {
    return this.billingService
      .getBulkPayment(id)
      .pipe(tap((x) => { this.populateForm(x); this.siteIdChanged.emit(x.siteId) }),
        switchMap(x => this.getMethodTypes$()));

  }

  return() {
    if (this.isPopup) {
      this.closePopup.emit();
    } else {
      this.router.navigate(["/accounts/bulk-payments"]);
    }
  }

  cancelDelete() {
    this.deletePopup.instance.hide();
  }

  confirmDelete() {
    this.spinnerService.start();
    this.subscription.add(
      this.billingService
        .deleteBulkPayment(this.bulkPaymentId)
        .subscribe(
          (data) => {
            if (data) {
              this.spinnerService.stop();
              notify("Deleted successfully", "success");
              this.router.navigate(["/accounts/bulk-payments"]);
            } else {
              this.spinnerService.stop();
              notify("An error occurred.", "error");
            }
          },
          (error) => {
            this.spinnerService.stop();
            notify("An error occurred.", "error");
            this.changeDetectorRef.detectChanges();
          }
        )
    );
  }

  delete() {
    const text = `Are you sure you want to delete this payment and all associated  allocations?`;
    this.appMessage.showAskForConfirmationModal(
      `Delete Bulk Payment`,
      text,
      () => {
        this.confirmDelete();
      },
      () => { }
    );
    return;
  }
}
