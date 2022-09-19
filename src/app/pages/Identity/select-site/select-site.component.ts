import { Component, OnInit } from '@angular/core';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { UserService, AuditModel } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { UserStore } from 'src/app/shared/stores/user.store';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SiteSelectDetails } from './select-site.base';
import { tap } from 'rxjs/operators';
import { LockScreenService } from 'src/app/shared/services/lock-screen.service';

@Component({
  selector: 'app-select-site',
  templateUrl: './select-site.component.html',
  styleUrls: ['./select-site.component.scss'],
})
export class SelectSiteComponent extends SubscriptionBase implements OnInit {
  public loadingData = true;

  private auditLogMap = new Map([
    [5, { eventCode: 'StaffLogin' }],
    [3, { eventCode: 'SiteLogin', details: undefined }],
    [6, { eventCode: 'BureauLogin', details: undefined }],
    [1, { eventCode: 'MedsecLogin', details: undefined }],
  ]);

  constructor(
    private authService: AuthService,
    public userStore: UserStore,
    private siteStore: SitesStore,
    private router: Router,
    private spinnerService: SpinnerService,
    private lockScreenService:LockScreenService
  ) {
    super();
  }

  ngOnInit(): void {
    this.siteStore.clearSites();
  }

  public selectSite(request: SiteSelectDetails) {
    this.spinnerService.start();
    this.subscription.add(
      this.authService
        .selectSite(request.siteId)
        .pipe(
          tap(() => {
            this.lockScreenService.clearTimers();
            this.loadingData = false;
            if (request.patientId) {
              this.router.navigate([`/patient-details/${request.patientId}`]);
              return;
            }

            this.router.navigate(['/home']);
            this.spinnerService.stop();
          }))
        .subscribe()
    );
  }

  private buildAuditModel(): AuditModel {
    const log = this.auditLogMap.get(this.userStore.getUserType());
    const auditModel: AuditModel = {
      userId: this.userStore.getUserId(),
      siteId: this.userStore.getSiteId(),
      eventCategory: 'Info',
      eventCode: log.eventCode,
      details: log.details,
      reportedBy: 'ePractice',
      reason: '',
      patientId: null,
    };
    return auditModel;
  }
}
