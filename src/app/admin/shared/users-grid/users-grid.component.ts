import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridBase } from 'src/app/shared/base/grid.base';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users-grid',
  templateUrl: './users-grid.component.html',
  styleUrls: ['./users-grid.component.scss']
})
export class UsersGridComponent extends GridBase implements OnInit, OnChanges {
  @Input() siteId: string;
  @Input() groupId: string;
  @Input() type: number;
  @Input() showUnlink: boolean;
  @Input() updateGrid = false;

  @Output() unlinkClicked = new EventEmitter<any>();

  constructor(
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  userId: string;
  selectedRecord: any;
  action: string;
  showPanel = false;

  ngOnInit() {
    this.getUsers();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateGridData(changes.updateGrid.currentValue);
  }

  updateGridData(e: any) {
    if (this.dataGrid)
      this.refreshData();
  }

  getUsers() {
    this.controllerUrl = `${environment.baseurl}/user/`;
    this.setupDataSource({
      key: 'userId',
      loadParamsCallback: () => this.getLoadParams()
    });
  }

  private getLoadParams() {
    let arr = [];

    if (this.siteId) {
      arr.push({
        name: 'siteId', value: this.siteId
      })
    }

    if (this.groupId) {
      arr.push({
        name: 'groupId', value: this.groupId
      })
    }

    if (this.type) {
      arr.push({
        name: 'type', value: this.type
      })
    }

    return arr;
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
    this.selectedRecord = { id: 0, siteId: this.siteId, groupId: this.groupId };
  }

  public editClicked(e) {
    this.action = "Edit";
    this.selectedRecord = { id: e.data.userId };
  }

  onFocusedRowChanged(e) {
    this.userId = e.row.data.userId;
    this.showPanel = true;
  }
}
