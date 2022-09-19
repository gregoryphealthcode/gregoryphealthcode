import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridCellDataPipe } from './grid-cell-data.pipe';
import { SafePipe } from './safe.pipe';
import { DateAgoPipe } from './date-ago.pipe';
import { DateFormatPipe } from './date-format.pipe';



@NgModule({
  declarations: [GridCellDataPipe, SafePipe, DateAgoPipe, DateFormatPipe],
  imports: [
    CommonModule
  ],
  exports:[GridCellDataPipe, SafePipe, DateAgoPipe, DateFormatPipe]
})
export class PipesModule { }
