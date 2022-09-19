import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { DialogTemplateComponent } from 'src/app/shared/components/dialog/dialog-template.component';
import { calculateAgeValue } from 'src/app/shared/helpers/other';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { PatientDetailsResponseModelNew } from 'src/app/shared/services/patient.service';
import { InvoiceAddEditStoreService } from '../invoice-add-edit-store.service';
import { GetInvoiceDetailsResponse, GetInvoicePayorResponseModel } from '../invoice-add-edit.service';

@Component({
  selector: 'app-invoice-header',
  templateUrl: './invoice-header.component.html',
  styleUrls: ['./invoice-header.component.scss']
})
export class InvoiceHeaderComponent extends SubscriptionBase implements OnInit {
@Output() closed = new EventEmitter();

  public patientDetails: PatientDetailsResponseModelNew;
  public payor: GetInvoicePayorResponseModel;
  public invoiceDetails: GetInvoiceDetailsResponse;


  constructor(
    public store: InvoiceAddEditStoreService,
    public appInfo: AppInfoService,
    private dialog: MatDialog,
    private appMessages: AppMessagesService,
  ) {
    super()
  }

  ngOnInit() {
    this.addToSubscription(
      this.store.invoicePatientDetails$.pipe(tap(x => this.patientDetails = x)
      )
    )

    this.addToSubscription(
      this.store.invoicePayorDetails$.pipe(tap(x => this.payor = x)
      )
    )

    this.addToSubscription(
      this.store.invoiceMainDetails$.pipe(tap(x => this.invoiceDetails = x))
    )
  }

  close() {
    if (this.store.isSectionEdited == true) {
      this.appMessages.showInvoiceCloseConfirmationModal(() => {
        
      },
        () => { 
          this.store.setSectionToEdit(false);
          this.closed.emit();
          //this.store.goBack();
        },
      );
    }
    else {
      this.closed.emit();
      //this.store.goBack();
    }
  }

  cancel() {
    this.store.setToCancelled();
  }

  calculateAge(dob) {
    return calculateAgeValue(dob);
  }

  cloneInvoice() {
    this.appMessages.showAskForConfirmationModal("Are you sure?", "Are you sure you want to copy this invoice?", () => {
      this.store.cloneInvoice();
    });
  }

  regenerateInvoice() {
    this.appMessages.showAskForConfirmationModal("Are you sure?", "Are you sure you want to regenerate this invoice?", () => {
      this.store.regenerate();
    });
  }

  savedHandler() {
    this.store.showCancel = false;
    this.closed.emit();
  }
}