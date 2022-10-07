// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { thickness } from 'devexpress-reporting/scopes/reporting-chart-internal';
import Guid from 'devextreme/core/guid';
import { tap } from 'rxjs/operators';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { BillingService, TaskTypeModel } from 'src/app/shared/services/billing.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { InvoiceAddEditStoreService } from '../../invoice-add-edit-store.service';
import { InvoiceAddEditService } from '../../invoice-add-edit.service';
import { GetInvoicePaymentNotificationsResponseModel, InvoicePaymentNotificationsService } from '../../invoice-payment-notifications/invoice-payment-notifications.service';

@Component({
  selector: 'app-invoice-task-add',
  templateUrl: './invoice-task-add.component.html',
  styleUrls: ['./invoice-task-add.component.scss']
})
export class InvoiceTaskAddComponent extends ReactiveFormBase implements OnInit {
  @Input() invoiceId: string;
  @Input() taskId: string;
  @Output() saved = new EventEmitter();

  public notifications: GetInvoicePaymentNotificationsResponseModel[];
  public taskTypes: TaskTypeModel[] = [];
  public showForm: boolean;
  public min = new Date();
  public patientId: Guid;

  constructor(
    private formBuilder: FormBuilder,
    private store: InvoiceAddEditStoreService,
    private paymentNotificationsService: InvoicePaymentNotificationsService,
    private billingService: BillingService
  ) {
    super();
  }

  protected httpRequest = (x: any) => {
    if (this.taskId) {
      return this.billingService.updateInvoiceTask(x);
    }
    else {
      return this.billingService.addInvoiceTask(x);
    }
  }

  protected onSuccessfullySaved = (x: any) => {
    this.taskId = null;
    this.editForm.reset();
    this.saved.emit();
  }

  ngOnInit() {
    this.patientId = this.store.getPatientId;

    this.getInvoiceTaskTypes();
    this.setupForm();

    if (this.taskId) {
      this.isNew = false;
      this.billingService.getInvoiceTaskDetails(this.taskId).subscribe(data => {
        super.populateForm(data);
      })
    }

    this.addToSubscription(
      this.paymentNotificationsService.getAll(this.invoiceId).pipe(tap(x => {
        x.forEach(el => el.leftAmount = el.initialAmount - el.paidAmount - el.reallocatedAmount);
        this.notifications = x;
      }
      )))
  }

  payorSelectedHandler(e) {
    this.editForm.patchValue({ payorId: e.payorId, payorName: e.displayName });
  }

  getInvoiceTaskTypes() {
    this.billingService.getInvoiceTaskTypes().subscribe(x => {
      this.taskTypes = x;
    });
  }

  private setupForm() {
    this.editForm = this.formBuilder.group({
      id: new FormControl(null),
      patientId: new FormControl(this.patientId),
      invoiceId: new FormControl(this.invoiceId),
      payorId: new FormControl(null, Validators.required),
      payorName: new FormControl(null),
      taskTypeId: new FormControl(null, Validators.required),
      note: new FormControl(null),
      dueDateTime: new FormControl(null, Validators.required),
      isCompleted: new FormControl(false),
    });
  }

  close() {
    this.taskId = null;
    this.editForm.reset();
    this.closed.emit();
  }
}
