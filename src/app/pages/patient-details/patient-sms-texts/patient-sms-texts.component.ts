import { NgModule, Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { DxFormModule, DxButtonModule, DxPopupModule, DxBoxModule, DxCheckBoxModule, DxDataGridModule, DxContextMenuModule, DxSwitchModule, DxToolbarModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { AppInfoService } from 'src/app/shared/services';
import { UserStore } from 'src/app/shared/stores/user.store';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { PatientService, PatientSmsTextViewModel } from 'src/app/shared/services/patient.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { GridBase } from 'src/app/shared/base/grid.base';
import { PatientSmsSendBtnModule } from 'src/app/shared/components/patients/patient-sms-send-btn/patient-sms-send-btn.module';

@Component({
  selector: 'app-patient-sms-texts',
  templateUrl: './patient-sms-texts.component.html',
  styleUrls: ['./patient-sms-texts.component.scss']
})
@AutoUnsubscribe
export class PatientSmsTextsComponent extends GridBase implements OnInit {
  @Input() patientId: string;
  @Input() patientName: string;

  showPopup: boolean;
  dataSource2: PatientSmsTextViewModel[] = [];

  constructor(
    public appInfo: AppInfoService,
    public userStore: UserStore,
    private patientService: PatientService,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.getSmsTexts();
  }

  getSmsTexts() {
    this.patientService.getSmsTexts(this.patientId).subscribe(data => {
      this.dataSource2 = data;
      this.dataGrid.instance.endCustomLoading();
      this.cd.detectChanges();
    });
  }

  sendSMS() {
    this.showPopup = true;
  }

  sentSmsHandler(e) {
    this.showPopup = false;
    this.refreshData();
  }

  refreshData() {
    this.getSmsTexts();
  }
}

@NgModule({
  declarations: [PatientSmsTextsComponent],
  imports: [
    DxDataGridModule, DxBoxModule, DxButtonModule, DxContextMenuModule, DxCheckBoxModule,
    CommonModule, DxFormModule, DxSwitchModule, DxToolbarModule, DxPopupModule,
    MatIconModule, MatButtonModule, MatTooltipModule, MatInputModule, MatFormFieldModule,
    PopUpFormModule, DirectivesModule, AppFormModule, GridSearchTextBoxModule, AppButtonModule, PatientSmsSendBtnModule
  ],
  exports: [PatientSmsTextsComponent]
})

export class PatientSmsTextsModule { }
