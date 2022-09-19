import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AddEditBulkPaymentBase } from 'src/app/shared/components/bulk-payments/add-edit-bulk-payment-form.base';
import { AppInfoService } from 'src/app/shared/services';
import { BillingService, BulkPaymentViewModel } from 'src/app/shared/services/billing.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UserStore } from 'src/app/shared/stores/user.store';
import { BulkPaymentViewStore } from '../account-bulk-payment-store.service';

@Component({
  selector: 'app-bulk-payment-header',
  templateUrl: './bulk-payment-header.component.html',
  styleUrls: ['./bulk-payment-header.component.scss']
})
export class BulkPaymentHeaderComponent extends AddEditBulkPaymentBase implements OnInit {
  public updating = false;
  public startingValues: BulkPaymentViewModel;

  constructor(
    public appInfo: AppInfoService,
    public userStore: UserStore,
    siteService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private billingService: BillingService,
    private spinnerService: SpinnerService,
    public store: BulkPaymentViewStore
  ) {
    super(changeDetectorRef, appInfo, siteService, userStore);
  }

  httpRequest = x => {
    this.updating = false;
    return this.billingService.updateBulkPayment(x)
  };

  ngOnInit() {
    super.ngOnInit()

    this.addToSubscription(
      this.store.bulkPayment$.pipe(tap(x => {
        this.startingValues = x;
        this.populateForm(x);
      }))
    )

    this.addToSubscription(
      this.store.totalChanged$.pipe(tap(x => {
        this.editForm.patchValue({ total: x });
      }))
    )

    this.subscription.add(this.editForm.get('dateCreated').valueChanges.subscribe(x => {
      if (this.startingValues && x != this.startingValues.dateCreated)
        this.updating = true;
    }))

    this.subscription.add(this.editForm.get('total').valueChanges.subscribe(x => {
      if (this.startingValues && x != this.startingValues.total)
        this.updating = true;
    }))

    this.subscription.add(this.editForm.get('methodId').valueChanges.subscribe(x => {
      if (this.startingValues && x != this.startingValues.methodId)
        this.updating = true;
    }))

    this.subscription.add(this.editForm.get('payorRef').valueChanges.subscribe(x => {
      if (this.startingValues && x != this.startingValues.payorRef)
        this.updating = true;
    }))

    this.subscription.add(this.editForm.get('comments').valueChanges.subscribe(x => {
      if (this.startingValues && x != this.startingValues.comments)
        this.updating = true;
    }))    
  }
}
