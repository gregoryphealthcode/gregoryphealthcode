import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "src/app/shared/guards/auth.guard";
import { ReportInvoicesUnpaidComponent } from "./financial/invoices-reports/report-invoices-unpaid/report-invoices-unpaid.component";
import { ReportsCentreComponent } from "./reports-centre/reports-centre.component";
import { reportsItems } from "./items";
import { ReportsTypeWrapperComponent } from "./shared/reports-type-wrapper/reports-type-wrapper.component";
import { ReportsWrapperComponent } from "./shared/reports-wrapper/reports-wrapper.component";

const buildChildrenReportsRoutes = () => {
  let children = [
    {
      path: "pages/report-invoices-unpaid",
      component: ReportInvoicesUnpaidComponent,
      canActivate: [AuthGuardService],
      data: { accesskey: 405 },
    }];

  reportsItems.forEach(x => {
    x.items.forEach(i => {
      children.push({
        path: x.key + '/' + i.key,
        component: i.component,
        canActivate: [AuthGuardService],
        data: { accesskey: x.accesskey },
      })
    });
  })
  return children;
}

const buildRoutes = () => {
  let routes: Routes = [
    {
      path: "centre",
      component: ReportsCentreComponent,
      data: { accesskey: 405 },
      canActivate: [AuthGuardService],
    },
    {
      path: "",
      component: ReportsWrapperComponent,
      canActivate: [AuthGuardService],
      children: buildChildrenReportsRoutes(),
    }
  ];

  reportsItems.forEach(x => {
    routes.push({
      path: x.key,
      component: ReportsTypeWrapperComponent,
      canActivate: [AuthGuardService],
      data: { accesskey: x.accesskey }
    })
  })

  return routes;
}

const routes: Routes = buildRoutes();

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule { }
