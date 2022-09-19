import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { requiredIfValidator } from 'src/app/shared/helpers/form-helper';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { GlobalTemplateCategoryModel, GlobalTemplateTypesModel, GlobalTemplateViewModel, TemplateViewModel, TemplateService } from 'src/app/shared/services/template.service';

@Component({
  selector: 'app-preferences-templates-add-edit',
  templateUrl: './preferences-templates-add-edit.component.html',
  styleUrls: ['./preferences-templates-add-edit.component.scss']
})
export class PreferencesTemplatesAddEditComponent extends PopupReactiveFormBase implements OnInit {
  @Input() get isMedsec(): boolean {
    return this._isMedsec;
  }
  set isMedsec(value: boolean) {
    if (value) {
      this.controllerName = "bureauTemplates";
      this.options.push("Medsec");
    }
    else {
      this.controllerName = "llu_Templates";
      this.options.push("Site");
    }
    this._isMedsec = value;
  }

  private _isMedsec;

  templateCategories: GlobalTemplateCategoryModel[] = [];
  templateTypes: GlobalTemplateTypesModel[] = [];
  globalTemplates: GlobalTemplateViewModel[] = [];
  templates: TemplateViewModel[] = [];
  templateType: string;
  category;
  type;

  public options = [
    "Global"
  ];

  constructor(
    private templateService: TemplateService, public appInfo: AppInfoService
  ) {
    super();
  }

  protected controllerName;

  protected onOpened = (data) => {
    this.getTemplateCategories();
    this.setupForm();
    this.setup(data);
  };

  ngOnInit() {
    this.getTemplateCategories();
    this.setupForm();
  }

  getTemplateCategories() {
    this.templateService.getGlobalTemplateCategories().subscribe(data => {
      this.templateCategories = data;
      this.templateCategories.sort(function (a, b) {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      });
    })
  }

  getTemplateTypes(category) {
    this.templateService.getGlobalTemplateTypes(category).subscribe(data => {
      this.templateTypes = data;
      this.templateTypes.sort(function (a, b) {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      });
    })
  }

  getGlobalTemplates(type) {
    this.templateService.getGlobalTemplates(type).subscribe(data => {
      this.globalTemplates = data;
      this.globalTemplates.sort(function (a, b) {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      });
    });
  }

  getSiteTemplates(type) {
    this.templateService.getSiteTemplates(type).subscribe(data => {
      this.templates = data;
      this.templates.sort(function (a, b) {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      })
    })
  }

  getMedsecTemplates(type) {
    this.templateService.getMedsecTemplates(type).subscribe(data => {
      this.templates = data;
      this.templates.sort(function (a, b) {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      })
    })
  }

  setupForm() {
    this.editForm = new FormGroup({
      templateId: new FormControl(null),
      templateCategory: new FormControl(null, requiredIfValidator(() => this.isNew)),
      templateType: new FormControl(null, requiredIfValidator(() => this.isNew)),
      type: new FormControl(null, requiredIfValidator(() => this.isNew)),
      existingGlobalTemplateId: new FormControl(null, requiredIfValidator(() => this.isNew && this.templateType == "Global")),
      existingSiteTemplateId: new FormControl(null, requiredIfValidator(() => this.isNew && this.templateType == "Site")),
      existingBureauTemplateId: new FormControl(null, requiredIfValidator(() => this.isNew && this.templateType == "Medsec")),
      description: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      comments: new FormControl(null, Validators.maxLength(500)),
      default: new FormControl(false),
      isPatientZone: new FormControl(false),
      active: new FormControl(true),
    })

    this.editForm.get('templateCategory').valueChanges.subscribe(x => {
      this.category = x;

      if (this.category) {
        this.getTemplateTypes(this.category);
      }

      if (this.type) {
        this.getGlobalTemplates(this.type);
        if (this.isMedsec)
          this.getMedsecTemplates(this.type);
        else
          this.getSiteTemplates(this.type);
      }
    })

    this.editForm.get('templateType').valueChanges.subscribe(x => {
      if (x) {
        this.type = x;
        this.getGlobalTemplates(this.type);

        if (this.isMedsec)
          this.getMedsecTemplates(this.type);
        else
          this.getSiteTemplates(this.type);
      }
    })
  }

  onTypeChanged(e) {
    this.templateType = e.value;

    this.editForm.patchValue({ existingSiteTemplateId: null });
    this.editForm.patchValue({ existingGlobalTemplateId: null });
    this.editForm.patchValue({ existingBureauTemplateId: null });

    this.editForm.get('existingGlobalTemplateId').updateValueAndValidity();
    this.editForm.get('existingSiteTemplateId').updateValueAndValidity();
    this.editForm.get('existingBureauTemplateId').updateValueAndValidity();
  }
}
