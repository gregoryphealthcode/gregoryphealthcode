import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { GridBase } from "src/app/shared/base/grid.base";
import { DialogTemplateComponent } from "src/app/shared/components/dialog/dialog-template.component";
import { lluContactTypeModel, ContactService } from "src/app/shared/services/contact.service";
import { SpinnerService } from "src/app/shared/services/spinner.service";


@Component({
  selector: 'app-preferences-contact-types',
  templateUrl: './preferences-contact-types.component.html',
  styleUrls: ['./preferences-contact-types.component.scss']
})
export class PreferencesContactTypesComponent extends GridBase implements OnInit {
  contactTypes: lluContactTypeModel[];
  selectedRecord: any;
  showInactive = false;

  constructor(
    private contactService: ContactService,
    private changeDetectorRef: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit() {
    this.getContactTypes();
  }

  getContactTypes() {
    this.contactService.getLocalContactTypes().subscribe(data => {
      this.contactTypes = data;
      this.dataGrid.instance.endCustomLoading();
      this.changeDetectorRef.detectChanges();
    })
  }

  getBackgroundColor(cellInfo) {
    return cellInfo.data.backgroundColor;
  }

  public addClicked() {
    this.selectedRecord = { id: 0 };
  }

  public editClicked(e) {
    this.selectedRecord = { id: e.data.id };
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
        this.subscription.add(this.contactService.deleteContactType(e.data.id).subscribe(data => {
          if (data.success) {
            this.snackBar.open('Contact type deleted', 'Close', {
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
          this.getContactTypes();
        }));
      }
    });
  }
}