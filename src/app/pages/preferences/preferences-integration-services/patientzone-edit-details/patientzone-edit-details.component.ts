import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { CorrespondenceTemplateModel } from 'src/app/shared/models/CorrespondenceTemplateModel';
import { CorrespondenceTypes } from 'src/app/shared/models/CorrespondenceTypes';
import { SiteViewModel } from 'src/app/shared/models/SiteViewModel';
import { CorrespondenceService } from 'src/app/shared/services/correspondence.service';
import { DocumentTemplateViewModel, SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';

@Component({
  selector: 'app-patientzone-edit-details',
  templateUrl: './patientzone-edit-details.component.html',
  styleUrls: ['./patientzone-edit-details.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' },
})
@AutoUnsubscribe
export class PatientzoneEditDetailsComponent extends SubscriptionBase implements OnInit {
  @Input() get siteVM(): SiteViewModel {
    return this._siteVM;
  }
  set siteVM(val: SiteViewModel) {
    if (val.siteId !== undefined) {
      this.populateForm(val);
    }
    this._siteVM = val;
  }

  private _siteVM: SiteViewModel;

  invoiceTypes: DocumentTemplateViewModel[] = [];
  shortfallTypes: DocumentTemplateViewModel[] = [];
  reallocationTypes: DocumentTemplateViewModel[] = [];
  band2Types: DocumentTemplateViewModel[] = [];
  band3Types: DocumentTemplateViewModel[] = [];
  band4Types: DocumentTemplateViewModel[] = [];
  form: FormGroup;
  creditNoteTypes: DocumentTemplateViewModel[] = [];
  templateChanges: DocumentTemplateViewModel[] = [];

  constructor(
    private siteService: SitesService,
    private spinnerService: SpinnerService,
    private changeDetectorRef: ChangeDetectorRef,
    private correspondenceService: CorrespondenceService
  ) {
    super();
    this.setupForm();
  }

  ngOnInit() {
    this.getTemplates();
  }

  setupForm() {
    this.form = new FormGroup({
      invoiceTemplate: new FormControl(null, null),
      shortfallTemplate: new FormControl(null, null),
      band2Template: new FormControl(null, null),
      band3Template: new FormControl(null, null),
      band4Template: new FormControl(null, null),
      reallocationTemplate: new FormControl(null, null),
      sendCreditNoteViaPatientZone: new FormControl(null, null),
      sendRemindersViaPatientZone: new FormControl(null, null),
      sendReallocationViaPatientZone: new FormControl(null, null),
      sendShortfallViaPatientZone: new FormControl(null, null),
      sendInvoicesViaPatientZone: new FormControl(null, null),
      creditNoteTemplate: new FormControl(null, null)
    });

    this.form.get('invoiceTemplate').valueChanges.subscribe(val => {
      this.update(val, this.invoiceTypes);
    });

    this.form.get('shortfallTemplate').valueChanges.subscribe(val => {
      this.update(val, this.shortfallTypes);
    });

    this.form.get('band2Template').valueChanges.subscribe(val => {
      this.update(val, this.band2Types);
    });

    this.form.get('band3Template').valueChanges.subscribe(val => {
      this.update(val, this.band3Types);
    });

    this.form.get('band4Template').valueChanges.subscribe(val => {
      this.update(val, this.band4Types);
    });

    this.form.get('reallocationTemplate').valueChanges.subscribe(val => {
      this.update(val, this.reallocationTypes);
    });

    this.form.get('creditNoteTemplate').valueChanges.subscribe(val => {
      this.update(val, this.creditNoteTypes);
    });
  }


  populateForm(value: SiteViewModel) {
    this.form.patchValue({ sendCreditNoteViaPatientZone: value.sendCreditNoteViaPatientZone });
    this.form.patchValue({ sendRemindersViaPatientZone: value.sendRemindersViaPatientZone });
    this.form.patchValue({ sendReallocationViaPatientZone: value.sendReallocationViaPatientZone });
    this.form.patchValue({ sendShortfallViaPatientZone: value.sendShortfallViaPatientZone });
    this.form.patchValue({ sendInvoicesViaPatientZone: value.sendInvoicesViaPatientZone });
  }

  getTemplates() {
    forkJoin([
      this.siteService.getTemplatesByType(CorrespondenceTypes.PatientInvoice),
      this.siteService.getTemplatesByType(CorrespondenceTypes.Shortfall),
      this.siteService.getTemplatesByType(CorrespondenceTypes.Reallocation),
      this.siteService.getTemplatesByType(CorrespondenceTypes.Band2),
      this.siteService.getTemplatesByType(CorrespondenceTypes.Band3),
      this.siteService.getTemplatesByType(CorrespondenceTypes.Band4),
      this.siteService.getTemplatesByType(CorrespondenceTypes.CreditNote)
    ])
      .subscribe(([invoice, shortfall, reallocation, band2, band3, band4, creditNote]) => {
        this.invoiceTypes = invoice;
        this.shortfallTypes = shortfall;
        this.reallocationTypes = reallocation;
        this.band2Types = band2;
        this.band3Types = band3;
        this.band4Types = band4;
        this.creditNoteTypes = creditNote;
        this.form.patchValue({ invoiceTemplate: invoice.find(x => x.isPatientZone)?.templateId });
        this.form.patchValue({ shortfallTemplate: shortfall.find(x => x.isPatientZone)?.templateId });
        this.form.patchValue({ reallocationTemplate: reallocation.find(x => x.isPatientZone)?.templateId });
        this.form.patchValue({ band2Template: band2.find(x => x.isPatientZone)?.templateId });
        this.form.patchValue({ band3Template: band3.find(x => x.isPatientZone)?.templateId });
        this.form.patchValue({ band4Template: band4.find(x => x.isPatientZone)?.templateId });
        this.form.patchValue({ creditNoteTemplate: creditNote.find(x => x.isPatientZone)?.templateId });
        this.changeDetectorRef.detectChanges();
      });
  }

  save() {
    this.spinnerService.start();
    this.siteVM.sendCreditNoteViaPatientZone = this.form.get('sendCreditNoteViaPatientZone').value;
    this.siteVM.sendInvoicesViaPatientZone = this.form.get('sendInvoicesViaPatientZone').value;
    this.siteVM.sendReallocationViaPatientZone = this.form.get('sendReallocationViaPatientZone').value;
    this.siteVM.sendShortfallViaPatientZone = this.form.get('sendShortfallViaPatientZone').value;
    this.siteVM.sendRemindersViaPatientZone = this.form.get('sendRemindersViaPatientZone').value;

    this.subscription.add(this.siteService.updateSitePreferences(this.siteVM).subscribe(data => {
      this.spinnerService.stop();
    }));
  }

  update(val, templateChanges: DocumentTemplateViewModel[]) {
    templateChanges.forEach(element => {
      const newtemplatedata = new CorrespondenceTemplateModel();
      newtemplatedata.siteId = this.siteVM.siteId;
      newtemplatedata.templateId = element.templateId;
      newtemplatedata.category = element.category;
      newtemplatedata.description = element.description
      newtemplatedata.default = element.default
      newtemplatedata.type = element.type
      newtemplatedata.active = true;
      newtemplatedata.isPatientZone = element.templateId === val ? true : false;
      this.subscription.add(this.correspondenceService.addTemplate(newtemplatedata).pipe()
        .subscribe(() => { }));
    });

    this.spinnerService.stop();
  }
}