import { Component, OnInit } from '@angular/core';
import { SelectSiteBase } from '../select-site.base';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserAllowedSitesViewModel } from 'src/app/shared/models/UserAllowedSitesViewModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-health-code-user-view',
  templateUrl: './health-code-user-view.component.html',
  styleUrls: ['./health-code-user-view.component.scss']
})
export class HealthCodeUserViewComponent extends SelectSiteBase implements OnInit {
  constructor(
    authService: AuthService,
    spinnerService: SpinnerService,
    private router: Router
  ) {
    super(authService, spinnerService);
  }

  public reasonSelected: any;
  public reasonDetails: string;
  public reasonList: any[] = [
    { id: 'SupportIssue', name: 'Support Issue' },
    { id: 'NewSetup', name: 'New Setup' },
    { id: 'Templates', name: 'Template Changes' },
    { id: 'Other', name: 'Other' }, 
  ];
  public selectedSite: UserAllowedSitesViewModel;

  showAdmin = false;

  ngOnInit() {
    this.getSites();
  }

  onHealthCodeUserFormSubmit(e) {
    e.preventDefault();
    this.siteSelect.emit({ siteId: this.selectedSite.siteId, details: this.reasonSelected + ':' + this.reasonDetails });
  }

  getSites() {
    this.getAllowedSites();
  }

  adminClicked() {
    this.router.navigate([`/admin`]);
  }
}
