import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { UserAllowedSitesViewModel } from 'src/app/shared/models/UserAllowedSitesViewModel';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { tap } from 'rxjs/operators';
import { Output, EventEmitter } from '@angular/core';

export class SelectSiteBase extends SubscriptionBase {
   @Output() siteSelect = new EventEmitter<SiteSelectDetails>();

  public sites: UserAllowedSitesViewModel[];

  constructor(
    private authService: AuthService,
    private spinnerService: SpinnerService
  ) {
    super();
  }

  protected getAllowedSites(callback?: (x: UserAllowedSitesViewModel[]) => void) {
    this.spinnerService.start();

    this.subscription.add(
      this.authService
        .getSites()
        .pipe(
          tap((sites) => {
            this.sites = sites;
            this.sites.sort(function (a, b) {
              if (a.displayName < b.displayName) return -1;
              if (a.displayName > b.displayName) { return 1; }
              return 0;
            })
            this.spinnerService.stop();
            if (callback) {
              callback(sites);
            }
          })
        )
        .subscribe()
    );
  }
}

export interface SiteSelectDetails {
  siteId: string;
  details?: string;
  patientId?: string;
}