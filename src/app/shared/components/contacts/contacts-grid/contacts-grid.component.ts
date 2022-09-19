import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Guid from 'devextreme/core/guid';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GridBase } from 'src/app/shared/base/grid.base';
import { ContactTypeViewModel } from 'src/app/shared/models/ContactTypeViewModel';
import { SiteAdminModel, SitesService } from 'src/app/shared/services/sites.service';
import { UserStore } from 'src/app/shared/stores/user.store';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contacts-grid',
  templateUrl: './contacts-grid.component.html',
  styleUrls: ['./contacts-grid.component.scss']
})
export class ContactsGridComponent extends GridBase implements OnInit {
  @Input() isConnectionView: boolean;
  @Input() contactClassificationId: number;
  @Input() contactId: Guid;
  @Input() patientId: Guid;
  @Input() fromPatient = false;

  @Output() selectedRow = new EventEmitter()
  @Output() doubleClickedRow = new EventEmitter()
  @Output() addedConnection = new EventEmitter()

  private _selectedContactType = '0';
  private searchTerms = new BehaviorSubject<string>(undefined);
  private _showInactive: boolean = false;

  public set selectedContactType(value: string) {
    if (value && value !== this._selectedContactType) {
      this._selectedContactType = value;
      this.refreshData()
    }
  };
  public get selectedContactType() { return this._selectedContactType };
  public showReferrers = false;
  public selectedConnection: any;

  public set showInactive(value: boolean) {
    this._showInactive = value;
    this.refreshData()
  }
  public get showInactive() { return this._showInactive }
  public gluContactTypes: ContactTypeViewModel[] = [];
  public masterDetailOptions: any;
  public searchField = 'name';
  public searchValue: string;
  sites: SiteAdminModel[] = [];
  selectedSiteId: string;
  defaultSiteId: string = "00000000-0000-0000-0000-000000000000";

  searchOptions: SearchOptions[] = [
    { value: 'name', viewValue: 'Name' },
    { value: 'type', viewValue: 'Type' },
    { value: 'postcode', viewValue: 'Postcode' },
    { value: 'telecoms', viewValue: 'Telecoms' },
  ];

  constructor(
    public userStore: UserStore,
    private sitesService: SitesService,
  ) {
    super()
  }

  ngOnInit() {
    this.masterDetailOptions = { enabled: this.isConnectionView, template: 'detail' }
    this.getContacts();
    this.getSites();
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

  getContacts() {
    this.controllerUrl = `${environment.baseurl}/contact/`;
    this.setupDataSource({
      key: 'contactId',
      loadParamsCallback: () => [
        { name: 'showInactive', value: this.showInactive },
        { name: 'searchField', value: this.searchField },
        { name: 'searchValue', value: this.searchValue },
        { name: 'contactClassification', value: this.contactClassificationId },
        { name: 'selectedSiteId', value: this.selectedSiteId != '00000000-0000-0000-0000-000000000000' ? this.selectedSiteId : null },
      ],
    });
  }


  getSites() {
    this.sitesService.getSites().subscribe(data => {
      this.sites = data;
      this.sites.sort(function (a, b) {
        if (a.siteName < b.siteName) return -1;
        if (a.siteName > b.siteName) { return 1; }
        return 0;
      });
      this.sites.unshift({
        siteId: '00000000-0000-0000-0000-000000000000', siteName: "All Sites"
      });
    });
  }

  getBackgroundColor(cellInfo) {
    return cellInfo.data.backgroundColor;
  }

  setSearchItem(e) {
    this.searchField = e.selectedItem.value;
    this.getContacts();
  }

  setSelectedSiteItem(e) {
    this.selectedSiteId = e.selectedItem.siteId;
    this.getContacts();
  }

  onFocusedRowChanged(e) {
    if (e !== null && e !== undefined) {
      this.selectedRow.emit(e.row.data)
    }
  }

  onRowClick(e) {
    const i = e.rowIndex + 1;
    this.dataGrid.instance.expandRow(i);
  }

  onRowDoubleClick(e) {
    this.doubleClickedRow.emit(e.data);
  }

  addedConnectionFromContact(item) {
    this.addedConnection.emit({
      contactId: item.contactId,
      contactClassification: item.contactClassification
    })
  }

  addedConnectionFromConnection(contactItem, item) {
    this.addedConnection.emit({
      contactId: contactItem.contactId,
      contactClassification: contactItem.contactClassification,
      connectionId: item.contactId,
      connectionClassification: item.contactClassification
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