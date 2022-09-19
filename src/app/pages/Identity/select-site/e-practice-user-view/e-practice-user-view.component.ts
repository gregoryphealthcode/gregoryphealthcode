import { Component, OnInit } from '@angular/core';
import { SelectSiteBase } from '../select-site.base';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { UserAllowedSitesViewModel } from 'src/app/shared/models/UserAllowedSitesViewModel';

@Component({
  selector: 'app-e-practice-user-view',
  templateUrl: './e-practice-user-view.component.html',
  styleUrls: ['./e-practice-user-view.component.scss']
})
export class EPracticeUserViewComponent extends SelectSiteBase implements OnInit {
  public show = false;
  public selectedSite: UserAllowedSitesViewModel;

  constructor(
    authService: AuthService,
    private spinner: SpinnerService
  ) {
    super(authService, spinner);
  }

  ngOnInit() {
    this.getAllowedSites(sites => {
      if (sites.length > 1) { // more than 1 site so user needs to select one
        this.show = true;
      }
      else {
        this.spinner.start();
        this.siteSelect.emit({ siteId: sites[0].siteId }); // select site
      }
    });
  }

  public onSiteSelectionChanged() {
    this.siteSelect.emit({ siteId: this.selectedSite.siteId });
  }
}