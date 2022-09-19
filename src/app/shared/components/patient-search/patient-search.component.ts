import { NgModule, Component, OnInit, OnChanges, ViewChild, AfterViewInit, Output, SimpleChange, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DxContextMenuModule, DxBoxModule, DxDataGridModule, DxDataGridComponent, DxButtonModule, DxCheckBoxModule, DxActionSheetModule, DxTextBoxModule, DxValidatorModule,
  DxValidationGroupModule, DxLoadPanelModule, DxResponsiveBoxModule, DxFormModule, DxDropDownBoxModule, DxListModule, DxSwitchModule, DxTextBoxComponent, DxPopupModule,
  DxPopupComponent, DxDateBoxModule, DxCalendarModule, DxTileViewModule, DxFormComponent, DxScrollViewModule } from 'devextreme-angular';
import { Subscription } from 'rxjs';
import * as jQuery from 'jquery';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import notify from 'devextreme/ui/notify';
import { AppInfoService, ScreenService } from 'src/app/shared/services';
import { MomentModule, SubtractPipe } from 'ngx-moment';
import { isNullOrUndefined } from 'util';
import ODataStore from 'devextreme/data/odata/store';
import Guid from 'devextreme/core/guid';
import { UserRecentsService } from 'src/app/shared/services/user-recents.service';
import { UserStore } from 'src/app/shared/stores/user.store';

declare var $: any;

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientSearchComponent
  implements OnInit, AfterViewInit, OnChanges {

  constructor(
    private userStore: UserStore,
    public appInfo: AppInfoService,
    private http: HttpClient,
    public router: Router,
    public screenService: ScreenService,
    private changeDetectorRef: ChangeDetectorRef,
    private userRecents: UserRecentsService
  ) {
    console.log('constructor');

    // keyConverters["MyDate"] = value => {
    //   return value + 'T00:00:00Z';
    // };

    // input: (event) => { this.searchInputChanged(event); },

    /* this.PatientStore = new ODataStore({
      url: this.appInfo.odata_baseurl + 'Patient_Details',
      version: 4,
      key: 'PatientId',
      keyType: 'Guid',
      fieldTypes: {
        PatientId: 'Guid',
        UniqueNo: 'Int32',
        SiteId: 'Guid',
        LastName: 'String',
        FirstName: 'String',
        Title: 'String',
        Gender: 'String',
        Inactive: 'Boolean'
      },
      beforeSend: e => {
        e.headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.userStore.getAuthToken()
        };
      }
    }); */

    this.searchButton = {
      icon: 'fas fa-search',
      type: 'default',
      focusStateEnabled: true,
      onClick: () => {}
    };

    this.dateButton = {
      icon: 'fas fa-calendar-alt',
      type: 'default',
      focusStateEnabled: true,
      hint: 'Show patients with an appointment on selected date.',
      onClick: () => {
        this.datePopup.instance.show();
      }
    };
    this.historyButton = {
      icon: 'fas fa-history',
      type: 'default',
      focusStateEnabled: true,
      hint: 'Show recently selected patients.',
      onClick: () => {
        this.patientsearchform.instance.option('opacity', 0.5);
        this.historyPopup.instance.show();
      }
    };

    /* this.patientsByApptDateDatasource = {
      store: {
        version: 4,
        type: 'odata',
        url: appInfo.odata_baseurl + 'Appointments',
        key: 'UniqueNo',
        keyType: 'Int32',
        withCredentials: false,
        filterToLower: false,
        beforeSend: e => {
          e.headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.userStore.getAuthToken()
          };
        },
        errorHandler: e => {
          console.log(e.message);
        }
      },
      orderby: ['RefNoValue'],
      select: [
        'UniqueNo',
        'AppointmentId',
        'PatientId',
        'SiteId',
        'LocationId',
        'LocationName',
        'StartDateTime'
      ],
      filter: ['UniqueNo', '=', '-1'],
      expand: ['Patient']
    }; */

   /*  this.patientsByRefNoDatasource = {
      store: {
        version: 4,
        type: 'odata',
        url: appInfo.odata_baseurl + 'Patient_ReferenceNumbers',
        key: 'UniqueNo',
        keyType: 'Int32',
        withCredentials: false,
        filterToLower: false,
        beforeSend: e => {
          e.headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.userStore.getAuthToken()
          };
        },
        errorHandler: e => {
          console.log(e.message);
        }
      },
      orderby: ['RefNoValue'],
      select: ['UniqueNo', 'PatientId', 'SiteId', 'RefNoValue', 'RefNoType'],
      filter: ['UniqueNo', '=', '-1'],
      expand: ['Patient']
      // expand: [
      //   'Patient.Patient_Visits,Patient_Balance,Patient_DataPoints,Patient_Addresses,Patient_Telecoms,Patient_Contacts.Organisation,Contact'
      // ],
    };

    this.patientsByPostcodeDatasource = {
      store: {
        version: 4,
        type: 'odata',
        url: appInfo.odata_baseurl + 'Patient_Addresses',
        key: 'UniqueNo',
        keyType: 'Int32',
        withCredentials: false,
        filterToLower: false,
        beforeSend: e => {
          e.headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.userStore.getAuthToken()
          };
        },
        errorHandler: e => {
          console.log(e.message);
        }
      },
      orderby: ['Postcode'],
      select: [
        'Uniqueno',
        'AddressType',
        'PrimaryAddress',
        'BillingAddress',
        'Address1',
        'Address2',
        'Address3',
        'Address4',
        'Postcode'
      ],
      filter: ['UniqueNo', '=', '-1'],
      expand: ['Patient']
      // 'Patient.Patient_Visits,Patient_Balance,Patient_DataPoints,Patient_ReferenceNumbers,Patient_Telecoms,Patient_Contacts'
    };
 */
    /* this.patientsByPhoneDatasource = {
      store: {
        version: 4,
        type: 'odata',
        url: appInfo.odata_baseurl + 'Patient_Telecoms',
        key: 'UniqueNo',
        keyType: 'Int32',
        withCredentials: false,
        filterToLower: false,
        beforeSend: e => {
          e.headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.userStore.getAuthToken()
          };
        },
        errorHandler: e => {
          console.log(e.message);
        }
      },
      orderby: ['TelecomValue', 'UniqueNo'],
      select: ['UniqueNo', 'TelecomSystem', 'TelecomValue'],
      filter: ['UniqueNo', '=', '-1'],
      expand: ['Patient']
    };

    this.lastXpatientsDataSource = {
      store: {
        version: 4,
        type: 'odata',
        url: appInfo.odata_baseurl + 'UserLastXPatients',
        key: 'UniqueNo',
        keyType: 'Int32',
        deserializeDates: true,
        fieldTypes: {
          UniqueNo: 'Int32',
          PatientId: 'Guid',
          SiteId: 'Guid',
          UserId: 'Guid',
          DateTimeSelected: 'Date'
        },
        withCredentials: false,
        filterToLower: false,
        beforeSend: e => {
          e.headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.userStore.getAuthToken()
          };
        },
        errorHandler: e => {
          console.log(e.message);
        }
      },
      top: 25,
      sort: { field: 'DateTimeSelected', desc: true },
      pageSize: 25,
      select: ['Uniqueno', 'PatientId', 'SiteId', 'DateTimeSelected'],
      expand: ['Patient']
      // 'Patient_Addresses',
      // 'Patient_Balance',
      // 'Patient_Visits',
      // 'Patient_ReferenceNumbers',
      // 'Patient_Telecoms',
    };

    this.patientsDatasource = {
      store: {
        version: 4,
        type: 'odata',
        url: appInfo.odata_baseurl + 'Patient_Details' + this.filterbirthdate,
        key: 'UniqueNo',
        keyType: 'Int32',
        deserializeDates: true,
        fieldTypes: {
          UniqueNo: 'Int32',
          PatientId: 'Guid',
          SiteId: 'Guid',
          LastName: 'String',
          FirstName: 'String',
          Title: 'String',
          Gender: 'String',
          Inactive: 'Boolean'
          // BirthDate: 'MyDate'
        },
        withCredentials: false,
        filterToLower: false,
        beforeSend: e => {
          e.headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.userStore.getAuthToken(),
            filterBirthDate: this.filterbirthdate
          };
        },
        errorHandler: e => {
          console.log(e.message);
        }
      },
      orderby: ['LastName', 'FirstName'],
      select: [
        'Uniqueno',
        'PatientId',
        'SiteId',
        'LastName',
        'FirstName',
        'Title',
        'BirthDate',
        'Gender',
        'Inactive'
      ],
      filter: ['LastName', 'startsWith', 'ZZZZ']
    }; */
  }
  // tslint:disable: variable-name
  @ViewChild('patientsearchform') patientsearchform: DxFormComponent;
  @ViewChild('patientSearchGrid') patientSearchGrid: DxDataGridComponent;
  @ViewChild('patientSearchByRefNoGrid') patientSearchByRefNoGrid: DxDataGridComponent;
  @ViewChild('patientSearchByPostcodeGrid') patientSearchByPostcodeGrid: DxDataGridComponent;
  @ViewChild('patientSearchByPhoneGrid') patientSearchByPhoneGrid: DxDataGridComponent;
  @ViewChild('patientSearchByApptDateGrid') patientSearchByApptDateGrid: DxDataGridComponent;
  @ViewChild('historypopup') historyPopup: DxPopupComponent;
  @ViewChild('datepopup') datePopup: DxPopupComponent;
  @ViewChild('searchText') searchText: DxTextBoxComponent;
  @Output() PatientSelected = new EventEmitter();
  @Output() SearchCancelled = new EventEmitter();

  selectedPatientId = '';
  expandedpatientDataSource = {};
  patientsDatasource: any;
  patientsByRefNoDatasource: any;
  patientsByPostcodeDatasource: any;
  patientsByPhoneDatasource: any;
  patientsByEmailDatasource: any;
  patientsByApptDateDatasource: any;
  lastXpatientsDataSource: any;
  searchTextEditorOptions: any;
  PatientStore: ODataStore;

  public patientsearchdata: any = {
    searchText: ''
  };

  minDate = new Date(2015, 0, 1);
  maxDate = new Date(2029, 11, 31);
  currentDate = new Date();

  isMobile = false;
  lastXscrolldirection = 'horizontal';
  selectedPatient: any;
  filterbirthdate = '';
  showPreview: boolean;
  patientId: string;
  lastName: string;
  firstName: string;
  title: string;
  balance: number;
  age: string;
  birthDate: string;
  gender: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  address5: string;
  postcode: string;
  country: string;
  showBillingAddress = false;
  referenceNumbers: any;
  patientContacts: any;
  patientOrganisations: any;
  patientVisits: any;
  patientDataPoints: any;
  telecoms: any;
  public searchOn = 'Surname';
  searchButton: any;
  dateButton: any;
  historyButton: any;
  tileviewIndex = 0;
  tileviewPatientId = '';

  commands: any[] = [
    { text: 'Patient Details' },
    { text: 'Scan Document' },
    { text: 'Correspondence' },
    { text: 'New Appointment' },
    { text: 'Quick eBill' },
    { text: 'Receive Payment' }
  ];
  actionSheetVisible = false;
  actionSheetTarget: any = '';

  contextMenuItems = [
    { text: 'Patient Details' },
    { text: 'Scan Document' },
    { text: 'Correspondence' },
    { text: 'New Appointment' },
    { text: 'Quick eBill' }
  ];

  private subscription = new Subscription();
  private subscription2: Subscription;

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // console.log('changes ');
    this.searchInputChanged(changes);
  }

  showByApptDate() {}

  showLast20() {}

  getExpandedPatient(mypatientid: string) {
    console.log('getexpandedpatient:', mypatientid);
    if (!this.expandedpatientDataSource[mypatientid]) {
      this.PatientStore.byKey(mypatientid, {
        expand: [
          'Patient_Addresses',
          'Patient_Balance',
          'Patient_Visits',
          'Patient_DataPoints',
          'Patient_ReferenceNumbers',
          'Patient_Telecoms',
          'Patient_Contacts',
          'Patient_Contacts.Organisation',
          'Patient_Contacts.Contact'
        ]
      }).then(
        dataItem => {
          const myPatientDisplayName =
            dataItem.LastName.toUpperCase() + ', ' + dataItem.FirstName;
          console.log('loaded patient name : ', myPatientDisplayName);
          console.log('loaded patient : ', dataItem);
          this.expandedpatientDataSource[mypatientid] = dataItem;
          const data = dataItem;
          this.loadPreviewData(data);
          // this.changeDetectorRef.detectChanges();
        },
        error => {
          console.log('!Error!: ', error);
        }
      );
    } else {
    }
  }

  addNewPatient() {
    // this.router.navigate(['/pages/add-patient'], { queryParams: { mode: 'ADD', patientkey: '' } });
  }

  cancelClicked() {
    this.SearchCancelled.emit(true);
  }

  calculatePatientNameValue(rowData) {
    try {
      return rowData.LastName + ', ' + rowData.FirstName + ' ' + rowData.Title;
    } catch (e) {
      return 'error';
    }
  }

  calculatePatientNameValueByRefNo(rowData) {
    try {
      return (
        rowData.Patient.LastName +
        ', ' +
        rowData.Patient.FirstName +
        ' ' +
        rowData.Patient.Title
      );
    } catch (e) {
      return 'error';
    }
  }

  showNotify(actiontext) {}

  calculateAgeValue(rowData) {
    try {
      if (rowData.BirthDate) {
        const timeDiff = Math.abs(
          Date.now() - new Date(rowData.BirthDate).getTime()
        );
        const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        return age;
      }
    } catch (e) {
      return '0';
    }
  }

  calculateAgeValueByRefNo(rowData) {
    try {
      if (rowData.Patient.BirthDate) {
        const timeDiff = Math.abs(
          Date.now() - new Date(rowData.Patient.BirthDate).getTime()
        );
        const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        return age;
      }
    } catch (e) {
      return '0';
    }
  }

  isPhoneNumberFormat(searchfor) {
    if (searchfor.length < 5) {
      return false;
    } else {
      if (searchfor[0] !== '0' || searchfor[5] !== ' ') {
        return false;
      } else {
        let flag = true;
        for (let i = 0; i < searchfor.length; i++) {
          if (i !== 5 && !'0123456789'.includes(searchfor[i])) {
            flag = false;
          }
        }
        return flag;
      }
    }
  }

  onRowDblclick(e) {
    console.log('row double click');
    this.selectPatient();
    e.event.preventDefault();
  }

  handleItemClickEvent(e) {
    console.log('item click event');
    const itemData = e.itemData;
  }

  commandbuttonClick(e) {
    console.log('command button clicked:', e);
    this.actionSheetTarget = e.ElementRef;
    this.actionSheetVisible = true;
  }

  handleEditPatientDetailsClick(e) {
    console.log('editpatientdetailsclick');
    const data = e.row.data;
    console.log(data);
    // this.patient_key = data.id;
    // this.router.navigate(['/pages/add-patient'], { queryParams: { mode: 'EDIT', patientkey: this.patient_key } });
    e.event.preventDefault();
  }

  onFocusedRowChanging(e) {}

  onByPostcodeFocusedRowChanged(e) {
    const data = e.row.data;
    this.selectedPatientId = data.PatientId;
    if (!this.expandedpatientDataSource[data.PatientId]) {
      this.blankPreviewData();
      this.getExpandedPatient(data.PatientId);
    } else {
      this.loadPreviewData(this.expandedpatientDataSource[data.PatientId]);
    }
  }

  loadPreviewData(data) {
    // $('#previewContentDiv').css('display', 'block');
    // console.log(e.row.data);
    this.patientId = data.PatientId;
    this.lastName = data.LastName.toUpperCase();
    this.firstName = data.FirstName;
    this.title = data.Title;

    try {
      this.balance = data.Patient_Balance[0].BalanceDue;
    } catch (e) {
      this.balance = 0;
    }
    this.birthDate = new Date(data.BirthDate).toLocaleDateString('en-GB');
    this.age = this.calculateAgeValue(data).toString();
    this.gender = data.Gender;
    this.referenceNumbers = data.Patient_ReferenceNumbers;
    this.patientContacts = data.Patient_Contacts.filter(
      t => t.ContactId !== null
    );
    this.patientOrganisations = data.Patient_Contacts.filter(
      t => t.ContactId === null
    );
    this.patientVisits = data.Patient_Visits;
    this.patientDataPoints = data.Patient_DataPoints;

    this.telecoms = data.Patient_Telecoms;
    if (this.showBillingAddress === true) {
      // show billing address
      for (const i in data.Patient_Addresses) {
        if (data.Patient_Addresses[i].BillingAddress === true) {
          this.address1 = data.Patient_Addresses[i].Address1;
          this.address2 = data.Patient_Addresses[i].Address2;
          this.address3 = data.Patient_Addresses[i].Address3;
          this.address4 = data.Patient_Addresses[i].Address4;
          this.address5 = data.Patient_Addresses[i].Address5;
          this.postcode = data.Patient_Addresses[i].Postcode;
          this.country = data.Patient_Addresses[i].Country;
        }
      }
    } else {
      // show primary address
      for (const i in data.Patient_Addresses) {
        if (data.Patient_Addresses[i].PrimaryAddress === true) {
          this.address1 = data.Patient_Addresses[i].Address1;
          this.address2 = data.Patient_Addresses[i].Address2;
          this.address3 = data.Patient_Addresses[i].Address3;
          this.address4 = data.Patient_Addresses[i].Address4;
          this.address5 = data.Patient_Addresses[i].Address5;
          this.postcode = data.Patient_Addresses[i].Postcode;
          this.country = data.Patient_Addresses[i].Country;
        }
      }
    }
    $('#previewContentDiv').css('display', 'block');
    this.changeDetectorRef.detectChanges();
  }

  blankPreviewData() {
    $('#previewContentDiv').css('display', 'none');
  }

  onByRefNoFocusedRowChanged(e) {
    let data = e.row.data;
    this.selectedPatientId = data.PatientId;
    if (!this.expandedpatientDataSource[data.PatientId]) {
      this.blankPreviewData();
      this.getExpandedPatient(data.PatientId);
    } else {
      data = this.expandedpatientDataSource[data.PatientId];
      this.loadPreviewData(data);
    }
  }

  onByPhoneFocusedRowChanged(e) {
    let data = e.row.data;
    this.selectedPatientId = data.PatientId;
    if (!this.expandedpatientDataSource[data.PatientId]) {
      this.blankPreviewData();
      this.getExpandedPatient(data.PatientId);
    } else {
      data = this.expandedpatientDataSource[data.PatientId];
      this.loadPreviewData(data);
    }
  }

  onFocusedRowChanged(e) {
    let data = e.row.data;
    this.selectedPatientId = data.PatientId;
    if (!this.expandedpatientDataSource[data.PatientId]) {
      this.blankPreviewData();
      this.getExpandedPatient(data.PatientId);
    } else {
      data = this.expandedpatientDataSource[data.PatientId];
      this.loadPreviewData(data);
    }
  }

  onRowPrepared(e): void {
    e.rowElement.style.height = '20px';
  }

  onCommandBtnContentReady(e): void {}

  form_fieldDataChanged(e) {
    // console.log('field data change: ', e);
    if (e.dataField === 'searchText') {
      this.searchInputChanged(e);
    }
  }

  tileClick(e) {
    console.log('Tile clicked. PatientId = ', e.itemData.PatientId);
    this.tileviewIndex = e.itemIndex;
    this.tileviewPatientId = e.itemData.PatientId;
  }

  tileOKButtonClicked(e, clickedPatientId) {
    this.historyPopup.instance.hide();
    // this.selectedPatientId = this.tileviewPatientId;
    this.selectedPatientId = clickedPatientId;
    console.log('Tile ok clicked. PatientId = ', this.selectedPatientId);

    this.userRecents
      .addUserLastXPatients(this.selectedPatientId)
      .subscribe(
        resp => {
          this.PatientSelected.emit(this.selectedPatientId);
        },
        error => {
          this.PatientSelected.emit(this.selectedPatientId);
        }
      );
  }

  daysBefore(dateselected) {
    try {
      const _MS_PER_DAY = 1000 * 60 * 60 * 24;
      const today = new Date();
      const todayutc = Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const dateselectedutc = Date.UTC(
        dateselected.getFullYear(),
        dateselected.getMonth(),
        dateselected.getDate()
      );
      return Math.floor((todayutc - dateselectedutc) / _MS_PER_DAY);
    } catch (e) {
      return 0;
    }
  }

  ngOnInit() {
    if (this.showPreview !== false) {
      this.showPreview = true;
    }
    this.isMobile = window.innerWidth <= 901;
    this.balance = 0.0;
    window.onresize = () => (this.isMobile = window.innerWidth <= 901);
    this.tileviewIndex = 0;
    this.tileviewPatientId = '';
    if (this.isMobile) {
      this.lastXscrolldirection = 'vertical';
    }
  }

  patientSearchShown() {
    console.log('patient search shown.');
    setTimeout(() => {
      try {
        this.patientsearchform.instance.getEditor('searchText').focus();
      } catch {
        console.log('error setting focus.');
      }
    }, 750);
  }

  ngAfterViewInit(): void {}

  getBalanceClasses() {
    let moneyOwed = false; // default
    if (this.balance < 0) {
      moneyOwed = true;
    }
    return {
      epPreviewBalance: true,
      epPreviewMoneyowed: moneyOwed
    };
  }

  hasNumbers(myString) {
    return /\d/.test(myString);
  }

  DifferenceInDays(firstDate, secondDate) {
    return Math.round((secondDate - firstDate) / (1000 * 60 * 60 * 24));
  }

  stringToDate(dateString) {
    const [dd, mm, yyyy] = dateString.split('/');
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  selectPatient() {
    console.log('patient selected: ', this.selectedPatientId);
    if (this.selectedPatientId !== '') {
      this.subscription2 = this.userRecents
        .addUserLastXPatients(this.selectedPatientId)
        .subscribe(
          resp => {
            this.PatientSelected.emit(this.selectedPatientId);
          },
          error => {
            this.PatientSelected.emit(this.selectedPatientId);
          }
        );
    }
  }

  onKeyUp(e) {
    console.log('onKeyPress');
    // this.searchInputChanged(e);
    // this.patientsearchdata.searchText = this.patientsearchform.instance.getEditor('searchText').option('text');
    // e.component._options.value
    const searchfor = this.patientsearchform.instance
      .getEditor('searchText')
      .option('text');
    console.log('searchfor:', searchfor);
    this.patientsearchform.instance
      .getEditor('searchText')
      .option('value', searchfor);
    this.searchForPatient(searchfor);
  }

  selectApptDate() {
    // this.searchText.value = this.currentDate.toLocaleDateString();
    this.patientsearchform.instance
      .getEditor('searchText')
      .option('value', this.currentDate.toLocaleDateString());
    this.searchForPatient(this.currentDate.toLocaleDateString());
    this.datePopup.instance.hide();
    // this.searchInputChanged(null);
  }

  public searchInputChanged(e) {
    console.log('search input changed:', e.component._options.text);
    if (
      e.component._options.text !== undefined &&
      e.component._options.text !== null
    ) {
      this.searchForPatient(e.component._options.text);
    }
  }

  public searchForPatient(searchfor: string) {
    console.log('searchForPatient called:', searchfor);
    let wildcardSearch = false;

    if (searchfor !== '') {
      this.selectedPatientId = '';

      // default to searching on patient surname
      let tempSearchOn = 'Surname';
      if (searchfor.length === 1) {
        searchfor = searchfor[0].toUpperCase();
      }
      if (searchfor.length >= 1) {
        // !!! WILDCARD SEARCH !!! if searchfor starts with an asterisk, set wildcardsearch to true, remove asterisk,
        // THEN continue as normal but filter on 'contains' rather than 'startsiwth'
        if (searchfor[0] === '*') {
          wildcardSearch = true;
          searchfor = searchfor.substring(1);
        } else {
          wildcardSearch = false;
          searchfor = searchfor[0].toUpperCase() + searchfor.substr(1);
        }

        // if numbers in the text, then assume searching on patient/invoice number
        if (this.hasNumbers(searchfor)) {
          tempSearchOn = 'Number';
          // check to see if text is a date & if so assume if more than 30 days ago searching on patient dob,
          // if more recent than 30 days, or future assume searching diary date
          if (searchfor.length === 8 || searchfor.length === 10) {
            if (searchfor[2] === '/' && searchfor[5] === '/') {
              try {
                const today = new Date();
                const searchDate = this.stringToDate(searchfor);
                const daysdiff = this.DifferenceInDays(searchDate, today);
                console.log('date difference: ', daysdiff);
                if (daysdiff > 30) {
                  tempSearchOn = 'DOB';
                } else {
                  tempSearchOn = 'Diary';
                }
              } catch (e) {
                tempSearchOn = 'DOB';
              }
            }
          }
          // if uppercase alphas and a space assume searching on patient postcode
          if (
            searchfor === searchfor.toUpperCase() &&
            searchfor.length >= 3 &&
            searchfor.length <= 10 &&
            searchfor.indexOf(' ') >= 0
          ) {
            tempSearchOn = 'Postcode';
          }
          // if all numbers, starts with zero & a space at position 4/5/6 assume searching on a phone number
          if (this.isPhoneNumberFormat(searchfor)) {
            tempSearchOn = 'Phone Number';
          }
        }
        // if contains @ symbol, assume searching for email address
        if (searchfor.indexOf('@') >= 0) {
          tempSearchOn = 'Email';
        }
        if (tempSearchOn === 'Surname') {
          if (searchfor.indexOf(',') >= 0) {
            tempSearchOn = 'Surname,Forename';
          }
        }
      }
      this.searchOn = tempSearchOn;
      this.filterbirthdate = null;

      if (this.searchOn === 'Surname') {
        this.patientSearchGrid.instance.beginUpdate();
        this.patientSearchGrid.instance.clearFilter();
        this.patientSearchGrid.instance.clearSorting();
        if (searchfor.length < 2) {
          searchfor = 'ZZZZ';
        }
        this.patientSearchGrid.visible = true;
        if (wildcardSearch) {
          this.patientSearchGrid.instance.filter([
            'LastName',
            'contains',
            searchfor
          ]);
        } else {
          this.patientSearchGrid.instance.filter([
            'LastName',
            'startsWith',
            searchfor
          ]);
        }
        this.patientSearchGrid.visible = true;
        this.patientSearchGrid.instance.endUpdate();
        this.patientSearchGrid.instance.refresh().then(reponseok => {
          this.patientSearchGrid.instance.pageIndex(1);
          this.patientSearchGrid.instance.getScrollable().scrollTo(0);
          this.patientSearchGrid.instance.option('focusedRowKey', 0);
          this.patientSearchGrid.instance.navigateToRow(0);
        });
      } else {
        if (this.searchOn === 'Surname,Forename' && searchfor.length >= 2) {
          this.patientSearchGrid.instance.beginUpdate();
          this.patientSearchGrid.instance.clearFilter();
          const splitnames = searchfor.split(',');
          const splitsurname = splitnames[0];
          const splitforename = splitnames[1];
          if (wildcardSearch) {
            this.patientSearchGrid.instance.filter([
              ['LastName', 'contains', splitsurname],
              'and',
              ['FirstName', 'startswith', splitforename]
            ]);
          } else {
            this.patientSearchGrid.instance.filter([
              ['LastName', 'startswith', splitsurname],
              'and',
              ['FirstName', 'startswith', splitforename]
            ]);
          }
          this.patientSearchGrid.instance.endUpdate();
          this.patientSearchGrid.instance.refresh().then(reponseok => {
            // this.patientSearchGrid.visible = true;
            this.patientSearchGrid.instance.pageIndex(1);
            this.patientSearchGrid.instance.getScrollable().scrollTo(0);
            this.patientSearchGrid.instance.option('focusedRowKey', 0);
            this.patientSearchGrid.instance.navigateToRow(0);
          });
        } else {
          if (this.searchOn === 'Diary') {
            const searchdate = searchfor
              .split('/')
              .reverse()
              .join('-');
            console.log('date: ', searchdate);
            this.patientSearchByApptDateGrid.instance.clearFilter();
            this.patientSearchByApptDateGrid.instance.clearSorting();
            const ds = this.patientSearchByApptDateGrid.instance.getDataSource();
            const startdate = new Date(searchdate);
            const enddate = new Date(startdate.getTime() + 86400000);
            this.patientSearchByApptDateGrid.instance.filter([
              ['StartDateTime', '>=', startdate],
              'and',
              ['StartDateTime', '<=', enddate]
            ]);
            ds.load();
            this.patientSearchByApptDateGrid.visible = true;
            this.patientSearchByApptDateGrid.instance
              .refresh()
              .then(reponseok => {
                this.patientSearchByApptDateGrid.instance.pageIndex(1);
                this.patientSearchByApptDateGrid.instance
                  .getScrollable()
                  .scrollTo(0);
                this.patientSearchByApptDateGrid.instance.option(
                  'focusedRowKey',
                  0
                );
                this.patientSearchByApptDateGrid.instance.navigateToRow(0);
              });
            // this.patientSearchByApptDateGrid.instance.pageIndex(1);
          } else {
            if (this.searchOn === 'DOB') {
              // const searchdate = searchfor.split('/').reverse().join('-');
              const searchdate = searchfor;
              console.log('date: ', searchdate);
              this.patientSearchGrid.instance.clearFilter();
              this.patientSearchGrid.instance.clearSorting();
              const ds = this.patientSearchGrid.instance.getDataSource();
              ds.filter();
              // this.filterbirthdate = searchdate + 'T00:00:00Z';
              this.filterbirthdate = searchdate;
              ds.load();
              this.patientSearchGrid.instance.refresh().then(reponseok => {
                // this.patientSearchGrid.visible = true;
                this.patientSearchGrid.instance.pageIndex(1);
                this.patientSearchGrid.instance.getScrollable().scrollTo(0);
                this.patientSearchGrid.instance.option('focusedRowKey', 0);
                this.patientSearchGrid.instance.navigateToRow(0);
              });
              // this.patientSearchGrid.instance.pageIndex(1);
            } else {
              if (this.searchOn === 'Number' && searchfor.length >= 2) {
                if (wildcardSearch) {
                  this.patientSearchByRefNoGrid.instance.filter([
                    'RefNoValue',
                    'contains',
                    searchfor
                  ]);
                } else {
                  this.patientSearchByRefNoGrid.instance.filter([
                    'RefNoValue',
                    'startswith',
                    searchfor
                  ]);
                }
                this.patientSearchByRefNoGrid.visible = true;
                this.patientSearchByRefNoGrid.instance
                  .refresh()
                  .then(reponseok => {
                    this.patientSearchByRefNoGrid.instance.pageIndex(1);
                    this.patientSearchByRefNoGrid.instance
                      .getScrollable()
                      .scrollTo(0);
                    this.patientSearchByRefNoGrid.instance.option(
                      'focusedRowKey',
                      0
                    );
                    this.patientSearchByRefNoGrid.instance.navigateToRow(0);
                  });
                // this.patientSearchByRefNoGrid.instance.pageIndex(1);
                // this.patientsDatasource.reload();
              } else {
                if (this.searchOn === 'Postcode') {
                  this.patientSearchByPostcodeGrid.instance.filter([
                    'Postcode',
                    'startswith',
                    searchfor
                  ]);
                  this.patientSearchByPostcodeGrid.visible = true;
                  this.patientSearchByPostcodeGrid.instance
                    .refresh()
                    .then(reponseok => {
                      this.patientSearchByPostcodeGrid.instance.pageIndex(1);
                      this.patientSearchByPostcodeGrid.instance
                        .getScrollable()
                        .scrollTo(0);
                      this.patientSearchByPostcodeGrid.instance.option(
                        'focusedRowKey',
                        0
                      );
                      this.patientSearchByPostcodeGrid.instance.navigateToRow(
                        0
                      );
                    });
                  // this.patientSearchByPostcodeGrid.instance.pageIndex(1);
                } else {
                  if (this.searchOn === 'Phone Number') {
                    this.patientSearchByPhoneGrid.instance.filter([
                      'TelecomValue',
                      'startswith',
                      searchfor
                    ]);
                    this.patientSearchByPhoneGrid.visible = true;
                    this.patientSearchByPhoneGrid.instance
                      .refresh()
                      .then(reponseok => {
                        this.patientSearchByPhoneGrid.instance.pageIndex(1);
                        this.patientSearchByPhoneGrid.instance
                          .getScrollable()
                          .scrollTo(0);
                        this.patientSearchByPhoneGrid.instance.option(
                          'focusedRowKey',
                          0
                        );
                        this.patientSearchByPhoneGrid.instance.navigateToRow(0);
                      });
                    // this.patientSearchByPhoneGrid.instance.pageIndex(1);
                    // try {this.patientSearchByPhoneGrid.instance.selectRowsByIndexes([0]); } catch {}
                  } else {
                    if (this.searchOn === 'Email') {
                      if (wildcardSearch) {
                        this.patientSearchByPhoneGrid.instance.filter([
                          ['TelecomValue', 'contains', searchfor],
                          'and',
                          ['TelecomSystem', '=', 'Email']
                        ]);
                      } else {
                        this.patientSearchByPhoneGrid.instance.filter([
                          ['TelecomValue', 'startswith', searchfor],
                          'and',
                          ['TelecomSystem', '=', 'Email']
                        ]);
                      }
                      this.patientSearchByPhoneGrid.visible = true;
                      this.patientSearchByPhoneGrid.instance
                        .refresh()
                        .then(reponseok => {
                          this.patientSearchByPhoneGrid.instance.pageIndex(1);
                          this.patientSearchByPhoneGrid.instance
                            .getScrollable()
                            .scrollTo(0);
                          this.patientSearchByPhoneGrid.instance.option(
                            'focusedRowKey',
                            0
                          );
                          this.patientSearchByPhoneGrid.instance.navigateToRow(
                            0
                          );
                        });
                      // this.patientSearchByPhoneGrid.instance.pageIndex(1);
                      // try {this.patientSearchByPhoneGrid.instance.selectRowsByIndexes([0]); } catch {}
                    }
                  }
                }
              }
            }
          }
        }
      }
      this.changeDetectorRef.detectChanges();
    } else {
      console.log('patientsearchdata is undefined.');
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxValidationGroupModule,
    DxLoadPanelModule,
    DxBoxModule,
    DxResponsiveBoxModule,
    DxFormModule,
    DxDropDownBoxModule,
    DxListModule,
    DxDataGridModule,
    DxContextMenuModule,
    DxCheckBoxModule,
    CommonModule,
    DxActionSheetModule,
    DxSwitchModule,
    DxPopupModule,
    DxDateBoxModule,
    DxCalendarModule,
    DxTileViewModule,
    DxScrollViewModule,
    MomentModule
  ],
  providers: [AppInfoService],
  declarations: [PatientSearchComponent],
  exports: [PatientSearchComponent]
})
export class PatientSearchModule {}
