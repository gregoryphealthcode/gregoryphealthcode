import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from 'src/app/shared/guards/admin.guard';
import { AdminUsersPageComponent } from './admin-users-page/admin-users-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SiteViewComponent } from './sites-page/site-view/site-view.component';
import { SitesPageComponent } from './sites-page/sites-page.component';
import { EpracticeUserViewComponent } from './epractice-users-page/epractice-user-view/epractice-user-view.component';
import { EpracticeUsersPageComponent } from './epractice-users-page/epractice-users-page.component';
import { GroupViewComponent } from './groups-page/group-view/group-view.component';
import { GroupsPageComponent } from './groups-page/groups-page.component';
import { GlobalTemplatesComponent } from './global-templates/global-templates.component';
import { GlobalTemplateAddEditComponent } from './shared/global-template-add-edit/global-template-add-edit.component';


const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: HomePageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'sites',
    component: SitesPageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'sites/:siteId',
    component: SiteViewComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'groups',
    component: GroupsPageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'groups/:groupId',
    component: GroupViewComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'adminUsers',
    component: AdminUsersPageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'ePracticeUsers',
    component: EpracticeUsersPageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'ePracticeUsers/:userId',
    component: EpracticeUserViewComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'templates',
    component: GlobalTemplatesComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'templates/:templateId',
    component: GlobalTemplateAddEditComponent,
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
