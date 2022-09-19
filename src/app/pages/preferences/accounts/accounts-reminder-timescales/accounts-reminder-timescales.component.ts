import { Component, OnInit } from '@angular/core';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import notify from 'devextreme/ui/notify';
import { UserStore } from 'src/app/shared/stores/user.store';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { ReminderLetterTimescalesViewModel, SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-accounts-reminder-timescales',
  templateUrl: './accounts-reminder-timescales.component.html',
  styleUrls: ['./accounts-reminder-timescales.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})
@AutoUnsubscribe
export class AccountsReminderTimescalesComponent extends SubscriptionBase implements OnInit {
  editTimescales: boolean;
  reminder1Timescale = 0;
  reminder2Timescale = 0;
  reminder3Timescale = 0;
  reminder4Timescale = 0;
  reminder5Timescale = 0;
  repeatTimescale = 0;
  uniqueNo = 0;
  editUniqueNo = null;
  editInvoiceType = '';
  siteId: string;
  reminders: ReminderLetterTimescalesViewModel[] = [];

  constructor(
    private userStore: UserStore,
    public appInfo: AppInfoService,
    private siteService: SitesService,
    private spinnerService: SpinnerService
  ) {
    super();
  }

  getReminderTimescales() {
    this.subscription.add(this.siteService.getReminderLetterTimescales(this.siteId).subscribe(data => {
      this.spinnerService.stop();
      this.reminders = data;
    },
      error => {
        this.spinnerService.stop();
      }));
  }

  edit(e) {
    this.editInvoiceType = e.invoiceType;
    this.editUniqueNo = e.uniqueNo;
    this.reminder1Timescale = e.reminder1DaysDelayFromInv;
    this.reminder2Timescale = e.reminder2DaysDelayFromReminder1;
    this.reminder3Timescale = e.reminder3DaysDelayFromReminder2;
    this.reminder4Timescale = e.reminder4DaysDelayFromReminder3;
    this.reminder5Timescale = e.reminder5DaysDelayFromReminder4;
    this.repeatTimescale = e.reminder5RepeatEveryXDays;
    this.editTimescales = true;
  }

  public onFocusedRowChanged(e) {
    this.uniqueNo = e.row.data.uniqueNo;
  }


  editOKClicked(e) {
    this.spinnerService.start();
    const model = new ReminderLetterTimescalesViewModel();
    model.reminder1DaysDelayFromInv = this.reminder1Timescale;
    model.reminder2DaysDelayFromReminder1 = this.reminder2Timescale,
      model.reminder3DaysDelayFromReminder2 = this.reminder3Timescale,
      model.reminder4DaysDelayFromReminder3 = this.reminder4Timescale,
      model.reminder5DaysDelayFromReminder4 = this.reminder5Timescale,
      model.reminder5RepeatEveryXDays = this.repeatTimescale;
    model.uniqueNo = this.uniqueNo;
    this.subscription.add(this.siteService.updateReminderLetterTimescales(model).subscribe(data => {
      this.spinnerService.stop();
      notify('Reminder Timescales Updated.', 'success');
      this.getReminderTimescales();
      this.editTimescales = false;
    },
      (error) => {
        const errorText = 'Error updating reminder timescales! :' + error;
        notify(errorText, 'error');
        this.spinnerService.stop();
      }));
  }

  ngOnInit() {
    this.spinnerService.start();
    this.siteId = this.userStore.getSiteId();
    this.getReminderTimescales();
  }
}