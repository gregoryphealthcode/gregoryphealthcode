import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService, AppointmentListViewModel } from 'src/app/shared/services/appointment.service';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserStore } from 'src/app/shared/stores/user.store';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';

@Component({
  selector: 'app-preferences-list-appointment-locations',
  templateUrl: './list-appointment-location.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' }
})
export class ListAppointmentsComponent extends SubscriptionBase implements OnInit {
  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private userStore: UserStore
  ) {
    super();
  }

  appointments$: Observable<AppointmentListViewModel[]>;
  locations: AppointmentListViewModel[];
  showAddLocations: boolean;
  siteId: string;
  isNew = true;
  
  ngOnInit(): void {
    this.siteId = this.userStore.getSiteId();
    this.getAppointmentLocations();
  }

  getAppointmentLocations() {
    this.subscription.add(
      this.appointmentService.getAppointmentLocations(this.siteId).pipe(first()).subscribe(value => {
        this.locations = value;

      }))
  }

  add() {
    this.showAddLocations = true;
  }

  viewSessions(location: any) {
    this.router.navigate(['./sessions/location-sessions/' + location.id]);
  }
}