import { Component, OnInit, ChangeDetectorRef, ViewChild, } from "@angular/core";
import { AppointmentService, SessionDataModel, SessionTypes, RecurrenceWindowTypes, AppointmentListViewModel, AppointmentTypes, UnavailableTypes, } from "src/app/shared/services/appointment.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "src/app/shared/services/user.service";
import ODataStore from "devextreme/data/odata/store";
import * as moment from "moment";
import { DxContextMenuComponent, DxButtonComponent, DxSchedulerComponent, } from "devextreme-angular";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { SitesStore } from "src/app/shared/stores/sites.store";
import { SpecialistViewModel } from "src/app/shared/models/SpecialistViewModel";
import { SubscriptionBase } from "src/app/shared/base/subscribtion.base";
import { SpinnerService } from "src/app/shared/services/spinner.service";
import { switchMap, tap } from "rxjs/operators";
import { AppMessagesService } from "src/app/shared/services/app-messages.service";
import { AppInfoService } from "src/app/shared/services/app-info.service";

export class ResourceMenuItem {
  text: string;
  id: number;
  color: string;
  onItemClick: any;
  enabled: boolean;
  visible: boolean;
  beginGroup?: boolean;
  icon?: string;
}

@Component({
  selector: "app-location-sessions",
  templateUrl: "./location-sessions.component.html",
  styleUrls: ["./location-sessions.component.scss"],
})
@AutoUnsubscribe
export class LocationSessionsComponent extends SubscriptionBase implements OnInit {
  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private userService: UserService,
    public changedetectorref: ChangeDetectorRef,
    private siteStore: SitesStore,
    private spinnerService: SpinnerService,
    private appMessage: AppMessagesService, 
    public appInfo: AppInfoService
  ) {
    super();
    this.loadSettingsMenuItems();
  }

  @ViewChild("settingsMenu") settingsMenu: DxContextMenuComponent;
  @ViewChild("diarysettingsbutton") diarysettingsButton: DxButtonComponent;
  @ViewChild("sessionCalendar") sessionCalendar: DxSchedulerComponent;

  showTooltip = false;
  tooltipTarget: any;
  hoveredAppointment: SessionDataModel;
  showAddSession: boolean;
  fromDiary: boolean;
  ownerFromRoute: string;
  locationId: string;
  sessionData: SessionDataModel[];
  sessionDataSelected: SessionDataModel;
  currentDate: Date = new Date();
  sessions$: Observable<SessionDataModel[]>;
  owners: SpecialistViewModel[];
  sessionTypes: SessionTypes[];
  unavailableTypes: UnavailableTypes[];
  windowDurations: RecurrenceWindowTypes[];
  appointmentTypes: AppointmentTypes[] = [];
  startDate: Date;
  ownerLocationSelected: AppointmentListViewModel;
  locationsDataStore: ODataStore;
  locations: AppointmentListViewModel[] = [];
  locationName: string;
  publicHolsDataStore: ODataStore;
  publicHols: any[];
  getCellDuration = 30;
  timeFormat: 12;
  settingsMenuItems: ResourceMenuItem[];
  isRecurrenceUpdate: boolean;
  selectedSpecialists: SpecialistViewModel[] = [];
  owner: SpecialistViewModel;
  selectedRows: SpecialistViewModel[] = [];
  ownersId1: string[] = [];
  ownerName: string;
  public selectedRecord: any;

  ngOnInit(): void {
    this.spinnerService.start();
    this.locationId = this.route.snapshot.paramMap.get("locationId");

    this.subscription.add(
      this.appointmentService
        .getAppointmentLocations()
        .subscribe((data) => {
          this.locations = data;
          if (this.locationId) {
            this.setLocationName(this.locationId);
          }
        })
    );

    this.subscription.add(
      this.route.queryParams.pipe(
        tap(params => {
          this.ownerFromRoute = params.ownerId;
          this.fromDiary = params.fromDiary;
        }),
        switchMap(() => {
          return this.getAllSpecialists()
        })
      ).subscribe()
    )
  }

  onContentReadyHandler(e) {
    if (e.component.shouldSkipNextReady) {
      e.component.shouldSkipNextReady = false;
    }
    else {
      e.component.shouldSkipNextReady = true;
      e.component.columnOption("command:select", "width", 50);
      e.component.updateDimensions();
    }
  }

  getAllSpecialists() {
    return this.userService.getConsultantsForSite().pipe(tap(
      (value) => {
        this.owners = value.filter((item) => item.active !== false);
        if (this.ownerFromRoute) {
          this.selectedSpecialists = this.owners.filter(x => x.id === this.ownerFromRoute);
        }
        else if (this.owners.length > 1) {
          this.selectedSpecialists = [this.owners[0]];
          this.getData();
        }
        this.spinnerService.stop();
      },
      (error) => {
        this.spinnerService.stop();
      }
    ))
  }

  onSelectionChangedHandler(e) {
    this.getData();
  }

  getData() {
    if (this.locationId !== null) {
      const ownerIds = this.selectedSpecialists.map(x => x.id.toString());
      this.subscription.add(
        this.appointmentService
          .getLocationSessionsForSpecialist(this.locationId, ownerIds)
          .subscribe((data) => {
            this.sessionData = data;
            this.changedetectorref.detectChanges();
          })
      );
    }
  }

  locationChanged(e) {
    if (e.selectedItem !== null) {
      this.locationId = e.selectedItem.id;
      this.getData();
      this.ownerLocationSelected = e.selectedItem;
      this.setLocationName(e.selectedItem.id);
    }
  }

  getPublicHols() {
  }

  public getSessionType(unavailableTypeId, sessionTypeId): string {
    if (unavailableTypeId === null) {
      let sessionDesc = "";
      try {
        sessionDesc = this.sessionTypes.find(
          (x) => x.sessionTypeId === sessionTypeId
        ).description;
      } catch (e) { }
      return "Available - " + sessionDesc;
    } else {
      let unavailDesc = "";
      try {
        unavailDesc = this.unavailableTypes.find(
          (x) => x.id === unavailableTypeId
        ).description;
      } catch (e) { }
      return "Unavailable - " + unavailDesc;
    }
  }

  getintervalIcon(option) {
    if (option === this.getCellDuration) {
      return "far fa-check-square";
    } else {
      return "far fa-square";
    }
  }

  gettimeformatIcon(timeformat) {
    if (timeformat === this.timeFormat) {
      return "far fa-check-square";
    } else {
      return "far fa-square";
    }
  }

  onContextMenuItemClick(e) {
    console.log("context menu item click - itemdata:", e.itemData);
    e.itemData.onItemClick(e.itemData);
  }

  loadSettingsMenuItems() {
    this.settingsMenuItems = [
      {
        id: 1,
        text: "Interval 10m",
        onItemClick: () => this.setTimelineInterval(10),
        enabled: true,
        visible: true,
        color: "",
        beginGroup: true,
        icon: this.getintervalIcon(10),
      },
      {
        id: 2,
        text: "Interval 15m",
        onItemClick: () => this.setTimelineInterval(15),
        enabled: true,
        visible: true,
        color: "",
        icon: this.getintervalIcon(15),
      },
      {
        id: 3,
        text: "Interval 30m",
        onItemClick: () => this.setTimelineInterval(30),
        enabled: true,
        visible: true,
        color: "",
        icon: this.getintervalIcon(30),
      },
      {
        id: 4,
        text: "Interval 1h",
        onItemClick: () => this.setTimelineInterval(60),
        enabled: true,
        visible: true,
        color: "",
        icon: this.getintervalIcon(60),
      },
      {
        id: 5,
        text: "Time format 12hr am/pm",
        onItemClick: () => this.setTimeFormat(12),
        enabled: true,
        visible: true,
        color: "",
        icon: this.gettimeformatIcon(12),
        beginGroup: true,
      },
      {
        id: 6,
        text: "Time format 24hr",
        onItemClick: () => this.setTimeFormat(24),
        enabled: true,
        visible: true,
        color: "",
        icon: this.gettimeformatIcon(24),
      },
    ];
  }

  setLocationName(id) {
    this.ownerLocationSelected = this.locations.find((x) => x.id === id);
    this.locationName = this.ownerLocationSelected.name;
    this.changedetectorref.detectChanges();
  }

  onDiaryConfigureClick(e) {
    this.settingsMenu.instance.show();
  }

  setTimelineInterval(mins) {
    this.getCellDuration = mins;
    this.changedetectorref.detectChanges();
  }

  setTimeFormat(hours) {
    this.timeFormat = hours;
    this.changedetectorref.detectChanges();
  }

  public isWeekEnd(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  public isPublicHol(date) {
    const mydate = moment(date).startOf("day");
    try {
      if (
        this.publicHols.findIndex((PH) =>
          moment(PH.PHDate).startOf("day").isSame(mydate)
        ) >= 0
      ) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  markWeekEnd(cellData) {
    const classObject = {};
    classObject["diary-weekend"] = this.isWeekEnd(cellData.startDate);
    classObject["diary-publichol"] = this.isPublicHol(cellData.startDate);
    return classObject;
  }

  markTimeFormat(cellData) {
    return {};
  }

  ownerChanged(e) {
    this.selectedSpecialists = [];
    this.selectedSpecialists = e.value;
    this.changedetectorref.detectChanges();
    this.getData();
  }


  getSessionTypes() {
    this.appointmentService.getSessionTypes().subscribe((value) => {
      this.sessionTypes = value;
    });
  }

  getAppointmentTypes(ownerId: string) {
    this.appointmentService.getAppointmentTypes(ownerId).subscribe((value) => {
      this.appointmentTypes = value;
      this.changedetectorref.detectChanges();
    });
  }

  save(val: any) {
    this.getData();
  }

  onAppointmentAdding(data) { }

  onAppointmentClick(e) {
    e.cancel = true;
  }

  onAppointmentEditingHandler(data) {
    this.owner = this.selectedSpecialists.find(
      (x) => x.id === data.appointmentData.ownerId
    );

    this.sessionDataSelected = data.appointmentData;
    this.hoveredAppointment = undefined;
    this.showTooltip = false;
    this.startDate = data.startDate;
    if (this.locationId != null)
      this.showAddSession = true;
  }

  onAppointmentAddingHandler(e) {
    const ownerId = e.groups !== undefined ? e.groups.ownerId : this.ownerFromRoute;
    this.owner = this.selectedSpecialists.find((x) => x.id === ownerId);
    this.startDate = e.startDate;
    this.sessionDataSelected = null;
    this.hoveredAppointment = undefined;
    this.showTooltip = false;
    if (this.locationId != null)
      this.showAddSession = true;
  }

  refresh() {
    this.getData();
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
}
