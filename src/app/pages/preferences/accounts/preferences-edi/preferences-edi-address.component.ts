import { Component, OnInit } from '@angular/core';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-preferences-edi-address',
  templateUrl: './preferences-edi-address.component.html',
  styleUrls: ['./preferences-edi-address.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})
export class PreferencesEdiAddressComponent extends GridBase implements OnInit {
  selectedRecord: any;
  action = "";
  show = false;

  constructor(
    private siteService: SitesService,
    private appMessages: AppMessagesService,
    private spinner: SpinnerService, public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit() {
    this.getAddresses();
  }

  getAddresses() {
    this.controllerUrl = `${environment.baseurl}/glu_EDIInsurerAddress/`;
    this.setupDataSource({
      key: 'id',
      loadParamsCallback: () => [
      ],
    });
  }

  public addClicked() {
    this.show = true;
    this.action = "Add";
    this.selectedRecord = { id: '00000000-0000-0000-0000-000000000000' };
  }

  public editClicked(e) {
    this.show = true;
    this.action = "Edit";
    this.selectedRecord = { id: e.data.id };
  }

  public deleteClicked(e) {
    const text = 'Are you sure you want to delete this address?'

    const callback = () => {
      this.spinner.start();
      this.siteService.deleteEdiAddress(e.row.key).subscribe(
        (x) => {
          this.spinner.stop();
          this.appMessages.showSuccessSnackBar("Address deleted");
          this.refreshData();
        },
        (e) => {
          this.spinner.stop(); this.appMessages.showApiErrorNotification(e)
        }
      );
    };

    this.appMessages.showDeleteConfirmation(callback, text);
  }

  saved(e) {
    if (e.success) {
      if (this.action == "Add")
        this.appMessages.showSuccessSnackBar("Insurer address added");
      else
        this.appMessages.showSuccessSnackBar("Insurer address updated");
      this.refreshData();
    }
    if (e.errors) {
      this.appMessages.showApiErrorNotification(e.errors[0]);
    }
    this.show = false;
  }
}
