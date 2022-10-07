import { ViewChild, Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import ODataStore from 'devextreme/data/odata/store';
import { environment } from 'src/environments/environment';
import { CorrespondenceTemplateModel } from '../../../../shared/models/CorrespondenceTemplateModel';
import { DocumentTemplateViewModel, SitesService } from 'src/app/shared/services/sites.service';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { CorrespondenceCategory } from 'src/app/shared/models/CorrespondenceTypes';
import { DocumentsService } from 'src/app/shared/services/documents.service';

@Component({
  selector: 'app-templates-receipts',
  templateUrl: './templates-receipts.component.html',
  styleUrls: ['./templates-receipts.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})
@AutoUnsubscribe
export class TemplatesReceiptsComponent extends SubscriptionBase implements OnInit {
  @ViewChild(DxDataGridComponent) templatesGrid: DxDataGridComponent;

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
  newtemplatedata: CorrespondenceTemplateModel;
  templates: DocumentTemplateViewModel[] = [];
  TemplateStore: ODataStore;
  preflabellocation = 'left';
  documentApiUrl = environment.documentApiUrl;

  constructor(
    public appInfo: AppInfoService,
    private siteService: SitesService,
    private documentsService: DocumentsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getTemplates();
  }

  form_fieldDataChanged(e) {
  }

  edit(e) {
    this.editEmit.emit(e.row.data);
  }

  getTemplates() {
    this.subscription.add(this.siteService.getTemplatesByCategoryType(CorrespondenceCategory.Accounts).subscribe(data => {
      this.templates = data;
    }));
  }

  onFocusedRowChanged(e) {
    this.selectedFileName = e.row.data.fileName;
  }

  refreshDataGrid() {
    this.templatesGrid.instance.option('loadPanel.enabled', true);
    this.templatesGrid.instance.refresh();
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

  deleteTemplate(e) {
    this.delete.emit(e.row.data);
  }
}