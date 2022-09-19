import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { calculateAgeValue } from 'src/app/shared/helpers/other';
import { AppInfoService, PatientReferenceNumber, PatientTelecom } from 'src/app/shared/services';
import { AppointmentService, AppointmentViewModel } from 'src/app/shared/services/appointment.service';
import { Address } from 'src/app/shared/services/contact.service';
import { BasicPatientDetailsViewModel, DataPointItemsModel, PatientBalanceViewModel, PatientCorrespondenceViewModel, PatientMainInsurerViewModel, PatientNotesViewModel, PatientService, WaitingListModel } from 'src/app/shared/services/patient.service';
import { RelatedPersonService, RelatedPersonsViewModel } from 'src/app/shared/services/related-person.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import * as moment from 'moment';
import { PatientNoteModel } from 'src/app/shared/services/patient-note.service';
import { PatientAllergyModel, PatientAllergyService } from 'src/app/shared/services/patient-allergy.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CorrespondenceModel, CorrespondenceService } from 'src/app/shared/services/correspondence.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-patient-summary',
  templateUrl: './patient-summary.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
  styleUrls: ['./patient-summary.component.scss']
})
@AutoUnsubscribe
export class PatientSummaryComponent extends SubscriptionBase implements OnInit {
  constructor(
    public appInfo: AppInfoService,
    private relatedPersonService: RelatedPersonService,
    private patientService: PatientService,
    private allergyService: PatientAllergyService,
    private router: Router,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private correspondenceService: CorrespondenceService
  ) {
    super();
  }

  @Input() get basicPatientDetails(): BasicPatientDetailsViewModel {
    return this._basicPatientDetails;
  }
  set basicPatientDetails(value: BasicPatientDetailsViewModel) {
    if (value) {
      this.patientName = `${value.title} ${value.firstName} ${value.lastName}`;
    }
    this._basicPatientDetails = value;
  }

  @Input() get nextApt(): AppointmentViewModel {
    return this._nextApt;
  }
  set nextApt(value: AppointmentViewModel) {
    this._nextApt = value;
    if (value) {
      this.nextAptDate = moment(value.startDate).format('dddd Do MMM YYYY - hh:mm a');
    }
  }

  @Input() primaryAddress: Address;
  @Input() patientBalance: PatientBalanceViewModel;
  @Input() referenceNumbers: PatientReferenceNumber[];
  @Input() insurer: PatientMainInsurerViewModel;
  @Input() siteId: string;
  @Input() telecoms: PatientTelecom[];
  @Input() patientId: string;

  @Output() tabIndex = new EventEmitter<string>();
  @Output() bookAptClicked = new EventEmitter<any>();

  private _basicPatientDetails: BasicPatientDetailsViewModel;
  private _nextApt: AppointmentViewModel;

  nextAptDate: string;
  showAlertPopup: boolean = false;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  address5: string;
  postcode: string;
  patientName: string;
  allergies: PatientAllergyModel[] = [];
  intolerances: PatientAllergyModel[] = [];
  relatedPersons: RelatedPersonsViewModel = new RelatedPersonsViewModel();
  correspondence: CorrespondenceModel[] = [];
  notes: PatientNoteModel[] = [];
  waitingList: WaitingListModel[] = [];
  notedata: PatientNotesViewModel = new PatientNotesViewModel();
  showCorrespondence: boolean;
  selectedRowData: any;
  selectedIndex = 0;
  selectedItem: PatientNoteModel;
  showAppointmentPopup: boolean;
  showNewLetterPopup: boolean;
  appointmentDataItem: AppointmentViewModel;
  popupNotesData: PatientNoteModel[] = [];
  selectedLetter: any;
  action = "";

  ngOnInit() {
    /* this.getRelatedPersons();
    this.getCorrespondence();
    this.getPatientNotes();
    this.getPatientDataPoints();
    this.getPatientWaitingList(); */

    forkJoin([
      this.relatedPersonService.getNextOfKin(this.patientId),
      this.correspondenceService.getCorrespondence(this.patientId),
      this.patientService.getNotes(this.patientId),
      this.allergyService.getPatientAllergiesIntolerances(this.patientId),
      this.patientService.getPatientWaitingListEntries(this.patientId),
    ]).subscribe(([relatedPersons, correspondence, notes, allergies, waitingList]) => {
      this.relatedPersons = relatedPersons;
      this.correspondence = correspondence;
      if (notes.length > 0) {
        notes.forEach((note) => {
          if (note.warning) {
            this.notes.push(note);
          }
        });

        this.selectedItem = this.notes[this.selectedIndex];
      }
      this.allergies = allergies.filter(x => x.allergyTypeId == 1);
      this.intolerances = allergies.filter(x => x.allergyTypeId == 2);
      this.waitingList = waitingList;
    });
  }

  calcAge() {
    return calculateAgeValue(this.basicPatientDetails.birthDate);
  }

  /* getRelatedPersons() {
    this.relatedPersonService.getNextOfKin(this.patientId).subscribe(data => {
      this.relatedPersons = data;
    });
  }

  getCorrespondence() {
    this.correspondenceService.getCorrespondence(this.patientId).subscribe(data => {
      this.correspondence = data;
    });
  }

  getPatientDataPoints() {
    this.allergyService.getPatientAllergiesIntolerances(this.patientId).subscribe(data => {

      this.allergies = data.filter(x => x.allergyTypeId == 1);
      this.intolerances = data.filter(x => x.allergyTypeId == 2);
    });
  } */

  getPatientWaitingList() {
    this.patientService.getPatientWaitingListEntries(this.patientId).subscribe(data => {
      this.waitingList = data;
    })
  }

  /*
  getPatientNotes() {
    this.patientService.getNotes(this.patientId).subscribe(data => {
      if (data.length > 0) {
        data.forEach((note) => {
          if (note.warning) {
            this.notes.push(note);
          }
        });

        this.selectedItem = this.notes[this.selectedIndex];
      }
    });
  } */

  showCorrespondenceClick(e) {
    this.selectedRowData = e.row.data;
    this.showCorrespondence = true;
  }

  nextClicked() {
    const newIndex = this.selectedIndex + 1;
    if (newIndex >= this.notes.length) { return; }
    this.setItem(newIndex);
  }

  previousClicked() {
    const newIndex = this.selectedIndex - 1;
    if (newIndex < 0) { return; }
    this.setItem(newIndex);
  }

  public setItem(index: number) {
    this.selectedIndex = index;
    this.selectedItem = this.notes[index];

  }

  newAppointment() {
    this.showAppointmentPopup = true;
  }

  newInvoice() {
    const patientId = this.patientId;
    this.router.navigate(['/accounts/invoice'], { queryParams: { patientId: patientId } });
  }

  public newLetter() {
    this.action = "Add";
    this.selectedLetter = { id: 0, patientId: this.patientId };
  }

  getNextApt() {
    this.subscription.add(this.appointmentService.getNextAppointment(this.patientId).subscribe(data => {
      this.nextApt = data;
    }));
  }

  saved(e) {
    if (e.success) {
      if (this.action == "Add") {
        this.snackBar.open("Draft correspondence added", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
      }
      this.action = "";
    }
  }

  closedHandler() {
    this.getPatientWaitingList(); 
    this.showAppointmentPopup = false;
  }
}
