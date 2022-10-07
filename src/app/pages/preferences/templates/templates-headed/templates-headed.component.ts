import { ViewChild, Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DxDataGridComponent, DxPopupComponent, DxTextBoxComponent } from 'devextreme-angular';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { CorrespondenceTemplateModel } from 'src/app/shared/models/CorrespondenceTemplateModel';
import { CopyFileModel, DocumentTemplateViewModel, SitesService } from 'src/app/shared/services/sites.service';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { CorrespondenceCategory } from 'src/app/shared/models/CorrespondenceTypes';
import { DocumentsService } from 'src/app/shared/services/documents.service';

@Component({
  selector: 'app-templates-headed',
  templateUrl: './templates-headed.component.html',
  styleUrls: ['./templates-headed.component.scss'],
  host: { class: 'd-flex flex-grow-1' }
})

@AutoUnsubscribe
export class TemplatesHeadedComponent extends SubscriptionBase implements OnInit {
  @ViewChild(DxDataGridComponent) templatesGrid: DxDataGridComponent;
  @ViewChild('newtemplatepopup') newTemplatePopup: DxPopupComponent;
  @ViewChild('newTemplateDesription') newtemplatedescription: DxTextBoxComponent;

  @Input() get refresh(): boolean {
    return this._refresh;
  }
  set refresh(value: boolean) {
    this._refresh = value;
    if (value) {
      this.getTemplates();
    }
  }

  @Output() delete = new EventEmitter<DocumentTemplateViewModel>();
  @Output() editEmit = new EventEmitter<DocumentTemplateViewModel>();

  private _refresh: boolean;
  private selectedSite: any;
  dataSource: any;
  selectedFileName = '';
  newtemplatedata: CorrespondenceTemplateModel;
  copyfiledata: CopyFileModel;
  templates: DocumentTemplateViewModel[] = [];
  preflabellocation = 'left';
  documentApiUrl = environment.documentApiUrl;

  constructor(
    public appInfo: AppInfoService,
    private http: HttpClient,
    private documentsService: DocumentsService,
    private siteStore2: SitesStore,
    private siteService: SitesService
  ) {
    super();
    this.selectedSite = this.siteStore2.getSelectedSite();
  }

  public copyFileRemote(mycopyfiledata: CopyFileModel): Observable<boolean> {
    console.log('copyfile:', mycopyfiledata);
    const url = this.documentApiUrl + '/home/CopyTemplateFile';
    return this.http.post<boolean>(url, mycopyfiledata);
  }

  form_fieldDataChanged() {
  }

  ngOnInit(): void {
    this.getTemplates();
  }

  getTemplates() {
    this.subscription.add(this.siteService.getTemplatesByCategoryType(CorrespondenceCategory.Headed).subscribe(data => {
      this.templates = data;
    }));
  }

  cancelClicked() {
    this.newTemplatePopup.instance.hide();
  }

  newtemplateshown() {
    this.newtemplatedescription.instance.focus();
    setTimeout(() => {
      try {
        this.newtemplatedescription.instance.focus();
      } catch { }
    }, 750);
  }

  onFocusedRowChanged(e) {
    this.selectedFileName = e.row.data.FileName;
  }

  edit(e) {
    this.editEmit.emit(e.row.data);
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

  addtemplateClicked() {
  }
}