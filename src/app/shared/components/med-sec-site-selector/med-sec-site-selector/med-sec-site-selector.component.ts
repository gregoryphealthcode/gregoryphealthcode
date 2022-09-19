import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { UserAllowedSitesViewModel } from 'src/app/shared/models/UserAllowedSitesViewModel';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-med-sec-site-selector',
  templateUrl: './med-sec-site-selector.component.html',
  styleUrls: ['./med-sec-site-selector.component.scss']
})
export class MedSecSiteSelectorComponent extends SubscriptionBase implements OnInit {
  @Output() onSelected = new EventEmitter();
  @Output() closed = new EventEmitter();

  @Input() title = "Select a Site";

  public sites: UserAllowedSitesViewModel[];
  public visible = false;

  constructor(
    private authService: AuthService,
    public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit() {
    this.subscription.add(
      this.authService
        .getSites()
        .pipe(
          tap((sites) => {
            this.sites = sites;
          })
        )
        .subscribe()
    );
  }

  show() {
    this.visible = true;
  }

  onSiteSelectionChanged(e) {
    const patientId = e.selectedItem.siteId;
    this.authService.selectSite(patientId)
      .subscribe(() => {
        this.onSelected.emit(e.selectedItem.siteId);
        this.visible = false
      })

  }
}
