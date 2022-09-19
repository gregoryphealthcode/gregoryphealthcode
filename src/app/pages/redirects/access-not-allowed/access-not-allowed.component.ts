import { NgModule, Component, Input, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { DxBoxModule, DxFormModule, DxPopupModule, DxButtonModule } from 'devextreme-angular';
import { Router } from '@angular/router';
import { AppInfoService } from 'src/app/shared/services';
import { DxiItemModule } from 'devextreme-angular/ui/nested';

@Component({
  selector: 'app-access-not-allowed',
  templateUrl: './access-not-allowed.component.html',
  styleUrls: ['./access-not-allowed.component.scss']
})

export class AccessNotAllowedComponent implements OnInit {
  @Input() requestedPage: string;

  constructor(
    public router: Router,
    public appInfo: AppInfoService) {

  }

  ngOnInit() {
    this.router.routerState.root.queryParams.subscribe(params => {
      this.requestedPage = params.deniedroute;
    });
  }
}

@NgModule({
  declarations: [
    AccessNotAllowedComponent
  ],
  imports: [
    DxBoxModule,
    DxFormModule,
    DxPopupModule,
    DxButtonModule,
    DxButtonModule,
    DxiItemModule,
  ],
  providers: [
    Location,
    AppInfoService
  ],
  exports: [
    AccessNotAllowedComponent],
})

export class AccessNotAllowedModule { }
