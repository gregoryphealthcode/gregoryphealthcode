import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GdprRoutingModule } from './gdpr-routing.module';
import { GdprAboutComponent } from './gdpr-about/gdpr-about.component';
import { GdprTemplatesComponent } from './gdpr-templates/gdpr-templates.component';
import { GdprSubjectAccessExportComponent } from './gdpr-subject-access-export/gdpr-subject-access-export.component';
import { RouterModule } from '@angular/router';
import { DxButtonModule } from 'devextreme-angular';
import { GdprGuideComponent } from './gdpr-guide/gdpr-guide.component';

@NgModule({
  declarations: [
    GdprAboutComponent,
    GdprTemplatesComponent,
    GdprSubjectAccessExportComponent,
    GdprGuideComponent],
  imports: [
    CommonModule,
    RouterModule,
    DxButtonModule,
    GdprRoutingModule
  ]
})
export class GdprModule { }
