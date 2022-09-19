import { Component, HostListener } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './shared/services/auth.service';
import { UserStore } from './shared/stores/user.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    event.stopPropagation();
  }

  constructor(router: Router, private userStore: UserStore,
    private authService: AuthService) {
    router.events
      .pipe(filter((event: NavigationEvent) => { return (event instanceof NavigationStart); }))
      .subscribe(
        (event: NavigationStart) => {
          if (event.navigationTrigger == "popstate") {
            //this.unselectSite();
          }
        });
  }

  private unselectSite() {
    if (this.userStore.isMedSecUser()) {
      this.authService.unselectSite().subscribe(() => {
      })
    }
  }

  //https://www.bennadel.com/blog/3533-using-router-events-to-detect-back-and-forward-browser-navigation-in-angular-7-0-4.htm
}
