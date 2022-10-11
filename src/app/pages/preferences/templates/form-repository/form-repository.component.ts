import { NgModule, ViewChild, Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import {
  DxContextMenuModule, DxBoxModule, DxDataGridModule, DxButtonModule, DxCheckBoxModule, DxFormModule, DxDropDownBoxModule, DxTemplateModule,
  DxFileUploaderModule, DxDateBoxModule, DxTextAreaModule, DxListModule, DxTextBoxModule, DxResponsiveBoxModule, DxSelectBoxModule,
  DxPopupModule, DxDataGridComponent, DxLoadPanelModule
} from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { DomSanitizer, } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserStore } from 'src/app/shared/stores/user.store';
import Guid from 'devextreme/core/guid';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { HttpClient } from '@angular/common/http';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-form-repository',
  templateUrl: './form-repository.component.html',
  styleUrls: ['./form-repository.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormRepositoryComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true }) formSearchGrid: DxDataGridComponent;

  documentApiUrl = environment.documentApiUrl;
  dataSource: any;
  popupVisible = true;
  expanded = false;
  previewUrl;
  previewUrlArray = {};
  showLetterPreview = true;
  safePreviewFilename = null;
  selectedRowData = null;

  constructor(
    public appInfo: AppInfoService,
    private userStore: UserStore,
    private siteStore: SitesStore,
  ) {
  }

  ngOnInit(): void {
  }

  collapseAllClick(e) {
    this.formSearchGrid.instance.option('loadPanel.enabled', true);
    if (this.expanded) {
      console.log('Collapsing All.');
      this.formSearchGrid.instance.collapseAll();
    }
    else {
      console.log('Expanding All.');
      this.formSearchGrid.instance.expandAll();
    }
    this.expanded = !this.expanded;
    e.component.option({
      text: this.expanded ? 'Collapse All' : 'Expand All'
    });
  }

  refreshDataGrid() {
    this.formSearchGrid.instance.option('loadPanel.enabled', true);
    this.formSearchGrid.instance.refresh();
  }

  groupChanged(e) {
    this.formSearchGrid.instance.option('loadPanel.enabled', true);
    this.formSearchGrid.instance.clearGrouping();
    this.formSearchGrid.instance.columnOption(e.value, 'groupIndex', 0);
  }

  GetMyDocumentId(Id: Guid, urlParams: any) {
    urlParams.Token = this.userStore.getAuthToken();
    urlParams.UserId = this.userStore.getUserId();
    urlParams.SiteId = this.siteStore.getSelectedSite().siteRef;
    const sessionStorage: any = {
      Id: new Guid(),
      CreatedDateTime: new Date(Date.now()).toISOString(),
      UrlParams: JSON.stringify(urlParams),
      UserId: this.userStore.getUserId()
    };
  }

  getFileExtension(fname: string) {
    return fname.substr((fname.lastIndexOf('.') + 1)).toUpperCase();
  }

  public calcPreviewUrl(data) {
    const templateurl = data.TemplateUrl;
    const uniqueid = data.UniqueNo;
    const NewId = new Guid();
    const fileExtension = this.getFileExtension(templateurl);
    const selectedSite = this.siteStore.getSelectedSite();
    const mySiteRef = selectedSite.siteRef;
    if (fileExtension === 'DOCX') {
      const myParams = {
        SiteID: mySiteRef,
        Context: 'FormRepository',
        FileID: templateurl,
        Mode: 'Embedded',
        Action: 'View',
      };
    }
    else
      if (fileExtension === 'PDF') {
        const myParams = {
          SiteID: mySiteRef,
          Context: 'FormRepository',
          FileID: templateurl,
        };
      }
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        template: 'myTitle'
      },
      {
        location: 'before',
        widget: 'dxSelectBox',
        options: {
          width: 200,
          items: [
            {
              value: '',
              text: 'Not Grouped'
            }, {
              value: 'Organisation',
              text: 'Organisation'
            }, {
              value: 'Category',
              text: 'Category'
            }],
          displayExpr: 'text',
          valueExpr: 'value',
          value: '',
          onValueChanged: this.groupChanged.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Expand All',
          onClick: this.collapseAllClick.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          onClick: this.refreshDataGrid.bind(this)
        }
      });
  }

  onFocusedRowChanged(e) {
    const data = e.row.data;
    this.selectedRowData = e.row.data;
    this.calcPreviewUrl(data);
  }

  onContentReady(e) {
    e.component.option('loadPanel.enabled', false);
  }
}

@NgModule({
  imports: [DxBoxModule, DxButtonModule, DxContextMenuModule, DxCheckBoxModule,
    CommonModule, DxFormModule, DxDropDownBoxModule, DxFileUploaderModule, DxButtonModule, DxDataGridModule, DxPopupModule,
    DxDateBoxModule, DxTextAreaModule, DxListModule, DxTextBoxModule, DxResponsiveBoxModule, DxSelectBoxModule, DxLoadPanelModule],
  declarations: [FormRepositoryComponent, SafePipe],
  exports: [FormRepositoryComponent]
})

export class FormRepositoryModule { }
