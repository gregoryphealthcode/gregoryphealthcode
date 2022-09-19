import { DayEnum, WorkDayTime } from "../services/site-practice-hours.service";

export interface UserAllowedSitesViewModel {
  siteId: string;
  siteName: string;
  siteRef: string;
  accessRole: string;
  ePracticeVariant: string;
  displayName: string;
  shortDateFormat: string;
  longDateFormat: string;
  dateTimeFormat: string;
  currencySymbol: string;
  currencyCode: string;
  financialYearStart : string;
  financialYearEnd : string;
  payeeProvider : string;
  isPatientZoneEnabled : boolean;
  address1 : string;
  address2 : string;
  address3 : string;
  address4 : string;
  postcode : string;
  firstName : string;
  lastName : string;
  title : string;
}

export class MedsecSitesViewModel {
  siteId: string;
  siteName: string;
  useOwnBank : string;
  isSelected : boolean;
  displayName : string;
  payeeProvider : string;
  title : string;
  bankName : string;
  accountNumber : number;
  sortCode : string;
  accountName : string;
  firstName : string;
  lastName : string;
  address1 : string;
  address2 : string;
  address3 : string;
  address4 : string;
  postcode : string;

  emailAddress : string;
  telephone : number;
  isPatientZoneEnabled : boolean;

}

