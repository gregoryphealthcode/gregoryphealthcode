import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { OnInit, Component, Input, Output, } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, } from '@angular/forms';
import { PatientService, BasicPatientDetailsViewModel, PatientBalanceViewModel, PatientMainInsurerViewModel, } from 'src/app/shared/services/patient.service';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { TitlesViewModel, AppInfoService, PatientTelecom, PatientReferenceNumber, } from 'src/app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AppointmentService, AppointmentViewModel } from 'src/app/shared/services/appointment.service';
import { Address } from 'src/app/shared/services/contact.service';
import { UserRecentsService } from 'src/app/shared/services/user-recents.service';
import { calculateAgeValue } from 'src/app/shared/helpers/other';
import { PatientNoteModel } from 'src/app/shared/services/patient-note.service';
import { thickness } from 'devexpress-reporting/scopes/reporting-chart-internal';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserStore } from 'src/app/shared/stores/user.store';

@Component({
  selector: 'app-patient-details',
  templateUrl: './new-patient-details.component.html',
  host: { class: 'd-flex flex-column flex-grow-1 py-3 px-4' },
  styleUrls: ['./new-patient-details.component.scss'],
})
@AutoUnsubscribe
export class NewPatientDetailsComponent extends SubscriptionBase implements OnInit {
  @Input() patientId: string;

  showAppointmentPopup: boolean;
  appointmentDataItem: AppointmentViewModel;
  isReadonly = true;
  form: FormGroup;
  payorRefControl: AbstractControl;
  totalControl: AbstractControl;
  payorControl: AbstractControl;
  payorTypeControl: AbstractControl;
  payor: string;
  total: string;
  email: string;
  basicPatientDetails: BasicPatientDetailsViewModel = new BasicPatientDetailsViewModel();
  titles: TitlesViewModel[] = [];
  patientName: string;
  notesWarning = false;
  notesPopup = false;
  showIcon = false;
  showPopupIcon = false;
  notesTabIcon = null;
  popupNotesWarningShown = false;
  popupNotesData: PatientNoteModel[] = new Array<PatientNoteModel>();
  notesCount = 0;
  isEdit = false;
  selectedPossibleDuplicate: BasicPatientDetailsViewModel;
  genders: string[] = [];
  patientBalance: PatientBalanceViewModel = new PatientBalanceViewModel();
  telecoms: PatientTelecom[] = [];
  addresses: Address[] = [];
  referenceNumbers: PatientReferenceNumber[] = [];
  showBillingAddress = false;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  address5: string;
  postcode: string;
  country: string;
  primaryAddress: Address;
  tabIndex = 0;
  tabSet = 0;
  insurer: PatientMainInsurerViewModel;
  showEditPatient: boolean;
  insuranceExpired = false;
  insuranceNearExpiry = false;
  filterValue: Array<any>;
  nextApt: AppointmentViewModel = new AppointmentViewModel();
  filteredOptions: Observable<TitlesViewModel[]>;
  myControl = new FormControl();
  showNotePreview = false;
  notesDataSource: PatientNoteModel[] = [];

  constructor(
    private patientService: PatientService,
    private siteStore: SitesStore,
    private route: ActivatedRoute,
    private router: Router,
    public appInfo: AppInfoService,
    private appointmentService: AppointmentService,
    private userRecents: UserRecentsService,
    private userStore: UserStore,
    private authService: AuthService
  ) {
    super();
    this.clearFields();
    this.appInfo.getReturnUrl(this.router.url);
    // if (this.patientId !== undefined) {
    //   this.getBasicPatientDetails();
    // }
  }

  clearFields() {
    this.nextApt = null;
    this.showAppointmentPopup = false;
    this.appointmentDataItem = null;
    this.isReadonly = true;
    this.payor = null;
    this.total = null;
    this.email = null;
    this.basicPatientDetails = null;
    this.titles = [];
    this.patientName = null;
    this.notesWarning = false;
    this.notesPopup = false;
    this.showIcon = false;
    this.showPopupIcon = false;
    this.notesTabIcon = null;
    this.popupNotesWarningShown = false;
    this.popupNotesData = [];
    this.notesCount = 0;
    this.isEdit = false;
    this.selectedPossibleDuplicate = null;
    this.genders = [];
    this.patientBalance = null;
    this.telecoms = [];
    this.addresses = [];
    this.referenceNumbers = [];
    this.showBillingAddress = false;
    this.address1 = null;
    this.address2 = null;
    this.address3 = null;
    this.address4 = null;
    this.address5 = null;
    this.postcode = null;
    this.country = null;
    this.primaryAddress = null;
    this.tabIndex = 0;
    this.tabSet = 0;
    this.insurer = null;
    this.showEditPatient = false;
    this.insuranceExpired = false;
    this.insuranceNearExpiry = false;
    this.nextApt = null;
    this.showNotePreview = false;
    this.notesDataSource = [];
  }

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.subscribe(params => {
        this.patientId = params.patientid;
        if (this.patientId !== undefined && this.patientId !== null) {
          this.isEdit = true;
          this.getPatientDetails();
          this.getPatientNotes();
        }

        this.updatePatientSelected();
      }));

    this.getPatientMainInsurer();

    if (sessionStorage.getItem('tabIndex')) {
      this.tabIndex = +sessionStorage.getItem('tabIndex');
      sessionStorage.removeItem('tabIndex');
    }
  }

  private isInsuranceExpired(val) {
    this.insuranceNearExpiry = false;
    this.insuranceExpired = false;

    var numOfDays = ((Date.parse(val)).valueOf() - Date.now().valueOf()) / (1000 * 3600 * 24);

    if (numOfDays <= 0)
      this.insuranceExpired = true;
    else if (numOfDays > 0 && numOfDays <= 30)
      this.insuranceNearExpiry = true;
    else
      this.insuranceExpired = false;
  }

  getPatientMainInsurer() {
    this.subscription.add(this.patientService.getPatientMainInsurer(this.patientId).subscribe(data => {
      this.insurer = data;
      this.isInsuranceExpired(this.insurer.expiryDate);
    }));
  }

  private getPatientDetails() {
    this.getBasicPatientDetails();
    this.getExtraInformation();
  }

  updatePatientSelected() {
    if (this.patientId !== undefined) {
      this.userRecents.addUserLastXPatients(this.patientId).subscribe(() => {
      },
        error => {
        }
      );
    }
  }

  getPatientReferenceNumbers() {
    this.patientService.getPatientReferenceNumbers(this.patientId).subscribe(data => {
      this.referenceNumbers = data;
    })
  }

  getBasicPatientDetails() {
    this.tabIndex = 0;
    this.subscription.add(this.patientService.getBasicPatientDetails(this.patientId).subscribe((data) => {
      this.basicPatientDetails = data;
      this.patientName = `${this.basicPatientDetails.lastName}, ${this.basicPatientDetails.firstName} ${this.basicPatientDetails.title}`;
    }));
  }

  getExtraInformation() {
    forkJoin([
      this.patientService.getPatientBalance(this.patientId),
      this.patientService.getPatientTelecoms(this.patientId),
      this.patientService.getPatientReferenceNumbers(this.patientId),
      this.patientService.getAddresses(this.patientId),
      this.appointmentService.getNextAppointment(this.patientId),
    ]).subscribe(([balance, telecoms, referenceNumbers, address, nextApt]) => {
      this.telecoms = telecoms.filter(x => x.primary);
      this.patientBalance = balance;
      this.referenceNumbers = referenceNumbers;
      this.addresses = address;
      this.nextApt = nextApt;
      this.showAddress();
    });
  }

  showAddress() {
    for (const i in this.addresses) {
      if (this.addresses[i].primaryAddress === true) {
        this.primaryAddress = this.addresses[i];
      }
    }
  }

  getGenders() {
    this.genders = this.appInfo.getGenders();
  }

  calculate_age(dob: Date) {
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }

  getAge() {
    return this.calculate_age(new Date(this.basicPatientDetails.birthDate));
  }

  patientEditClosed(saved: boolean) {
    if (saved) {
      this.getBasicPatientDetails();
    }
  }

  close() {
    if (this.userStore.isMedSecUser()) {
      this.unselectSite(this.router.navigate(['/medsec/patient-list']));
    } else {
      this.router.navigate(['/patient-list']);
    }
  }

  new() {
    this.router.navigate(['/patient-details']);
  }

  setTab(value) {
    this.tabIndex = value;
    switch (value) {
      case 'Address':
        this.tabIndex = 1;
        break;
      case 'Allergies':
        this.tabIndex = 6;
        break;
      case 'Appointment':
        this.tabIndex = 12;
        break;
      case 'Balance':
        this.tabIndex = 8;
        this.tabSet = 2;
        break;
      case 'Contact':
        this.tabIndex = 3;
        break;
      case 'Correspondence':
        this.tabIndex = 9;
        break;
      case 'Documents':
        this.tabIndex = 9;
        break;
      case 'Insurer':
        this.tabIndex = 5;
        break;
      case 'Notes':
        this.tabIndex = 10;
        break;
      case 'Reference':
        this.tabIndex = 7;
        break;
      case 'Related':
        this.tabIndex = 4;
        break;
      case 'Summary':
        this.tabIndex = 0;
        break;
      case 'Tasks':
        this.tabIndex = 11;
        break;
      case "WaitingList":
        this.tabIndex = 13;
        break;
    }
  }

  indexValue(e) {
    this.tabIndex = e;

    if (this.tabIndex == 0)
      this.getPatientDetails();
  }

  warnPatientNotesPopupShown() {
    this.popupNotesWarningShown = true;
  }

  getPatientNotes() {
    this.subscription.add(this.patientService.getNotes(this.patientId).subscribe(data => {
      this.notesDataSource = data;
      this.showNotePreview = false;

      if (this.notesDataSource.length > 0) {
        this.showNotePreview = true;
      }

      const notedata = this.notesDataSource;
      this.NotesLoaded(notedata);
    }));
  }

  NotesLoaded(e) {
    if (e == null)
      return this.getPatientNotes();

    this.popupNotesData = new Array<PatientNoteModel>();
    let notesCount = 0;
    this.notesPopup = false;
    this.notesWarning = false;

    try {
      e.forEach((note) => {
        notesCount++;
        if (note.warning) {
          this.notesWarning = true;
        }
        if (note.popup) {
          this.notesPopup = true;
          this.popupNotesData.push(note);
        }
      });
    } catch (ex) {
    }

    const tabicon = this.getNotesTabIcon();
    this.notesCount = notesCount;
  }

  getNotesTabIcon() {
    if (this.notesWarning === true) {
      this.showPopupIcon = true;
      this.showIcon = true;
    }
    else {
      this.showPopupIcon = false;
      this.showIcon = false;;
    }
  }

  editDetails() {
    this.showEditPatient = true;
  }

  calcAge() {
    if (this.basicPatientDetails)
      return calculateAgeValue(this.basicPatientDetails.birthDate);
  }

  newAppointment() {
    this.showAppointmentPopup = true;
  }

  update() {
    this.subscription.add(this.appointmentService.getNextAppointment(this.patientId).subscribe(data => {
      this.nextApt = data;
    }));
  }

  insurerChangedHandler() {
    this.getPatientMainInsurer();
  }

  referenceChangedHandler() {
    this.getPatientReferenceNumbers();
  }

  closedAppHandler() {
    this.showAppointmentPopup = false;
  }

  private unselectSite(callback?) {
    if (this.userStore.isMedSecUser()) {
      this.subscription.add(
        this.authService.unselectSite().subscribe(() => {
          if (callback) {
            callback();
          }
        })
      );
    }
  }
}