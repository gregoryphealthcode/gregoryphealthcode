import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpResourcesComponent } from './help-resources/help-resources.component';
import { HelpUserGuideComponent } from './help-user-guide/help-user-guide.component';
import { HelpVideosComponent } from './help-videos/help-videos.component';
import { HelpCentreRoutingModule } from './help-centre.routing.module';
import { DxButtonModule } from 'devextreme-angular';

@NgModule({
  declarations: [
    HelpResourcesComponent,
    HelpUserGuideComponent,
    HelpVideosComponent
  ],
  imports: [
    CommonModule,
    HelpCentreRoutingModule,
    DxButtonModule
  ],
  exports: [
    HelpCentreRoutingModule
  ]
})

export class HelpCentreModule { }