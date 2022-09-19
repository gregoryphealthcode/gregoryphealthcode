import { BehaviorSubject } from "rxjs";
import { InvoiceAddEditSectionEnum, InvoiceAddEditTabEnum } from "./invoice-add-edit-constants";
import { InvoiceAddEditStoreService } from "./invoice-add-edit-store.service";

export class InvoiceSectionManagerService {
  private editableSectionIndex = new BehaviorSubject<number>(InvoiceAddEditSectionEnum.Patient);
  public editableSectionIndex$ = this.editableSectionIndex.asObservable();

  private tabIndex = new BehaviorSubject<number>(0);
  public tabIndex$ = this.tabIndex.asObservable();

  constructor(
    private store: InvoiceAddEditStoreService
  ) { }

  public setSectionIndexOnInvoiceLoad() {
    if (this.store.hasEpisode) {
      this.goToNextViewAfterEpisode();
      return;
    }
    this.editableSectionIndex.next(4);
  }

  public goToNextViewAfterEpisode() {
    //set view to 2nd tab
    this.setTab(1);

    if (this.store.issuedOrBalanced) { return; }

    const payorRequiresDiagnosis =
      this.store.payorRequiresDiagnosisCode;

    if (payorRequiresDiagnosis && !this.store.hasDiagnosisCodes) {
      this.goToDiagnosis();
      return;
    }

    if (!this.store.hasServices) {
      this.goToServices();
      return;
    }

    //set to review tab
    this.setTab(2);
    this.setCurrentlyEditableSection(0);
  }

  private goToDiagnosis() {
    this.setCurrentlyEditableSection(5);
  }

  public goToServices() {
    this.setCurrentlyEditableSection(6);
    if (!this.store.hasServices) {
      this.store.showAddNewService();
    }
  }

  public goToReview() {
    this.setTab(2);
    this.setCurrentlyEditableSection(0);
  }

  public isTabDisabled(tabIndex: InvoiceAddEditTabEnum) {
    switch (tabIndex) {
      case InvoiceAddEditTabEnum.PatientAndDetails:
        return false;
      case InvoiceAddEditTabEnum.Services:
        return !this.store.hasEpisode;
      case InvoiceAddEditTabEnum.Review:
        return !this.store.hasServices;
      default:
        break;
    }
  }

  public setTab(tabIndex: number) {
    this.tabIndex.next(tabIndex);
  }

  public unsetCurrentEditableSection() {
    this.editableSectionIndex.next(0); //unset current section on edit
  }

  public canEditSection(index: InvoiceAddEditSectionEnum) {
    if (index === InvoiceAddEditSectionEnum.Patient) {
      return this.store.isNew;
    }

    return this.store.isEditable;
  }

  public setCurrentlyEditableSection(index: InvoiceAddEditSectionEnum) {
    if (index === InvoiceAddEditSectionEnum.Patient && this.store.isNew) {
      if (!this.store.hasPatientId)
        return;
      else {
        this.store.unsetPatientId();
      }
    }
    const currentIndex = this.editableSectionIndex.value;
    if (currentIndex === index) {
      this.unsetCurrentEditableSection();
    } else {
      if (index === InvoiceAddEditSectionEnum.Patient
        || index === InvoiceAddEditSectionEnum.InvoiceDetails
        || index === InvoiceAddEditSectionEnum.Payor
        || index === InvoiceAddEditSectionEnum.Episode) {
        this.setTab(InvoiceAddEditTabEnum.PatientAndDetails)
      }

      if (index === InvoiceAddEditSectionEnum.Diagnosis
        || index === InvoiceAddEditSectionEnum.Services) {
        this.setTab(InvoiceAddEditTabEnum.Services)
      }

      this.editableSectionIndex.next(index);
    }
  }

  public get currentTab() {
    return this.tabIndex.value;
  }

  public get currentEditableSection() { return this.editableSectionIndex.value }
}