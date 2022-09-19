import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentLoaderComponent } from './content-loader.component';

@NgModule({
  declarations: [ContentLoaderComponent],
  imports: [
    CommonModule
  ],
  exports: [ContentLoaderComponent],
})

export class ContentLoaderModule { }