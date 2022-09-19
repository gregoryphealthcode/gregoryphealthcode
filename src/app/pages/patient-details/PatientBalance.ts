import Guid from 'devextreme/core/guid';

export class PatientBalance {
  BalanceDue: number;
  OnStop: boolean;
  DoNotChase: boolean;
  DoNotChaseUntil: Date;
  PaymentPlan: boolean;
  PaymentPlanId: Guid;
  Notes: string;
  PatientId: Guid;
  SiteId: Guid;
  UniqueNo: number;
}