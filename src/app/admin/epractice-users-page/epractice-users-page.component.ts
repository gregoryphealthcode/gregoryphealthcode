import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-epractice-users-page',
  templateUrl: './epractice-users-page.component.html',
  styleUrls: ['./epractice-users-page.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' },
})
export class EpracticeUsersPageComponent extends GridBase implements OnInit {
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  userId: string;
  selectedRecord: any;
  action: string;

  ngOnInit() {
    this.getUsers();

  }

  getUsers() {
    this.controllerUrl = `${environment.baseurl}/user/`;
    this.setupDataSource({
      key: 'userId',
      loadParamsCallback: () => [
        { name: 'type', value: 3 }
      ],
    });
  }

  saved(e) {
    if (e.success) {
      if (this.action == "Add") {
        this.snackBar.open("User added", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
      }
      if (this.action == "Edit") {
        this.snackBar.open("User edited", "Close", {
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
    this.router.navigate([`${e.data.userId}`], { relativeTo: this.route });
  }

  onFocusedRowChanged(e) {
    this.userId = e.row.data.userId;
  }
}
