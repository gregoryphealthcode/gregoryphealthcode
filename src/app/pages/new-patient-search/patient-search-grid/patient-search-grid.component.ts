import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { BasicPatientDetailsViewModel, PatientService } from 'src/app/shared/services/patient.service';
import { SiteAdminModel, SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { UserStore } from 'src/app/shared/stores/user.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-patient-search-grid',
  templateUrl: './patient-search-grid.component.html',
  styleUrls: ['./patient-search-grid.component.scss']
})
export class PatientSearchGridComponent extends GridBase implements OnInit {
  constructor(
    private patientService: PatientService,
    public userStore: UserStore,
    private appMessages: AppMessagesService,
    private sitesService: SitesService
  ) {
    super()
  }

  @Input() filterType: 'all' | 'recent' | 'today' = 'all';
  @Input() get setFocus(): boolean {
    return this._setFocus;
  }
  set setFocus(value: boolean) {
    if (value) {
      this.dataGrid.instance.focus();
    }
    this._setFocus = value;
  }
  @Input()
  get searchInput(): string {
    return this._searchInput;
  }
  set searchInput(value: string) {
    this._searchInput = value;
    if (this._searchInput !== undefined && this._searchInput !== null && this._searchInput !== '') {
      this.searchTermValue = this._searchInput;
    }
  }
  @Input() patientAdded: boolean;
  @Input() appointmentDate: string;

  @Output() rowFocused = new EventEmitter<BasicPatientDetailsViewModel>();
  @Output() patientSelected = new EventEmitter<string>();
  @Output() startDateChanged = new EventEmitter<string>();

  private _setFocus: boolean;
  private _searchInput: string;
  private searchTerms = new BehaviorSubject<any>(undefined);
  private row = new BehaviorSubject<any>(undefined);
  patients: BasicPatientDetailsViewModel[] = [];
  defaultPatients: BasicPatientDetailsViewModel[] = [];
  searchTermValue: string;
  isSmallScreen = false;
  searchField = 'name';
  showPostCol = false;
  showRefCol = false;
  showInvCol = false;
  showAptCol = false;
  showInsCol = false;
  showTelCol = false;
  hideCol = true;
  deceased = false;
  inactive = false;
  debtors = true;
  format = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
  typingTimeout = 1000;
  typingTimer: any;
  isMedSec = false;
  dateFormat = 'dd/MM/yyyy';
  selectedPatientId: string;
  showSites = false;
  sites: SiteAdminModel[] = [];
  defaultSiteId: string = "00000000-0000-0000-0000-000000000000";
  selectedSiteId: string;

  searchOptions: SearchOptions[] = [
    { value: 'name', viewValue: 'Name' },
    { value: 'postcode', viewValue: 'Postcode' },
    { value: 'refNumbers', viewValue: 'Patient Reference Nos' },
    { value: 'telecoms', viewValue: 'Telecoms' },
    { value: 'insurer', viewValue: 'Membership No' },
    { value: 'invoice', viewValue: 'Invoice No' },
    { value: 'dateOfBirth', viewValue: 'Date of Birth' },
  ];

  searchBoxMask = '';
  maskRules = {
    a: /[0-9]/,
    t: '/',
  }

  ngOnInit() {
    this.isMedSec = this.userStore.isMedSecUser();

    this.getPatients();
    this.getSites();

    this.subscription.add(
      this.searchTerms
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap((x) => {
            if (x !== undefined) this.reloadData();
          })
        )
        .subscribe()
    );
  }

  private reloadData() {
    /* if (this.filterType != 'all') {
      this.dataGrid.instance.searchByText(this.searchBoxValue);
    } else { */
    this.getPatients();
    //}
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

  getPatients() {
    this.controllerUrl = `${environment.baseurl}/search/`;
    this.setupDataSource({
      key: 'patientId',
      loadUrl: this.buildLoadUrl(),
      loadParamsCallback: () => this.buildParams(),
    });
  }

  private buildParams() {
    const arr = [{ name: 'inactive', value: this.inactive },
    { name: 'deceased', value: this.deceased },
    { name: 'debtors', value: this.debtors },
    { name: 'searchField', value: this.searchField }];

    if (this.searchTermValue) {
      arr.push({ name: 'searchValue', value: this.searchTermValue })
    }

    if (this.appointmentDate) {
      arr.push({ name: 'appointmentDate', value: this.appointmentDate })
    }

    if (this.selectedSiteId != '00000000-0000-0000-0000-000000000000') {
      arr.push({ name: 'selectedSiteId', value: this.selectedSiteId })
    } else {
      arr.push({ name: 'selectedSiteId', value: null })
    }

    return arr;
  }

  buildLoadUrl() {
    switch (this.filterType) {
      case 'all': return 'searchAllPatients';
      case 'today': return 'searchTodaysPatients';
      case 'recent': return 'searchRecentlySelectedPatients';
      default:
        break;
    }
  }

  setSearchItem(e) {
    this.showPostCol = false;
    this.showInsCol = false;
    this.showRefCol = false;
    this.showTelCol = false;
    this.showInvCol = false;
    this.hideCol = false;
    this.searchBoxMask = "";

    this.searchField = e.selectedItem.value;
    if (this.searchField == "name")
      this.hideCol = true;

    if (this.searchField == "postcode")
      this.showPostCol = true;

    if (this.searchField == "insurer")
      this.showInsCol = true;

    if (this.searchField == "refNumbers")
      this.showRefCol = true;

    if (this.searchField == "telecoms")
      this.showTelCol = true;

    if (this.searchField == "invoice")
      this.showInvCol = true;

    if (this.searchField == "dateOfBirth") {
      this.searchBoxMask = "aataataaaa";
      if (this.format.test(this.searchTermValue)) {
        this.reloadData();
      }
    }
    else {
      this.reloadData();
    }
  }

  checkboxChanged(e) {
    if (e.source.name == "Active")
      this.inactive = !this.inactive;
    if (e.source.name == "Debtors")
      this.debtors = !this.debtors;
    if (e.source.name == "Deceased")
      this.deceased = !this.deceased;
    this.reloadData();
  }

  public onSearchInputChangedHandler() {
    if (this.searchField == "dateOfBirth") {
      this.checkSearchDate();
      /* if (this.format.test(this.searchTermValue)) {
        this.searchTerms.next(this.searchTermValue);
      } */
    }
    else {
      this.searchTerms.next(this.searchTermValue);
    }
  }

  checkSearchDate() {
    var d = new Date(this.searchTermValue);
    const isDate = d instanceof Date;
    if (isDate)
      this.searchTerms.next(d);
  }

  onFocusedRowChanged(e) {
    this.row.next(e.row.data);

    this.subscription.add(
      this.row
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap((x) => {
            if (x !== undefined) this.rowFocused.emit(this.row.value);
          })
        )
        .subscribe()
    );

  }

  doubleClickHandled(e) {
    this.patientService.setPatientRecentlySelected(e.data.patientId).subscribe(x => { });
    this.patientSelected.emit(e.data.patientId);
  }

  onKeyDown(e) {
    if (e.event.key === 'Enter') {
      const i = this.dataGrid.instance.option(
        'focusedRowIndex'
      );
      const row = this.dataGrid.instance.getKeyByRowIndex(i);
      this.patientSelected.emit(row.patientId);
    }
  }

  getSelectedDate(e) {
    this.appointmentDate = moment(e.value).format("YYYY-MM-DDT00:00:00.000") + "Z";
    this.startDateChanged.emit(this.appointmentDate);
    this.getPatients();
  }

  clearDate() {
    this.appointmentDate = null;
    this.getPatients();
  }

  shareClicked(e) {
    this.showSites = true;
    this.selectedPatientId = e.data.patientId;
  }

  savedSiteHandler(e) {
    this.showSites = false;
    if (e.success)
      this.appMessages.showSuccessSnackBar("Patient shared.");
    if (e.errors)
      this.appMessages.showFailedSnackBar(e.errors[0]);
  }

  setSelectedSiteItem(e) {
    this.selectedSiteId = e.selectedItem.siteId;
    this.reloadData();
  }
}

interface SearchOptions {
  value: string;
  viewValue: string;
}
