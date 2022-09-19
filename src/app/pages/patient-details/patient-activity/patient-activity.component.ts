import { NgModule, Component, OnInit, Input } from '@angular/core';
import {
  DxContextMenuModule, DxBoxModule, DxDataGridModule, DxButtonModule, DxCheckBoxModule, DxFormModule, DxDropDownBoxModule,
  DxFileUploaderModule, DxDateBoxModule, DxTextAreaModule, DxListModule, DxTextBoxModule, DxResponsiveBoxModule,
  DxSelectBoxModule, DxPopupModule, DxRangeSelectorModule, DxResizableModule, DxScrollViewModule, DxSwitchModule
} from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GridBase } from 'src/app/shared/base/grid.base';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-patient-activity',
  templateUrl: './patient-activity.component.html',
  styleUrls: ['./patient-activity.component.scss']
})
@AutoUnsubscribe
export class PatientActivityComponent extends GridBase implements OnInit {
  @Input() patientId: string;

  isSummary = true;
  searchTerm: string;
  private searchTerms = new BehaviorSubject<string>(undefined);

  constructor
    (
    ) {
    super();
  }

  ngOnInit() {
    this.getAcitivityLogs();

    this.subscription.add(
      this.searchTerms
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap((x) => {
            if (x !== undefined) this.refreshData();
          })
        )
        .subscribe()
    );
  }

  getAcitivityLogs() {
    this.controllerUrl = `${environment.baseurl}/patientActivityLog/`;
    this.setupDataSource({
      key: 'systemLogId',
      loadParamsCallback: () => [
        { name: 'searchTerm', value: this.searchTerm },
        { name: 'patientId', value: this.patientId },
        { name: 'isSummary', value: this.isSummary },
      ],
    });
  }

  refreshDataGrid() {
    this.refreshData();
  }

  summaryChanged(e) {
    this.isSummary = !this.isSummary;
    this.refreshData();
  }

  doSearch() {
    this.searchTerms.next(this.searchTerm);
  }

  calculateAgo(date) {
    return Math.floor(Math.abs(new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24));
  }
}

@NgModule({
  imports: [DxBoxModule, DxButtonModule, DxContextMenuModule, DxCheckBoxModule,
    CommonModule, DxFormModule, DxDropDownBoxModule, DxFileUploaderModule, DxButtonModule, DxDataGridModule, DxPopupModule,
    DxDateBoxModule, DxTextAreaModule, DxListModule, DxTextBoxModule, DxResponsiveBoxModule, MomentModule,
    DxSelectBoxModule, DxRangeSelectorModule, DxResizableModule, DxScrollViewModule, DxPopupModule, GridSearchTextBoxModule, AppButtonModule, MatCheckboxModule,
    MatIconModule, MatButtonModule, MatTooltipModule, DxSwitchModule, MatInputModule, MatSelectModule, DirectivesModule, MatFormFieldModule],
  declarations: [PatientActivityComponent],
  exports: [PatientActivityComponent]
})

export class PatientActivityModule { }
