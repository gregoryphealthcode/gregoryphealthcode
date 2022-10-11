import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable, Injector } from '@angular/core';
import { AppComponent } from './app.component';
import { SingleCardModule } from './layouts';
import { ScreenService, AppInfoService } from './shared/services';
import { AppRoutingModule } from './app-routing.module';
import { AlertService } from './shared/services/alert.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
// import { DeviceDetectorModule } from 'ngx-device-detector';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { fas } from '@fortawesome/free-solid-svg-icons';
// import { far } from '@fortawesome/free-regular-svg-icons';
// import { fal } from '@fortawesome/fontawesome-pro';
import { AppointmentService } from './shared/services/appointment.service';
import { DxLoadPanelModule } from 'devextreme-angular';
import { ContactService } from './shared/services/contact.service';
import { environment } from 'src/environments/environment';
import { WaitingListService } from './shared/services/waiting-list-service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BillingService } from './shared/services/billing.service';
import { TaskService } from './shared/services/task.service';
import { RelatedPersonService } from './shared/services/related-person.service';
import {GoogleAnalyticsService} from './shared/services/google-analytics.service';
import { UpdateService} from './shared/services/update.service';
import { IdentityModule } from './pages/Identity/identity.module';
import { MasterPageModule } from './pages/master-page/master-page.module';
import { SpinnerModule } from './shared/components/spinner/spinner.module';
import { BearerInterceptor } from './shared/interceptors/bearer.interceptor';
import { PageNotFoundComponent } from './pages/redirects/page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogTemplateComponent } from './shared/components/dialog/dialog-template.component';
import { MatButtonModule } from '@angular/material/button';
import { PrintingService } from './shared/services/printing.service';
import {  SearchService } from './shared/services/search.service';
import { CorrespondenceService } from './shared/services/correspondence.service';
import { AppInjector } from './shared/services/app.injector';
import { ErrorDialogTemplateComponent } from './shared/components/dialog/error-dialog-template.component';
import { MedSecMasterPageModule } from './medsec/medsec-master-page/medsec-master-page.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PatientZoneService } from './shared/services/patient-zone.service';
import { AdminModule } from './admin/admin.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DialogTemplateComponent,
    ErrorDialogTemplateComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    SingleCardModule,
    AppRoutingModule,
    IdentityModule,
    MasterPageModule,
    MedSecMasterPageModule,
    AdminModule,
    // FontAwesomeModule,
    HttpClientModule,
    DxLoadPanelModule,
    SpinnerModule,
    // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    // DeviceDetectorModule.forRoot(),
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    NgbModule,
    MatDialogModule
  ],
  providers: [
    ScreenService,
    AlertService,
    AppointmentService,
    ContactService,
    WaitingListService,
    BillingService,
    TaskService,
    RelatedPersonService,
    GoogleAnalyticsService,
    CorrespondenceService,
    PrintingService,
    SearchService,
    UpdateService,
    PatientZoneService,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: BearerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {constructor(injector: Injector) {
  AppInjector.setInjector(injector);
//** PG */  library.add(fas, far);
} }
