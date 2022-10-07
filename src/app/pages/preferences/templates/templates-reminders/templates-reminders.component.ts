import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { CorrespondenceTemplateModel } from 'src/app/shared/models/CorrespondenceTemplateModel';
import { CorrespondenceCategory, } from 'src/app/shared/models/CorrespondenceTypes';
import { AppInfoService } from 'src/app/shared/services';
import { DocumentsService } from 'src/app/shared/services/documents.service';
import { DocumentTemplateViewModel, SitesService } from 'src/app/shared/services/sites.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-templates-reminders',
  templateUrl: './templates-reminders.component.html',
  styleUrls: ['./templates-reminders.component.scss'],
  host: { class: 'd-flex flex-grow-1' }
})
@AutoUnsubscribe
export class TemplatesRemindersComponent extends SubscriptionBase implements OnInit {
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

  templates: DocumentTemplateViewModel[] = [];
  selectedFileName = '';
  newtemplatedata: CorrespondenceTemplateModel;
  preflabellocation = 'left';
  documentApiUrl = environment.documentApiUrl;

  constructor(
    public appInfo: AppInfoService,
    private siteService: SitesService,
    private documentsService: DocumentsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getTemplates();
  }

  getTemplates() {
    this.subscription.add(this.siteService.getTemplatesByCategoryType(CorrespondenceCategory.Appointments).subscribe(data => {
      this.templates = data;
    }));
  }

  onFocusedRowChanged(e) {
    this.selectedFileName = e.row.data.fileName;
  }

  edit(e) {
    this.editEmit.emit(e.row.data);
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