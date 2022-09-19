import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { PercentPipe } from '@angular/common';
import notify from 'devextreme/ui/notify';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { DxActionSheetComponent, DxGalleryComponent, } from 'devextreme-angular';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService, AppMessageType } from 'src/app/shared/services/app-messages.service';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { filter, pairwise } from 'rxjs/operators';
import { Router, RoutesRecognized } from '@angular/router';
import { DashboardService } from 'src/app/shared/services/dashboard.services';
import { HealthcodeNewsModel, NewsService } from 'src/app/shared/services/news.service';
import { AppointmentViewModel } from 'src/app/shared/services/appointment.service';
import { InputNotifier } from 'src/app/shared/helpers/other';
import { UserStore } from 'src/app/shared/stores/user.store';

export var previousUrl = null;
export var currentUrl = null;

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})
export class HomeComponent extends SubscriptionBase implements OnInit {
  @ViewChild('actionSheet') actionSheet: DxActionSheetComponent;
  @ViewChild(DxGalleryComponent) newsGallery: DxGalleryComponent;

  patientId;
  appointmentId;
  ownerId;
  waitingListId;
  locationId;
  startDateTime;
  fromSession;

  isSelectSiteVisible = false;
  customisingDashboard = false;
  userDashboard: any;
  userDashboardId: string;
  dateFormat = this.appInfo.getDateFormat;
  firstTime = true;
  pipe: any = new PercentPipe('en-US');
  options: GridsterConfig;
  dashboard: Array<GridsterItem>;
  currentUser: any;
  sites: any[];
  reasonSelected: any;
  reasonDetails: string;
  accessLevel: string;
  userAccessLevel: string;
  slideshowDelay = 40000;
  newsfeedDataSource: HealthcodeNewsModel[];
  public showAppointmentPopup: boolean;
  public appointmentDataItem: AppointmentViewModel;
  public notifier = new InputNotifier();
  commands: any[] = [
    { text: 'Healthcode News' },
    { text: 'System Status' },
    { text: 'Recent Logins' },
    { text: 'Tasks + Reminders' },
    { text: 'Diary' },
    { text: 'Unpaid Invoices' },
    { text: 'Calculator' },
    { text: 'Invoice Auto-population' },
    { text: 'Features + Benefits' }
  ];

  constructor(
    public appInfo: AppInfoService,
    private appMessages: AppMessagesService,
    private router: Router,
    private dashboardService: DashboardService,
    private newsService: NewsService,
    public userStore: UserStore,
  ) {
    super();
    this.customisingDashboard = true;
    this.router.events.pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        previousUrl = events[0].url;
        currentUrl = events[1].url;
      });
    this.appInfo.getReturnUrl(this.router.url);
    this.options = {
      gridType: GridType.ScrollVertical,
      compactType: CompactType.None,
      margin: 20,
      outerMargin: true,
      outerMarginTop: 16,
      outerMarginRight: 32,
      outerMarginBottom: 12,
      outerMarginLeft: 32,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      minCols: 8,
      maxCols: 12,
      minRows: 6,
      maxRows: 24,
      maxItemCols: 12,
      minItemCols: 1,
      maxItemRows: 12,
      minItemRows: 1,
      maxItemArea: 25000,
      minItemArea: 1,
      defaultItemCols: 2,
      defaultItemRows: 2,
      fixedColWidth: 90,
      fixedRowHeight: 140,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      emptyCellDragMaxCols: 12,
      emptyCellDragMaxRows: 12,
      ignoreMarginInRow: false,
      draggable: {
        enabled: false
      },
      resizable: {
        enabled: false
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: false, east: false, south: true, west: true },
      pushResizeItems: false,
      displayGrid: DisplayGrid.OnDragAndResize,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false,
      destroyCallback: () => this.ngOnDestroy()
    };
  }

  ngOnInit() {
    this.getDashboard();
    this.getNewsfeed();
  }

  getDashboard() {
    this.subscription.add(
      this.dashboardService.getDashboard().subscribe(
        (x) => {
          if (x) {
            this.userDashboard = x;
            this.userDashboardId = x.dashboardId;
            this.dashboard = JSON.parse(this.userDashboard.content);
          }
        },
        e => console.log(e),
        () => {
          if (!this.dashboard) {
            this.dashboard = [
              { cols: 4, rows: 2, y: 0, x: 0, label: 'Healthcode News' },
              { cols: 2, rows: 2, y: 0, x: 2, label: '' },
              { cols: 6, rows: 4, y: 2, x: 0, label: 'Diary' },
              { cols: 3, rows: 2, y: 2, x: 6, label: 'Recent Logins' },
              { cols: 3, rows: 2, y: 4, x: 6, label: 'Unpaid Invoices' },
              { cols: 3, rows: 2, y: 0, x: 6, label: 'Tasks + Reminders' },
              { cols: 1, rows: 2, y: 6, x: 0, label: 'Calculator' },
              { cols: 1, rows: 2, y: 6, x: 2, label: 'Invoice Auto-population' },
              { cols: 1, rows: 2, y: 6, x: 4, label: 'Features + Benefits' }
            ];
          }
        }));

    const showDashboardSettings$ = this.appMessages.messages$.pipe(
      filter(x => x === AppMessageType.ShowDashboardConfigurationPanel)
    );
    this.subscription.add(
      showDashboardSettings$.subscribe(() => this.showDashboardSettings())
    );
  }

  getNewsfeed() {
    this.newsService.getHealthcodeNews().subscribe(x => {
      this.newsfeedDataSource = x;
    });
  }

  customizeTooltip = (arg: any) => {
    return {
      text: arg.valueText + ' - ' + this.pipe.transform(arg.percent, '1.2-2')
    };
  }

  actionsheetAddPanel(paneltype: string) {
    if (paneltype === 'Recent Logins') {
      this.dashboard.push({
        cols: 3,
        rows: 2,
        y: 0,
        x: 0,
        label: 'Recent Logins'
      });
    }
    if (paneltype === 'Diary') {
      this.dashboard.push({ cols: 6, rows: 4, y: 0, x: 0, label: 'Diary' });
    }
    if (paneltype === 'Healthcode News') {
      this.dashboard.push({
        cols: 4,
        rows: 2,
        y: 0,
        x: 0,
        label: 'Healthcode News'
      });
    }
    if (paneltype === 'Unpaid Invoices') {
      this.dashboard.push({
        cols: 4,
        rows: 2,
        y: 0,
        x: 0,
        label: 'Unpaid Invoices'
      });
    }
    if (paneltype === 'Tasks + Reminders') {
      this.dashboard.push({
        cols: 4,
        rows: 2,
        y: 0,
        x: 0,
        label: 'Tasks + Reminders'
      });
    }
    if (paneltype === 'Calculator') {
      this.dashboard.push({
        cols: 2,
        rows: 3,
        y: 0,
        x: 0,
        label: 'Calculator'
      });
    }
    if (paneltype === 'Invoice Auto-population') {
      this.dashboard.push({
        cols: 2,
        rows: 2,
        y: 0,
        x: 0,
        label: 'Invoice Auto-population'
      });
    }
    if (paneltype === 'Features + Benefits') {
      this.dashboard.push({
        cols: 2,
        rows: 2,
        y: 0,
        x: 0,
        label: 'Features + Benefits'
      });
    }
    if (paneltype === 'System Status') {
      this.dashboard.push({
        cols: 3,
        rows: 2,
        y: 0,
        x: 0,
        label: 'System Status'
      });
    }
  }

  public showSystemStatus() {
    window.open('https://stats.uptimerobot.com/29M2kC93P');
  }

  public saveDashboardSettings() {
    const content = JSON.stringify(this.dashboard)
    if (this.userDashboard) {
      this.subscription.add(this.dashboardService.updateDashboard(this.userDashboardId, content).subscribe(() => { }));
      this.userDashboard = this.dashboard;
    }
    else {
      this.subscription.add(this.dashboardService.addDashboard(content).subscribe((x) => {
        this.userDashboardId = x.dashboardId;
      }));
    }
    this.showDashboardSettings();
  }

  public showDashboardSettings() {
    if (previousUrl != null) {
      if (this.firstTime) {
        this.firstTime = false;
        return;
      }
    }
    if (this.customisingDashboard) {
      this.customisingDashboard = !this.customisingDashboard;
      this.options.resizable.enabled = true;
      this.options.draggable.enabled = true;
      this.changedOptions();
      notify(
        'You can now customise the dashboard - Move, resize, delete or add new panels...',
        'success'
      );
    }
    else {
      this.customisingDashboard = !this.customisingDashboard;
      this.options.resizable.enabled = false;
      this.options.draggable.enabled = false;
      this.changedOptions();
      notify(
        'The dashboard is now locked to prevent accidental changes.',
        'success'
      );
    }
  }

  public changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  removeItem($event, item) {
    try {
      $event.preventDefault();
      $event.stopPropagation();
    } catch (e) { }
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem() {
    this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1 });
  }

  appointmentSelectedHandler(item: AppointmentViewModel) {
    this.patientId = null;
    this.appointmentId = null;
    this.ownerId = null;
    this.locationId = null;
    this.startDateTime = null;
    this.fromSession = true;

    this.patientId = item.patientId;
    this.appointmentId = item.appointmentId;
    this.ownerId = item.ownerId;
    this.locationId = item.locationId;
    this.startDateTime = item.startDate;
    this.fromSession = item.sessionId != null ? true : false;
    this.showAppointmentPopup = true;
  }

  closedHandler() {
    this.patientId = null;
    this.appointmentId = null;
    this.waitingListId = null;
    this.showAppointmentPopup = false;
  }
}
