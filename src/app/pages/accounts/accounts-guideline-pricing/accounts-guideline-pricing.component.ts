import { Component, OnInit } from "@angular/core";
import { switchMap, tap } from "rxjs/operators";
import { SubscriptionBase } from "src/app/shared/base/subscribtion.base";
import { AppMessagesService } from "src/app/shared/services/app-messages.service";
import { ManagedPayorModel, ManagedServiceLocationModel, ManagedServiceModel, ManagedServicePayorModel, PricingMatrixService, } from "src/app/shared/services/pricing-matrix.service";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import notify from "devextreme/ui/notify";
import { AppInfoService } from "src/app/shared/services";
import { AppointmentListViewModel, AppointmentService } from "src/app/shared/services/appointment.service";

@Component({
  selector: "app-accounts-guideline-pricing",
  templateUrl: "accounts-guideline-pricing.component.html",
  styleUrls: ["accounts-guideline-pricing.component.scss"],
  host: { class: "d-flex flex-column flex-grow-1" },
})
@AutoUnsubscribe
export class AccountsGuidelinePricingComponent extends SubscriptionBase implements OnInit {
  records: any[] = [];
  payors: ManagedPayorModel[] = [];
  filteredPayors: ManagedPayorModel[] = [];

  services: ManagedServiceModel[] = [];
  servicePayors: ManagedServicePayorModel[] = [];

  locations: ManagedServiceLocationModel[] = [];
  filteredLocations: ManagedServiceLocationModel[] = [];

  currentServiceId;
  currentPayorId;

  serviceId;
  service;
  payorId;
  payor;

  showAddPayor = false;
  showAddService = false;
  showMultiProc = false;
  selectedServiceRecord: any;

  selectedPayor = "00000000-0000-0000-0000-000000000000";
  payorSelection: ManagedPayorModel[] = [];

  selectedService = 0;
  serviceSelection: ManagedServiceModel[] = [];
  selectedLocation = '00000000-0000-0000-0000-000000000000';
  appointmentListViewList: AppointmentListViewModel[] = [];

  showEdit = false;

  items = [
    { id: 1, description: "New Payor", icon: "far fa-user-tag" },
    { id: 2, description: "New Service", icon: "far fa-procedures" },
  ];

  constructor(
    private pricingMatrixService: PricingMatrixService,
    private appMessages: AppMessagesService,
    public appInfo: AppInfoService,
    public appointmentService: AppointmentService
  ) {
    super();
  }

  ngOnInit() {
    this.getPricingMatrix();
  }

  getPricingMatrix() {
    this.getPayors();
    this.getServices();
    this.getServicePayors();
    this.getAppointmentLocations();
    this.getLocations();
  }

  getPayors() {
    this.pricingMatrixService.getManagedPayors().subscribe((data) => {
      this.payors = data;
      this.payors.sort(function (a, b) {
        if (a.payorName < b.payorName) return -1;
        if (a.payorName > b.payorName) return 1;
        return 0;
      });
      this.payorSelection.push({
        payorName: "All Payors",
        payorId: "00000000-0000-0000-0000-000000000000",
      });
      this.payors.forEach((payor) => {
        this.payorSelection.push(payor);
      });
      this.filteredPayors = this.payors;
    });
  }

  getServices() {
    this.subscription.add(this.getServices$().subscribe());
  }

  getServices$() {
    return this.pricingMatrixService.getManagedServices(
      this.selectedService != 0 ? this.selectedService : null,
    ).pipe(
      tap((data) => {
        this.services = data;
        this.serviceSelection.push({
          serviceDescription: "All Services",
          serviceId: 0,
        });
        this.services.forEach((service) => {
          this.serviceSelection.push(service);
        });
      })
    );
  }

  getAppointmentLocations() {
    this.subscription.add(this.getAppointmentLocations$().subscribe());
  }

  getAppointmentLocations$() {
    return this.appointmentService.getAppointmentLocations().pipe(
      tap((data) => {
        // this.appointmentListViewList.push({
        //   name: "All Locations",
        //   id: "00000000-0000-0000-0000-000000000000",
        //   street: "",
        //   town: "",
        //   postcode: "",
        //   hcCode: "",
        //   appointmentOwners: []
        // });
        data.forEach((location) => {
          this.appointmentListViewList.push(location);
        });
      })
    );
  }

  getServicePayors() {
    this.pricingMatrixService.getManagedServicePayors().subscribe((data) => {
      this.servicePayors = data;
    });
  }

  getPrice(e) {
    const payorId = this.payors[e.columnIndex - 3]?.payorId;
    const serviceId = e.key;
    return this.servicePayors.find(
      (x) => x.managedServiceId == serviceId && x.managedPayorId == payorId
    )?.price;
  }

  itemClicked(item) {
    switch (item.id) {
      case 1:
        this.showAddPayor = true;
        break;
      case 2:
        this.selectedServiceRecord = { id: 0 };
        this.showAddService = true;
        break;
      default:
        break;
    }
  }

  getLocations() {
    this.pricingMatrixService.getLocations().subscribe(data => {
      this.locations = data; 
      this.filteredLocations = this.locations;    
    })
  }

  setSearchPayor(e) {
    this.selectedPayor = e.selectedItem.payorId;
    if (this.selectedPayor != '00000000-0000-0000-0000-000000000000')
      this.filteredPayors = this.payors.filter(x => x.payorId == this.selectedPayor);
  }

  setSearchService(e) {
    this.selectedService = e.selectedItem.serviceId;
    this.getServices();
  }

  // setSearchLocation(e) {
  //   this.selectedLocation = e.selectedItem.id;
  //   this.filteredLocations = this.locations;
  //   if (this.selectedLocation != '00000000-0000-0000-0000-000000000000')
  //     this.filteredLocations = this.locations.filter(x => x.locationId == this.selectedLocation);
  // }

  setSearchLocation(e) {
    this.filteredLocations = [];

    if (e.value && e.value.length > 0) {
      e.value.forEach(id => {
        if (!this.filteredLocations.find(x => x.locationId == id)) {
          this.filteredLocations.push(this.locations.find(x => x.locationId === id));
        }
      });
    }
  }

  editClicked(data) {
    this.payorId = this.payors[data.columnIndex - 3]?.payorId;
    this.payor = this.payors[data.columnIndex - 3]?.payorName;
    this.serviceId = data.data.serviceId;
    this.service = data.data.serviceDescription;
    this.showEdit = true;
  }

  priceChanged(e, data) {
    const payorId = this.payors[data.columnIndex - 3]?.payorId;
    const serviceId = data.key;

    let managedServicePayorId = this.servicePayors.find(
      (x) =>
        x.managedServiceId == serviceId &&
        x.managedPayorId == payorId
    )?.managedServicePayorId;

    let request = null;

    if (managedServicePayorId) {
      request = this.pricingMatrixService.editManagedServicePayor(
        managedServicePayorId,
        e.value == "" ? 0 : e.value
      );
    } else {
      request = this.pricingMatrixService.addManagedServicePayor(
        serviceId,
        payorId,
        e.value
      );
    }

    this.subscription.add(
      request.subscribe(
        () => {
          this.getPricingMatrix();
        },
        (e) => {
          this.appMessages.showApiErrorNotification(e), this.getPricingMatrix();
        }
      )
    );
  }

  saved(e) {
    this.showEdit = false;
    this.showAddService = false;
    this.showAddPayor = false;
    this.getPricingMatrix();
  }

  payorClosed() {
    this.showAddPayor = false;
  }

  onFocusedRowChanged(e) {
    this.currentServiceId = e.row.key;
  }

  onRowExpanded(e) {
    this.currentServiceId = e.key;
  }

  deleteClicked(e) {
    const request = this.pricingMatrixService.deleteManagedService(e.key);
    this.subscription.add(
      request
        .pipe(
          tap(
            () => {
              notify("Successfully deleted.", "success");
            },
            (error: any) => this.appMessages.showApiErrorNotification(error)
          ),
          switchMap(() => this.getServices$())
        )
        .subscribe()
    );
  }
}
