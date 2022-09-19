import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridBase } from 'src/app/shared/base/grid.base';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-group-grid',
  templateUrl: './group-grid.component.html',
  styleUrls: ['./group-grid.component.scss']
})
export class GroupGridComponent extends GridBase implements OnInit, OnChanges {
  @Input() userId: string;
  @Input() siteId: string;
  @Input() showUnlink: boolean;
  @Input() updateGrid = false;

  @Output() unlinkClicked = new EventEmitter<any>();

  constructor(
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  groupId: string;
  selectedRecord: any;
  action: string;
  showPanel = false;

  ngOnInit() {
    this.getGroups();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.dataGrid)
      this.updateGridData(changes.updateGrid.currentValue);
  }

  updateGridData(e: any) {
    this.refreshData();
  }

  getGroups() {
    this.controllerUrl = `${environment.baseurl}/group/`;
    this.setupDataSource({
      key: 'groupId',
      loadParamsCallback: () => this.getLoadParams()
    });
  }

  private getLoadParams() {
    let arr = [];

    if (this.userId) {
      arr.push({
        name: 'userId', value: this.userId
      })
    }

    if (this.siteId) {
      arr.push({
        name: 'siteId', value: this.siteId
      })
    }

    return arr;
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
    this.selectedRecord = { id: 0, userId: this.userId, siteId: this.siteId };
  }

  public editClicked(e) {
    this.action = "Edit";
    this.selectedRecord = { id: e.data.groupId };
  }

  onFocusedRowChanged(e) {
    this.groupId = e.row.data.groupId;
    this.showPanel = true;
  }
}


