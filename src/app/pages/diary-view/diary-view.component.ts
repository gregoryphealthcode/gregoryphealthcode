import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { MedSecSiteSelectorComponent } from 'src/app/shared/components/med-sec-site-selector/med-sec-site-selector/med-sec-site-selector.component';
import { InputNotifier } from 'src/app/shared/helpers/other';
import { AppointmentViewModel } from 'src/app/shared/services/appointment.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SiteAdminModel, SitesService } from 'src/app/shared/services/sites.service';
import { UserStore } from 'src/app/shared/stores/user.store';

@Component({
  selector: 'app-diary-view',
  templateUrl: './diary-view.component.html',
  styleUrls: ['./diary-view.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' },
})
export class DiaryViewComponent extends SubscriptionBase implements OnInit {
  @ViewChild(MedSecSiteSelectorComponent) siteSelector: MedSecSiteSelectorComponent;

  showAppointment = false;
  patientId;
  appointmentId;
  ownerId;
  waitingListId;
  locationId;
  startDateTime;
  fromSession;
  refreshDiary = false;

  selectedRecordAppoint: any
  selectedRecordWaiting: any
  public showAppointmentPopup: boolean;
  public appointmentDataItem: AppointmentViewModel;
  public notifier = new InputNotifier();
  public selectedPractitioners: string[];
  updateWaitingList;
  sites: SiteAdminModel[] = [];
  selectedSiteId: string = null;

  itemSelected;
  items = [
    { id: 1, description: "New Appointment", icon: "far fa-calendar-check" },
    { id: 2, description: "New Waiting List Entry", icon: "far fa-clipboard-list" },
  ];

  constructor(
    public userStore: UserStore,
    private router: Router, private authService: AuthService,
    private sitesService: SitesService
  ) {
    super();
  }

  ngOnInit() {
    this.getSites();
  }

  getSites() {
    this.sitesService.getSites().subscribe(data => {
      this.sites = data;
      this.sites.sort(function (a, b) {
        if (a.siteName < b.siteName) return -1;
        if (a.siteName > b.siteName) { return 1; }
        return 0;
      });
      this.tabChange(0);
    });
  }

  appointmentSelectedHandler(item: AppointmentViewModel) {
    this.patientId = item.patientId;
    this.appointmentId = item.appointmentId;
    this.ownerId = item.ownerId;
    this.locationId = item.locationId;
    this.startDateTime = item.startDate;
    this.fromSession = item.sessionId != null ? true : false;

    if (this.userStore.isMedSecUser()) {
      this.authService.selectSite(item.siteId).subscribe(x => {
        this.showAppointment = true;
      });
    } else {
      this.showAppointment = true;
    }
  }

  practitionersSelectedHandler(item: string[]) {
    this.selectedPractitioners = item;
  }

  itemClicked(item) {
    this.itemSelected = item;
    if (this.userStore.isMedSecUser()) {
      this.siteSelector.show();
    } else {
      this.addClicked();
    }
  }

  addClicked() {
    switch (this.itemSelected.id) {
      case 1:
        this.patientId = null;
        this.appointmentId = null;
        this.ownerId = null;
        this.locationId = null;
        this.startDateTime = null;
        this.fromSession = true;
        this.showAppointment = true;
        break;

      case 2:
        this.selectedRecordWaiting = { id: '00000000-0000-0000-0000-000000000000' };
        break;

      default:
        break;
    }
  }

  add() {
    if (this.userStore.isMedSecUser() && !this.userStore.hasSelectedASite()) {
      this.siteSelector.show();
    } else {
      this.addClicked();
    }
  }

  settings() {
    this.router.navigate(['/preferences/appointments']);
  }

  closedHandler() {
    this.patientId = null;
    this.appointmentId = null;
    this.waitingListId = null;
    this.showAppointment = false;
    this.unselectSite();
  }

  waitingListHandler() {
    this.updateWaitingList = true;
  }

  bookFromWaitingListHandler(e) {
    this.waitingListId = e;
    this.fromSession = true;
    if (this.userStore.isMedSecUser()) {
      this.authService.selectSite(e.siteId).subscribe(x => {
        this.showAppointment = true;
      });
    } else {
      this.showAppointment = true;
    }
  }

  savedHandler() {
    this.showAppointment = false;
    this.notifier.valueChanged();
    this.refreshDiary = true;
   // this.unselectSite();
  }

  tabChange(index) {
    if (this.userStore.isMedSecUser()) {
      this.authService.selectSite(this.sites[index].siteId).subscribe(x => {
        this.selectedSiteId = this.sites[index].siteId;
      });
    } else {
    }
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