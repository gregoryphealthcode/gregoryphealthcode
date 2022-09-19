import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxAutocompleteModule, DxCheckBoxModule, DxDataGridModule, DxDateBoxModule, DxNumberBoxModule, DxPopupModule, DxSelectBoxModule, DxSortableModule, DxTextBoxModule } from 'devextreme-angular';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AppFormModule } from '../../app-form/app-form.module';
import { OtherPreferencesComponent } from './other-preferences.component';
import { OtherPreferencesAddEditComponent } from './other-preferences-add-edit/other-preferences-add-edit.component';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { PopUpFormModule } from '../../pop-up-form/pop-up-form.module';

@NgModule({
  imports: [
    DxTextBoxModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DirectivesModule,
    DxDataGridModule,
    MatIconModule,
    MatButtonModule,
    DxCheckBoxModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    DxAutocompleteModule,
    DxSortableModule,
    DxPopupModule,
    MatIconModule,
    AppFormModule,
    GridSearchTextBoxModule,
    AppButtonModule,
    DxPopupModule,
    PopUpFormModule
],
  declarations: [OtherPreferencesComponent, OtherPreferencesAddEditComponent],
  exports: [OtherPreferencesComponent]})

  export class OtherPreferencesModule {}
