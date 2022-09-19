import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CorrespondenceService } from 'src/app/shared/services/correspondence.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { requiredIfValidator } from 'src/app/shared/helpers/form-helper';
import { BillingService } from 'src/app/shared/services/billing.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { Router } from '@angular/router';
import { InvoicePayorTypeEnum, PaymentAgeModel, SitesService } from 'src/app/shared/services/sites.service';
import { TemplateViewModel, TemplateService } from 'src/app/shared/services/template.service';

@Component({
  selector: 'app-generate-batch',
  templateUrl: './generate-batch.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
  styleUrls: ['./generate-batch.component.scss'],
})

@AutoUnsubscribe
export class GenerateBatchComponent extends SubscriptionBase implements OnInit {
  editForm: FormGroup;
  reminderSelected = false;
  receiptSelected = false;
  shortfallSelected = false;
  paymentAgeBands: PaymentAgeModel[] = [];
  shortfallTemplates: TemplateViewModel[] = [];
  contactTypes: string[] = [];
  options = [
    { id: 0, text: 'Reminder Letters' },
    { id: 1, text: 'Receipts' },
    { id: 2, text: 'Shortfall Letters' },
  ];
  band1Label = "Band 1";
  band2Label = "Band 2";
  band3Label = "Band 3";
  band4Label = "Band 4";

  constructor(
    public appInfo: AppInfoService,
    private correspondenceService: CorrespondenceService,
    private billingService: BillingService,
    private spinnerService: SpinnerService,
    private appMessages: AppMessagesService,
    private router: Router,
    private sitesService: SitesService,
    private templateService: TemplateService,
  ) {
    super();
  }

  ngOnInit() {
    this.getPaymentAgeBands();
    this.getShortfallTemplates();
    this.setupForm();
  }

  getPaymentAgeBands() {
    this.sitesService.getPaymentAge().subscribe(data => {
      this.paymentAgeBands = data;
      this.contactTypes.push("All");
      data.forEach(x => {
        this.contactTypes.push(x.description);
      });
    });
  }

  getShortfallTemplates() {
    this.templateService.getSiteTemplates(14).subscribe(data => {
      this.shortfallTemplates = data;
      this.shortfallTemplates.sort(function (a, b) {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      })
    })
  }

  private setupForm() {
    this.editForm = new FormGroup({
      contactType: new FormControl("All", null),
      band1: new FormControl(true, null),
      band2: new FormControl(true, null),
      band3: new FormControl(true, null),
      band4: new FormControl(true, null),
      dateFrom: new FormControl(new Date(), [requiredIfValidator(() => this.receiptSelected)]),
      dateTo: new FormControl(new Date(), [requiredIfValidator(() => this.receiptSelected)]),
      shortfallTemplate: new FormControl(null, [requiredIfValidator(() => this.shortfallSelected)]),
    });

    this.subscription.add(this.editForm.get('contactType').valueChanges.subscribe(x => {
      if (x == '0') {
        this.band1Label = "Band 1";
        this.band2Label = "Band 2";
        this.band3Label = "Band 3";
        this.band4Label = "Band 4";
      }
      else {
        let band = this.paymentAgeBands.find(y => y.description == x);
        this.band1Label = "Band 1 (" + band.band1 + ")";
        this.band2Label = "Band 2 (" + band.band2 + ")";
        this.band3Label = "Band 3 (" + band.band3 + ")";
        this.band4Label = "Band 4 (" + band.band4 + ")";
      }
    }));
  }

  generate() {
    this.spinnerService.start();
    if (this.reminderSelected) {
      const type = this.editForm.get("contactType").value;

      const batch: number[] = [];
      if (this.editForm.get('band1').value === true) {
        batch.push(1);
      }
      if (this.editForm.get('band2').value === true) {
        batch.push(2);
      }
      if (this.editForm.get('band3').value === true) {
        batch.push(3);
      }
      if (this.editForm.get('band4').value === true) {
        batch.push(4);
      }

      this.correspondenceService.generateReminderLetters(type, batch).subscribe(x => {
        this.spinnerService.stop();
        if (x.success) {
          this.appMessages.showSuccessSnackBar(x.data);
          this.afterGeneration();
        }
        else
          this.appMessages.showApiErrorNotification(x.errors[0]);
      },
        e => {
          this.spinnerService.stop();
          this.appMessages.showApiErrorNotification(e);
        }
      )
    }

    if (this.receiptSelected) {
      let dateFrom = this.editForm.get('dateFrom').value;
      const userTimezoneOffset = dateFrom.getTimezoneOffset() * 60000;

      dateFrom.setHours(0, 0, 0);
      dateFrom = new Date(dateFrom.getTime() - userTimezoneOffset).toISOString();

      let dateTo = this.editForm.get('dateTo').value;
      dateTo.setHours(23, 59, 59);
      dateTo = new Date(dateTo.getTime() - userTimezoneOffset).toISOString();

      this.billingService.generateTransactionReceipts(dateFrom, dateTo).subscribe(x => {
        this.spinnerService.stop();
        if (x.success) {
          if (x.data > 0) {
            if (x.data == 1)
              this.appMessages.showSuccessSnackBar(`${x.data} receipt added to Print Queue`);
            else
              this.appMessages.showSuccessSnackBar(`${x.data} receipts added to Print Queue`);
            this.afterGeneration();
          }
          else
            this.appMessages.showFailedSnackBar("No receipts were generated. Either no receipts in date range, or already in print queue.")
        }
        else
          this.appMessages.showApiErrorNotification(x.errors[0]);
      },
        e => {
          this.spinnerService.stop();
          this.appMessages.showApiErrorNotification(e);
        }
      )
    }

    if (this.shortfallSelected) {     
      let template = this.editForm.get('shortfallTemplate').value;

      this.billingService.generateShortfallLetters(template).subscribe(x => {
        this.spinnerService.stop();
        if (x.success) {
          if (x.data > 0) {
            if (x.data == 1)
              this.appMessages.showSuccessSnackBar(`${x.data} shortfall letter added to Print Queue`);
            else
              this.appMessages.showSuccessSnackBar(`${x.data} shortfall letters added to Print Queue`);
            this.afterGeneration();
          }
          else
            this.appMessages.showFailedSnackBar("No receipts were generated. Either no receipts in date range, or already in print queue.")
        }
        else
          this.appMessages.showApiErrorNotification(x.errors[0]);
      },
        e => {
          this.spinnerService.stop();
          this.appMessages.showApiErrorNotification(e);
        }
      )
    }
  }

  public afterGeneration() {
    this.appMessages.showAskForConfirmationModal("View Print Queue", "Would you like to view the print queue?",
      () => { this.router.navigate(['/documents/printing']); },
      () => { return; }
    );
  }

  updateControls() {
    this.editForm.get('dateFrom').updateValueAndValidity();
    this.editForm.get('dateTo').updateValueAndValidity();
  }

  reminderChanged() {
    this.receiptSelected = false;
    this.reminderSelected = true;
    this.shortfallSelected = false;
    this.band1Label = "Band 1";
    this.band2Label = "Band 2";
    this.band3Label = "Band 3";
    this.band4Label = "Band 4";
  }

  receiptChanged() {
    this.receiptSelected = true;
    this.reminderSelected = false;
    this.shortfallSelected = false;
  }

  shortfallChanged() {
    this.receiptSelected = false;
    this.reminderSelected = false;
    this.shortfallSelected = true;;
  }

  printTypeChanged(e) {
    switch (e.value.id) {
      case 0: //Reminder Letters
        this.setupForm();
        this.reminderChanged();
        break;

      case 1: //Receipts
        this.setupForm();
        this.receiptChanged();
        break;

      case 2: //Shortfall letters
        this.setupForm();
        this.shortfallChanged();
        break;
    }
  }

  checkReminderSelection() {
    if (this.editForm.get('band1').value == false &&
      this.editForm.get('band2').value == false &&
      this.editForm.get('band3').value == false &&
      this.editForm.get('band4').value == false)
      return true;
    return false;
  }

  checkShortfallSelection() {
    if (this.editForm.get('shortfallTemplate').value == null)
      return true;
    return false;
  }
}