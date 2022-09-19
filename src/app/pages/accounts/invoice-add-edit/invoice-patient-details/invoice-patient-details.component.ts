import { OnInit, Component, ViewChild, Input, ChangeDetectorRef, Output, EventEmitter, } from "@angular/core";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { AppInfoService, PatientAddress, PatientDetailsModel, } from "src/app/shared/services";
import { PatientInsurerViewModel, } from "src/app/shared/services/patient.service";
import { SubscriptionBase } from "src/app/shared/base/subscribtion.base";
import { Address } from "src/app/shared/services/contact.service";
import { ErrorData } from "src/app/shared/models/ErrorData";
import { BehaviorSubject, } from "rxjs";
import { debounceTime, filter, switchMap } from "rxjs/operators";
import { NewPatientSearchComponent } from "src/app/pages/new-patient-search/new-patient-search.component";
import { InvoiceAddEditStoreService } from "../invoice-add-edit-store.service";

@Component({
  selector: "app-invoice-patient-details",
  templateUrl: "./invoice-patient-details.component.html",
  styleUrls: ["./invoice-patient-details.component.scss"],
})
@AutoUnsubscribe
export class InvoicePatientDetailsComponent extends SubscriptionBase implements OnInit {
  @Input() siteId: string;
  @Input() errors: ErrorData[];
  @Input() disabled = false;
  @Input() sitePZEnabled = false;
  @Input() isDirty: boolean;
  @Input() status: string;
  @Input() patientDetails: PatientDetailsModel;
  @Input() hideButtons = false;

  @Output() patientDetailsChange = new EventEmitter<PatientDetailsModel>();
  @Output() showPatientDetails = new EventEmitter();

  @ViewChild(NewPatientSearchComponent) child: NewPatientSearchComponent;

  showPatientDetailsPopup: boolean;
  selectedAddress: Address;
  setFocus: boolean;
  showNextButton: boolean;
  showPreviousButton = false;
  searchButton: any;
  isNew = false;
  appointmentId: string;
  searchFor = "";
  fullName: string;
  isContactShown = false;
  isInsurer = false;
  fromInsurer = true;
  isEmailNew = false;
  selectedItem: number;
  billingAddress: PatientAddress;
  _patientId: string;
  addInsurer = false;
  insurerDetails: PatientInsurerViewModel;
  isNewAddress = false;
  searchTerms = new BehaviorSubject<string>(undefined);
  showPatientSearch: boolean;
  showAddPatient: boolean;
  editableSectionIndex: number;
  patientId: string;

  constructor(
    public appInfo: AppInfoService,
    private changeDetectorRef: ChangeDetectorRef,
    private store: InvoiceAddEditStoreService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.searchTerms
        .pipe(
          filter((x) => x !== undefined),
          debounceTime(1000),
          switchMap((term: string) => {
            this.showPatientSearch = true;
            this.changeDetectorRef.detectChanges();
            return term;
          })
        )
        .subscribe()
    );

    this.subscription.add(
      this.store.invoicePatientDetails$.subscribe(x => {
        if (x) {
          this.patientId = x.patientId.toString();
          this.fullName = x.lastName.toUpperCase() + ", " + x.firstName;
          this.searchFor = this.fullName;
        }
        else {
          this.searchFor = '';
          this.fullName = '';
        }

      })
    )

    this.subscription.add(
      this.store.sectionManager.editableSectionIndex$.subscribe(x => this.editableSectionIndex = x)
    )
  }

  search() {
    this.showPatientSearch = true;
  }

  addNewPatient() {
    this.showAddPatient = true;
  }

  public onSearchEnterPressedHandler() {
    this.showPatientSearch = true;
  }

  loadPatient(myPatientId) {
    this.store.setPatientId(myPatientId);
  }

  newPatient(myPatientId) {
    this.loadPatient(myPatientId);
    this.store.setSectionOnEdit(2);
  }

  handleInput() {
    this.searchTerms.next(this.searchFor);
  }

  calculateAge(dob) {
    const timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
    const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    return age;
  }

  public onSearchTabPressedHandler(e) {
    if (e.target.value.length > 0) {
      this.setFocus = true;
      e.preventDefault();
    }
  }
}