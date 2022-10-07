import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DxDataGridModule, DxBoxModule, DxButtonModule, DxContextMenuModule, DxCheckBoxModule, DxFormModule,
  DxSwitchModule, DxToolbarModule, DxPopupModule, DxLoadPanelModule, DxSelectBoxModule
} from 'devextreme-angular';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PatientCorrespondenceComponent } from './patient-correspondence.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { CorrespondenceGridComponent } from './correspondence-grid/correspondence-grid.component';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';

@NgModule({
  declarations: [
    PatientCorrespondenceComponent,
    CorrespondenceGridComponent
  ],
  imports: [
    DxDataGridModule, 
    DxBoxModule, 
    DxButtonModule,
    DxContextMenuModule, 
    DxCheckBoxModule,
    CommonModule,
    DxFormModule, 
    DxSwitchModule, 
    DxToolbarModule, 
    DxPopupModule,
    DirectivesModule,
    DxLoadPanelModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTooltipModule, 
    MatFormFieldModule, 
    MatInputModule,
    PopUpFormModule, 
    DirectivesModule, 
    AppFormModule, 
    MatTabsModule, 
    PipesModule, 
    AppButtonModule, 
    GridSearchTextBoxModule, 
    AppButtonModule,
    DxSelectBoxModule
  ],
  exports: [PatientCorrespondenceComponent]
})

export class PatientCorrespondenceModule { }
