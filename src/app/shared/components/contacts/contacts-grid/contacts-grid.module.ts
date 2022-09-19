import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DxDataGridModule, DxPopupModule, DxSelectBoxModule } from 'devextreme-angular';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { ContactDetailConnectionsComponent } from './contact-detail-connections/contact-detail-connections.component';
import { ContactsGridComponent } from './contacts-grid.component';
import { FormsModule } from '@angular/forms';
import { PopUpFormModule } from '../../pop-up-form/pop-up-form.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [ContactsGridComponent, ContactDetailConnectionsComponent],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    GridSearchTextBoxModule,
    DxDataGridModule,
    DxPopupModule,
    DxSelectBoxModule,
    FormsModule,
    DirectivesModule,
    AppButtonModule,
    PopUpFormModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule
  ],
  exports: [ContactsGridComponent]
})
export class ContactsGridModule { }
