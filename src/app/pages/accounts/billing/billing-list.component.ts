import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentViewModel, AppointmentService, AppointmentLocationModel, } from 'src/app/shared/services/appointment.service';
import { AppInfoService, } from 'src/app/shared/services';
import { formatDate, Location } from '@angular/common';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { UserStore } from 'src/app/shared/stores/user.store';
import { UserService } from 'src/app/shared/services/user.service';
import { SpecialistModel } from 'src/app/shared/models/SpecialistViewModel';
import { GridBase } from 'src/app/shared/base/grid.base';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs'

@Component({
  selector: 'app-billing-list',
  templateUrl: './billing-list.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
  styleUrls: ['./billing-list.component.scss'],
})
@AutoUnsubscribe
export class BillingListComponent extends GridBase implements OnInit {
  constructor(
    private router: Router,
    public appInfo: AppInfoService,
    private userStore: UserStore,
    public location: Location,
    private appointmentService: AppointmentService,
    private userService: UserService
  ) {
    super();
  }

  private searchTerms = new BehaviorSubject<any>(undefined);
  searchTermValue: string = "";

  fullName = '';
  siteId: string;
  patientId: string;
  appointmentId: string;
  showPanel = false;
  selectedrowData: AppointmentViewModel;

  appointmentOwners: SpecialistModel[] = [{ id: "00000000-0000-0000-0000-000000000000", displayName: "All Practitioners"}];
  appointmentLocations: AppointmentLocationModel[] = [{ id: "00000000-0000-0000-0000-000000000000", name: "All Locations"}];
  selectedOwner = "00000000-0000-0000-0000-000000000000";
  selectedLocation = "00000000-0000-0000-0000-000000000000";

  fileName = "ToBeInvoiced-" + formatDate(new Date(), "dd-MM-yyyy", 'en');

  ngOnInit(): void {
    this.siteId = this.userStore.getSiteId();
    this.getAppointmentsForBilling();
    this.getAppointmentOwners();
    this.getAppointmentLocations();

    this.subscription.add(
      this.searchTerms
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap((x) => {
            if (x !== undefined) this.reloadData();
          })
        )
        .subscribe()
    );
  }

  reloadData() {
    this.getAppointmentsForBilling();
  }

  getAppointmentsForBilling() {
    this.controllerUrl = `${environment.baseurl}/billing/`;
    this.setupDataSource({
      key: 'appointmentId',
      loadParamsCallback: () => [
        { name: 'searchValue', value: this.searchTermValue },
        { name: 'searchLocation', value: this.selectedLocation },
        { name: 'searchOwner', value: this.selectedOwner },
      ],
    });
  }

  getAppointmentOwners() {
    this.userService.getConsultantsForSite().subscribe(data => {
      const owners = data.filter(item => item.active !== false);
      owners.forEach(owner => {
        this.appointmentOwners.push(owner);
      });
    });
  }

  getAppointmentLocations() {
    this.subscription.add(
      this.appointmentService.getAppointmentLocations(this.siteId).subscribe(data => {
        const locations = data;
        locations.forEach(location => {
          this.appointmentLocations.push(location);
        })
      })
    );
  }

  createInvoice(e) {
    this.quickeBill(e.data.patientId, e.data.appointmentId);
  }

  quickeBill(patientId: string, appointmentId: string) {    
    sessionStorage.setItem('returnUrl', '/accounts/billing-list');
    this.router.navigate(['/accounts/invoice'], {
      queryParams: { patientId: patientId, appointmentId: appointmentId },
    });
  }

  onFocusedRowChanged(e) {
    this.selectedrowData = e.row.data;
    this.patientId = e.row.data.patientId;
    this.appointmentId = e.row.data.appointmentId;
    this.showPanel = true;
  }

  public onSearchInputChangedHandler() {
      this.searchTerms.next(this.searchTermValue);
  }

  appointmentOwnerChanged(e) {
    this.selectedOwner = e.selectedItem.id;
    this.reloadData();
  }

  appointmentLocationChanged(e) {
    this.selectedLocation = e.selectedItem.id;
    this.reloadData();
  }

  export() {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');

      exportDataGrid({
        component: this.dataGrid.instance,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), this.fileName + '.xlsx');
        });
      });
  }
}
