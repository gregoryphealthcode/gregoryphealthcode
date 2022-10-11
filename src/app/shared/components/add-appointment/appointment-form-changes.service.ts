import { Injectable } from '@angular/core';
import { EMPTY, of } from 'rxjs';
import { tap, switchMap, distinctUntilChanged, filter } from 'rxjs/operators';
import { AppointmentAddEditStoreService } from './appointment-add-edit-store.service';
import { AppointmentDropdownDataManagerService } from './appointment-dropdown-data-manager.service';

@Injectable()
export class AppointmentFormChangesService {
  constructor(
    private store: AppointmentAddEditStoreService,
    private dropdownData: AppointmentDropdownDataManagerService
  ) { }

  public setup() {
    this.listenToAppTypeChanges();
    this.listenToStartDateChanges();
    this.listenToSpecialistChanges();
    this.listenToAddToWaitingListChanges();
  }

  private listenToAppTypeChanges() {
    this.store.getFormControl("appointmentTypeId")
      .valueChanges.pipe(
        tap((x) => {
          this.setType(x);
        })
      )
      .subscribe();
  }

  private listenToStartDateChanges() {
    this.store.getFormControl("startDate")
      .valueChanges.pipe(
        filter(x=> !!x),
        tap((x) => {
          this.updateEndDate();
        }),
        switchMap(() => {
          if (
            this.store.getFormPropertyValue("appointmentTypeId") &&
            !this.store.getFormPropertyValue("appointmentId")
          ) {
            return this.store.reserveAppointment();
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  public listenToLocationIdChanges() {
    this.store.getFormControl("locationId")
      .valueChanges.pipe(
        switchMap(() => {
          if (
            this.store.getFormPropertyValue("appointmentTypeId") &&
            !this.store.getFormPropertyValue("appointmentId")
          ) {
            return this.store.reserveAppointment();
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  private setType(id: string) {
    if (id && !this.store.getFormPropertyValue("durationMinutes")) {
      const item = this.dropdownData.appointmentOwnerTypes.find(
        (x) => x.id === id
      );
      if (item) {
        this.store.setFormPropertyValue("durationMinutes", item.duration);
        this.updateEndDate();
      }
    }
  }

  private updateEndDate() {
    const durationMinutes = this.store.getFormPropertyValue("durationMinutes");
    if (durationMinutes && this.store.getFormPropertyValue("startDate")) {
      const endDate = new Date(
        this.store.getFormPropertyValue("startDate").getTime() +
        60 * 1000 * durationMinutes
      );
      this.store.setFormPropertyValue("endDate", endDate);
    }
  }

  private listenToSpecialistChanges() {
    let ownerId;
    this.store.getFormControl("ownerId")
      .valueChanges.pipe(
        distinctUntilChanged(),
        filter((x) => x),
        switchMap((x) => {
          ownerId = x;
          if (!this.dropdownData.owners) {
            return this.dropdownData.getAppointmentOwners$();
          }
          return of(true);
        }),
        tap(() => this.dropdownData.setSpecialistName(ownerId)),
        switchMap(() => this.dropdownData.getLocations$(ownerId))
      )
      .subscribe();
  }


  private listenToAddToWaitingListChanges() {
  //   this.store.getFormControl("addToWaitingList")
  //     .valueChanges.pipe(
  //       filter((x) => x),
  //       switchMap(() => this.store.addToWaitingList$())
  //     )
  //     .subscribe();
   }
}
