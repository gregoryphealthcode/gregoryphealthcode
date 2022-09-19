export class ProcedureCodesViewModel {
  description: string;
  code: string;
  appointmentServiceTypeId: string;
  procedureCodeId: string;
  appointmentId: string;
  cost: number;
  serviceProvider: string;
  serviceLocation: string;
  invoiceItemId : string;
  groupInvoiceItemId : string;
  combinedDescription : string;
}

export class ServiceCodesViewModel {
  description: string;
  code: string;
  requiresProcedureCode : boolean;

}


export class CostViewInvoiceLineItemViewModel
{
     patientId : string;
     invoiceNumber : string;
     cost : number;
     invoiceId : string;
     siteId : string;
     serviceCodeType : string;
     startDate : string;
     count : number;
     serviceDescription : string;
     groupInvoiceItemId : string;
     invoiceItemId : string;
     showAddProcedure : boolean;
     endDate : string;
     procedureLines : ProcedureLine[];
     requiresProcedure : boolean;
}


export class ProcedureLine
{
  invoiceItemId : string;
  showAddProcedure : boolean;
  procedureDescription : string;
  procedureCode : string;
  groupInvoiceItemId : string;
}
