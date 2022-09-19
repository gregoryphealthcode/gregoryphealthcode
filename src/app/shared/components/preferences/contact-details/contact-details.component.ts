import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ReactiveFormBase } from "src/app/shared/base/reactiveForm.base";
import { TelecomTypes } from "src/app/shared/services";
import { SitesService } from "src/app/shared/services/sites.service";
import { SpinnerService } from "src/app/shared/services/spinner.service";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { DialogTemplateComponent } from "../../dialog/dialog-template.component";

@Component({
  selector: 'app-preference-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls : ['./contact-details.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})

@AutoUnsubscribe
export class PreferenceContactDetailsComponent extends ReactiveFormBase implements OnInit {
  constructor(
    private siteService : SitesService,
    private spinnerService : SpinnerService,
    private snackBar : MatSnackBar,
    private dialog: MatDialog,
    private changeDetection : ChangeDetectorRef,
    ) {
    super();
  }

  @Input() siteId : string;

  editForm: FormGroup;
  telecomTypes : TelecomTypes[];
  selectedItemNo: number;
  showDetails = false;
  isNew = false;

  httpRequest = x => {
    this.spinnerService.start();
    x.uniqueNo = this.selectedItemNo;
    if (this.isNew)
      return this.siteService.addTelecomType(x);
    else
      return this.siteService.updateTelecomType(x);
  }

  onSuccessfullySaved = x => {
    if (this.isNew) {
      if (x.success) {
        this.snackBar.open('Telecom type added', 'Close', {
          panelClass: 'badge-success',
          duration: 3000,
        });
      }
      else {
        this.snackBar.open(x.errors[0], 'Close', {
          panelClass: 'badge-danger',
          duration: 3000,
        });
      }
    }
    else {
      if (x.success) {
        this.snackBar.open('Telecom type updated', 'Close', {
          panelClass: 'badge-success',
          duration: 3000,
        });
      }
      else {
        this.snackBar.open(x.errors[0], 'Close', {
          panelClass: 'badge-danger',
          duration: 3000,
        });
      }
    }
    this.spinnerService.stop();
    this.getTelecomTypes();
  }

  ngOnInit() {
    this.getTelecomTypes();
    this.setupForm();
  }

  getTelecomTypes()
  {
    this.spinnerService.start();
    this.siteService.getTelecomTypes().subscribe(data => {
      this.telecomTypes = data;
      this.spinnerService.stop();
      this.changeDetection.detectChanges();
    });
  }

  private setupForm() {
    this.editForm = new FormGroup({
      telecomType: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      description: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      alwaysAdd: new FormControl(null, null),
      numericOnly: new FormControl(null, null),
      active: new FormControl(null, null)
    });
  }

  onFocusedRowChanged(e) {
    this.showDetails = true;
    this.isNew = false;
    this.selectedItemNo = e.row.data.uniqueNo;
    super.populateForm(e.row.data);
    this.changeDetection.detectChanges();
  }

  addNew() {
    this.showDetails = true;
    this.isNew = true;
    var next = this.telecomTypes[this.telecomTypes.length - 1].telecomType + 1;
    this.editForm.reset();
    this.editForm.patchValue({ active: true });
    this.editForm.patchValue({ telecomType: next})
    this.changeDetection.detectChanges();
  }

  delete(e) {
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
        this.subscription.add(this.siteService.deleteTelecomType(e.data.uniqueNo).subscribe(x => {
          if (x.success) {
            this.snackBar.open('Telecom type deleted', 'Close', {
              panelClass: 'badge-success',
              duration: 3000,
            });
          }
          else {
            this.snackBar.open(x.errors[0], 'Close', {
              panelClass: 'badge-danger',
              duration: 3000,
            });
          }
          this.spinnerService.stop();
          this.getTelecomTypes();
        }));
      }
    });
  }

  close() {
    this.editForm.reset();
    this.showDetails = false;
  }
}
