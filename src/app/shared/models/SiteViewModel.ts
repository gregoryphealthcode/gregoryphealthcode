import { Address } from "../services/contact.service";

export class SiteViewModel
{
  siteId  : string;
  siteName : string;
  shortDateFormat : Date;
  longDateFormat  : Date;
  currencySymbol    : string;
  documentReference : string;
  autoAnalyzeBulkPayment : boolean;
  minimumSlotDuration  : number;
  dateTimeFormat : Date;

  currencyCode : string;

  financialYearStart : Date;
  financialYearEnd : Date;
  hcCode : string;
  sendInvoicesViaPatientZone : boolean;
  sendCreditNoteViaPatientZone : boolean;
  sendReallocationViaPatientZone : boolean;
  sendRemindersViaPatientZone : boolean;
  sendShortfallViaPatientZone : boolean;

  Address : Address;
  address1 : string;
  address2 : string;
  address3 : string;
  address4 : string;
  postcode : string;
  firstName : string;
  lastName : string;
  title : string;
}
