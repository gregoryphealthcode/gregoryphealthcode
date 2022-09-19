import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { GridBase } from "src/app/shared/base/grid.base";
import { TelecomTypes } from "src/app/shared/services";
import { SitesService } from "src/app/shared/services/sites.service";
import { UserStore } from "src/app/shared/stores/user.store";

@Component({
  selector: "app-preferences-contact-telecoms",
  templateUrl: "./preferences-contact-telecoms.component.html",
  styleUrls: ["./preferences-contact-telecoms.component.scss"],
})
export class PreferencesContactTelecomsComponent extends GridBase implements OnInit {
  private siteId: string;
  telecomTypes: TelecomTypes[] = [];
  selectedRecord: any;

  constructor(
    private siteService: SitesService,
    private userStore: UserStore,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  getTelecomTypes() {
      this.siteService.getContactTelecomTypes().subscribe((data) => {
        this.telecomTypes = data;
        this.dataGrid.instance.endCustomLoading();
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnInit(): void {
    this.siteId = this.userStore.getSiteId();
    this.getTelecomTypes();
  }

  public addClicked() {
    this.selectedRecord = { id: 0 };
  }

  public editClicked(e) {
    this.selectedRecord = { id: e.data.uniqueNo };
  }
}
