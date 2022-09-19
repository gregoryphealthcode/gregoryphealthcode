import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { GridsterModule } from 'angular-gridster2';
import { CookieService } from 'ngx-cookie-service';
import { DxActionSheetModule } from 'devextreme-angular/ui/action-sheet';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxGalleryModule } from 'devextreme-angular/ui/gallery';
import { DxCommonFormControlsModule } from 'src/app/shared/modules/dx-common/dx-common-form-controls.module';
import { HomeRoutingModule } from './home-routing.module';
import { TasksModule } from '../tasks/tasks.module';
import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { ViewDiaryModule } from 'src/app/shared/components/diary/view-diary.module';
import { AppointmentPopupAddEditModule } from 'src/app/shared/components/appointment-popup-add-edit/appointment-popup-add-edit.module';

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
@NgModule({
  declarations: [HomeComponent, SafeHtmlPipe],
  imports: [
    CommonModule,
    HomeRoutingModule,
    GridsterModule,
    DxCommonFormControlsModule,
    DxActionSheetModule,
    DxPopupModule,
    DxGalleryModule,
    TasksModule,
    ViewDiaryModule,
    AppointmentPopupAddEditModule
  ],
  providers: [
    CookieService,
    SafeHtmlPipe
  ],
  exports: [
    HomeRoutingModule
  ]
})

export class HomeModule { }
