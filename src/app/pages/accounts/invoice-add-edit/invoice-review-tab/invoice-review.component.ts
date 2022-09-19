import { Component, Input, OnInit, } from "@angular/core";
import { SubscriptionBase } from "src/app/shared/base/subscribtion.base";
import { AppInfoService, PatientDetails } from "src/app/shared/services";
import { PatientInsurerViewModel } from "src/app/shared/services/patient.service";
import { TemplateViewModel } from "src/app/shared/services/template.service";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { InvoiceAddEditStoreService } from "../invoice-add-edit-store.service";
import { tap } from "rxjs/operators";

@Component({
  selector: 'app-invoice-review',
  templateUrl: './invoice-review.component.html',
  styleUrls: ['./invoice-review.component.scss']
})
@AutoUnsubscribe
export class InvoiceReviewComponent extends SubscriptionBase implements OnInit {
  @Input() patientDetails: PatientDetails;
  @Input() get payorDetails(): PatientInsurerViewModel {
    return this._payorDetails
  }
  set payorDetails(val: PatientInsurerViewModel) {
    this._payorDetails = val;

    if (val.invoiceType !== undefined) {
      this.showDiagnosis();

    }
  }
  @Input() disableEdit = false;

  private _payorDetails: PatientInsurerViewModel
  showDiagnosisStep = true;
  hasErrors = false;
  templates: TemplateViewModel[] = [];
  selectedTemplate: string;

  constructor(
    public appInfo: AppInfoService,
    public store: InvoiceAddEditStoreService
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.getInvoiceTemplates();

    this.addToSubscription(
      this.store.invoiceTemplates$.pipe(tap(x => {
        if (x) {
          this.templates = x
          this.selectedTemplate = this.store.selectedTemplate;
        }
      }))
    )
  }

  showDiagnosis() {
    if (!this.payorDetails.requiresDiagnosisCode || !this.payorDetails.sendViaPatientzone || this.payorDetails.isPatientZone) {
      this.showDiagnosisStep = false;
    }
    else {
      this.showDiagnosisStep = true;
    }
  }

  templateChanged(e) {
    if (e.selectedItem) {
      this.selectedTemplate = e.selectedItem.templateId;
      this.store.selectedTemplate = e.selectedItem.templateId;
    }
  }
}