import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PprProfileRoutingModule } from './ppr-profile-routing.module';
import { PprProfileComponent } from './ppr-profile.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  declarations: [PprProfileComponent],
  imports: [
    CommonModule,
    PprProfileRoutingModule,
    PipesModule
  ]
})
export class PprProfileModule { }
