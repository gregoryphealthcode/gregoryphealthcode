import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Guid from 'devextreme/core/guid';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { PatientService } from 'src/app/shared/services/patient.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-patient-waiting-list',
  templateUrl: './patient-waiting-list.component.html',
  styleUrls: ['./patient-waiting-list.component.scss']
})
export class PatientWaitingListComponent extends GridBase implements OnInit {
  @Input() patientId: Guid;

  selectedRecord: any;

  constructor(
    private spinner: SpinnerService,
    private snackBar: MatSnackBar,
    private appMessages: AppMessagesService,
    private patientService: PatientService,
    public appInfo: AppInfoService
  ) {
    super();
   }

  ngOnInit() {
   
  }
}
