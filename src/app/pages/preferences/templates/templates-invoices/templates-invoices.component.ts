import { ViewChild, Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { environment } from 'src/environments/environment';
import { DocumentTemplateViewModel, SitesService } from 'src/app/shared/services/sites.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { CorrespondenceTemplateModel } from 'src/app/shared/models/CorrespondenceTemplateModel';
import { CorrespondenceCategory } from 'src/app/shared/models/CorrespondenceTypes';
import { DocumentsService } from 'src/app/shared/services/documents.service';

@Component({
  selector: 'app-templates-invoices',
  templateUrl: './templates-invoices.component.html',
  styleUrls: ['./templates-invoices.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})
@AutoUnsubscribe
export class TemplatesInvoicesComponent extends SubscriptionBase implements OnInit {
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

  @Output() editEmit = new EventEmitter<DocumentTemplateViewModel>();
  @Output() delete = new EventEmitter<DocumentTemplateViewModel>();

  private _refresh: boolean;

  dataSource: any;
  selectedFileName = '';
  newtemplatedata: CorrespondenceTemplateModel;
  templates: DocumentTemplateViewModel[] = [];
  preflabellocation = 'left';
  documentApiUrl = environment.documentApiUrl;

  constructor(
    public appInfo: AppInfoService,
    private siteService: SitesService,
    private documentsService: DocumentsService
  ) {
    super();
  }

  form_fieldDataChanged(e) {
  }

  ngOnInit(): void {
    this.getTemplates();
  }

  getTemplates() {
    this.subscription.add(this.siteService.getTemplatesByCategoryType(CorrespondenceCategory.Invoices).subscribe(data => {
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

  edit(e) {
    this.editEmit.emit(e.row.data);
  }

  firstLetterCaps(e) {
    let textcontent = e.component._$textEditorInputContainer[0].firstChild.value;
    if (textcontent.length === 1) { textcontent = textcontent.toUpperCase(); }
    if (textcontent.length > 2) {
      // tslint:disable-next-line: quotemark
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