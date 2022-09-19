import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, EMPTY, zip } from "rxjs";
import { filter, finalize, switchMap, tap } from "rxjs/operators";
import { AppMessagesService } from "src/app/shared/services/app-messages.service";
import { PatientDetailsResponseModelNew, PatientService, } from "src/app/shared/services/patient.service";
import {
  GetInvoiceDetailsResponse, GetInvoiceDiagnosisCodesResponseModel, GetInvoiceEpisodeDetailsResponse, GetInvoicePayorResponseModel,
  InvoiceAddEditService, InvoiceDetailsRequestResponseBase, InvoiceStatusEnum,
} from "./invoice-add-edit.service";
import { Location } from "@angular/common";
import { InvoiceServicesStoreService, ServiceParentEntityType, } from "src/app/shared/components/invoice-services-select/invoice-services-store.service";
import { InvoiceSectionManagerService } from "./invoice-section-manager.service";
import { InvoiceAddEditSectionEnum, InvoiceAddEditTabEnum, } from "./invoice-add-edit-constants";
import { SpinnerService } from "src/app/shared/services/spinner.service";
import { ErrorData } from "src/app/shared/models/ErrorData";
import { AppointmentService } from "src/app/shared/services/appointment.service";
import { AppointmentServicesService } from "src/app/shared/components/invoice-services-select/appointment-services.service";
import { BillingService } from "src/app/shared/services/billing.service";
import { TemplateService, TemplateViewModel } from "src/app/shared/services/template.service";
import { UserStore } from "src/app/shared/stores/user.store";
import { GetInvoicePaymentNotificationsResponseModel } from "./invoice-payment-notifications/invoice-payment-notifications.service";

@Injectable()
export class InvoiceAddEditStoreService {
  private invoiceId = new BehaviorSubject<string>(undefined);
  public invoiceId$ = this.invoiceId.asObservable();

  private patientId = new BehaviorSubject<string>(undefined);
  public patientId$ = this.patientId.asObservable();

  private errors = new BehaviorSubject<ErrorData[]>(undefined);
  public errors$ = this.errors.asObservable().pipe();

  private invoicePatientDetails = new BehaviorSubject<PatientDetailsResponseModelNew>(undefined);
  public invoicePatientDetails$ = this.invoicePatientDetails.asObservable().pipe();

  private invoicePdfCorrespondenceId = new BehaviorSubject<string>(undefined);
  public invoicePdf$ = this.invoicePdfCorrespondenceId.asObservable().pipe();

  private invoicePayorDetails = new BehaviorSubject<GetInvoicePayorResponseModel>(undefined);
  public invoicePayorDetails$ = this.invoicePayorDetails.asObservable().pipe();

  private invoiceMainDetails = new BehaviorSubject<GetInvoiceDetailsResponse>(undefined);
  public invoiceMainDetails$ = this.invoiceMainDetails.asObservable().pipe();

  private invoiceEpisodeDetails = new BehaviorSubject<GetInvoiceEpisodeDetailsResponse>(undefined);
  public invoiceEpisodeDetails$ = this.invoiceEpisodeDetails.asObservable().pipe();

  private transactionsChanged = new BehaviorSubject<boolean>(undefined);
  public transactionsChanged$ = this.transactionsChanged.asObservable().pipe(
    filter(
      (x) => !!x)
  );

  private notificationsChanged = new BehaviorSubject<boolean>(undefined);
  public notificationsChanged$ = this.notificationsChanged.asObservable().pipe();

  private tasksChanged = new BehaviorSubject<boolean>(undefined);
  public tasksChanged$ = this.tasksChanged.asObservable().pipe();

  private invoiceDiagnosisCodes = new BehaviorSubject<GetInvoiceDiagnosisCodesResponseModel[]>(undefined);
  public invoiceDiagnosisCodes$ = this.invoiceDiagnosisCodes.asObservable().pipe();

  private invoiceTemplates = new BehaviorSubject<TemplateViewModel[]>(undefined);
  public invoiceTemplates$ = this.invoiceTemplates.asObservable().pipe();

  private needReallocation = new BehaviorSubject<GetInvoicePaymentNotificationsResponseModel>(undefined)
  public needsReallocation$ = this.needReallocation.asObservable().pipe();

  private appointmentDetails;
  private appointmentServices;
  private isFromNew = false;

  private isSectionInEdit = false;

  public selectedTemplate;

  public get isNew() {
    return !this.invoiceId.value;
  }

  public get hasEpisode() {
    return !!this.invoiceEpisodeDetails.value;
  }

  public get hasPayor() {
    return !!this.invoicePayorDetails.value;
  }

  public get payorRequiresDiagnosisCode() {
    return this.invoicePayorDetails.value.requiresDiagnosisCode;
  }

  public get hasDiagnosisCodes() {
    return (
      this.invoiceDiagnosisCodes.value &&
      this.invoiceDiagnosisCodes.value.length > 0
    );
  }

  public get hasInvoiceId() {
    return !!this.invoiceId.value;
  }

  public get getInvoiceId() {
    return this.invoiceId.value;
  }

  public get hasPatientId() {
    return !!this.patientId.value;
  }

  public get hasServices() {
    return this.servicesStore.hasServices;
  }

  public get issued() {
    return this.invoiceMainDetails.value?.statusId === InvoiceStatusEnum.Issued;
  }

  public get balanced() {
    return (
      this.invoiceMainDetails.value?.statusId === InvoiceStatusEnum.Balanced
    );
  }

  public get issuedOrBalanced() {
    return this.issued || this.balanced;
  }

  public get isEditable() {
    const currentDetails = this.invoiceMainDetails.value;

    if (!currentDetails) {
      return true;
    }

    switch (currentDetails.statusId) {
      case InvoiceStatusEnum.Issued:
        return false;
      case InvoiceStatusEnum.Passed:
        return false;
      case InvoiceStatusEnum.Submitted:
        return false;
      case InvoiceStatusEnum.Balanced:
        return false;
      case InvoiceStatusEnum.Cancelled:
        return false;
      case InvoiceStatusEnum.Ready:
        return false;
      default:
        return true;
    }
  }

  public get isSectionEdited() {
    if ((this.invoiceMainDetails.value?.statusId === InvoiceStatusEnum.Draft ||
      this.invoiceMainDetails.value?.statusId === InvoiceStatusEnum.Review ||
      this.invoiceMainDetails.value?.statusId === InvoiceStatusEnum.FailedValidation) &&
      this.sectionManager.currentTab != 2)
      return this.isSectionInEdit;
    else
      return false;
  }

  public setNeedsReallocation(model: GetInvoicePaymentNotificationsResponseModel) {
    this.needReallocation.next(model);
  }

  public setSectionToEdit(value: boolean) {
    this.isSectionInEdit = value;
  }

  public get hasAppointmentDetails() {
    if (this.appointmentDetails) {
      let episodeDetails = new GetInvoiceEpisodeDetailsResponse();
      episodeDetails.admissionDate = this.appointmentDetails.startDate;
      episodeDetails.dischargeDate = this.appointmentDetails.endDate;
      episodeDetails.locationId = this.appointmentDetails.locationId;
      episodeDetails.ownerId = this.appointmentDetails.ownerId;
      episodeDetails.locationName = this.appointmentDetails.locationName;
      episodeDetails.ownerName = this.appointmentDetails.ownerName;
      if (this.appointmentServices) {
        episodeDetails.episodeTypeId = this.appointmentServices[0].episodeTypeId;
      }

      this.invoiceEpisodeDetails.next(episodeDetails);

      return true;
    }
    return false;
  }

  public get hasAppointmentServices() {
    if (this.appointmentServices && this.appointmentServices.length > 0) {
      this.servicesStore.setServices(this.appointmentServices);
      return true;
    }

    return false;
  }

  public get inReview() {
    const currentDetails = this.invoiceMainDetails.value;
    if (!currentDetails) {
      return false;
    }

    return currentDetails.statusId === InvoiceStatusEnum.Review;
  }

  public get invoiceDate() {
    if (this.invoiceMainDetails.value)
      return this.invoiceMainDetails.value.invoiceDate;
  }

  public get isInsurer() {
    if (this.invoicePayorDetails.value)
      return this.invoicePayorDetails.value.isInsurer;
  }

  public get isPatientzone() {
    if (this.invoicePayorDetails.value)
      return this.invoicePayorDetails.value.sendViaPatientzone;
  }

  public get getPayorId() {
    return this.invoicePayorDetails.value.payorId;
  }

  public get getPatientId() {
    return this.invoicePatientDetails.value.patientId;
  }

  public get isNewInvoice() {
    return this.isFromNew;
  }

  public sectionManager: InvoiceSectionManagerService;
  public showCancel = false;

  constructor(
    private patientService: PatientService,
    private invoiceService: InvoiceAddEditService,
    private appMessages: AppMessagesService,
    private spinner: SpinnerService,
    private router: Router,
    private servicesStore: InvoiceServicesStoreService,
    private location: Location,
    private appointmentService: AppointmentService,
    private appointmentServicesService: AppointmentServicesService,
    private billingService: BillingService,
    private templateService: TemplateService,
    public userStore: UserStore

  ) {
    this.sectionManager = new InvoiceSectionManagerService(this);
  }

  public getAppointmentDetails(appointmentId: string) {
    if (appointmentId) {
      this.appointmentService.getAppointment(appointmentId).subscribe(data => {
        if (data) {
          this.appointmentDetails = data;
        }
      })

      this.appointmentServicesService.getAll(appointmentId).subscribe(data => {
        if (data) {
          this.appointmentServices = data;
        }
      })

    }
  }

  public getAutoPopInvoiceDetails(autoPopId: string) {
    if (autoPopId) {
      this.billingService.getAutoPopInvoiceDetails(autoPopId).pipe(
        tap((x) => {

        })
      );
    }
  }

  public getInvoiceTemplates() {
    this.templateService.getTemplatesByType(8).subscribe(data => {
      if (data) {
        this.selectedTemplate = data.find(x => x.default && x.isPatientZone == this.isPatientzone)?.templateId;
        this.invoiceTemplates.next(data);
      }
    })
  }

  public onNewInvoice() {
    this.sectionManager.setTab(InvoiceAddEditTabEnum.PatientAndDetails);
    this.sectionManager.setCurrentlyEditableSection(InvoiceAddEditSectionEnum.Patient);
    this.servicesStore.onNewInvoice();
    this.invoiceId.next(undefined);
    this.patientId.next(undefined);
    this.errors.next(undefined);
    this.invoicePatientDetails.next(undefined);
    this.invoicePayorDetails.next(undefined);
    this.invoiceMainDetails.next(undefined);
    this.invoiceEpisodeDetails.next(undefined);
    this.invoiceDiagnosisCodes.next(undefined);
    this.invoiceTemplates.next(undefined);
  }

  public showSection(sectionIndex: number): boolean {
    switch (
    sectionIndex //
    ) {
      case 1:
        return true;
      case 2:
        return this.invoicePatientDetails.value ? true : false;
      case 3:
        return this.hasPayor;
      case 5:
        return this.hasPayor ? this.payorRequiresDiagnosisCode : false;
      case 6:
        return this.hasPayor
          ? this.payorRequiresDiagnosisCode
            ? this.hasDiagnosisCodes
            : true
          : false;
      default:
        return this.isNew ? false : true;
    }
  }

  public notificationsUpdate(value) {
    this.notificationsChanged.next(value);
  }

  public showAddNewService() {
    this.servicesStore.showAddNewService();
  }

  public transactionsUpdated() {
    this.transactionsChanged.next(true);
    this.invoiceService.getInvoice(this.invoiceId.value).pipe(
      tap((x) => {
        this.invoiceMainDetails.next(x.details);
      })
    ).subscribe();
  }

  public tasksUpdated() {
    this.tasksChanged.next(true);
  }

  public setInvoiceId(invoiceId: string) {
    this.spinner.start();

    const updateView = (errors: ErrorData[]) => {
      this.sectionManager.setSectionIndexOnInvoiceLoad();
      if (errors && errors.length > 0) {
        this.setErrorsOnSend(errors);
      }
      this.spinner.stop();
    };

    const invoiceDetails$ = this.invoiceService.getInvoice(invoiceId).pipe(
      tap((x) => {
        this.invoiceId.next(invoiceId);
        this.patientId.next(x.patient.patientId.toString());
        this.invoicePatientDetails.next(x.patient);
        this.invoicePayorDetails.next(x.payor);
        this.invoiceMainDetails.next(x.details);
        this.invoiceEpisodeDetails.next(x.episode);
      })
    );

    invoiceDetails$
      .pipe(
        switchMap((x) => {
          if (this.hasPayor && this.hasEpisode) {
            this.setServicesStore();
            return zip(
              this.getDiagnosisCodes$(invoiceId),
              this.servicesStore.getAll()
            ).pipe(
              tap(() => {
                updateView(x.validationErrors);
              })
            );
          } else {
            updateView(x.validationErrors);
            return EMPTY;
          }
        })
      )
      .subscribe();
  }

  public setPatientId(patientId: string) {
    const patientDetails$ = this.patientService
      .getPatientDetails(patientId)
      .pipe(
        tap((x) => {
          this.invoicePatientDetails.next(x);
          this.setSectionOnEdit(2);
        })
      );

    if (!this.invoiceId.value) {
      patientDetails$.subscribe();
      this.patientId.next(patientId); // //
    }
  }

  public unsetPatientId() {
    this.invoicePayorDetails.next(null);
    this.patientId.next(null);
  }

  public setInvoiceMainDetails(details: InvoiceDetailsRequestResponseBase) {
    this.isFromNew = true;
    this.appMessages.showSuccessSnackBar("Invoice saved to draft");

    const updateView = (status: string, statusId: number) => {
      this.invoiceMainDetails.next({
        invoiceNo: details.invoiceNo,
        authCode: details.authCode,
        invoiceDate: details.invoiceDate,
        status,
        statusId,
      });

      if (this.hasEpisode) {
        this.sectionManager.unsetCurrentEditableSection();
      } else {
        this.setSectionOnEdit(InvoiceAddEditSectionEnum.Episode);
      }
    };

    if (!this.isNew) {
      // if existing invoice update DB
      this.invoiceService
        .updateInvoiceMainDetails(details, this.invoiceId.value)
        .subscribe(
          () => {
            const currentDetails = this.invoiceMainDetails.value;
            updateView(currentDetails.status, currentDetails.statusId);
          },
          (e) => this.appMessages.showApiErrorNotification(e)
        );
    } else {
      //create invoice
      const payor = this.invoicePayorDetails.value;
      let request = {
        patientId: this.patientId.value,
        payor: {
          payorId: payor.payorId,
          type: payor.type,
        },
        details: details,
        appointmentId: this.appointmentDetails ? this.appointmentDetails.appointmentId : null,
      };

      this.invoiceService.saveInvoice(request).subscribe(
        (x) => {
          updateView(
            InvoiceStatusEnum.Draft.toString(),
            InvoiceStatusEnum.Draft
          );
          this.router.navigate(["/accounts/invoice"], {
            queryParams: { invoiceId: x.data.id },
          });
        },
        (e) => this.appMessages.showApiErrorNotification(e)
      );
    }
  }

  public setSectionOnEdit(index: InvoiceAddEditSectionEnum) {
    this.sectionManager.setCurrentlyEditableSection(index);
  }

  public setPayor(payor: GetInvoicePayorResponseModel) {
    this.removeEpisode();
    const updateView = () => {
      this.invoicePayorDetails.next(payor);
      if (this.invoiceMainDetails.value) {
        this.sectionManager.unsetCurrentEditableSection();
      } else {
        this.setSectionOnEdit(InvoiceAddEditSectionEnum.InvoiceDetails);
      }
    };

    if (!this.isNew) {
      // if existing invoice update DB
      const request = {
        invoiceId: this.invoiceId.value,
        payor: {
          payorId: payor.payorId,
          type: payor.type,
        },
      };
      this.invoiceService.updateInvoicePayor(request).subscribe(
        () => {
          updateView();
        },
        (e) => this.appMessages.showApiErrorNotification(e)
      );
    } else {
      updateView();
    }
  }

  private setServicesStore() {
    this.servicesStore.setParentEntityType(ServiceParentEntityType.Invoice);
    this.servicesStore.setParentEntityId(this.invoiceId.value);
    const invoiceEpisodeDetails = this.invoiceEpisodeDetails.value;
    this.servicesStore.setDefaultOwnerId(invoiceEpisodeDetails.ownerId);
    this.servicesStore.setDefaultStartDate(invoiceEpisodeDetails.admissionDate);
    this.servicesStore.setDefaultEndDate(invoiceEpisodeDetails.dischargeDate);
    this.servicesStore.setDefaultEpisodeTypeId(invoiceEpisodeDetails.episodeTypeId);
  }

  public removeEpisode() {
    this.invoiceEpisodeDetails.next(null);
  }

  public setEpisode(episode: GetInvoiceEpisodeDetailsResponse) {
    const updateView = () => {
      if (this.hasServices) {
        this.sectionManager.unsetCurrentEditableSection();
      } else {
        this.sectionManager.goToNextViewAfterEpisode();
      }
    };

    if (this.isNew) {
      throw "Can only update episode details of an existing invoice!";
    }

    episode = Object.assign(new GetInvoiceEpisodeDetailsResponse(), episode);
    const request = episode.toRequest(this.invoiceId.value);

    this.invoiceService.setInvoiceEpisode(request).subscribe(
      () => {
        this.invoiceEpisodeDetails.next(episode);
        this.setServicesStore();
        updateView();
      },
      (e) => this.appMessages.showApiErrorNotification(e)
    );
  }

  public setToCancelled() {
    this.showCancel = true;
  }

  public setToReview() {
    this.invoiceService.setToReview(this.invoiceId.value).subscribe(
      () => this.appMessages.showInfoConfirmationModal("Information", "Invoice saved for review", () => this.goBack(), () => this.goBack()),
      (e) => this.appMessages.showApiErrorNotification(e)
    );
  }

  public send() {
    this.spinner.start();
    this.errors.next([]);
    this.invoiceService
      .sendInvoice(this.invoiceId.value, this.selectedTemplate)
      .pipe(
        tap(
          (x) => {
            if (x.data.correspondenceId) {
              let invoiceDetails = this.invoiceMainDetails.value;
              invoiceDetails.statusId = InvoiceStatusEnum.Issued;
              invoiceDetails.status = "Issued";
              this.invoiceMainDetails.next(invoiceDetails);
              this.invoicePdfCorrespondenceId.next(x.data.correspondenceId);
            } else {
              this.goBack();
            }
          },
          (e) => {
            this.appMessages.showApiErrorNotification(e);
            if (e.error.data && e.error.data.ediErrors) {
              this.setErrorsOnSend(e.error.data.ediErrors);
            }
          }
        ),
        finalize(() => this.spinner.stop())
      )
      .subscribe();
  }

  public regenerate() {
    this.spinner.start();
    this.errors.next([]);
    this.invoiceService
      .regenerateInvoice(this.invoiceId.value)
      .pipe(
        tap(
          (x) => {
            if (x.data.correspondenceId) {
              let invoiceDetails = this.invoiceMainDetails.value;
              invoiceDetails.statusId = InvoiceStatusEnum.Issued;
              this.invoiceMainDetails.next(invoiceDetails);
              this.invoicePdfCorrespondenceId.next(x.data.correspondenceId);
              this.transactionsUpdated();
            } else {
              this.goBack();
            }
          },
          (e) => {
            this.appMessages.showApiErrorNotification(e);
            if (e.error.data && e.error.data.ediErrors) {
              this.setErrorsOnSend(e.error.data.ediErrors);
            }
          }
        ),
        finalize(() => this.spinner.stop())
      )
      .subscribe();
  }

  public goBack() {
    this.location.back();
  }

  private setErrorsOnSend(errors: ErrorData[]) {
    errors.forEach((e) => {
      switch (e.invoiceStep) {
        case "chargeDetails":
          e.sectionIndex = InvoiceAddEditSectionEnum.Services;
          break;
        case "diagnosisDetails":
          e.sectionIndex = InvoiceAddEditSectionEnum.Diagnosis;
          break;
        case "patientDetailsView":
          e.sectionIndex = InvoiceAddEditSectionEnum.Patient;
          break;
        case "payorView":
          e.sectionIndex = InvoiceAddEditSectionEnum.Payor;
          break;
        case "treatmentDetailsView":
          e.sectionIndex = InvoiceAddEditSectionEnum.Episode;
          break;
        default:
          e.sectionIndex = 0;
          break;
      }
    });

    this.errors.next(errors);
  }

  private getDiagnosisCodes$(invoiceId: string) {
    return this.invoiceService
      .getInvoiceDiagnosisCodes(invoiceId)
      .pipe(tap((x) => this.invoiceDiagnosisCodes.next(x)));
  }

  public addDiagnosis(code: string, callback: () => void) {
    const invoiceId = this.invoiceId.value;

    this.invoiceService
      .addDiagnosisCode(invoiceId, code)
      .pipe(
        tap(
          () => { },
          (e) => this.appMessages.showApiErrorNotification(e),
          () => callback()
        ),
        switchMap(() => this.getDiagnosisCodes$(invoiceId))
      )
      .subscribe();
  }

  public removeDiagnosis(id: string) {
    this.invoiceService
      .deleteDiagnosisCode(id)
      .pipe(
        tap(
          () => { },
          (e) => this.appMessages.showApiErrorNotification(e)
        ),
        switchMap(() => this.getDiagnosisCodes$(this.invoiceId.value))
      )
      .subscribe();
  }

  public setDiagnosisAsPrimary(id: string) {
    this.invoiceService
      .setDiagnosisCodeAsPrimary(id)
      .pipe(
        tap(
          () => { },
          (e) => this.appMessages.showApiErrorNotification(e)
        ),
        switchMap(() => this.getDiagnosisCodes$(this.invoiceId.value))
      )
      .subscribe();
  }

  public cloneInvoice() {
    this.invoiceService.cloneInvoice(this.invoiceId.value).subscribe(data => {
      const invoiceId = data.data;
      if (this.userStore.isMedSecUser()) {
        this.router.navigate(['/medsec/accounts/invoice'], { queryParams: { invoiceId } });
      } else {
        this.router.navigate(['/accounts/invoice'], { queryParams: { invoiceId } });
      }
    },
      error => {
        this.appMessages.showApiErrorNotification(error);
      }
    );
  }
}