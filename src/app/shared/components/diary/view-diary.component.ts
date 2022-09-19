import { Component, OnInit, ViewChild, Input, ChangeDetectorRef, Output, EventEmitter, AfterViewInit, OnChanges, } from "@angular/core";
import { AppointmentService, SessionDataModel, SessionTypes, DiaryViewModel, AppointmentViewModel, GetAppointmentsDiaryViewResponse, AppointmentDiaryViewModel, SessionDiaryViewModel, } from "src/app/shared/services/appointment.service";
import { BehaviorSubject, EMPTY, Observable, of, throwError } from "rxjs";
import { AppointmentStatusModel, UserService } from "src/app/shared/services/user.service";
import { DxSchedulerComponent, DxToastComponent } from "devextreme-angular";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { SubscriptionBase } from "../../base/subscribtion.base";
import { SpecialistViewModel } from "../../models/SpecialistViewModel";
import { SpinnerService } from "../../services/spinner.service";
import { Router } from "@angular/router";
import { dateInsideWorkDay, InputNotifier } from "../../helpers/other";
import { catchError, filter, switchMap, tap } from "rxjs/operators";
import { UserStore } from "../../stores/user.store";
import { AppMessagesService } from "../../services/app-messages.service";
import { SitePracticeHoursService, WorkDayInputModel, } from "../../services/site-practice-hours.service";

@Component({
  selector: "app-view-diary",
  templateUrl: "./view-diary.component.html",
  styleUrls: ["./view-diary.component.scss"],
})
@AutoUnsubscribe
export class ViewDiaryComponent extends SubscriptionBase implements OnInit, AfterViewInit, OnChanges {
  @ViewChild(DxToastComponent) syncToast: DxToastComponent;

  @ViewChild("appointments") scheduler: DxSchedulerComponent;

  @Input() reloadDataListener = new InputNotifier();
  @Input() hideTitle: boolean;

  @Input() refreshDiary = false;
  @Input() tabid = 0;

  @Output() selectAddedFormOK = new EventEmitter();
  @Output() appointmentSelected = new EventEmitter<AppointmentViewModel>();
  @Output() practitionersSelected = new EventEmitter<string[]>();

  private getDataSubject$ = new BehaviorSubject(undefined);
  private filterStartDate: Date;
  private filterEndDate: Date;
  private viewChanged = false;
  public syncingEbookingData = true;

  appointmentDataItem: AppointmentViewModel;
  startDate: Date;
  appointmentData: AppointmentDiaryViewModel[] = [];
  sessionsData: SessionDiaryViewModel[] = [];
  cacheAppointmentData: DiaryViewModel[] = [];
  currentDate: Date = new Date();
  sessions$: Observable<SessionDataModel[]>;
  owners: SpecialistViewModel[] = [];
  selectedOwners: SpecialistViewModel[] = [];
  siteId: string;
  sessionTypes: SessionTypes[];
  isEdit = false;
  isSelectPatientVisible: boolean;
  showTooltip = false;
  tooltipTarget: any;
  hoveredAppointment: DiaryViewModel;
  loadingVisible = false;
  workDays: WorkDayInputModel[];
  startTime = 5;
  endTime = 23;

  //private isMedsecUser = false;

  resources1MenuItems = [
    { color: "rgb(210, 210, 210)", text: "Unavailable" },
    { color: "rgb(171, 224, 016)", text: "Available" },
  ]; // session types colours


  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    public userStore: UserStore,
    private appMessages: AppMessagesService,
    private dataService: SitePracticeHoursService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.initializeData();
  }

  initializeData() {
    this.appointmentData = [];
    this.sessionsData = [];
    this.cacheAppointmentData = [];
    this.currentDate = new Date();
    this.owners = [];
    this.selectedOwners = [];
    this.sessionTypes = [];
    this.isEdit = false;
    this.showTooltip = false;
    this.loadingVisible = false;
    this.workDays = [];
    this.startTime = 5;
    this.endTime = 23;

    this.spinnerService.start();
    //this.isMedsecUser = this.userStore.isMedSecUser();
    this.getSpecialists$();

    //sync eBooking data
    this.syncingEbookingData = true;
    this.subscription.add(this.appointmentService.syncEbookingAppointments()
      .pipe(tap((x) => {
        if (!x.success) {
          this.appMessages.showApiWarningNotification(x);
        }
        this.syncingEbookingData = false;
      }),
        switchMap(() => {
          // if (!this.isMedsecUser) {
          //   return this.getPracticeHours$();
          // }
          // return of({});
          return this.getPracticeHours$();
        }),
        catchError(err => {
          this.spinnerService.stop();
          return throwError(err);
        })
      ).subscribe()
    );

    this.subscription.add(
      this.getDataSubject$
        .pipe(
          filter((x) => !!x),
          switchMap(() => {
            if (this.selectedOwners.length === 0) {
              this.appointmentData = [];
              return EMPTY;
            }
            let selectedOwnersIds = [];
            this.selectedOwners.forEach(owner => {
              selectedOwnersIds.push(owner.id);
            });
            this.spinnerService.stop();
            const startDate = this.scheduler.instance.getStartViewDate();
            const endDate = this.scheduler.instance.getEndViewDate();
            return this.getDiaryData$(selectedOwnersIds, startDate, endDate);
          })
        )
        .subscribe()
    );

    this.reloadDataListener.valueChanged = () => {
      this.getDataSubject$.next({});
    };

  }

  ngAfterViewInit(): void {
    if (this.syncingEbookingData) {
      setTimeout(() => {
        this.syncToast.instance.show();
      }, 1);
    }
  }

  ngOnChanges() {
    if (!this.userStore.isMedSecUser() && this.refreshDiary) {
      let selectedOwnersIds = [];
      this.selectedOwners.forEach(owner => {
        selectedOwnersIds.push(owner.id);
      });
      const startDate = this.scheduler.instance.getStartViewDate();
      const endDate = this.scheduler.instance.getEndViewDate();
      this.getDiaryData$(selectedOwnersIds, startDate, endDate);
    }
    if (this.userStore.isMedSecUser() && this.tabid) {
      this.initializeData();
    }
  }


  private getPracticeHours$() {
    return this.dataService.getCurrentSitePracticeHours().pipe(
      tap((x) => {
        this.spinnerService.stop();
        this.workDays = x.workDays;
        const startTimes = x.workDays.map((obj) => obj.startTime.hours);
        if (startTimes.length > 0) {
          this.startTime = Math.min(...startTimes) - 1;
        }
        const endTimes = x.workDays.map((obj) => obj.endTime.hours);
        if (endTimes.length > 0) {
          this.endTime = Math.max(...endTimes) + 1;
        }
      })
    );
  }

  getSpecialists$() {
    this.userService.getConsultantsForSite().subscribe(value => {
      this.owners = value.filter((item) => item.active !== false);
      this.owners.sort(function (a, b) {
        if (a.displayName < b.displayName) return -1;
        if (a.displayName > b.displayName) return 1;
        return 0;
      })
      if (this.owners.length > 1) {
        this.selectedOwners.push(this.owners[0]);
        this.practitionersSelected.emit(this.getSelectedIds());
        this.getDataSubject$.next({});
      } else {
        this.practitionersSelected.emit([]);
        this.getDataSubject$.next({});
      }
      this.changeDetectorRef.detectChanges();
    })
  }

  onOptionChangedHandler(e) {
    if (e.fullName == "currentDate" || e.fullName == "currentView") {
      this.viewChanged = true;
    }
  }

  private getDiaryData$(selectedOwnersIds, startDate: Date, endDate: Date) {
    return this.appointmentService
      .getAppointments(selectedOwnersIds, startDate, endDate)
      .pipe(
        tap(
          (data: GetAppointmentsDiaryViewResponse) => {
            this.appointmentData = data.appointments;
            this.sessionsData = data.sessions;
            this.sessionsData.forEach((x) => {
              x.startDate = new Date(x.startDate);
              x.endDate = new Date(x.endDate);
            });

            this.spinnerService.stop();
            this.changeDetectorRef.detectChanges();
          },
          (error) => {
            this.spinnerService.stop();
          }
        )
      );
  }

  public getCellClass(data) {
    let cssClass = "h-100 w-100 pointer-events-all ";
    const outOfHours = !this.isWorkingHour(data.startDate);

    if (outOfHours) {
      cssClass += "unavailable-date";
      return cssClass;
    }

    let session;
    if (this.selectedOwners.length > 0 && this.sessionsData.length > 0) {
      session = this.sessionsData.find(
        (x) =>
          x.startDate <= data.startDate &&
          x.endDate >= data.endDate &&
          data?.groups?.ownerId === x.ownerId
      );
    }

    if (session) {
      data.sessionData = session;

      if (session.startDate.getTime() == data.startDate.getTime()) {
        if (session.unavailable) {
          data.text = session.description;
        } else {
          data.text = session.locationName;
        }
      }

      if (session.unavailable) {
        cssClass += "unavailable-date";
      } else {
        cssClass += "session-date";
      }
    }

    return cssClass;
  }


  public getBackgroundColour(data): Object {
    let session;
    if (this.selectedOwners.length > 0 && this.sessionsData.length > 0) {
      session = this.sessionsData.find(
        (x) =>
          x.startDate <= data.startDate &&
          x.endDate >= data.endDate &&
          data?.groups?.ownerId === x.ownerId
      );
    }

    if (session) {
      data.sessionData = session;

      if (session.startDate.getTime() == data.startDate.getTime()) {
        if (session.unavailable) {
          data.text = session.description;
        } else {
          data.text = session.locationName;
        }
      }

      if (!session.unavailable) {
        return session.backgroundColour;
      }
    }
  }

  private isWorkingHour(date: Date) {
    if (!date)
      return false;

    if (!this.workDays)
      return false;

    const dayOfWeek = date.getDay();
    const workDay = this.workDays.find((x) => x.day == (dayOfWeek == 0 ? 7 : dayOfWeek));

    if (!workDay)
      return false;

    if (!workDay.working)
      return false;

    return dateInsideWorkDay(date, workDay);
  }

  public onAppointmentClick(e) {
    e.cancel = true;
  }

  public onContentReady(e) {
    const currentDate = new Date();
    const currentHour = currentDate.getHours() - 1;

    if (this.viewChanged) {
      this.getDataSubject$.next({});
      this.viewChanged = false;
    }

    if (
      currentDate > this.filterStartDate &&
      currentDate < this.filterEndDate
    ) {
      e.component.scrollToTime(currentHour, 30, new Date());
    }
  }

  public onMultiTagPreparing(event) {
    setTimeout(() => {
      const input = event.multiTagElement.nextElementSibling;
      input.placeholder = "Search...";
    }, 10);
  }

  public showAppointmentTooltip(event, data) {
    this.tooltipTarget = event.target;
    this.hoveredAppointment = data;
    this.showTooltip = true;
  }

  public hideTooltip() {
    this.hoveredAppointment = undefined;
    this.showTooltip = false;
  }

  public setCellColour(cellData: any) {
    if (cellData.appointmentData.isUnavailableSession) {
      try {
        return cellData.appointmentData.backgroundColour;
      } catch (e) {
        return "";
      }
    } else {
      return cellData.appointmentData.backgroundColour;
    }
  }

  public setBackgroundColour(cellData) {
    if (
      !cellData.appointmentData.isUnavailableSession &&
      cellData.appointmentData.isSession
    ) {
      try {
        return `5px solid ${cellData.appointmentData.highlightColour} !important`;
      } catch (e) {
        return "";
      }
    } else {
      return "";
    }
  }

  close() {
    this.selectAddedFormOK.emit();
  }

  getSessionTypes() {
    this.appointmentService.getSessionTypes().subscribe((value) => {
      this.sessionTypes = value;
    });
  }

  appointmentDoubleClick(e) {
    e.cancel = true;
    this.onAppointmentEditingHandler(e);
  }

  onAppointmentFormOpening = e => {
    e.cancel = true;
  }

  onAppointmentEditingHandler(data) {
    this.appointmentSelected.emit(data.appointmentData);
  }

  onAppointmentAddingHandler(item) {
    if (!this.isWorkingHour(item.startDate) || item.sessionData && item.sessionData.unavailable || new Date(item.startDate) < new Date()) {
      return;
    }

    this.isEdit = false;
    this.startDate = item.startDate;

    this.appointmentDataItem = new AppointmentViewModel();

    this.appointmentDataItem.ownerId = item.groups.ownerId;

    if (item.sessionData) {
      this.appointmentDataItem.sessionId = item.sessionData.sessionId;
      this.appointmentDataItem.locationId = item.sessionData.locationId;
      this.appointmentDataItem.siteId = item.sessionData.siteId;
    } else {
      this.appointmentDataItem.startDate = item.startDate;
    }

    this.appointmentSelected.emit(this.appointmentDataItem);
  }

  ownersChanged(e) {
    this.selectedOwners = [];
    if (e.value && e.value.length > 0) {
      e.value.forEach(id => {
        if (e.value && !this.selectedOwners.find(x => x.id == id))
          this.selectedOwners.push(this.owners.find(x => x.id === id));
        else if (!e.value && this.selectedOwners.find(x => x.id == id))
          this.selectedOwners = this.selectedOwners.filter(x => x.id != id);
      });
    }
    this.getDataSubject$.next({});
    this.practitionersSelected.emit(this.getSelectedIds());
  }

  getIcon(e) {
    switch (e) {
      case 2:
        return 'fa-calendar';
      case 3:
        return 'fa-times';
      case 4:
        return 'fa-calendar-check';
      case 5:
        return 'fa-house-return';
      case 6:
        return 'fa-clock';
      case 7:
        return 'fa-check';
      case 8:
        return 'fa-user-alt-slash';
    }
  }

  // selectAll(e) {
  //   if (e.value)
  //     this.selectedOwners = this.owners;
  //   else
  //     this.selectedOwners = [];

  //   this.practitionersSelected.emit(this.getSelectedIds());
  // }

  getSelectedIds() {
    let selectedIds = [];
    this.selectedOwners.forEach(element => {
      selectedIds.push(element.id);
    });
    return selectedIds;
  }

  getSelected(id) {
    if (this.selectedOwners.find(x => x.id == id))
      return true;
    else
      return false;
  }

  public isBadge(e) {
    if (e.icon === "badge") {
      return true;
    } else {
      return false;
    }
  }

  public isRightBar(e) {
    if (e.icon === "rightbar") {
      return true;
    } else {
      return false;
    }
  }

  public isLeftBar(e) {
    if (e.icon === "leftbar") {
      return true;
    } else {
      return false;
    }
  }
}