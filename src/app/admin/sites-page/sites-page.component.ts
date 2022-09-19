import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sites-page',
  templateUrl: './sites-page.component.html',
  styleUrls: ['./sites-page.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' },
})
export class SitesPageComponent extends GridBase implements OnInit {
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  siteId: string;
  selectedRecord: any;
  action: string;

  ngOnInit() {
    this.getSites();
  }

  getSites() {
    this.controllerUrl = `${environment.baseurl}/site/`;
    this.setupDataSource({
      key: 'siteId',
      loadParamsCallback: () => [
      ],
    });
  }

  saved(e) {
    if (e.success) {
      if (this.action == "Add") {
        this.snackBar.open("Site added", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
      }
      if (this.action == "Edit") {
        this.snackBar.open("Site edited", "Close", {
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
    this.refreshData();
  }

  public addClicked() {
    this.action = "Add";
    this.selectedRecord = { id: 0 };
  }

  public editClicked(e) {
    this.action = "Edit";
    this.selectedRecord = { id: e.data.userId };
  }

  public selectedClicked(e) {
    this.router.navigate([`${e.data.siteId}`], { relativeTo: this.route });
  }

  onFocusedRowChanged(e) {
    this.siteId = e.row.data.siteId;
  }
}
