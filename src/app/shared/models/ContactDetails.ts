import Guid from 'devextreme/core/guid';
import { Address, TelecomsViewModel } from '../services/contact.service';
export class ContactDetails {
  patientId: Guid;
  siteId: Guid;
  inactive: boolean;
  lastName: string;
  firstName: string;
  otherInitials: string;
  title: string;
  jobTitle: string;
  qualifications: string;
  payor: boolean;
  sendViaPatientzone: boolean;
  knownAs: string;
  contactId: string;
  addresses : Address[];
  contactTypeId : string;
  classificationTypeId : number;
  linkedPractice : string;
  contactType : string;
  displayName : string;
  items : ContactDetails[];
  contactLinkId : string;
  telecoms : TelecomsViewModel[];
  organisationId : string;
  inactiveReason : string;
  postcode : string;
  departmentName : string;
}

