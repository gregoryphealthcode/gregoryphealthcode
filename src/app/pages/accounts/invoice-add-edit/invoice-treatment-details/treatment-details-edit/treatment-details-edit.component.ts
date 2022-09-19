import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ReactiveFormBase } from "src/app/shared/base/reactiveForm.base";
import { requiredIfValidator } from "src/app/shared/helpers/form-helper";
import { SpecialistViewModel } from "src/app/shared/models/SpecialistViewModel";
import { AppInfoService } from "src/app/shared/services";
import { AppointmentListViewModel, AppointmentService } from "src/app/shared/services/appointment.service";
import { DischargeCodesViewModel, EpisodeTypes, UserService } from "src/app/shared/services/user.service";
import { UserStore } from "src/app/shared/stores/user.store";
import { InvoiceAddEditStoreService } from "../../invoice-add-edit-store.service";
import { GetInvoiceEpisodeDetailsResponse, GluEpisodeTypeEnum } from "../../invoice-add-edit.service";

@Component({
  selector: "app-treatment-details-edit",
  templateUrl: "./treatment-details-edit.component.html",
  styleUrls: ["./treatment-details-edit.component.scss"],
})
export class TreatmentDetailsEditComponent extends ReactiveFormBase implements OnInit, OnChanges {
  private siteId: string;
  public recordAdmitDate = false;
  public recordDischargeDate = false;
  public recordDischargeCode = false;
  public recordLocation = true;
  public showAdmitDate = false;
  public showLocation = false;
  public showDischargeDate = false;
  public showDischargeCode = false;
  public owners: SpecialistViewModel[];
  public dischargeCodes: DischargeCodesViewModel[] = [];
  public locations: AppointmentListViewModel[] = [];
  public episodeTypes: EpisodeTypes[] = [];
  public admissionDate = new Date();
  public dischargeDate = new Date();
  public selectedEpisodeType;
  public showEpisode = false;
  public saving;
  future = new Date();
  maxDate = this.future.setDate(this.future.getDate() + 30);

  @Input() isViewVisible: any;
  @ViewChild('gouprOne') gouprOneSelector: ElementRef;

  constructor(
    private store: InvoiceAddEditStoreService,
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private userStore: UserStore,
    private userService: UserService,
    public appInfo: AppInfoService,
  ) {
    super();
  }

  protected httpRequest: (x: any) => Observable<any>;

  ngOnInit() {
    this.setupForm();
    this.siteId = this.userStore.getSiteId();

    this.addToSubscription(this.store.invoiceEpisodeDetails$.pipe(
      tap((x) => {
        if (this.saving != true) {
          if (x) {
            this.selectedEpisodeType = this.episodeTypes.find(y => y.episodeTypeId == x.episodeTypeId);
            this.recordAdmitDate = this.store.isInsurer;
            this.recordDischargeDate = this.store.isInsurer && (x.episodeTypeId === GluEpisodeTypeEnum.Daycase || x.episodeTypeId === GluEpisodeTypeEnum.Inpatient);
            this.recordDischargeCode = this.store.isInsurer && (x.episodeTypeId === GluEpisodeTypeEnum.Daycase || x.episodeTypeId === GluEpisodeTypeEnum.Inpatient);
            this.recordLocation = this.store.isInsurer && x.episodeTypeId !== GluEpisodeTypeEnum.ConsultingRooms;
            this.showDischargeCode = x.episodeTypeId === GluEpisodeTypeEnum.Daycase || x.episodeTypeId === GluEpisodeTypeEnum.Inpatient;
            this.showDischargeDate = x.episodeTypeId === GluEpisodeTypeEnum.Daycase || x.episodeTypeId === GluEpisodeTypeEnum.Inpatient;
            this.showEpisode = x.episodeTypeId === GluEpisodeTypeEnum.Daycase || x.episodeTypeId === GluEpisodeTypeEnum.Inpatient;
            this.showAdmitDate = true;
            this.showLocation = true;

            this.editForm.get('dischargeCodeId').updateValueAndValidity();
            this.editForm.get('admissionDate').updateValueAndValidity();
            this.editForm.get('dischargeDate').updateValueAndValidity();
            this.editForm.get('dischargeCodeId').updateValueAndValidity();
            this.editForm.get('locationId').updateValueAndValidity();
            this.populateForm(x);
          }
          else {
            this.showAdmitDate = false;
            this.showDischargeCode = false;
            this.showDischargeDate = false;
            this.showEpisode = false;
            this.showAdmitDate = false;
            this.showLocation = false;
          }
        }
      }))
    );

    this.addToSubscription(this.store.invoicePatientDetails$.pipe(tap((x) => { if (x) this.siteId = x.siteId.toString() })));

    this.addToSubscription(this.userService.getEpisodeTypes().pipe(tap((x) => {
      this.episodeTypes.push(x.find(y => y.description == "Daycase"));
      this.episodeTypes.push(x.find(y => y.description == "Inpatient"));
      this.episodeTypes.push(x.find(y => y.description == "Outpatient"));
      this.episodeTypes.push(x.find(y => y.description == "Consulting Rooms"));
      this.episodeTypes.push(x.find(y => y.description == "Other"));
      this.episodeTypes.push(x.find(y => y.description == "Cash Benefit"));
      this.episodeTypes.push(x.find(y => y.description == "Nursing Home"));
    })));

    this.addToSubscription(this.userService.getDischargeCodes().pipe(tap((x) => this.dischargeCodes = x)));

    this.addToSubscription(this.userService.getConsultantsForSite().pipe(tap((x) => this.owners = x)));

    const locations$ = this.appointmentService.getAppointmentLocations(this.siteId).pipe(tap((x) => {
      this.locations = x
      if (this.locations.length === 0) {
        //this.setFormPropertyValue('episodeTypeId', GluEpisodeTypeEnum.CashBenefit);
      }
      if (this.locations.length === 1) {
        this.setFormPropertyValue('locationId', this.locations[0].id);
      }
    }));

    this.addToSubscription(locations$);

    const episodeTypeChanges$ = this.editForm.get('episodeTypeId').valueChanges.pipe(
      tap(x => {
        if (this.saving != true) {
          if (!x) { return; }
          this.store.setSectionToEdit(true);

          this.selectedEpisodeType = x;
          this.recordAdmitDate = this.store.isInsurer;
          this.recordDischargeDate = this.store.isInsurer && (x === GluEpisodeTypeEnum.Daycase || x === GluEpisodeTypeEnum.Inpatient);
          this.recordDischargeCode = this.store.isInsurer && (x === GluEpisodeTypeEnum.Daycase || x === GluEpisodeTypeEnum.Inpatient);
          this.recordLocation = this.store.isInsurer && x !== GluEpisodeTypeEnum.ConsultingRooms;
          this.showDischargeCode = x === GluEpisodeTypeEnum.Daycase || x === GluEpisodeTypeEnum.Inpatient;
          this.showDischargeDate = x === GluEpisodeTypeEnum.Daycase || x === GluEpisodeTypeEnum.Inpatient;
          this.showEpisode = x === GluEpisodeTypeEnum.Daycase || x === GluEpisodeTypeEnum.Inpatient;
          this.showAdmitDate = true;
          this.showLocation = true;

          this.editForm.get('dischargeCodeId').updateValueAndValidity();
          this.editForm.get('admissionDate').updateValueAndValidity();
          this.editForm.get('dischargeDate').updateValueAndValidity();
          this.editForm.get('dischargeCodeId').updateValueAndValidity();
          this.editForm.get('locationId').updateValueAndValidity();
        }
      })
    )

    this.editForm.get('dischargeCodeId').valueChanges.subscribe(() => {
      if (this.saving != true)
        this.store.setSectionToEdit(true);
    });

    this.editForm.get('admissionDate').valueChanges.subscribe(() => {
      if (this.saving != true)
        this.store.setSectionToEdit(true);
    });

    this.editForm.get('dischargeDate').valueChanges.subscribe(() => {
      if (this.saving != true)
        this.store.setSectionToEdit(true);
    });

    this.editForm.get('locationId').valueChanges.subscribe(() => {
      if (this.saving != true)
        this.store.setSectionToEdit(true);
    });

    this.editForm.get('ownerId').valueChanges.subscribe(() => {
      if (this.saving != true)
        this.store.setSectionToEdit(true);
    });

    this.addToSubscription(episodeTypeChanges$);
    this.subscribeToAdmissionDateChange();
    this.subscribeToDischargeDateChange();
  }

  private setupForm() {
    this.editForm = this.formBuilder.group({
      episodeTypeId: [undefined, Validators.required],
      dischargeCodeId: [undefined, [requiredIfValidator(() => this.recordDischargeCode)]],
      admissionDate: [undefined, [requiredIfValidator(() => this.recordAdmitDate)]],
      dischargeDate: [undefined, [requiredIfValidator(() => this.recordDischargeDate)]],
      locationId: [undefined, [requiredIfValidator(() => this.recordLocation)]],
      ownerId: [undefined, Validators.required],
    });
  }

  save() {
    this.saving = true;
    let record: GetInvoiceEpisodeDetailsResponse = this.getModelFromForm();

    record.ownerName = this.owners.find(x => x.id === record.ownerId).displayName;
    record.type = this.episodeTypes.find(x => x.episodeTypeId === record.episodeTypeId).description;

    if (record.locationId) {
      record.locationName = this.locations.find(x => x.id === record.locationId).name;
    }

    if (record.dischargeCodeId) {
      record.dischargeReason = this.dischargeCodes.find(x => x.dischargeCodeId === record.dischargeCodeId).description;
    }
    this.store.setSectionToEdit(false);
    this.store.setEpisode(record);
  }

  subscribeToAdmissionDateChange() {
    this.subscription.add(
      this.editForm.get('admissionDate').valueChanges
        .pipe(tap(x => {
          if (!x) { return }

          if (this.editForm.get('dischargeDate').value) {
            if (new Date(this.editForm.get('dischargeDate').value).getTime() < new Date(this.editForm.get('admissionDate').value).getTime()) {
              this.editForm.get('dischargeDate').setValue(this.editForm.get('admissionDate').value, { emitEvent: false });
              return;
            }
          }

          if (this.selectedEpisodeType === GluEpisodeTypeEnum.Daycase)
            this.editForm.get('dischargeDate').setValue(this.editForm.get('admissionDate').value, { emitEvent: false });
          return;
        })
        ).subscribe()
    );
  }

  subscribeToDischargeDateChange() {
    this.subscription.add(
      this.editForm.get('dischargeDate').valueChanges
        .pipe(tap(x => {
          if (!x) { return }

          if (this.editForm.get('admissionDate').value) {
            if (new Date(this.editForm.get('dischargeDate').value).getTime() < new Date(this.editForm.get('admissionDate').value).getTime()) {
              this.editForm.get('admissionDate').setValue(this.editForm.get('dischargeDate').value, { emitEvent: false });
              return;
            }
          }
          return;
        })
        ).subscribe()
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      const focussableElements = this.appInfo.getHtmlElements(this.gouprOneSelector);
      if (focussableElements[0]) focussableElements[0].focus();
    }, 750);
  }
}
