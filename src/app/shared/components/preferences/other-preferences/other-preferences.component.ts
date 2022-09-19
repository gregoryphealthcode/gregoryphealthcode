import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { GridBase } from "src/app/shared/base/grid.base";
import { AppMessagesService } from "src/app/shared/services/app-messages.service";
import { PreferenceDataPointItemsModel } from "src/app/shared/services/patient.service";
import { SitesService } from "src/app/shared/services/sites.service";
import { SpinnerService } from "src/app/shared/services/spinner.service";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-other-preferences',
  templateUrl: './other-preferences.component.html',
  styleUrls: ['./other-preferences.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})

@AutoUnsubscribe
export class OtherPreferencesComponent extends GridBase implements OnInit {
  @Input() category: string;

  public selectedRecord: any;
  dataPoints: PreferenceDataPointItemsModel[] = [];

  constructor(
    private siteService: SitesService,
    private spinnerService: SpinnerService,
    private appMessage: AppMessagesService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
  }


  ngOnInit(): void {
    this.getDataPoints();
  }

  getDataPoints() {
    this.controllerUrl = `${environment.baseurl}/llu_PatientDataPoints/`;
    this.setupDataSource({
      key: 'uniqueNo',
      loadParamsCallback: () => [
        { name: 'category', value: this.category },
      ],
    })
  }

  public addClicked() {
    this.selectedRecord = { id: 0, category: this.category };
  }

  public editClicked(e) {
    this.selectedRecord = { id: e.data.uniqueNo, category: this.category };
  }

  deleteClicked(e) {
    const callback = () => {
      this.spinnerService.start();
      this.subscription.add(this.siteService.deleteDataPoint(e.data.uniqueNo).subscribe(x => {
        if (x.success) {
          this.appMessage.showSuccessSnackBar('Patient data point deleted')
        }
        else {
          this.appMessage.showFailedSnackBar(x.errors[0]);
        }
        this.spinnerService.stop();
        this.getDataPoints();
        this.changeDetector.detectChanges();
      },
        e => {
          this.appMessage.showFailedSnackBar(e);
          this.spinnerService.stop();
        }))
    }

    this.appMessage.showDeleteConfirmation(callback, "Are you sure you want to delete this patient datapoint?");
  }
}