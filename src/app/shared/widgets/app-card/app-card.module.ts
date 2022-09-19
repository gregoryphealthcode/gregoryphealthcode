import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCardComponent } from './app-card.component';
import { AppCardFooterComponent } from './app-card-footer/app-card-footer.component';



@NgModule({
  declarations: [AppCardComponent, AppCardFooterComponent],
  imports: [
    CommonModule
  ],
  exports: [AppCardComponent, AppCardFooterComponent]
})
export class AppCardModule { }
