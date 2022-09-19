import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Guid from 'devextreme/core/guid';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GridBase } from 'src/app/shared/base/grid.base';
import { ContactTypeViewModel } from 'src/app/shared/models/ContactTypeViewModel';
import { SitesService } from 'src/app/shared/services/sites.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-department-grid',
  templateUrl: './department-grid.component.html',
  styleUrls: ['./department-grid.component.scss']
})
export class DepartmentGridComponent extends GridBase implements OnInit {
  constructor() {
    super()
  }

  @Input() contactId: Guid;
  @Input() contactClassification: number;

  @Output() selectedRow = new EventEmitter()
  @Output() doubleClickedRow = new EventEmitter()
  @Output() addedDepartment = new EventEmitter()
  
  private searchTerms = new BehaviorSubject<string>(undefined);
  private _showInactive: boolean = false;
  public selectedConnection: any;

  public set showInactive(value: boolean) {
    this._showInactive = value;
    this.refreshData()
  }  
  public get showInactive() { return this._showInactive }

  public searchField = 'name';
  public searchValue: string;

  searchOptions: SearchOptions[] = [
    { value: 'name', viewValue: 'Name' },
    { value: 'organisation', viewValue: 'Organisation' },
    { value: 'postcode', viewValue: 'Postcode' },
    { value: 'number', viewValue: 'Number' },
    { value: 'email', viewValue: 'Email' },
  ];

  ngOnInit() {
    this.getDepartments();

    this.subscription.add(
      this.searchTerms
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap((x) => {
            if (x !== undefined) this.refreshData();
          })
        )
        .subscribe()
    );
  }

  getDepartments() {
    this.controllerUrl = `${environment.baseurl}/department/`;
    this.setupDataSource({
      key: 'departmentId',
      loadParamsCallback: () => [
        { name: 'showInactive', value: this.showInactive },
        { name: 'searchField', value: this.searchField },
        { name: 'searchValue', value: this.searchValue },
        { name: 'contactId', value: this.contactId }
      ],
    });
  }

  onFocusedRowChanged(e) {
    if (e !== null && e !== undefined) {
      this.selectedRow.emit(e.row.data)
    }
  }

  setSearchItem(e) {
    this.searchField = e.selectedItem.value;
    this.getDepartments();
  }

  onRowClick(e) {
    const i = e.rowIndex + 1;
    this.dataGrid.instance.expandRow(i);
  }

  onRowDoubleClick(e) {
    this.doubleClickedRow.emit(e.data);
  }

  addedDepartmentFromContact(item) {
    this.addedDepartment.emit({
      departmentId: item.departmentId,
    })
  }

  checkboxChanged(e) {
    this.showInactive = e.checked;
  }

  onSearchInputChangedHandler() {
    this.searchTerms.next(this.searchValue);
  }
}

interface SearchOptions {
  value: string;
  viewValue: string;
}