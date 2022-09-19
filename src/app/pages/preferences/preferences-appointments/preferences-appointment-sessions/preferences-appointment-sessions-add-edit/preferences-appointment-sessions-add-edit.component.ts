import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { SitePracticeHoursService } from 'src/app/shared/services/site-practice-hours.service';
import { AppInfoService } from 'src/app/shared/services';
import { AppointmentListViewModel, AppointmentOwnerModel, AppointmentService, AppointmentTypes } from 'src/app/shared/services/appointment.service';
import { UserService } from 'src/app/shared/services/user.service';
import { requiredIfValidator } from 'src/app/shared/helpers/form-helper';
import { tap } from 'rxjs/operators';
import { AppointmentTypesService } from '../../appointment-types.service';

@Component({
  selector: 'app-preferences-appointment-sessions-add-edit',
  templateUrl: './preferences-appointment-sessions-add-edit.component.html',
  styleUrls: ['./preferences-appointment-sessions-add-edit.component.scss']
})
export class PreferencesAppointmentSessionsAddEditComponent extends PopupReactiveFormBase implements OnInit {
  locations: AppointmentListViewModel[] = [];
  specialists: AppointmentOwnerModel[] = [];
  types: AppointmentTypes[] = [];
  filteredTypes: AppointmentTypes[];
  monWork;
  mon = false;
  monStart;
  monEnd;
  tuesWork;
  tues = false;
  tuesStart;
  tuesEnd;
  wedWork;
  wed = false;
  wedStart;
  wedEnd;
  thursWork;
  thurs = false;
  thursStart;
  thursEnd;
  friWork;
  fri = false;
  friStart;
  friEnd;
  satWork;
  sat = false;
  satStart;
  satEnd;
  sunWork;
  sun = false;
  sunStart;
  sunEnd;
  specialistId;
  unavailable = false;
  practiceHours;
  appointmentTypeIds = [];

  repeats = [
    { id: 0, value: 'Don\'t repeat' },
    { id: 1, value: 'Week' },
    { id: 2, value: 'Two-weeks' },
    { id: 4, value: 'Four-weeks' },
  ]

  constructor(
    private appInfo: AppInfoService,
    private appointmentService: AppointmentService,
    private userSite: UserService,
    private dataService: SitePracticeHoursService,
    private appointmentTypesService: AppointmentTypesService
  ) {
    super();
  }

  protected controllerName = "appointmentSession";
  protected onOpened = (data) => {
    if (!this.isNew)
      this.editForm.patchValue({sessionId: data.id});

    this.getStartEndTimes();
    this.getPractitioners();
    this.getAppointmentLocations();

    this.addToSubscription(
      this.appointmentTypesService.getAppointmentTypes()
        .pipe(tap(x => {
          this.types = x;
          this.types.sort(function (a, b) {
            if (a.description < b.description) return -1;
            if (a.description > b.description) return 1;
            return 0;
          })
          this.filteredTypes = this.types;
        }))
    );

    this.setupForm();
    this.setup(data);

    if (this.isNew) {
      this.editForm.patchValue({
        eBooking: false,
        unavailable: false,
        mon: false,
        tues: false,
        wed: false,
        thurs: false,
        fri: false,
        sat: false,
        sun: false,
      })
    }
  };

  ngOnInit() {

  }

  getStartEndTimes() {
    this.dataService.getCurrentSitePracticeHours().subscribe(data => {
      this.practiceHours = data.workDays;
      data.workDays.forEach(day => {
        const d = new Date();
        switch (day.day) {
          case 1:
            this.monWork = day.working;
            this.monStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), day.startTime.hours, day.startTime.minutes);
            this.monEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), day.endTime.hours, day.endTime.minutes);
            break;

          case 2:
            this.tuesWork = day.working;
            this.tuesStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), day.startTime.hours, day.startTime.minutes);
            this.tuesEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), day.endTime.hours, day.endTime.minutes);
            break;

          case 3:
            this.wedWork = day.working;
            this.wedStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), day.startTime.hours, day.startTime.minutes);
            this.wedEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), day.endTime.hours, day.endTime.minutes);
            break;

          case 4:
            this.thursWork = day.working;
            this.thursStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), day.startTime.hours, day.startTime.minutes);
            this.thursEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), day.endTime.hours, day.endTime.minutes);
            break;

          case 5:
            this.friWork = day.working;
            this.friStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), day.startTime.hours, day.startTime.minutes);
            this.friEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), day.endTime.hours, day.endTime.minutes);
            break;

          case 6:
            this.satWork = day.working;
            this.satStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), day.startTime.hours, day.startTime.minutes);
            this.satEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), day.endTime.hours, day.endTime.minutes);
            break;

          case 7:
            this.sunWork = day.working;
            this.sunStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), day.startTime.hours, day.startTime.minutes);
            this.sunEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), day.endTime.hours, day.endTime.minutes);
            break;
        }
      })
    });
  }

  getPractitioners() {
    this.appointmentService.getAppointmentOwners().subscribe(value => {
      this.specialists = value;
      this.specialists.sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      })
    })
  }

  getAppointmentLocations() {
    this.appointmentService.getAppointmentLocations().subscribe(data => {
      this.locations = data;
      this.locations.sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      })
    })
  }

  getAppointmentTypes(id) {
    this.filteredTypes = this.types.filter(x => x.appointmentOwners.includes(id));
  }

  private setupForm() {
    this.editForm = new FormGroup({
      sessionId: new FormControl(undefined),
      description: new FormControl(null, Validators.required),
      eBooking: new FormControl(false),
      unavailable: new FormControl(false),
      unavailableStartDateTime: new FormControl(null, requiredIfValidator(() => this.unavailable)),
      unavailableEndDateTime: new FormControl(null, requiredIfValidator(() => this.unavailable)),
      ownerId: new FormControl(null, Validators.required),
      locationId: new FormControl(null, requiredIfValidator(() => !this.unavailable)),
      appointmentTypes: new FormControl(null),
      appointmentTypeIds: new FormControl(null),
      startDate: new FormControl(null, requiredIfValidator(() => !this.unavailable)),
      endDate: new FormControl(null, requiredIfValidator(() => !this.unavailable)),
      repeatsEvery: new FormControl(1, requiredIfValidator(() => !this.unavailable)),
      mon: new FormControl(false),
      monStartTime: new FormControl(null, requiredIfValidator(() => this.mon)),
      monEndTime: new FormControl(null, requiredIfValidator(() => this.mon)),
      tues: new FormControl(false),
      tuesStartTime: new FormControl(null, requiredIfValidator(() => this.tues)),
      tuesEndTime: new FormControl(null, requiredIfValidator(() => this.tues)),
      wed: new FormControl(false),
      wedStartTime: new FormControl(null, requiredIfValidator(() => this.wed)),
      wedEndTime: new FormControl(null, requiredIfValidator(() => this.wed)),
      thurs: new FormControl(false),
      thursStartTime: new FormControl(null, requiredIfValidator(() => this.thurs)),
      thursEndTime: new FormControl(null, requiredIfValidator(() => this.thurs)),
      fri: new FormControl(false),
      friStartTime: new FormControl(null, requiredIfValidator(() => this.fri)),
      friEndTime: new FormControl(null, requiredIfValidator(() => this.fri)),
      sat: new FormControl(false),
      satStartTime: new FormControl(null, requiredIfValidator(() => this.sat)),
      satEndTime: new FormControl(null, requiredIfValidator(() => this.sat)),
      sun: new FormControl(false),
      sunStartTime: new FormControl(null, requiredIfValidator(() => this.sun)),
      sunEndTime: new FormControl(null, requiredIfValidator(() => this.sun)),
      /* backgroundColour: new FormControl(undefined, requiredIfValidator(() => !this.unavailable)), */
    });    

    this.subscription.add(this.editForm.get('ownerId').valueChanges.subscribe(val => {
      if (val && !this.submitting) {
        this.specialistId = val;
        this.getAppointmentTypes(val);
      }
    })); 

    this.subscription.add(this.editForm.get('unavailable').valueChanges.subscribe(x => {
      this.unavailable = x;
      if (!this.submitting)
        this.editForm.patchValue({appointmentTypes: []});
      this.updateValidity();
    }));

    this.subscription.add(this.editForm.get('mon').valueChanges.subscribe(x => {
      this.mon = x;
      this.updateValidity();
    }));

    this.subscription.add(this.editForm.get('tues').valueChanges.subscribe(x => {
      this.tues = x;
      this.updateValidity();
    }));

    this.subscription.add(this.editForm.get('wed').valueChanges.subscribe(x => {
      this.wed = x;
      this.updateValidity();
    }));

    this.subscription.add(this.editForm.get('thurs').valueChanges.subscribe(x => {
      this.thurs = x;
      this.updateValidity();
    }));

    this.subscription.add(this.editForm.get('fri').valueChanges.subscribe(x => {
      this.fri = x;
      this.updateValidity();
    }));

    this.subscription.add(this.editForm.get('sat').valueChanges.subscribe(x => {
      this.sat = x;
      this.updateValidity();
    }));

    this.subscription.add(this.editForm.get('sun').valueChanges.subscribe(x => {
      this.sun = x;
      this.updateValidity();
    }));
  }

  updateValidity() {
    this.editForm.controls['locationId'].updateValueAndValidity();
    this.editForm.controls['unavailableStartDateTime'].updateValueAndValidity();
    this.editForm.controls['unavailableEndDateTime'].updateValueAndValidity();
    this.editForm.controls['startDate'].updateValueAndValidity();
    this.editForm.controls['endDate'].updateValueAndValidity();
    this.editForm.controls['repeatsEvery'].updateValueAndValidity();
    this.editForm.controls['monStartTime'].updateValueAndValidity();
    this.editForm.controls['monEndTime'].updateValueAndValidity();
    this.editForm.controls['tuesStartTime'].updateValueAndValidity();
    this.editForm.controls['tuesEndTime'].updateValueAndValidity();
    this.editForm.controls['wedStartTime'].updateValueAndValidity();
    this.editForm.controls['wedEndTime'].updateValueAndValidity();
    this.editForm.controls['thursStartTime'].updateValueAndValidity();
    this.editForm.controls['thursEndTime'].updateValueAndValidity();
    this.editForm.controls['friStartTime'].updateValueAndValidity();
    this.editForm.controls['friEndTime'].updateValueAndValidity();
    this.editForm.controls['satStartTime'].updateValueAndValidity();
    this.editForm.controls['satEndTime'].updateValueAndValidity();
    this.editForm.controls['sunStartTime'].updateValueAndValidity();
    this.editForm.controls['sunEndTime'].updateValueAndValidity();
    this.editForm.controls['backgroundColour'].updateValueAndValidity();
  }
}