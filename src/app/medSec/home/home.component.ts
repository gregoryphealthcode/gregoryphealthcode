import { Component, OnInit,} from '@angular/core';
import { GridBase } from 'src/app/shared/base/grid.base';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
  host: { class: "d-flex flex-column flex-grow-1" },
})

export class MedSecHomeComponent extends GridBase implements OnInit {
  constructor(
  ) {
    super();
  } 

  ngOnInit() {
    this.controllerUrl = `${environment.baseurl}/user/`;
    this.setupDataSource({
      key: 'siteId',
      loadParamsCallback: () => [],
      loadUrl: "getMedsecUserSummary" 
    });
  }
}
