import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridBase } from 'src/app/shared/base/grid.base';
import { SpecialistViewModel } from 'src/app/shared/models/SpecialistViewModel';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-preferences-appointment-owners',
  templateUrl: './preferences-appointment-owners.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
  styleUrls: ['./preferences-appointment-owners.component.scss']
})
export class PreferencesAppointmentOwnersComponent extends GridBase implements OnInit {
  selectedrowData: SpecialistViewModel = new SpecialistViewModel();
  showConsultants = false;
  consultants: SpecialistViewModel[];
  AuthServerBaseurl = environment.authserverBaseurl;
  showDetails = false;
  showInactive = false;
  selectedType: any;

  constructor(
    private siteStore: SitesStore,
    public appInfo: AppInfoService,
    private changeDetectorRef: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private appMessages: AppMessagesService,
    private appointmentService: AppointmentService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getSpecialists();
  }

  getSpecialists() {
    this.controllerUrl = `${environment.baseurl}/appointmentOwner/`;
    this.setupDataSource({
      key: 'id',
      loadParamsCallback: () => [
        { name: 'showInactive', value: this.showInactive },
      ],
      loadCallback: (x) => {
        this.consultants = x.data;
        if (this.selectedrowData)
          this.selectedrowData = this.consultants.find(x => x.id == this.selectedrowData.id);
      }
    });
  }

  public addClicked() {
    this.selectedType = { id: '00000000-0000-0000-0000-000000000000' };
  }

  public editClicked(e) {
    this.selectedType = { id: e };
  }

  onFocusedRowChanged(e) {
    this.showDetails = true;
    this.selectedrowData = e.row.data;
  }

  onRowPrepared(e) {
    if (e.data !== undefined) {
      if (e.data.active === false) {
        e.rowElement.style.color = "grey";
        e.rowElement.style.textDecoration = "line-through";
      }
    }
  }

  checkboxChanged(e) {
    this.showInactive = e.checked;
    this.refreshData();
  }

  public deleteClicked(e) {
    const text = 'Are you sure you want to delete this practitioner?'

    const callback = () => {
      this.spinnerService.start();
      this.appointmentService.deleteAppointmentOwner(e.row.data.id).subscribe(x => {
        this.spinnerService.stop();
        this.snackBar.open('Practitioner deleted successfully', "Close", {
          panelClass: "badge-success",
          duration: 3000,
        }
        );
        this.getSpecialists();
      },
        (e) => {
          this.snackBar.open(e.error.errors, 'Close', {
            panelClass: 'badge-danger',
            duration: 3000,
          });
          this.spinnerService.stop();
        });
    };
    this.appMessages.showDeleteConfirmation(callback, text);
  }
}
