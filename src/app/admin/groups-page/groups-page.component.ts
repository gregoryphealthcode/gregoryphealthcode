import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' },
})
export class GroupsPageComponent extends GridBase implements OnInit {
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  groupId: string;
  selectedRecord: any;
  action: string;

  ngOnInit() {
    this.getGroups();

  }

  getGroups() {
    this.controllerUrl = `${environment.baseurl}/group/`;
    this.setupDataSource({
      key: 'groupId',
      loadParamsCallback: () => [
      ],
    });
  }

  saved(e) {
    if (e.success) {
      if (this.action == "Add") {
        this.snackBar.open("Group added", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
      }
      if (this.action == "Edit") {
        this.snackBar.open("Group edited", "Close", {
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
    this.router.navigate([`${e.data.groupId}`], { relativeTo: this.route });
  }

  onFocusedRowChanged(e) {
    this.groupId = e.row.data.groupId;
  }
}