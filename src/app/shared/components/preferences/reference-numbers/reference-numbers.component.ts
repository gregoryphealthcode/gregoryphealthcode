import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridBase } from 'src/app/shared/base/grid.base';
import { ReferenceNumberTypes } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { DialogTemplateComponent } from '../../dialog/dialog-template.component';

@Component({
  selector: 'app-reference-numbers',
  templateUrl: './reference-numbers.component.html',
  styleUrls: ['./reference-numbers.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})

@AutoUnsubscribe
export class ReferenceNumbersComponent extends GridBase implements OnInit {
  public selectedRecord: any;

  referenceNumberTypes: ReferenceNumberTypes[];

  constructor(
    private siteService: SitesService,
    private spinnerService: SpinnerService,
    private appMessage: AppMessagesService
  ) {
    super();
  }  

  ngOnInit() {
    this.getReferenceNumberTypes();
  }

  getReferenceNumberTypes() {
    this.spinnerService.start();
    this.siteService.getPatientReferenceNumberTypes().subscribe(data => {
      this.referenceNumberTypes = data;
      this.spinnerService.stop();
      this.dataGrid.instance.endCustomLoading();
    });
  }

  public addClicked() {
    this.selectedRecord = { id: 0 };
  }

  public editClicked(e) {
    this.selectedRecord = { id: e.data.id };
  }

  deleteClicked(e) {
    const callback = () => {
      this.spinnerService.start();
      this.subscription.add(this.siteService.deletePatientReferenceNumberType(e.data.id).subscribe(x => {
        this.spinnerService.stop();
        if (x.success) 
          this.appMessage.showSuccessSnackBar('Patient reference number type deleted');
        else
          this.appMessage.showFailedSnackBar(x.errors[0]);
         
        this.getReferenceNumberTypes();
      },
      e => {
        this.spinnerService.stop();
        this.appMessage.showFailedSnackBar(e);
      }));
    }

    this.appMessage.showDeleteConfirmation(callback, "Are you sure you want to delete this item?");
  }
}
