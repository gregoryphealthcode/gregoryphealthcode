import { Component, OnInit } from '@angular/core';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-post-auth',
  templateUrl: './post-auth.component.html',
  styleUrls: ['./post-auth.component.scss'],
})
export class PostAuthComponent extends SubscriptionBase implements OnInit {
  public showUnauthorised: boolean;
  public showNoUserFound: boolean;
  public showUnknownError: boolean;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.subscription.add(
      this.route.queryParams.subscribe((params) => {

        if (params.code) {
          this.setup(params);
        }
      })
    );
  }

  private setup(params: any) {
    const code = params.code;
    const state = params.state;

    this.subscription.add(
      this.authService.postAuth(code, state).subscribe(
        (x) => {
          if (!x) {
            this.showNoUserFound = true;
          }
        },
        (error) => {
          this.onError(error);
        }
      )
    );
  }

  private onError(error: any) {
    switch (error.status) {
      case 401:
        this.showUnauthorised = true;
        break;
      default:
        this.showUnknownError = true;
    }
  }
}