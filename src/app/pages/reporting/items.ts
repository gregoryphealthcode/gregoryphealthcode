import { AppointmentsReportsComponent } from "./diary/appointments-reports/appointments-reports.component";
import { WaitingListReportsComponent } from "./diary/waiting-list-reports/waiting-list-reports.component";
import { InvoicesReportsComponent } from "./financial/invoices-reports/invoices-reports.component";
import { ReportChargesComponent } from "./financial/report-charges/report-charges.component";
import { TransactionsReportsComponent } from "./financial/transactions-reports/transactions-reports.component";
import { PatientReferrersReportsComponent } from "./patient/patient-referrers-reports.component";

export const reportsItems: ReportItemsModel[] = [
  {
    key: "financial",
    title: "Financial",
    description:
      "You can find invoices, transactions, charges, debtors related informations in here",
    icon: "fad fa-chart-bar",
    accesskey: 405,
    items: [
      {
        key: "invoices",
        title: "Invoices",
        description: "You can find invoices related informations in here",
        icon: "fad fa-chart-bar",
        component: InvoicesReportsComponent,
      },
      {
        key: "transactions",
        title: "Transactions",
        description: "You can find transactions related informations in here",
        icon: "fad fa-chart-bar",
        component: TransactionsReportsComponent,
      },
      {
        key: "charges",
        title: "Charges",
        description: "You can find charges related informations in here",
        icon: "fad fa-chart-bar",
        component: ReportChargesComponent,
      },
    ],
  },
  {
    key: "patients",
    title: "Patients",
    description: "You can find patients related informations in here",
    icon: "fad fa-user-injured",
    accesskey: 416,
    items: [
      {
        key: "referrer",
        title: "Referrer",
        description: "You can find patients age related informations in here",
        icon: "fad fa-chart-bar",
        component: PatientReferrersReportsComponent,
      },
    ],
  },
  {
    key: "diary",
    title: "Diary",
    description:
      "You can find appointments and waiting list related informations in here",
    icon: "fad fa-calendar-alt",
    accesskey: 410,
    items: [
      {
        key: "appointments",
        title: "Appointments",
        description: "You can find appointments related informations in here",
        icon: "fad fa-chart-bar",
        component: AppointmentsReportsComponent,
      },
      {
        key: "waiting-list",
        title: "Waiting List",
        description: "You can find waiting list related informations in here",
        icon: "fad fa-chart-bar",
        component: WaitingListReportsComponent,
      },
    ],
  },
];

export interface ReportItemsModel {
  key: string;
  title: string;
  description: string;
  icon: string;
  accesskey: number;
  items: ReportItemModel[];
}

export interface ReportItemModel {
  key: string;
  title: string;
  description: string;
  icon: string;
  component: any;
}
