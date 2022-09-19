import { Component, Input, OnInit } from '@angular/core';
import Guid from 'devextreme/core/guid';
import { GridBase } from 'src/app/shared/base/grid.base';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { PatientService } from 'src/app/shared/services/patient.service';
import { Address } from 'src/app/shared/services/contact.service';

@Component({
  selector: 'app-patient-address',
  templateUrl: './patient-address.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
})
@AutoUnsubscribe
export class PatientAdressComponent extends GridBase implements OnInit {
  constructor(
    private patientService: PatientService,
    private spinner: SpinnerService,
    private snackBar: MatSnackBar,
    private appMessages: AppMessagesService,
  ) {
    super();
  }

  @Input() patientId: Guid;

  selectedRecord: any;
  action: string;
  addresses: Address[];
  show = false;  

  ngOnInit(): void {
    this.getPatientAddresses();
  }

  getPatientAddresses() {
    if (this.patientId != undefined) {
      this.controllerUrl = `${environment.baseurl}/patientAddress/`;
      this.setupDataSource({
        key: 'addressId',
        loadParamsCallback: () => [
          { name: 'patientId', value: this.patientId },
        ],
        loadCallback: (x) => this.addresses = x.data,
      });
    }
  }

  saved(e) {
    this.show = false;
    if (e.success) {
      if (this.action == "Add") {
        this.snackBar.open("Address added", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
      }
      if (this.action == "Edit") {
        this.snackBar.open("Address edited", "Close", {
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
    this.getPatientAddresses();
  }

  public add() {
    this.action = "Add";
    this.show = true;
    this.selectedRecord = { id: 0, patientId: this.patientId };
  }

  public editClicked(e) {
    this.action = "Edit";
    this.show = true;
    this.selectedRecord = { id: e.data.addressId };
  }

  public deleteClicked(e) {
    const callback = () => {
      this.spinner.start();
      this.patientService.deletePatientAddress(e.data.addressId).subscribe(
        (x) => {
          this.spinner.stop();
          this.snackBar.open("Address deleted", "Close", {
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

    this.appMessages.showDeleteConfirmation(callback, 'Are you sure you want to delete this address?');
  }
}