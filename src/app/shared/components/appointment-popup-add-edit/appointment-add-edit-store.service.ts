import { Injectable } from "@angular/core";
import { InvoiceServicesStoreService, ServiceParentEntityType } from "../invoice-services-select/invoice-services-store.service";

@Injectable()
export class AppointmentAddEditStoreService {
  constructor(
    private servicesStore: InvoiceServicesStoreService
  ) { }

  setServicesStore(appointmentId, ownerId, startDate, endDate) {
    this.servicesStore.setParentEntityType(ServiceParentEntityType.Appointment);
    this.servicesStore.setParentEntityId(appointmentId);
    this.servicesStore.setDefaultOwnerId(ownerId);
    this.servicesStore.setDefaultStartDate(startDate);
    this.servicesStore.setDefaultEndDate(endDate);
  }
}
