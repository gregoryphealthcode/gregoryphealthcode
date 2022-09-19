import Guid from "devextreme/core/guid";

export class PrintQueueViewModel
{
  siteId: Guid;
  patientId: Guid;
  recipientId: string;
  documentTypeId: string;
  correspondenceType: string;
  documentId : string;
  documentTypeName : string;
  queueStatus : number;
  batchId : number;
  printQueueId : string;
}

export class PrintQueueListViewModel
{
  siteId: string;
  patientId: string;
  documentType : string;
  dateCreated : Date;
  patientName : string;
  documentId : string;
  queueStatus : number;
  batchId : number;
  printQueueId : string;
  documentTypeId : string;
  siteName : string;
  siteRef : string;
}

