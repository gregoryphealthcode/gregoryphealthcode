import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { GridBase } from "src/app/shared/base/grid.base";
import { SpecialistViewModel } from "src/app/shared/models/SpecialistViewModel";
import { SitesStore } from "src/app/shared/stores/sites.store";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-specialist-list",
  templateUrl: "./specialist-list.component.html",
  host: { class: "d-flex flex-column flex-grow-1" },
})
@AutoUnsubscribe
export class SpecialistListComponent extends GridBase implements OnInit {
  constructor(
    private siteStore: SitesStore
  ) {
    super();
  }

  selectedrowData: SpecialistViewModel = new SpecialistViewModel();
  showConsultants = false;
  consultants: SpecialistViewModel[];
  AuthServerBaseurl = environment.authserverBaseurl;
  showDetails = false;
  siteId: string;
  showInactive = false;
  selectedType: any;

  ngOnInit(): void {
    this.siteId = this.siteStore.getSelectedSite().siteId;
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
    this.selectedType = { id: 0 };
  }

  public editClicked(id) {
    this.selectedType = { id };
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
}
