import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridBase } from 'src/app/shared/base/grid.base';
import { DialogTemplateComponent } from 'src/app/shared/components/dialog/dialog-template.component';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { DocumentTypeModel, PatientDocumentService } from 'src/app/shared/services/patient-document-service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-preferences-document-types',
  templateUrl: './preferences-document-types.component.html',
  styleUrls: ['./preferences-document-types.component.scss']
})
export class PreferencesDocumentTypesComponent extends GridBase implements OnInit {
  documentTypes: DocumentTypeModel[];
  selectedRecord: any;
  showInactive = false;

  constructor(
    private patientDocumentService: PatientDocumentService,
    private changeDetectorRef: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog, public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit() {
    this.getDocumentTypes();
  }

  getDocumentTypes() {
    this.patientDocumentService.getDocumentTypes().subscribe(data => {
      this.documentTypes = data;
      this.dataGrid.instance.endCustomLoading();
      this.changeDetectorRef.detectChanges();
    });
  }

  public addClicked() {
    this.selectedRecord = { id: 0 };
  }

  public editClicked(e) {
    this.selectedRecord = { id: e.data.documentTypeId };
  }

  deleteClicked(e) {
    const dialogRef = this.dialog.open(DialogTemplateComponent, {
      width: '250px',
      data: {
        title: 'Are you sure?',
        message: 'Are you sure you want to delete this item?',
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.spinnerService.start();
        this.subscription.add(this.patientDocumentService.deleteDocumentType(e.data.documentTypeId).subscribe(data => {
          if (data.success) {
            this.snackBar.open('Document type deleted', 'Close', {
              panelClass: 'badge-success',
              duration: 3000,
            });
          }
          else {
            this.snackBar.open(data.errors[0], 'Close', {
              panelClass: 'badge-danger',
              duration: 3000,
            });
          }
          this.spinnerService.stop();
          this.getDocumentTypes();
        }));
      }
    });
  }
}
