import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Output, } from "@angular/core";
import { AppointmentService, AppointmentDataModel, AppointmentViewModel, AppointmentListViewModel, DiaryViewModel, WaitingListModel, } from "../../services/appointment.service";
import { UserService } from "../../services/user.service";
import * as moment from "moment";
import { AppInfoService } from "../../services";
import ODataStore from "devextreme/data/odata/store";
import { UnavailableTypes, } from "src/app/shared/services/appointment.service";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { SitesStore } from "../../stores/sites.store";
import { UserStore } from "../../stores/user.store";
import { SpecialistViewModel } from "../../models/SpecialistViewModel";
import { SubscriptionBase } from "../../base/subscribtion.base";
import { AppMessagesService } from "../../services/app-messages.service";
import { BehaviorSubject } from "rxjs";
import { debounceTime, tap } from "rxjs/operators";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-appointments",
  styleUrls: ["./appointments.component.scss"],
  templateUrl: "./appointments.component.html",
})
@AutoUnsubscribe
export class AppointmentsComponent extends SubscriptionBase implements OnInit {
  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService,
    private appInfo: AppInfoService,
    private userStore: UserStore,
    private appMessagesService: AppMessagesService,
    private siteStore: SitesStore,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  @Input() sessionId: string;
  @Input() patientId: string;
  @Input() public set duration(value) {
    if (value) {
      this._duration = value;

      if (this.filterStartDate && value > 5) {
        this.getDataSubject.next({});
      }
    }

  }
  public get duration() {
    return this._duration;
  }

  @Input() public set appointmentTypeId(value) {
    if (value) {
      this._appointmentTypeId = value;

      if (this.filterStartDate) {
        this.getDataSubject.next({});
      }
    }

  }
  public get appointmentTypeId() {
    return this._appointmentTypeId;
  }

  @Output() slotSelected = new EventEmitter<AppointmentViewModel>();
  @Output() addedToWaitingList = new EventEmitter();

  unavailableTypes: UnavailableTypes[];
  publicHolsDataStore: ODataStore;
  publicHols: any[];
  getCellDuration = 10;
  timeFormat: 12;
  loadingVisible = false;

  soonerAppointment: SoonerAppointment[] = [
    {
      text: "No",
      id: false,
    },
    {
      text: "Yes",
      id: true,
    },
  ];

  private _duration: any;
  private _appointmentTypeId: any;
  private getDataSubject = new BehaviorSubject<any>(undefined);
  private filterStartDate: Date;
  private filterEndDate: Date;
  private viewChanged = false;

  _apptTypeSelected: string;
  _ownerSelectedId: string;
  showAddToWaitingList = false;
  owners: SpecialistViewModel[] = [];
  _ownerSelected: SpecialistViewModel = null;
  ownerSelected: SpecialistViewModel;
  ownerLocationSelected: AppointmentListViewModel;
  fullName: string;
  showName: boolean;
  isOnWaitingList: boolean;
  appointmentDataItem: DiaryViewModel;
  PatientStore: ODataStore;
  currentDate: Date = new Date();
  startTime = 5;
  sessionData: AppointmentDataModel[];
  public editForm: FormGroup;
  addToWaiting = false;

  ngOnInit(): void {
    this.getAppointmentOwners();
    this.setupForm();

    this.subscription.add(
      this.getDataSubject
        .pipe(
          debounceTime(500),
          tap((x) => {
            if (x) {
              this.getAvailableSessions();
            }
          })
        )
        .subscribe()
    );
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

  onAppointmentRenderedHandler(e) {
    e.appointmentElement.style.height = "48px";
  }

  onContentReadyHandler(args) {
    const agendaView = args.component.getWorkSpace();
    agendaView.option("rowHeight", 48);

    //initial load
    if (!this.filterStartDate) {
      this.filterStartDate = args.component.getStartViewDate();
      this.filterEndDate = args.component.getEndViewDate();
      this.getDataSubject.next({})
    }

    if (this.viewChanged && this.filterStartDate.getTime() !== args.component.getStartViewDate().getTime()) {
      this.filterStartDate = args.component.getStartViewDate();
      this.currentDate = this.filterStartDate;
      this.filterEndDate = args.component.getEndViewDate();
      this.viewChanged = false;
      this.getDataSubject.next({});
    }

  }

  markWeekEnd(cellData) {
    const classObject = {};
    classObject["diary-weekend"] = this.isWeekEnd(cellData.startDate);
    classObject["diary-publichol"] = this.isPublicHol(cellData.startDate);
    return classObject;
  }

  getAppointmentOwners() {
    this.userService.getConsultantsForSite().subscribe((value) => {
      let tempOwners = value.filter((item) => item.active !== false);
      tempOwners.sort(function (a, b) {
        if (a.displayName < b.displayName ) return -1;
        if (a.displayName  > b.displayName ) return 1;
        return 0;
      });
      this.owners.push({
        displayName: "All Practitioners",
        id: null,
      });
      tempOwners.forEach((owner) => {
        this.owners.push(owner);
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  ownerChanged() {
    this.getAvailableSessions();
    this.changeDetectorRef.detectChanges();
  }

  onAppointmentEditingHandler(item) {
    item.appointmentData.startDate = new Date(item.appointmentData.startDate);
    item.appointmentData.endDate = new Date(item.appointmentData.endDate);
    this.slotSelected.emit(item.appointmentData);
  }

  onOptionChangedHandler(e) {
    if (e.fullName == "currentDate" || e.fullName == "currentView") {
      this.viewChanged = true;
    }
  }

  getAvailableSessions() {
    this.loadingVisible = true;
    this.changeDetectorRef.detectChanges();

    let ownerId = null;

    if (this.ownerSelected) {
      ownerId = this.ownerSelected.id;
    }

    this.appointmentService
      .getAvailableSessions(
        this.sessionId,
        ownerId,
        this.duration,
        this.appointmentTypeId,
        this.filterStartDate,
        this.filterEndDate
      )
      .subscribe((value) => {
        this.sessionData = value;
        this.loadingVisible = false;
        if (this.sessionData.length > 0) {
          this.showAddToWaitingList = false;
          const now = new Date();
          for (const a of this.sessionData) {
            const x = moment(a.startDate).isAfter(now);
            if (x) {
              this.startTime = new Date(a.startDate).getHours();
              this.loadingVisible = false;
              this.changeDetectorRef.detectChanges();
              break;
            }
          }
        } else {
          this.startTime = 5;
          this.showAddToWaitingList = true;
        }

        this.changeDetectorRef.detectChanges();
      });
  }

  setupForm() {
    this.editForm = new FormGroup({
      notes: new FormControl(undefined),
      priority: new FormControl(false),
    });
  }


  addToWaitingList() {
    const waitingListVM = new WaitingListModel();

    let ownerId = null;

    if (this.ownerSelected) {
      ownerId = this.ownerSelected.id;
    }

    waitingListVM.ownerId = ownerId;
    waitingListVM.patientId = this.patientId;
    waitingListVM.appointmentTypeId = this.appointmentTypeId;
    waitingListVM.notes = this.editForm.get('notes').value;
    waitingListVM.priority = this.editForm.get('priority').value;
    this.subscription.add(
      this.appointmentService
        .addToWaitingList(waitingListVM)
        .subscribe((value) => {
          this.appMessagesService.showSuccessInformationModal(
            "Patient has been added to waiting list."
          );
          this.addedToWaitingList.emit();
        })
    );
  }

  public getFormPropertyValue(controlName: string){
    return this.editForm.controls[controlName].value;
  }
}

export class SoonerAppointment {
  text: string;
  id: boolean;
}
