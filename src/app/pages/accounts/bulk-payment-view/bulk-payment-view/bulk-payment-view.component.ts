import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import Guid from 'devextreme/core/guid';
import { tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { DialogTemplateComponent } from 'src/app/shared/components/dialog/dialog-template.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BulkPaymentViewStore } from '../account-bulk-payment-store.service';

@Component({
  selector: 'app-bulk-payment-view',
  templateUrl: './bulk-payment-view.component.html',
  styleUrls: ['./bulk-payment-view.component.scss'],
  providers: [BulkPaymentViewStore],
})
export class BulkPaymentViewComponent extends SubscriptionBase implements OnInit {
  public bulkPaymentId: Guid;

  constructor(
    private route: ActivatedRoute,
    public store: BulkPaymentViewStore,
    public dialog: MatDialog,
    private authService: AuthService,
  ) {
    super();
  }

  ngOnInit() {  
    this.addToSubscription(
      this.route.params.pipe(
        tap((params) => {
          this.bulkPaymentId = params.bulkPaymentId;
          this.store.getBulkPayment(params.bulkPaymentId);
        })
      )
    );
  }

  delete() {
    const dialogRef = this.dialog.open(DialogTemplateComponent, {
      width: '250px',
      data: {
        title: 'Are you sure?',
        message: 'Are you sure you want to delete this payment and all associated allocations?',
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true)
        this.store.deleteBulkPayment$();
    });
  }

  printReceipt() {
    this.store.generateBulkPaymentReceipt$();
  }

  viewClicked() {
    this.store.setTab(1);
  }
}