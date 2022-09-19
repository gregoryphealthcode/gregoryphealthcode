import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GdprSubjectAccessExportComponent } from './gdpr-subject-access-export/gdpr-subject-access-export.component';
import { AuthGuardService } from 'src/app/shared/guards/auth.guard';
import { GdprTemplatesComponent } from './gdpr-templates/gdpr-templates.component';
import { GdprGuideComponent } from './gdpr-guide/gdpr-guide.component';
import { GdprAboutComponent } from './gdpr-about/gdpr-about.component';

const routes: Routes = [
  {
    path: 'subject-access-export',
    component: GdprSubjectAccessExportComponent,
    data: { accesskey: 380 },
    canActivate: [AuthGuardService]
  },
  {
    path: 'templates',
    data: { accesskey: 380 },
    component: GdprTemplatesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'guide',
    data: { accesskey: 380 },
    component: GdprGuideComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'about',
    data: { accesskey: 1 },
    component: GdprAboutComponent,
    canActivate: [AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GdprRoutingModule { }