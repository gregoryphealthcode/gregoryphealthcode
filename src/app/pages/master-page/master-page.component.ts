import { Component, OnInit } from '@angular/core';
import { AppInfoService } from 'src/app/shared/services';
import { Router } from '@angular/router';
import { SubscriptionAndSignalRBase } from 'src/app/shared/base/subscribtion.base';
import { navigation } from 'src/app/app-navigation';
import { SignalRBase } from 'src/app/shared/base/signalR.base';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { BillingService } from 'src/app/shared/services/billing.service';
import { SignalRMainHubService } from 'src/app/shared/services/signal-rmain-hub.service';
import { SitesService } from 'src/app/shared/services/sites.service';
import { UserStore } from 'src/app/shared/stores/user.store';

@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.scss']
})
export class MasterPageComponent extends SubscriptionAndSignalRBase(SignalRBase) implements OnInit {
  constructor(
    public appInfo: AppInfoService,
    public router: Router,
    private appointmentsService: AppointmentService,
    private billingService: BillingService,
    private siteService: SitesService,
    signalRService: SignalRMainHubService,
    private userStore: UserStore,
  ) {
    super(signalRService);
  }

  public menuItems: any = navigation;
  isMedSec = false;

  ngOnInit() {
    this.isMedSec = this.userStore.isMedSecUser();

    if (!this.isMedSec) {
      this.getAppointmentsForBillingCount();
      this.getAllInvoicesCount();
      this.getAllTasksCount();
      this.getInvoicesForReviewCount();
    }

    this.addSignalRListener('completedAppointmentsCountChanged', (x) => {
      this.setCompletedAppointmentsCount(x);
    });

    this.addSignalRListener('allInvoicesCountChanged', (x) => {
      this.setAllInvoicesCount(x);
    });

    this.addSignalRListener('invoicesForReviewCountChanged', (x) => {
      this.setInvoicesForReviewCount(x);
    });

    this.addSignalRListener('dueTaskCountChanged', (x) => {
      this.setDueTaskCount(x);
    });

    this.addSignalRListener('upcomingTaskCountChanged', (x) => {
      this.setUpcomingTaskCount(x);
    });
  }

  private getAppointmentsForBillingCount() {
    this.subscription.add(this.billingService.getAppointmentsForBillingCount().subscribe(x => this.setCompletedAppointmentsCount(x)));
  }

  private setCompletedAppointmentsCount(count: number) {
    const accountsMenuItem = this.menuItems.find(i => i.key === 'Accounts');
    const toBeInvoicedMenuItem = accountsMenuItem.items.find(i => i.key === 'accounts/billing-list');
    toBeInvoicedMenuItem.count = count;
  }

  private getAllInvoicesCount() {
    this.subscription.add(this.billingService.getInvoiceCounts().subscribe(x => this.setAllInvoicesCount(x.allInvoiceCount)));
  }

  private getAllTasksCount() {
    this.subscription.add(this.siteService.getTaskCounts().subscribe(x => {
      this.setDueTaskCount(x.dueCount);
      this.setUpcomingTaskCount(x.upcomingCount);
    }))
  }

  private setAllInvoicesCount(count: number) {
    const accountsMenuItem = this.menuItems.find(i => i.key === 'Accounts');
    const allInvoicesMenuItem = accountsMenuItem.items.find(i => i.key === 'accounts/pending-invoices');
    allInvoicesMenuItem.count = count;
  }

  private setDueTaskCount(count: number) {
    const taskMenuItem = this.menuItems.find(i => i.key === 'tasks');
    taskMenuItem.dueCount = count;
  }

  private setUpcomingTaskCount(count: number) {
    const taskMenuItem = this.menuItems.find(i => i.key === 'tasks');
    taskMenuItem.upCount = count;
  }


  private getInvoicesForReviewCount() {
    this.subscription.add(this.billingService.getInvoiceCounts().subscribe(x => this.setInvoicesForReviewCount(x.reviewInvoiceCount)));
  }

  private setInvoicesForReviewCount(count: number) {
    const accountsMenuItem = this.menuItems.find(i => i.key === 'Accounts');
    const invoicesForReviewMenuItem = accountsMenuItem.items.find(i => i.key === 'accounts/invoices-for-review');
    invoicesForReviewMenuItem.count = count;
  }

  get runChangeDetection() {
    console.log('change detection cycle');
    return '';
  }
}