import { ViewChild, Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent, DxTextBoxComponent } from 'devextreme-angular';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import ODataStore from 'devextreme/data/odata/store';
import { environment } from 'src/environments/environment';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { DocumentTemplateViewModel, SitesService } from 'src/app/shared/services/sites.service';
import { CorrespondenceCategory, CorrespondenceTypes } from 'src/app/shared/models/CorrespondenceTypes';
import { DocumentsService } from 'src/app/shared/services/documents.service';

@Component({
  selector: 'app-templates-correspondence',
  templateUrl: './templates-correspondence.component.html',
  styleUrls: ['./templates-correspondence.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})

@AutoUnsubscribe
export class TemplatesCorrespondenceComponent extends SubscriptionBase implements OnInit {
  @ViewChild(DxDataGridComponent) templatesGrid: DxDataGridComponent;
  @ViewChild('newtemplatepopup') newTemplatePopup: DxPopupComponent;
  @ViewChild('formrepositorypopup') formRepositoryPopup: DxPopupComponent;
  @ViewChild('newTemplateDesription') newtemplatedescription: DxTextBoxComponent;

  @Input() get refresh(): boolean {
    return this._refresh;
  }
  set refresh(value: boolean) {
    if (value) {
      this.getTemplates();
    }
    this._refresh = value;
  }

  @Output() delete = new EventEmitter<DocumentTemplateViewModel>();
  @Output() editEmit = new EventEmitter<DocumentTemplateViewModel>();

  private _refresh: boolean;

  dataSource: any;
  selectedFileName = '';
  templates: DocumentTemplateViewModel[] = [];
  TemplateStore: ODataStore;
  preflabellocation = 'left';
  documentApiUrl = environment.documentApiUrl;

  constructor(
    public appInfo: AppInfoService,
    private documentsService: DocumentsService,
    private siteService: SitesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getTemplates();
  }

  getTemplates() {
    this.subscription.add(this.siteService.getTemplatesByCategoryType(CorrespondenceCategory.Letters).subscribe(data => {
      this.templates = data;
    }));
  }

  form_fieldDataChanged(e) {
  }

  cancelClicked() {
    this.newTemplatePopup.instance.hide();
  }

  onFocusedRowChanged(e) {
    this.selectedFileName = e.row.data.fileName;
  }

  refreshDataGrid() {

  }

  deleteTemplate(e) {
    this.delete.emit(e.row.data);
  }

  firstLetterCaps(e) {
    let textcontent = e.component._$textEditorInputContainer[0].firstChild.value;
    if (textcontent.length === 1) { textcontent = textcontent.toUpperCase(); }
    if (textcontent.length > 2) {
      if (textcontent[textcontent.length - 2] === ' ' || textcontent[textcontent.length - 2] === "'") {
        let s = '' + textcontent[(textcontent.length - 1)];
        s = s.toUpperCase();
        textcontent = textcontent.slice(0, textcontent.length - 1);
        textcontent = textcontent + s[0];
      }
    }
    e.component._$textEditorInputContainer[0].firstChild.value = textcontent;
  }

  formRepositoryClicked() {
    this.formRepositoryPopup.instance.show();
  }

  edit(e) {
    this.editEmit.emit(e.row.data);
  }

  editTemplate(data) {
    this.addToSubscription(
      this.documentsService.editTemplate(data.data.templateId)
    )
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

  renameTemplate() { }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      { location: 'after', template: 'afterSearch', focusStateEnabled: true });
  }
}