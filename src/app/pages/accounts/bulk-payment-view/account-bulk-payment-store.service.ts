import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import notify from "devextreme/ui/notify";
import { BehaviorSubject } from "rxjs";
import { AppInfoService } from "src/app/shared/services";
import { AppMessagesService } from "src/app/shared/services/app-messages.service";
import { BillingService, BulkPaymentViewModel, GetBulkPaymentShortFallsViewModel, OutstandingInsurerInvoicesViewModel, PaymentAllocationViewModel } from "src/app/shared/services/billing.service";
import { DocumentsService } from "src/app/shared/services/documents.service";
import { SpinnerService } from "src/app/shared/services/spinner.service";
import { GetInvoicePayorResponseModel, InvoiceAddEditService } from "../invoice-add-edit/invoice-add-edit.service";

@Injectable()
export class BulkPaymentViewStore {
    private bulkPaymentId = new BehaviorSubject<string>(undefined);
    public bulkPaymentId$ = this.bulkPaymentId.asObservable();

    private payorId = new BehaviorSubject<string>(undefined);
    public payorId$ = this.payorId.asObservable().pipe();

    private siteId = new BehaviorSubject<string>(undefined);
    public siteId$ = this.siteId.asObservable();

    private bulkPayment = new BehaviorSubject<BulkPaymentViewModel>(undefined);
    public bulkPayment$ = this.bulkPayment.asObservable().pipe();

    private invoices = new BehaviorSubject<OutstandingInsurerInvoicesViewModel[]>(undefined);
    public invoices$ = this.invoices.asObservable();

    private allocations = new BehaviorSubject<PaymentAllocationViewModel[]>(undefined);
    public allocations$ = this.allocations.asObservable();

    private shortfalls = new BehaviorSubject<GetBulkPaymentShortFallsViewModel[]>(undefined);
    public shortfalls$ = this.shortfalls.asObservable();

    private relatedPayors = new BehaviorSubject<GetInvoicePayorResponseModel[]>(undefined);
    public relatedPayors$ = this.relatedPayors.asObservable().pipe();

    private payorInfo = new BehaviorSubject<GetInvoicePayorResponseModel>(undefined);
    public payorInfo$ = this.payorInfo.asObservable();

    private allocated = new BehaviorSubject<number>(0);
    public allocated$ = this.allocated.asObservable();

    private unallocated = new BehaviorSubject<number>(0);
    public unallocated$ = this.unallocated.asObservable();

    private shortfall = new BehaviorSubject<number>(0);
    public shortfall$ = this.shortfall.asObservable();

    private tabIndex = new BehaviorSubject<number>(0);
    public tabIndex$ = this.tabIndex.asObservable();

    private totalChanged = new BehaviorSubject<number>(0);
    public totalChanged$ = this.totalChanged.asObservable();

    private currencySymbol: string;
    private currencyCode: string;
    private dateFormat: string;
    private total: number;
    private allocationsUnsaved = false;
    private allocationsSaved = false;
    public payorType: string;

    constructor(
        private spinner: SpinnerService,
        private billingService: BillingService,
        private appInfo: AppInfoService,
        private appMessages: AppMessagesService,
        private router: Router,
        private invoiceService: InvoiceAddEditService,
        private documentsService: DocumentsService,
        ) { }

    public setTab(tabIndex: number) {
        this.total = this.bulkPayment.value.total;
        this.unallocated.next(this.total);
        this.allocated.next(0);
        this.tabIndex.next(tabIndex);
    }

    public getBulkPayment(bulkPaymentId) {
        this.spinner.start();
        this.bulkPaymentId.next(bulkPaymentId);

        this.currencySymbol = this.appInfo.getCurrencySymbol;
        this.currencyCode = this.appInfo.getCurrencyCode;
        this.dateFormat = this.appInfo.getDateFormat;

        this.getBulkPaymentDetails$();
    }

    getBulkPaymentDetails$() {
        this.billingService.getBulkPayment(this.bulkPaymentId.value).subscribe(x => {
            this.spinner.stop();
            this.bulkPayment.next(x);
            this.payorId.next(x.payorId);
            this.payorType = x.payorType;
            this.siteId.next(x.siteId);
            this.total = x.total;
            this.shortfall.next(x.shortfalls);
            this.refreshData$();
        })
    }

    generateBulkPaymentReceipt$() {
        this.spinner.start();
        this.billingService.generateBulkPaymentReceipt(this.bulkPaymentId.value).subscribe(x => {
            this.spinner.stop();
            if (x.success) {
                this.appMessages.showSuccessSnackBar("Bulk payment receipt generated");
                this.documentsService.viewCorrespondence(x.data).subscribe();
            }
            if (x.errors) {
                this.appMessages.showSwallError(x.errors[0]);
            }
        },
            e => {
                this.spinner.stop();
                this.appMessages.showApiErrorNotification(e);
            }
        )
    }

    refreshData$() {
        this.getInvoices$();
        this.getAllocations$();
        this.getShortfalls$();
    }

    getInvoices$() {
        this.spinner.start();
        this.billingService.getOutstandingInvoices(this.payorId.value).subscribe(x => {
            this.invoices.next(x);
            this.spinner.stop();
        })
    }

    getAllocations$() {
        this.spinner.start();
        this.billingService.getBulkPaymentTransactions(this.bulkPaymentId.value).subscribe(x => {
            this.allocations.next(x);
            this.updateAllocated$(x);
            this.allocationsSaved = false;
            this.allocationsUnsaved = false;
            x.forEach(allocation => {
                if (!allocation.processed)
                    this.allocationsUnsaved = true;
                if (allocation.processed)
                    this.allocationsSaved = true;
            })
            this.spinner.stop();
        })
    }

    getShortfalls$() {
        this.spinner.start();
        this.billingService.getBulkPaymentShortFalls(this.bulkPaymentId.value).subscribe(x => {
            this.shortfalls.next(x);
            this.spinner.stop();
        })
    }

    getRelatedPayors$(patientId: string) {
        this.invoiceService.getPayors(patientId).subscribe(x => {
            this.relatedPayors.next(x);
        })
    }

    getPayorInfo$(payorId: string, type: number) {
        this.invoiceService.getPayor(payorId, type).subscribe(x => {
            this.payorInfo.next(x);
        });
    }

    saveAllocations$(allocations) {
        let valueToReturn;
        this.billingService.saveAllocationPayment({ bulkPaymentId: this.bulkPaymentId.value, allocations: allocations }).subscribe(x => {
            this.updateAllocated$(allocations);
            this.refreshData$();
            if (x.success)
                valueToReturn = true;
            else
                valueToReturn = false;
        });

        return valueToReturn;
    }

    updateAllocated$(allocations) {
        let unallocated = this.total;
        let allocated = 0;
        allocations.forEach(allocation => {
            allocated += allocation.allocation;
            unallocated -= allocation.allocation;
        });

        this.unallocated.next(unallocated);
        this.allocated.next(allocated);
    }

    updateAllocationAmount$(bulkPaymentTransactionId: string, allocation: number, comments: string) {
        this.billingService.editAllocationPayment(bulkPaymentTransactionId, allocation, comments).subscribe(x => {
            this.refreshData$();
            if (x.errors) {
                notify("An error occurred.", "error");
            }
        })
    }

    removeAllocation$(bulkPaymentTransactionId) {
        this.billingService.removeAllocationPayment(bulkPaymentTransactionId).subscribe(x => {
            this.refreshData$();
            if (x.success) {
                notify("Deleted successfully", "success");
            }
            if (x.errors) {
                notify("An error occurred.", "error");
            }
        })
    }

    adjustBulkPayment$(amountToIncrease) {
        this.billingService.increaseBulkPaymentTotal(this.bulkPaymentId.value, amountToIncrease).subscribe(x => {
            if (x.success) {
                this.total += amountToIncrease;
                this.allocated.next(this.total);
                this.unallocated.next(0);
                this.bulkPayment.value.total = this.total;
                this.totalChanged.next(this.total);
            }
            else
                this.appMessages.showApiErrorNotification(x.errors[0]);
        })
    }

    deleteBulkPayment$() {
        this.billingService.deleteBulkPayment(this.bulkPaymentId.value).subscribe(x => {
            this.refreshData$();
            if (x.success) {
                notify("Deleted successfully", "success");
                this.router.navigate(["/accounts/bulk-payments"]);
            }
            if (x.errors) {
                notify("An error occurred.", "error");
            }
        });
    }

    processAllocations$(allocations) {
        let valueToReturn;
        this.billingService.processBulkPaymentTransactions({ bulkPaymentId: this.bulkPaymentId.value, allocations: allocations }).subscribe(x => {
            this.getBulkPaymentDetails$();
            if (x.success)
                valueToReturn = true;
            else
                valueToReturn = false;
        },
        e => {
            valueToReturn = false;
            this.appMessages.showApiErrorNotification(e);
        }
        );

        return valueToReturn;
    }

    removePayorInfo$() {
        this.payorInfo.next(undefined);
    }

    public get getCurrency() {
        return this.currencyCode;
    }

    public get getDateFormat() {
        return this.dateFormat;
    }

    public get getTotal() {
        return this.total;
    }

    public get getAllocated() {
        return this.allocated.value;
    }

    public get getUnallocated() {
        return this.unallocated.value;
    }

    public get getShortfalls() {
        return this.shortfall.value;
    }

    public get getAllocationsSaved() {
        return this.allocationsSaved;
    }

    public get getAllocationsUnsaved() {
        return this.allocationsUnsaved;
    }
}