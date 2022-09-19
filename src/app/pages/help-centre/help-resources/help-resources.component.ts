import { Component, OnInit } from '@angular/core';
import initHelpHero from 'helphero';
import { UserStore } from 'src/app/shared/stores/user.store';
import { AppInfoService } from 'src/app/shared/services';
import { HelpHeroModel, HelpHeroService } from 'src/app/shared/services/help-hero.service';

@Component({
  selector: 'app-help-resources',
  templateUrl: './help-resources.component.html',
  styleUrls: ['./help-resources.component.scss']
})
export class HelpResourcesComponent implements OnInit {
  public hlp: any = null;
  public helptours: HelpHeroModel[] = null;

  constructor(
    private userStore: UserStore,
    public appInfo: AppInfoService,
    private helpHeroService: HelpHeroService
  ) {
  }

  ngOnInit() {
    this.hlp = initHelpHero('N0KU0rTcWFG');
    this.hlp.identify(this.userStore.getUserId(), {
      firstName: this.userStore.getFirstName(),
      displayName: this.userStore.getDisplayName()
    })
  }

  getHelpHero() {
    this.helpHeroService.getHelpHero().subscribe(x => {
      this.helptours = x;
    });
  }

  public runTour(tourId) {
    this.hlp.startTour(tourId, { redirectIfNeeded: true });
  }
}