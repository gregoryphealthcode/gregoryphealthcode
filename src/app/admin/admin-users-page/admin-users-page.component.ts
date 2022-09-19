import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-users-page',
  templateUrl: './admin-users-page.component.html',
  styleUrls: ['./admin-users-page.component.scss'],  
  host: { class: 'd-flex flex-column flex-grow-1' },
})
export class AdminUsersPageComponent extends GridBase implements OnInit {
  constructor(
    private appMessages: AppMessagesService,
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
        {name: 'type', value: 5 }
      ],
    });
  }

  saved(e) {
    if (e.success) {
      if (this.action == "Add")
        this.appMessages.showSuccessSnackBar("User added.");
      
      if (this.action == "Edit")
        this.appMessages.showSuccessSnackBar("User updated.");
    }
    if (e.errors) {
      this.appMessages.showFailedSnackBar(e.errors[0]);
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

  onFocusedRowChanged(e) {
    this.userId = e.row.data.userId;
  }
}
