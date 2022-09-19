import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridBase } from 'src/app/shared/base/grid.base';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sites-grid',
  templateUrl: './sites-grid.component.html',
  styleUrls: ['./sites-grid.component.scss']
})
export class SitesGridComponent extends GridBase implements OnInit, OnChanges {
  @Input() userId: string;
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

  siteId: string;
  selectedRecord: any;
  action: string;
  showPanel = false;

  ngOnInit() {
    this.getSites();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateGridData(changes.updateGrid.currentValue);
  }

  updateGridData(e: any) {
    if (this.dataGrid)
      this.refreshData();
  }

  getSites() {
    this.controllerUrl = `${environment.baseurl}/site/`;
    this.setupDataSource({
      key: 'siteId',
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
    this.selectedRecord = { id: 0, userId: this.userId, groupId: this.groupId };
  }

  public editClicked(e) {
    this.action = "Edit";
    this.selectedRecord = { id: e.data.siteId };
  }

  onFocusedRowChanged(e) {
    this.siteId = e.row.data.siteId;
    this.showPanel = true;
  }
}

