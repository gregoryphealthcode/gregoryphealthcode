import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { thickness } from 'devexpress-reporting/scopes/reporting-chart-internal';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { SpecialistViewModel } from 'src/app/shared/models/SpecialistViewModel';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { SitesService } from 'src/app/shared/services/sites.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-waiting-list-add-edit',
  templateUrl: './waiting-list-add-edit.component.html',
  styleUrls: ['./waiting-list-add-edit.component.scss']
})
export class WaitingListAddEditComponent extends PopupReactiveFormBase implements OnInit {
  appointmentTypes = [];
  locations = [];
  filteredLocations = [];
  specialists: SpecialistViewModel[] = [];
  filteredSpecialists: SpecialistViewModel[] = [];
  appointmentTypeId;
  patientId: string;

  constructor(
    public appointmentService: AppointmentService,
    private userService: UserService,
  ) {
    super();
  }

  protected controllerName = "waitingList";
  protected onOpened = (data) => {
    debugger;
    if (data.patientId) {
      this.patientId = data.patientId;
      this.setFormPropertyValue('patientId', this.patientId);
    }

    this.setupForm();

    this.getAppointmentTypes();
    this.getAppointmentOwners();
    this.getLocations();

    this.setup(data);
  };

  ngOnInit() {
    this.setupForm();
  }

  getAppointmentTypes() {
    this.appointmentService.getTypesForAppointments().subscribe(value => {
      this.appointmentTypes = value;
    });
  }

  getAppointmentOwners() {
    this.userService.getConsultantsForSite().subscribe(data => {
      this.specialists = data.filter(item => item.active !== false);;
      this.specialists.sort(function (a, b) {
        if (a.displayName < b.displayName) return -1;
        if (a.displayName > b.displayName) { return 1; }
        return 0;
      })
      this.filteredSpecialists = this.specialists;
    });
  }

  getLocations() {
    this.appointmentService.getAppointmentLocations().subscribe(data => {
      this.locations = data;
      this.locations.sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) { return 1; }
        return 0;
      })
      this.filteredLocations = this.locations;
    });
  }

  setupForm() {
    this.editForm = new FormGroup({
      id: new FormControl(undefined),
      patientId: new FormControl(undefined),
      appointmentTypeId: new FormControl(undefined, [Validators.required]),
      locationId: new FormControl(undefined),
      ownerId: new FormControl(undefined),
      duration: new FormControl(undefined, [Validators.required]),
      notes: new FormControl(undefined),
      priority: new FormControl(undefined),
    }); 

    this.subscription.add(this.editForm.get('appointmentTypeId').valueChanges.subscribe(x => {
      if (x) {
        this.filteredSpecialists = this.specialists;
        this.filteredSpecialists = this.filteredSpecialists.filter(y => y.appointmentTypes.includes(x));

        const duration = this.appointmentTypes.find(y => y.appointmentTypeId == x)?.duration;
        this.setFormPropertyValue("duration", duration);
      }
    }));

    this.subscription.add(this.editForm.get('ownerId').valueChanges.subscribe(x => {
      if (x) {
        this.filteredLocations = this.locations;
        this.filteredLocations = this.filteredLocations.filter(y => y.appointmentOwners.includes(x));
      }
    }));
  }

  validateDuration() {
    if (this.getFormPropertyValue('duration') === null) {
      this.setFormPropertyValue("duration", 1);
    }
    return true;
  }

  newPatient(myPatientId) {
    this.loadPatient(myPatientId);
  }

  loadPatient(myPatientId) {
    if (myPatientId)
      this.editForm.patchValue({ patientId: myPatientId });
  }
}
