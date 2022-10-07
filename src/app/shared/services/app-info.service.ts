import { ElementRef, Injectable } from '@angular/core';
import ODataContext from 'devextreme/data/odata/context';
import Guid from 'devextreme/core/guid';
import 'devextreme/data/odata/store';
import { environment } from 'src/environments/environment';
import { PatientBalance } from 'src/app/pages/patient-details/PatientBalance';
import { ScreenService } from './screen.service';
import initHelpHero from 'helphero';
import { GoogleAnalyticsService } from './google-analytics.service';
import { UserStore } from '../stores/user.store';
import { SitesStore } from '../stores/sites.store';
import { ContactModel } from './contact.service';

export class PatientAddress {
  addressId: Guid;
  patientId: Guid;
  addressType: number;
  rank: number;
  primaryAddress: boolean;
  billingAddress: boolean;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  postcode: string;
  country: string;
  longitude: number;
  latitude: number;
  siteId: Guid;
  uniqueNo: number;
}


export class PatientReferenceNumber {
  referenceNumberId: Guid;
  siteId: Guid;
  patientId: Guid;
  refNoType: string;
  refNoValue: string;
  primaryRefNo: boolean;
  rank: number;
  uniqueNo: number;
  autoincrement: boolean;
  nextNumber = 0;
  description?: string;
}

export class DataPoint {
  UniqueNo: number;
  DataPointId: Guid;
  SiteId: Guid;
  PatientId: Guid;
  DataItem: string;
  DataCategory: string;
  DataValue1: string;
  Data2Description: string;
  Data2Value: string;
  Data3Description: string;
  Data3Value: string;
  Comment: string;
  DataCategoryRank: number;
  DataItemRank: number;
  FlagRed: boolean;
  FlagAmber: boolean;
  FlagGreen: boolean;
  DateAdded: Date;
  AddedBy: Guid;
}

export class ContactTelecom {
  telecomId: Guid;
  siteId: Guid;
  contactId: Guid;
  telecomSystem: any;
  telecomValue: string;
  rank: number;
  preferred: boolean;
  uniqueNo: number;
  usage: string;
  primary: boolean;
  telecomTypeId: number;
}

export class PatientTelecom {
  telecomId: Guid;
  siteId: Guid;
  patientId: Guid;
  telecomSystem: any;
  telecomValue: string;
  rank: number;
  preferred: boolean;
  uniqueNo: number;
  usage: string;
  primary: boolean;
  telecomTypeId: number;
  description: string;
}

export class PatientDetailsBase {
  patientId?: Guid | null;
  siteId?: Guid | null;
  lastName?: string | null;
  firstName?: string | null;
  birthDate?: Date | null;
  postcode?: string | null;
}

export class PatientDetailsResponseModel {
  duplicatePatients?: PatientDetailsBase[] | null;
  success: boolean;
}

export class PatientDetailsModel extends PatientDetailsBase {
  initials?: string | null;
  title?: string | null;
  gender?: string | null;
  identifiesAs?: string | null;
  deceased?: boolean | null;
  deceasedDate?: Date | null;
  noChase?: boolean | null;
  onStop?: boolean | null;
  inactive?: boolean | null;
  inactiveReason?: string | null;
  sendViaPatientzone?: boolean | null;
  addressTypeId?: number | null;
  address1?: string | null;
  address2?: string | null;
  address3?: string | null;
  address4?: string | null;
  primaryAddress?: boolean | null;
  billingAddress?: boolean | null;
  forceAdd?: boolean | null;
  patientTelecoms?: PatientTelecomModel[] | null;
  patientReferences?: PatientReferenceModel[] | null;
  insurers?: AddPatientRequestInsurerDto[] | null;
  contacts?: ContactModel[] | null;
}

export class AddPatientRequestInsurerDto {
  insurerId: string | null;
  insurerName: string | null;
  registrationNumber: string | null;
  scheme: string | null;
  renewalDate: string | null;
  isPrimary: boolean | null;
}

export class PatientReferenceModel {
  refNoType: string | null;
  refNoValue: string | null;
}

export class PatientTelecomModel {
  telecomType: number | null;
  telecomValue: string | null;
}

export class PatientDetails {
  patientId: Guid;
  siteId: Guid;
  inactive: boolean;
  inactiveReason: string;
  lastName: string;
  lastNamePhonex: string;
  firstName: string;
  otherInitials: string;
  title: string;
  gender: string;
  birthDate: Date;
  age: number;
  deceased: boolean;
  deceasedDate: Date;
  patientAddresses: Array<PatientAddress>;
  patientReferenceNumbers: Array<PatientReferenceNumber>;
  deletedReferenceNumbers: Array<PatientReferenceNumber>;
  patientTelecoms: Array<PatientTelecom>;
  deletedTelecoms: Array<PatientTelecom>;
  dataPoints: Array<DataPoint>;
  deletedDatapoints: Array<DataPoint>;
  patientBalance: Array<PatientBalance>;
  sendViaPatientzone: boolean;
  billingAddress: PatientAddress;
  patientAddressesString: string;
}

export class PatientViewModel {
  patientId: Guid;
  siteId: Guid;
  lastName: string;
  patientAddresses: Array<PatientAddress>;
  patientReferenceNumbers: Array<PatientReferenceNumber>;
}

@Injectable()
export class AppInfoService {

  public get versionNumber() {
    return '3.7.10.22p';
  }


  public context: ODataContext;
  lifestyleOptions: any;
  lluPatientDataPointItemsDatasource: any;
  lluTelecomTypesDataSource: any;
  gluAddressTypesDataSource: any;
  lluPatientNumberTypesDataSource: any;
  LifestyleTypesDatasource: any;
  SocialTypesDatasource: any;
  Genders: string[];
  Identifies: string[];
  presetReportDates: any;
  helpHero: any;

  siteDetails: any =
    { CurrencyCode: '', CurrencySymbol: '', ShortDateFormat: '', LongDateFormat: '', FinancialYearStart: '', FinancialYearEnd: '' };

  public cachedPublicHolidays: any[] = null;
  public cachedAppointmentTypes: any[] = null;
  public cachedAppointmentOwners: any[] = null;
  public cachedSpecialistsMenuItems: any[] = null;
  public cachedResources1MenuItems: any = null;
  public cachedResources2MenuItems: any = null;
  public cachedResources3MenuItems: any = null;
  public cachedResources4MenuItems: any = null;
  public cachedVisibleAppointmentOwners: any = null;

  presetReportDateTimes: any;
  public preflabelpos = 'left';
  public prefstylingmode = 'outlined';
  public MostRecentPatient1 = null;
  public MostRecentPatient2 = null;
  public MostRecentPatient3 = null;
  public MostRecentPatient4 = null;
  public MostRecentPatient5 = null;

  public helpHeroTrackEvent(ev, info) {
    try {
      console.log('Help Hero track event: ', ev, '- info: ', info);
      this.googleAnalyticsService.eventEmitter('HelpHero', 'Tour', ev.kind, info.tour.name, 1);
    } catch (e) { }
  }


  public setupHelpHero(userId: string, firstName: string, displayName: string) {
    this.helpHero = initHelpHero('N0KU0rTcWFG');
    console.log('Help Hero initialised');

    this.helpHero.identify(userId, {
      firstName,
      displayName
    });
    console.log('Help Hero user identified');
    this.helpHero.on('tour_started', this.helpHeroTrackEvent);
    this.helpHero.on('tour_completed', this.helpHeroTrackEvent);
    this.helpHero.on('tour_cancelled', this.helpHeroTrackEvent);
    this.helpHero.on('error', this.helpHeroTrackEvent);
    console.log('Help Hero event tracking set up');
    // this.helpHero.showBeacon();
  }

  getPreflabelLocation(): any {
    return this.preflabelpos;
  }

  getPrefstylingMode(): any {
    return this.prefstylingmode;
  }

  getGenders(): string[] {
    return this.Genders;
  }

  getIdentifiesAs(): string[] {
    return this.Identifies;
  }

  public getTelecomTypes() {
    return this.lluTelecomTypesDataSource;
  }

  public getPatientNumberTypes() {
    return this.lluPatientNumberTypesDataSource;
  }

  public getSocialTypes() {
    return this.SocialTypesDatasource;
  }
  public getLifestyleTypes() {
    return this.LifestyleTypesDatasource;
  }


  public getDataPointItems(mycategory: string): any {
    this.lluPatientDataPointItemsDatasource.filter([
      'Category',
      '=',
      mycategory
    ]);
    return this.lluPatientDataPointItemsDatasource;
  }

  getReturnUrl(url) {
    sessionStorage.setItem('returnUrl', url);
  }

  constructor(
    screenService: ScreenService,
    // private http: HttpClient,
    public googleAnalyticsService: GoogleAnalyticsService,
    private userStore: UserStore,
    private siteStore: SitesStore
  ) {

    this.Genders = [
      'Male',
      'Female',
      'Other'
    ];

    this.Identifies = [
      "Agender",
      "Androgyne",
      "Bigender",
      "Cisgender",
      "Female",
      "Gender Fluid",
      "Gender Nonconforming",
      "Gender Questioning",
      "Gender Variant",
      "Genderqueer",
      "Intersex",
      "Male",
      "Neither",
      "Neutrois",
      "Non-binary",
      "Other",
      "Pangender",
      "Trans Female",
      "Trans Male",
      "Trans Person",
      "Transfeminine",
      "Transgender",
      "Transmasculine",
      "Transsexual",
      "Transsexual Female",
      "Transsexual Male",
      "Two-Spirit",
    ]

    const screensize = screenService.sizes;

    this.presetReportDates = [
      { value: 'today', text: 'Today' },
      { value: 'thismonth', text: 'This Month', beginGroup: true },
      { value: 'previous30', text: 'Previous 30 Days' },
      { value: 'previousmonth', text: 'Previous Month' },
      { value: 'thisquarter', text: 'This Quarter', beginGroup: true },
      { value: 'previousquarter', text: 'Previous Quarter' },
      { value: 'thiscalyear', text: 'This Calendar Year', beginGroup: true },
      { value: 'thisfyear', text: 'This Financial Year' },
      { value: 'previouscalyear', text: 'Previous Calendar Year' },
      { value: 'previousfyear', text: 'Previous Financial Year' }
    ];

    this.presetReportDateTimes = [
      { value: 'hours3', text: 'Last 3 hours' },
      { value: 'hours6', text: 'Last 6 hours' },
      { value: 'hours24', text: 'Last 24 hours' },
      { value: 'days7', text: 'Last 7 days' },
      { value: 'months1', text: 'Last 1 month' }
    ];
  }

  private getEPracticeToken() {
    // return sessionStorage.getItem('ePracticeToken');
    return this.userStore.getAuthToken();
  }

  public get getFinancialYearStart() {
    // return JSON.parse(sessionStorage.getItem('siteDetails')).FinancialYearStart;
    if (!this.userStore.isMedSecUser() && this.userStore.hasSelectedASite())
      return this.siteStore.getSelectedSite().financialYearStart;

    let d = new Date();
    return new Date(d.getFullYear(), 4, 1, 0, 0, 0);
  }

  public get getFinancialYearEnd() {
    // return JSON.parse(sessionStorage.getItem('siteDetails')).FinancialYearEnd;
    if (!this.userStore.isMedSecUser() && this.userStore.hasSelectedASite())
      return this.siteStore.getSelectedSite().financialYearEnd;

    let d = new Date();
    return new Date(d.getFullYear() + 1, 3, 31, 23, 59, 59);
  }


  public get getCurrencySymbol() {
    if (!this.userStore.isMedSecUser() && this.userStore.hasSelectedASite())
      return this.siteStore.getSelectedSite().currencySymbol;

    return '£';
  }

  public getCurrencySymbolBySite(siteId: string) {
    const site = this.getSite(siteId);
    if (site !== undefined) {
      return site.currencySymbol;
    }
    return '£';
  }


  private getSite(siteId: string) {
    const sites = JSON.parse(sessionStorage.getItem('sites'));
    return sites.find(x => x.siteId === siteId);
  }

  public get getCurrencyCode() {
    if (!this.userStore.isMedSecUser() && this.userStore.hasSelectedASite())
      return this.siteStore.getSelectedSite().currencyCode;

    return 'GBP';
  }

  public get getCurrencyFormat() {
    return { style: 'currency', precision: 2, currency: this.getCurrencyCode };
  }
  public get getCurrencyFormatForNumberBox() {
    return this.getCurrencySymbol + " #,##0.##"
  }

  public getCurrencyCodeBySite(siteId) {
    const site = this.getSite(siteId);
    if (site !== undefined) {
      return site.currencyCode;
    }
    return 'GBP';
  }

  public getSiteWorkingHours(siteId) {
    const site = this.getSite(siteId);
    if (site !== undefined) {
      return site.wo
    }
  }

  public get getDateFormat() {
    if (!this.userStore.isMedSecUser() && this.userStore.hasSelectedASite())
      return this.siteStore.getSelectedSite().shortDateFormat;

    return 'dd/MM/yyyy';
  }

  public getEmailFormat() {
    return "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,10}$";
  }

  public getDateFormatBySite(siteId) {
    const site = this.getSite(siteId);
    if (site !== undefined) {
      return site.shortDateFormat;
    }
    return 'dd/mm/yyyy';
  }
  public getDateTimeFormatBySite(siteId) {
    const site = this.getSite(siteId);
    if (site !== undefined) {
      return site.dateTimeFormat;
    }
    return 'dd/mm/yyyy HH:MM';
  }

  public get getDateTimeFormat() {
    if (!this.userStore.isMedSecUser() && this.userStore.hasSelectedASite())
      return this.siteStore.getSelectedSite().dateTimeFormat;

    return "dd/MM/yyyy hh:mm";
  }

  public get getExtendedDateTimeFormat() {
    return 'dd-MMM-yyyy  HH:mm:ss';
  }

  public insurerLogo(organisationName) {
    if (organisationName === 'BUPA') {
      return 'assets/img/insurer_logos/bup2.png';
    } else {
      if (organisationName === 'AXA PPP Healthcare') {
        return 'assets/img/insurer_logos/ppp2.png';
      }
    }
    return '';
  }

  public getAddressTypesForPatientDetails() {
    return this.gluAddressTypesDataSource;
  }

  public getPatientNumberTypesForPatientDetails() {
    return this.lluPatientNumberTypesDataSource;
  }

  public get title() {
    return 'ePractice';
  }

  /* public get odata_baseurl() {
    return environment.odataBaseurl;
  } */

  public get authserver_baseurl() {
    return environment.authserverBaseurl;
  }


  public get odata_context() {
    return this.context;
  }

  public firstLetterCaps(e) {
    let textcontent = e.target.value;
    if (textcontent.length === 1) {
      textcontent = textcontent.toUpperCase();
    }
    if (textcontent.length > 2) {
      if (
        textcontent[textcontent.length - 2] === ' ' ||
        textcontent[textcontent.length - 2] === '\''
      ) {
        let s = '' + textcontent[textcontent.length - 1];
        s = s.toUpperCase();
        textcontent = textcontent.slice(0, textcontent.length - 1);
        textcontent = textcontent + s[0];
      }
    }
    return e.target.value = textcontent;
  }

  public allCaps(e) {
    return e.target.value = e.target.value.toUpperCase();
  }

  public convertToHours(totalMinutes) {
    let text = "";
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    if (hours > 0)
      text += hours + "hrs ";
    return text += minutes + "mins";
  }

  public isDatagridGrouped(gridComponent: any): boolean {
    for (let i = 0; i < gridComponent.option('columns').length; i++) {
      const groupedColum = gridComponent.columnOption('groupIndex:' + i.toString());
      if (groupedColum) {
        return true;
      }
    }
    return false;
  }

  public disableESC(e: any) {
    e.component.registerKeyHandler("escape", function (arg) {
      arg.stopPropagation();
    });
  }

  public getHtmlElements(selector: ElementRef) {
    const focussableElements =
      'input:not([disabled]):not([ng-reflect-is-disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
    let elements = selector.nativeElement.querySelectorAll(focussableElements);
    elements = Array.prototype.filter.call(elements, function (element) {
      return element.offsetWidth > 0 || element.offsetHeight > 0;
    });
    return elements;
  }
}

export class TitlesViewModel {
  title: string;
}

export class TelecomVM {
  Type: string;
  Value: string;
}

// TODO : The below needs to be removed it is a dup of ContactTypeViewModel!
export class ContactTypeVM {
  description: string;
  contactType: string;
  uniqueNo: number;
  sendViaPatientzone: boolean;
  canBeReferrer: boolean;
}

export class TelecomDetails {
  type: string;
  value: string;
}

export class TelecomTypes {
  uniqueNo: number;
  siteId: Guid;
  type: string;
  telecomType: number;
  description: string;
  rank: number;
  editMask: boolean;
  active: boolean;
  numericOnly: boolean;
  alwaysAdd: boolean;
  preferred: boolean;
  patientId: Guid;
  telecomTypeId: number;
  value: string;
  telecomId: Guid;
  isOrganisation: boolean;
}


export class ReferenceNumberTypes {
  uniqueNo: number;
  siteId: string;
  numberType: string;
  description: string;
  rank: number;
  editMask: string;
  minLength: number;
  maxLength: number;
  numericOnly: boolean;
  checkDigit: boolean;
  checkDigitMethod: string;
  active: boolean;
  autoIncrement: boolean;
  nextNumber: number;
  prefix: string;
  suffix: string;
  alwaysAdd: boolean;
}
