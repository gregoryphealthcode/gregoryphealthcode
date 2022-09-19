import { Component, NgModule, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxListModule } from 'devextreme-angular';
import { DxContextMenuModule } from 'devextreme-angular';
import { SitesStore } from '../../stores/sites.store';
import { UserStore } from '../../stores/user.store';

@Component({
  selector: 'app-site-panel',
  templateUrl: 'site-panel.component.html',
  styleUrls: ['./site-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SitePanelComponent implements OnInit {
  constructor(
    private siteStore: SitesStore,
    private userStore: UserStore,
  ) {
  }

  public currentSite: any;

  ngOnInit(): void {
    if (this.userStore.hasSelectedASite())
      this.currentSite = this.siteStore.getSelectedSite();
  }

}

@NgModule({
  imports: [
    DxListModule,
    DxContextMenuModule,
    CommonModule
  ],
  declarations: [SitePanelComponent],
  exports: [SitePanelComponent]
})

export class SitePanelModule { }