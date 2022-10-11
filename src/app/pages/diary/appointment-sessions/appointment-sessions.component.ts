import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Guid from 'devextreme/core/guid';
import { GridBase } from 'src/app/shared/base/grid.base';
import { SpecialistViewModel } from 'src/app/shared/models/SpecialistViewModel';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { AppointmentListViewModel, AppointmentService, SessionDataModel } from 'src/app/shared/services/appointment.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-appointment-sessions',
  templateUrl: './appointment-sessions.component.html',
  styleUrls: ['./appointment-sessions.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' },
})
export class AppointmentSessionsComponent extends GridBase implements OnInit {
  constructor(
    private spinner: SpinnerService,
    private snackBar: MatSnackBar,
    private appMessages: AppMessagesService,
    private appointmentService: AppointmentService,
    private siteStore: SitesStore
  ) {
    super();
  }

  types: SearchOptions[] = [];
  session: SessionDataModel;
  owner: SpecialistViewModel;
  location: AppointmentListViewModel;
  action: string;
  now = new Date();
  startDate = new Date();
  showAddSession = false;
  siteId;
  isExpiredSessions: boolean = false

  selectedType = "00000000-0000-0000-0000-000000000000";
  appointmentTypes: SearchOptions[] = [];

  ngOnInit() {
    this.siteId = this.siteStore.getSelectedSite().siteId;
    this.session = new SessionDataModel();
    this.location = new AppointmentListViewModel();
    this.owner = new SpecialistViewModel();

    this.getAppointmentTypes();

    this.getAppointmentSessions();
    this.subscription.add()
  }

  getAppointmentTypes() {
    this.appointmentService.getAppointmentTypesSelection().subscribe(data => {
      this.types = data;
      this.types.sort(function (a, b) {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      });
      this.appointmentTypes.push({
        description: "All Types",
        id: "00000000-0000-0000-0000-000000000000",
      });
      this.types.forEach((type) => {
        this.appointmentTypes.push(type);
      });
    })
  }

  getAppointmentSessions() {
    this.controllerUrl = `${environment.baseurl}/appointmentSession/`;
    this.setupDataSource({
      key: 'id',
      loadParamsCallback: () => [
        { name: 'startDate', value: this.startDate.toISOString() },
        { name: 'appointmentType', value: this.selectedType },
        { name: 'isExpiredSessions', value: this.isExpiredSessions }
      ],
    });
  }

  add() {
    this.action = "Add";

  }

  editClicked(e) {
    this.action = "Edit";
    this.session.sessionId = e.data.sessionId;
    this.owner.id = e.data.ownerId;
    this.location.id = e.data.locationId;
    this.showAddSession = true;
  }

  /* deleteClicked(e) {
      const text = 'Are you sure you want to delete this appointment session?'
  
      const callback = () => {
        this.spinner.start();
        this.appointmentService.deleteAppointmentSession(e.data.id).subscribe(
          (x) => {
            this.spinner.stop();
            this.snackBar.open("Appointment Session deleted", "Close", {
              panelClass: "badge-success",
              duration: 3000,
            }
            );
            this.refreshData();
          },
          (e) => {
            this.spinner.stop(); this.appMessages.showApiErrorNotification(e)
          }
        );
      };
  
      this.appMessages.showDeleteConfirmation(callback, text);
    }
  } */

  dateChange(e) {
    this.startDate = e.value;
    this.refreshData();
  }

  setSearchType(e) {
    this.selectedType = e.selectedItem.id;
    this.refreshData();
  }

  saved(e) {
    if (e.success) {
      if (this.action == "Add") {
        this.snackBar.open("Appointment Session added", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
      }
      if (this.action == "Edit") {
        this.snackBar.open("Appointment Session edited", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
      }
    }
    if (e.errors) {
      this.snackBar.open(e.errors[0], "Close", {
        panelClass: "badge-danger",
        duration: 3000,
      });
    }
    this.action = "";
    this.getAppointmentSessions();
  }

  checkboxChanged(e) {
    this.isExpiredSessions = !this.isExpiredSessions;
    this.refreshData();
  }

}

interface SearchOptions {
  id: Guid;
  description: string;
}