import { HomeComponent } from './pages/home/home.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule, NoPreloading, PreloadingStrategy, PreloadAllModules } from "@angular/router";
import { AuthGuardService } from "./shared/guards/auth.guard";
import { MasterPageComponent } from "./pages/master-page/master-page.component";
import { IdentityMasterPageComponent } from "./pages/Identity/identity-master-page/identity-master-page.component";
import { PageNotFoundComponent } from "./pages/redirects/page-not-found/page-not-found.component";
import { PostAuthComponent } from "./pages/Identity/post-auth/post-auth.component";
import { MedSecMasterPageComponent } from "./medsec/medsec-master-page/medsec-master-page.component";
import { MedSecAuthGuardService } from "./shared/guards/medsec-auth.guard";
import { AdminGuard } from "./shared/guards/admin.guard";
import { AdminMasterPageComponent } from "./admin/admin-master-page/admin-master-page.component";

const routes: Routes = [
  // { path: 'identity', loadChildren: () => import('./pages/Identity/identity.module').then(m => m.IdentityModule)
  // },
  {
    path: "identity",
    component: IdentityMasterPageComponent,
    loadChildren: () =>
      import("./pages/Identity/identity.module").then((m) => m.IdentityModule),
  },
  {
    path: "medsec",
    component: MedSecMasterPageComponent,
    canActivate: [MedSecAuthGuardService],
    canActivateChild: [MedSecAuthGuardService],
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
      {
        path: "home",
        loadChildren: () =>
          import("./medsec/home/home.module").then((m) => m.MedSecHomeModule),
      },
      {
        path: "",
        loadChildren: () =>
          import("./medsec/medsec-master-page/medsec-master-page.module").then(
            (m) => m.MedSecMasterPageModule
          ),
      },
      {
        path: "reports",
        loadChildren: () =>
          import("./pages/reporting/reporting.module").then(
            (m) => m.ReportingModule
          ),
      },
      {
        path: "preferences",
        loadChildren: () =>
          import("./medsec/preferences/preferences.module").then(
            (m) => m.MedSecPreferencesModule
          ),
      },
      {
        path: "tasks",
        loadChildren: () =>
          import("./pages/tasks/tasks.module").then((m) => m.TasksModule),
      },
    ],
  },
  {
    path: "",
    component: MasterPageComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
      {
        path: "home",
        loadChildren: () =>
          import("./pages/home/home.module").then((m) => m.HomeModule),
      },
      {
        path: "help",
        loadChildren: () =>
          import("./pages/help-centre/help-centre.module").then(
            (m) => m.HelpCentreModule
          ),
      },
      {
        path: "messages",
        loadChildren: () =>
          import("./pages/messages/messages.module").then(
            (m) => m.MessagesModule
          ),
      },
      {
        path: "accounts",
        loadChildren: () =>
          import("./pages/accounts/accounts.module").then(
            (m) => m.AccountsModule
          ),
      },
      {
        path: "preferences",
        loadChildren: () =>
          import("./pages/preferences/preferences.module").then(
            (m) => m.PreferencesModule
          ),
      },
      {
        path: "reports",
        loadChildren: () =>
          import("./pages/reporting/reporting.module").then(
            (m) => m.ReportingModule
          ),
      },
      {
        path: "tasks",
        loadChildren: () =>
          import("./pages/tasks/tasks.module").then((m) => m.TasksModule),
      },
      {
        path: "ppr-profile",
        loadChildren: () =>
          import("./pages/ppr-profile/ppr-profile.module").then(
            (m) => m.PprProfileModule
          ),
        data: { accesskey: 375 },
        canActivate: [AuthGuardService],
      },
      {
        path: "documents",
        loadChildren: () =>
          import("./pages/documents/documents.module").then(
            (m) => m.DocumentsModule
          ),
        data: { accesskey: 375 },
        canActivate: [AuthGuardService],
      },
      {
        path: "gdpr",
        loadChildren: () =>
          import("./pages/gdpr/gdpr.module").then((m) => m.GdprModule),
      },
      {
        path: "",
        loadChildren: () =>
          import("./pages/master-page/master-page.module").then(
            (m) => m.MasterPageModule
          ),
      },
    ],
  },
  {
    path: 'admin',
    component: AdminMasterPageComponent,
    canActivate: [AdminGuard],
    loadChildren: () =>
          import("./admin/admin.module").then(
            (m) => m.AdminModule
          ),
      },
  // {
  //   path: "identity",
  //   component: IdentityMasterPageComponent,
  //   loadChildren: () =>
  //     import("./pages/Identity/identity.module").then((m) => m.IdentityModule),
  // },
  {
    path: "postauth",
    component: PostAuthComponent,
  },
  // { path: "**", component: PageNotFoundComponent },
  { path: "**", component: HomeComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'ignore',
      enableTracing: false,
      useHash: false,
      urlUpdateStrategy:'eager',
      preloadingStrategy: PreloadAllModules
      // preloadingStrategy: NoPreloading
    }),
    //RouterModule.forRoot(
    //  routes
      //  { enableTracing: true } // <-- debugging purposes only
    //),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
