import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { InvoiceServicesSelectComponent } from './invoice-services-select.component';
import { ServicesGridComponent } from './services-grid/services-grid.component';
import { ServiceProcedureComponent } from './service-procedure/service-procedure.component';
import { ServiceAddEditComponent } from './service-add-edit/service-add-edit.component';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { DxDataGridModule, DxDateBoxModule, DxNumberBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InvoiceServicesViewComponent } from './invoice-services-view/invoice-services-view.component';
import { MatInputModule } from '@angular/material/input';
import { DirectivesModule } from '../../directives/directives.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppFormModule } from '../app-form/app-form.module';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [InvoiceServicesSelectComponent, ServicesGridComponent, ServiceProcedureComponent, ServiceAddEditComponent,
    InvoiceServicesViewComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppButtonModule,
    DxDataGridModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    DirectivesModule,
    MatTooltipModule,
    AppFormModule
  ],
  exports: [InvoiceServicesSelectComponent, InvoiceServicesViewComponent],
})
export class InvoiceServicesSelectModule { }


