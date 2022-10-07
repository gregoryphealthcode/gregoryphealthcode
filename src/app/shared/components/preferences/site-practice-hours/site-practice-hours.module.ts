import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitePracticeHoursComponent } from './site-practice-hours/site-practice-hours.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { MatInputModule } from '@angular/material/input';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [SitePracticeHoursComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppButtonModule,
    MatCheckboxModule,
    MatInputModule,
    DirectivesModule
  ],
  exports: [SitePracticeHoursComponent]
})
export class SitePracticeHoursModule { }
