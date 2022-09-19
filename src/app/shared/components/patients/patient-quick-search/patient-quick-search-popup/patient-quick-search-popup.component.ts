import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-patient-quick-search-popup',
  templateUrl: './patient-quick-search-popup.component.html',
  styleUrls: ['./patient-quick-search-popup.component.scss']
})
export class PatientQuickSearchPopupComponent extends GridBase implements OnInit {
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
  @Input() addToContact = false;
  @Input() title = "Patient Search";

  @Output() doubleClickedRow = new EventEmitter();
  @Output() closed = new EventEmitter();

  private _searchInput: string;
  private searchTerms = new BehaviorSubject<any>(undefined);

  searchField = 'name';
  visible = false;
  dateFormat = 'dd/MM/yyyy';
  searchTermValue: string;
  format = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

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

  constructor(public appInfo: AppInfoService) { super() }

  ngOnInit() {
    this.getPatients();

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

  getPatients() {
    this.controllerUrl = `${environment.baseurl}/search/`;
    this.setupDataSource({
      key: 'patientId',
      loadUrl: 'searchAllPatients',
      loadParamsCallback: () => this.buildParams(),
    });
  }

  reloadData() {
    this.getPatients();
  }

  private buildParams() {
    const arr = [{ name: 'inactive', value: false },
    { name: 'deceased', value: false },
    { name: 'debtors', value: true },
    { name: 'searchField', value: this.searchField }];

    if (this.searchTermValue) {
      arr.push({ name: 'searchValue', value: this.searchTermValue })
    }

    return arr;
  }

  onRowDoubleClick(e) {
    this.doubleClickedRow.emit(e.data);
    this.visible = false;
  }

  addedPatient(e) {
    this.doubleClickedRow.emit(e);
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  setSearchItem(e) {
    this.searchBoxMask = "";

    this.searchField = e.selectedItem.value;

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

  public onSearchInputChangedHandler() {
    if (this.searchField == "dateOfBirth") {
      this.checkSearchDate();
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
}

interface SearchOptions {
  value: string;
  viewValue: string;
}
