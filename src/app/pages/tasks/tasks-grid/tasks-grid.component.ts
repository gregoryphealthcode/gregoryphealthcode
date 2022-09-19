import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridBase } from 'src/app/shared/base/grid.base';
import { MedSecSiteSelectorComponent } from 'src/app/shared/components/med-sec-site-selector/med-sec-site-selector/med-sec-site-selector.component';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BillingService } from 'src/app/shared/services/billing.service';
import { SiteAdminModel, SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UserStore } from 'src/app/shared/stores/user.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tasks-grid',
  templateUrl: './tasks-grid.component.html',
  styleUrls: ['./tasks-grid.component.scss']
})
export class TasksGridComponent extends GridBase implements OnInit {
  @ViewChild(MedSecSiteSelectorComponent) siteSelector: MedSecSiteSelectorComponent;
  @Input() patientId: string;
  @Input() fromPatient: boolean;

  action = "";
  selectedRecord: any;
  controllerUrl: string;
  invoiceId: string;
  fromDate;
  toDate;
  dateFormat;
  completed = false;
  sites: SiteAdminModel[] = [];
  selectedSiteId: string;
  defaultSiteId: string = "00000000-0000-0000-0000-000000000000";

  constructor(
    private spinner: SpinnerService,
    private billingService: BillingService,
    private appMessages: AppMessagesService,
    private router: Router,
    public appInfo: AppInfoService,
    public userStore: UserStore,
    private authService: AuthService,
    private userService: UserService,
    private sitesService: SitesService,
  ) {
    super();
  }

  ngOnInit() {
    this.dateFormat = this.appInfo.getDateFormat;
    this.getTasks();
    this.getSites();
  }

  getTasks() {
    this.controllerUrl = `${environment.baseurl}/invoiceTasks/`;
    this.setupDataSource({
      key: 'taskId',
      loadParamsCallback: () => [
        { name: 'fromDate', value: this.fromDate ? new Date(this.fromDate.getTime() - (this.fromDate.getTimezoneOffset() * 60000)).toISOString() : undefined },
        { name: 'toDate', value: this.toDate ? new Date(this.toDate.getTime() - (this.toDate.getTimezoneOffset() * 60000)).toISOString() : undefined },
        { name: 'patientId', value: this.patientId },
        { name: 'selectedSiteId', value: this.selectedSiteId != '00000000-0000-0000-0000-000000000000' ? this.selectedSiteId : null },
      ],
    });
  }

  getSites() {
    this.sitesService.getSites().subscribe(data => {
      this.sites = data;
      this.sites.sort(function (a, b) {
        if (a.siteName < b.siteName) return -1;
        if (a.siteName > b.siteName) { return 1; }
        return 0;
      });
      this.sites.unshift({
        siteId: '00000000-0000-0000-0000-000000000000', siteName: "All Sites"
      });
    });
  }

  add() {
    if (this.userStore.isMedSecUser() && !this.userStore.hasSelectedASite()) {
      this.siteSelector.show();
    } else {
      this.addClicked();
    }
  }

  public addClicked() {
    this.action = "Add";
    this.selectedRecord = { id: '00000000-0000-0000-0000-000000000000', patientId: this.patientId };
  }

  public editTask(e) {
    this.editClicked(e);
  }

  public editClicked(e) {
    this.action = "Edit";
    this.selectedRecord = { id: e.data.taskId, patientId: this.patientId };
  }

  public deleteClicked(e) {
    const text = 'Are you sure you want to delete this task?'

    const callback = () => {
      this.spinner.start();
      this.billingService.deleteInvoiceTask(e.data.taskId).subscribe(
        (x) => {
          this.spinner.stop();
          this.appMessages.showSuccessSnackBar("Task deleted");
          this.refreshData();
        },
        (e) => {
          this.spinner.stop(); this.appMessages.showApiErrorNotification(e)
        }
      );
    };

    this.appMessages.showDeleteConfirmation(callback, text);
  }

  saved(e) {
    if (this.userStore.isMedSecUser()) {
      this.unselectSite();
    }

    if (e.success) {
      this.appMessages.showSuccessSnackBar("Task added.");

      if (this.action == "Edit")
        this.appMessages.showSuccessSnackBar("Task updated.");
    }
    if (e.errors) {
      this.appMessages.showFailedSnackBar(e.errors[0]);
    }

    this.action = "";
    this.refreshData();
  }

  openInvoice(e) {
    if (e.data.invoiceId) {
      let invoiceId = e.data.invoiceId;
      if (this.userStore.isMedSecUser() && !this.userStore.hasSelectedASite()) {
        this.userService.selectSite(e.data.siteId.toString()).subscribe();
      }
      this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId }, fragment: "3" });
    }
  }

  dateChanged() {
    this.refreshData();
  }

  dueDateExpired(d: any) {
    try {
      const numDays: number = ((Date.parse(d)).valueOf() - Date.now().valueOf()) / (1000 * 3600 * 24);
      if (numDays <= 0) { return (true); } else { return (false); }
    } catch (e) {
      return (false);
    }
  }

  dueDateNearingExpiry(d: any) {
    try {
      const numDays: number = ((Date.parse(d)).valueOf() - Date.now().valueOf()) / (1000 * 3600 * 24);
      if (numDays > 0 && numDays <= 30) { return (true); } else { return (false); }
    } catch (e) {
      return (false);
    }
  }

  checkboxChanged(e) {
    this.completed = !this.completed;
    this.refreshData();
  }

  setSelectedSiteItem(e) {
    this.selectedSiteId = e.selectedItem.siteId;
    this.getTasks();
  }

  private unselectSite(callback?) {
    if (this.userStore.isMedSecUser()) {
      this.subscription.add(
        this.authService.unselectSite().subscribe(() => {
          if (callback) {
            callback();
          }
        })
      );
    }
  }
}
