import { Component, OnInit } from '@angular/core';
import { tap, switchMap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { BillingService, InvoiceTaskModel, } from 'src/app/shared/services/billing.service';
import { InvoiceAddEditStoreService } from '../invoice-add-edit-store.service';

@Component({
  selector: 'app-invoice-tasks',
  templateUrl: './invoice-tasks.component.html',
  styleUrls: ['./invoice-tasks.component.scss']
})
export class InvoiceTasksComponent extends SubscriptionBase implements OnInit {
  public showAdd: boolean;
  public invoiceId: string;
  public tasks: InvoiceTaskModel[];
  public taskId;

  constructor(
    private billingService: BillingService,
    public store: InvoiceAddEditStoreService,
    public appMessages: AppMessagesService,
  ) {
    super();
  }

  ngOnInit() {
    this.addToSubscription(
      this.store.invoiceId$.pipe(
        tap(x => this.invoiceId = x),
        switchMap(
          id => this.getRecords$(id)
        )
      )
    )

    this.addToSubscription(
      this.store.tasksChanged$.pipe(
        switchMap(() => this.getRecords$(this.invoiceId))
      )
    )
  }

  private getRecords$(invoiceId) {
    return this.billingService.getInvoiceTasks(invoiceId).pipe(
      tap(
        x => {
          this.tasks = x;
          if (this.tasks.length === 0) {
            this.showAdd = true;
          }
        }
      )
    )
  }

  public deleteClicked(e) {
    const text = 'Are you sure you want to delete this task?'

    const callback = () => {
      this.billingService.deleteInvoiceTask(e.taskId).subscribe(x => {
        if (x.success) {
          this.appMessages.showSuccessInformationModal(
            "Task successfully deleted!"
          );
          this.store.tasksUpdated();
        } else {
          this.appMessages.showSwallError("Unable to delete task!")
        }
      });
    };

    this.appMessages.showDeleteConfirmation(callback, text);
  }

  public editClicked(e) {
    if (this.showAdd)
      return;

    this.taskId = e.taskId;
    this.showAdd = true;
  }

  public savedHandler(e) {
    this.showAdd = false;
    this.store.tasksUpdated()
  }
}
