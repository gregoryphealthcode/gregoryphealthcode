import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { Component, OnInit, Input, EventEmitter, Output, } from '@angular/core';
import { PatientService, BasicPatientDetailsViewModel, } from 'src/app/shared/services/patient.service';
import { SitesService } from 'src/app/shared/services/sites.service';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { AppInfoService, } from 'src/app/shared/services';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { showSuccessSnackbar, showErrorSnackbar } from 'src/app/shared/helpers/other';
import { DialogTemplateComponent } from 'src/app/shared/components/dialog/dialog-template.component';
import { MatDialog } from '@angular/material/dialog';
import { EditPatientRequest } from 'src/app/shared/models/AddEditPatientRequestBase';
import { AddEditPatientBase } from 'src/app/shared/components/patient-add-edit-popup/patient-add-edit-base';

@Component({
  selector: 'app-patient-details-edit',
  templateUrl: './patient-details-edit.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
  styleUrls: ['./patient-details-edit.component.scss'],
})
@AutoUnsubscribe
export class PatientDetailsEditComponent extends AddEditPatientBase implements OnInit {
  constructor(
    public siteService: SitesService,
    private siteStore: SitesStore,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    public appInfo: AppInfoService,
    public patientService: PatientService,
    private dialog: MatDialog,
    private router: Router
  ) {
    super(siteService, appInfo, patientService);
    this.eventOptions = {
      max: new Date(),
    };
  }

  @Input() basicPatientDetails: BasicPatientDetailsViewModel;

  @Output() closeDialog = new EventEmitter<boolean>();

  isDeceased = false;
  isInactive = false;
  eventOptions: any;
  maxDate = new Date();
  isSitePatientzone: boolean;

  httpRequest = (x: any) => {
    let isFuture = new Date(x.birthDate).getTime() > new Date().getTime();
    if (isFuture) {
      x.birthDate = new Date();
    }

    isFuture = new Date(x.deceasedDate).getTime() > new Date().getTime();
    if (isFuture) {
      x.deceasedDate = new Date();
    }

    return this.patientService.editPatientDetails(x)
  };

  ngOnInit(): void {
    this.onSuccessfullySaved = this.onSaved;

    this.getSitePatientzone();

    this.subscription.add(
      this.getTitles$().subscribe()
    );

    this.setupForm();

    if (this.basicPatientDetails !== undefined) {
      this.populateForm();
    }

    this.subscribeToDateOfBirthChanges();
    this.subscribeToDateOfDeathChanges();
    //setTimeout((x)=>{document.querySelector("div[data-automation]").(Input).focus();},750);
  }

  isNumber(value) {
    return Number(value);
  }

  getSitePatientzone() {
    this.siteService.getSitePatientzone().subscribe(data => {
      this.isSitePatientzone = data;
    })
  }

  private setupForm() {
    this.editForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(50)]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(50)]),
      birthDate: new FormControl(null, [Validators.required, this.dateValidator()]),
      inactive: new FormControl(false, null),
      deceased: new FormControl(false, null),
      gender: new FormControl(null, Validators.required),
      identifiesAs: new FormControl(null, null),
      title: new FormControl(null, [Validators.required]),
      initials: new FormControl(null, Validators.maxLength(10)),
      sendViaPatientzone: new FormControl(null, null),
      noChase: new FormControl(null, null),
      onStop: new FormControl(null, null),
      inactiveReason: new FormControl(null, Validators.maxLength(25)),
      deceasedDate: new FormControl(null, null),
    });
  }

  populateForm() {
    this.editForm.patchValue({
      firstName: this.basicPatientDetails.firstName,
      lastName: this.basicPatientDetails.lastName,
      title: this.basicPatientDetails.title,
      birthDate: this.basicPatientDetails.birthDate,
      inactive: this.basicPatientDetails.inactive,
      deceased: this.basicPatientDetails.deceased ?? false,
      gender: this.basicPatientDetails.gender,
      identifiesAs: this.basicPatientDetails.identifiesAs,
      initials: this.basicPatientDetails.otherInitials === undefined ? '' : this.basicPatientDetails.otherInitials,
      noChase: this.basicPatientDetails.noChase,
      onStop: this.basicPatientDetails.onStop,
      sendViaPatientzone: this.basicPatientDetails.sendViaPatientzone,
      inactiveReason: this.basicPatientDetails.inactiveReason,
      deceasedDate: this.basicPatientDetails.deceasedDate,
    });
    this.isDeceased = this.basicPatientDetails.deceased;
    this.isInactive = this.basicPatientDetails.inactive;
  }

  getModelFromForm() {
    const model = super.getModelFromForm();
    return new EditPatientRequest(model, this.basicPatientDetails.patientId.toString());
  }

  private onSaved(data) {
    this.closeDialog.emit(true);
  }

  close() {
    this.closeDialog.emit(false);
  }

  deceasedChanged(e) {
    this.isDeceased = e.value;
  }

  inactiveChanged(e) {
    this.isInactive = e.value;
  }

  delete() {
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogTemplateComponent, {
      width: '250px',
      data: { title: 'Are you sure?', message: 'Are you sure you want to delete this Patient?' },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.spinnerService.start();
        this.subscription.add(this.patientService.deletePatient(this.basicPatientDetails.patientId.toString()).subscribe(data => {
          if (data) {
            showSuccessSnackbar(this.snackBar, 'Patient successfully deleted');
            this.spinnerService.stop();
            this.router.navigate(['/patient-list']);
          }
          else {
            this.snackBar.open("It is not possible to delete this patient as they have invoices/notes/letters/appointments or other items recorded.  Please edit the patient and mark them as 'Inactive' to hide them from the Patient List.", 'Close', {
              panelClass: 'badge-danger',
              duration: 3000,
            });
          }
        },
          (error) => {
            this.snackBar.open("Unable to delete patient as an Invoice, Appointment or Note exists. Mark this patient as 'Inactive' to hide it from the patient list.", 'Close', {
              panelClass: 'badge-danger',
              duration: 3000,
            });
            this.spinnerService.stop();
          }));
      }
    });
  }

  dateValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const todaysTime = new Date().getTime();
      if (!(control && control.value)) {
        return null;

      }
      const d = new Date(control.value).getTime();
      return d > todaysTime
        ? { invalidDate: 'You cannot use future dates' }
        : null;
    }
  }
}
