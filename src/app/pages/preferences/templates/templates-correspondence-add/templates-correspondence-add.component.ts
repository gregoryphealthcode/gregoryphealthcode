import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SubscriptionBase } from "src/app/shared/base/subscribtion.base";
import { CategoryTypesViewModel, CorrespondenceService, TemplateCategoryTypesViewModel } from "src/app/shared/services/correspondence.service";
import { CopyFileModel, DocumentTemplateViewModel, SitesService } from "src/app/shared/services/sites.service";
import { SpinnerService } from "src/app/shared/services/spinner.service";
import { SitesStore } from "src/app/shared/stores/sites.store";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { CorrespondenceTemplateModel } from "../../../../shared/models/CorrespondenceTemplateModel";

@Component({
  selector: 'app-templates-correspondence-add',
  templateUrl: './templates-correspondence-add.component.html',
  styleUrls: ['./templates-correspondence-add.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})

@AutoUnsubscribe
export class AddCorrespondenceTemplateComponent extends SubscriptionBase implements OnInit {
  @Input() model = CorrespondenceTemplateModel
  @Input() get templateModel(): CorrespondenceTemplateModel {
    return this._templateModel;
  }
  set templateModel(value: CorrespondenceTemplateModel) {
    this._templateModel = value;
    if (value) {
      this.populateForm(value);
      this.isEdit = true;
    }
  }

  @Output() templateAdded = new EventEmitter();

  private _templateModel: CorrespondenceTemplateModel;

  form: FormGroup;
  templates: DocumentTemplateViewModel[] = [];
  newtemplatedata: CorrespondenceTemplateModel = new CorrespondenceTemplateModel();
  categories: CategoryTypesViewModel[] = [];
  showCatTypes = false;
  categoryTypes: TemplateCategoryTypesViewModel[] = [];
  isEdit = false;

  constructor(
    private siteStore: SitesStore,
    private siteService: SitesService,
    private spinnerService: SpinnerService,
    private changeDetectorRef: ChangeDetectorRef,
    private correspondenceService: CorrespondenceService) {
    super();
    this.getTemplateCategories();
    this.setupForm();
  }

  ngOnInit(): void {
    this.getTemplates();
  }

  private populateForm(value: CorrespondenceTemplateModel) {
    this.form.patchValue({ templateName: value.description });
    this.form.patchValue({ templateCategory: value.category });
    this.form.patchValue({ categoryType: value.type });
    this.form.patchValue({ comments: value.comments });
    this.form.patchValue({ default: value.default });
    this.form.patchValue({ patientzone: value.isPatientZone });
    this.form.get('templateName').disable();
    this.form.get('templateType').clearValidators();
    this.form.get('templateType').updateValueAndValidity();
  }

  private setupForm() {
    this.form = new FormGroup({
      templateName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)])),
      templateType: new FormControl('', null),
      templateCategory: new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      categoryType: new FormControl('', null),
      comments: new FormControl('', Validators.compose([Validators.maxLength(200)])),
      default: new FormControl('', null),
      patientzone: new FormControl('', null)
    });

    this.form.get('templateCategory').valueChanges.subscribe(val => {
      this.getTemplateTypesForCategory(val);
    });
  }

  getTemplates() {
    this.subscription.add(this.siteService.getTemplates().subscribe(data => {
      this.templates = data;
      this.changeDetectorRef.detectChanges();
    }));
  }

  getTemplateCategories() {
    this.subscription.add(this.correspondenceService.getTemplateCategories().subscribe(data => {
      this.categories = data;
      if (this.isEdit) {
        this.getTemplateTypesForCategory(this.form.get('templateCategory').value);
      }
    }));
  }

  getTemplateTypesForCategory(e) {
    const res = this.categories.find(x => x.uniqueNo === e);
    if (res !== undefined) {
      this.categoryTypes = res.templateTypes;
      this.showCatTypes = true;
    }
  }

  update() {
    this.spinnerService.start();
    const selectedSite = this.siteStore.getSelectedSite();
    this.newtemplatedata = new CorrespondenceTemplateModel();
    this.newtemplatedata.siteId = selectedSite.siteId;
    this.newtemplatedata.templateId = this.templateModel.templateId;
    this.newtemplatedata.siteRef = selectedSite.siteRef;
    this.newtemplatedata.category = this.form.get('templateCategory').value.uniqueNo;
    this.newtemplatedata.description = this.form.get('templateName').value;
    this.newtemplatedata.default = this.form.get('default').value === '' ? false : this.form.get('default').value;
    this.newtemplatedata.isPatientZone = this.form.get('patientzone').value === '' ? false : this.form.get('patientzone').value;
    this.newtemplatedata.type = this.form.get('categoryType').value;
    this.newtemplatedata.active = true;
    this.newtemplatedata.heading = 'BlankSignOff.docx';
    this.newtemplatedata.rank = this.templates.length + 1;
    this.newtemplatedata.fileName = this.sanitizeFilename(this.form.get('templateName').value + this.templates.length.toString()) + '.docx';
    this.newtemplatedata.comments = this.form.get('comments').value;
    this.subscription.add(this.correspondenceService.addTemplate(this.newtemplatedata).subscribe(value => {
      this.templateAdded.emit();
      this.spinnerService.stop();
    }));
  }

  save() {
    this.spinnerService.start();
    const selectedSite = this.siteStore.getSelectedSite();
    this.newtemplatedata = new CorrespondenceTemplateModel();
    this.newtemplatedata.siteId = selectedSite.siteId;
    this.newtemplatedata.siteRef = selectedSite.siteRef;
    this.newtemplatedata.category = this.form.get('templateCategory').value;
    this.newtemplatedata.description = this.form.get('templateName').value;
    this.newtemplatedata.default = this.form.get('default').value === '' ? false : this.form.get('default').value;
    this.newtemplatedata.type = this.form.get('categoryType').value;
    this.newtemplatedata.active = true;
    this.newtemplatedata.heading = 'BlankSignOff.docx';
    this.newtemplatedata.isPatientZone = this.form.get('patientzone').value === '' ? false : this.form.get('patientzone').value;
    this.newtemplatedata.rank = this.templates.length + 1;
    this.newtemplatedata.fileName = this.sanitizeFilename(this.form.get('templateName').value + this.templates.length.toString()) + '.docx';
    this.newtemplatedata.comments = this.form.get('comments').value;
    this.subscription.add(this.correspondenceService.addTemplate(this.newtemplatedata).subscribe(value => {
      const copyfiledata = new CopyFileModel();
      copyfiledata.Context = 'ePracticeDocs';
      copyfiledata.DestinationFile = this.sanitizeFilename(this.form.get('templateName').value + this.templates.length.toString()) + '.docx';
      copyfiledata.SourceFile = this.form.get('templateType').value.fileName;
      copyfiledata.Overwrite = false;
      copyfiledata.SiteID = selectedSite.siteId;
      copyfiledata.SiteRef = selectedSite.siteRef;
      copyfiledata.Token = sessionStorage.getItem('ePracticeToken');
      var destinationCategory = this.categories.find(x => x.uniqueNo === this.form.get('templateCategory').value);
      copyfiledata.DestinationFolder = destinationCategory.description;
      this.subscription.add(this.siteService.copyFileRemote(copyfiledata).subscribe(value2 => {
      }));

      this.templateAdded.emit();
      this.spinnerService.stop();

    }, error => {
      this.spinnerService.stop();
    }));
  }

  sanitizeFilename(inString: string) {
    let outString = '';
    inString = inString.toLowerCase();
    for (var i = 0; i < inString.length; i++) {
      const character = inString.charAt(i);
      if (/[a-z]/.test(character) || /[0-9]/.test(character)) {
        outString = outString + character;
      }
    }
    return outString;
  }

  discard() {
    this.form.reset();
  }

  firstLetterCaps(e) {
    let textcontent =
      e.component._$textEditorInputContainer[0].firstChild.value;
    if (textcontent.length === 1) {
      textcontent = textcontent.toUpperCase();
    }
    if (textcontent.length > 2) {
      if (
        textcontent[textcontent.length - 2] === ' ' ||
        textcontent[textcontent.length - 2] === '\''
      ) {
        let s = '' + textcontent[textcontent.length - 1];
        s = s.toUpperCase();
        textcontent = textcontent.slice(0, textcontent.length - 1);
        textcontent = textcontent + s[0];
      }
    }
    e.component._$textEditorInputContainer[0].firstChild.value = textcontent;
  }
}