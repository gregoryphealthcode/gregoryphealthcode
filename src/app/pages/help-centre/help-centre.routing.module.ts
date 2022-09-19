import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HelpResourcesComponent } from './help-resources/help-resources.component';
import { HelpUserGuideComponent } from './help-user-guide/help-user-guide.component';
import { HelpVideosComponent } from './help-videos/help-videos.component';

const routes: Routes = [
  {
    path: 'resources',
    component: HelpResourcesComponent
  },
  {
    path: 'videos',
    component: HelpUserGuideComponent
  },
  {
    path: 'user-guide',
    component: HelpVideosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HelpCentreRoutingModule { }