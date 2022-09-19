import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Guid from 'devextreme/core/guid';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService, ScreenService } from 'src/app/shared/services';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { UserStore } from 'src/app/shared/stores/user.store';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-patient-correspondence-preview',
  templateUrl: './patient-correspondence-preview.component.html',
  styleUrls: ['./patient-correspondence-preview.component.scss']
})
@AutoUnsubscribe
export class PatientCorrespondencePreviewComponent extends SubscriptionBase implements OnInit {
  @Input() patientId: string;
  @Input() get correspondencePreviewData(): any {
    return this._correspondencePreviewData;
  }
  set correspondencePreviewData(value: any) {
    this._correspondencePreviewData = value;
    if (this._correspondencePreviewData) {
      this.showPreviewFilename();
    }
  }

  @Output() closed = new EventEmitter<any>();
  @Output() saved = new EventEmitter();

  private _correspondencePreviewData: any;
  safePreviewFilename: SafeUrl;
  safeViewFilename: string;
  safeEditFilename: string;
  downloadPDFUrl: string;
  docformatPDF: boolean;
  docformatImage: boolean;
  docformatDOCX: boolean;
  previewFilename: string;
  documentApiUrl = environment.documentApiUrl;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    public appInfo: AppInfoService,
    public screenService: ScreenService,
    public userStore: UserStore,
    private siteStore: SitesStore,
  ) {
    super();
  }

  ngOnInit() {
  }

  public viewClickHandler() {
  }

  public editClickHandler() {
  }

  showPreviewFilename() {
    const selectedSite = this.siteStore.getSelectedSite();
    const mySiteRef = selectedSite.siteRef;

    this.safePreviewFilename = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
    this.safeViewFilename = 'about:blank';
    this.safeEditFilename = 'about:blank';
    $('#correspondenceEditDocumentButton').css('display', 'none');
    this.docformatImage = false;
    this.docformatPDF = false;
    this.docformatDOCX = false;
    this.downloadPDFUrl = '';

    if (this.correspondencePreviewData.documentFile != null) {
      const fileExtension = this.correspondencePreviewData.fileType.toUpperCase();
      if (fileExtension === 'DOCX') {
        const myParams = {
          SiteID: mySiteRef,
          Context: 'ePracticeDocs',
          FileID: 'Correspondence\\' + this.correspondencePreviewData.documentFile,
          Mode: 'Embedded',
          Action: 'View',
        };
      }
      if (fileExtension === 'PDF') {
        const myParams = {
          SiteID: mySiteRef,
          Context: 'ePracticeDocs',
          FileID: 'Correspondence\\' + this.correspondencePreviewData.documentFile,
        };
      }
      if (fileExtension === 'JPG' || fileExtension === 'PNG' || fileExtension === 'BMP') {
        this.previewFilename = this.documentApiUrl + '/ViewGraphic?SiteID=' + mySiteRef +
          '&Context=ePracticeDocs&FileID=Correspondence\\' + this.correspondencePreviewData.documentFile
          + '&Token=' + this.userStore.getAuthToken();
        this.safePreviewFilename = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewFilename);
        this.safeViewFilename = this.previewFilename;
        this.docformatImage = true;
        this.changeDetectorRef.detectChanges();
      }

    } else {
      this.previewFilename = 'about:blank';
      this.safePreviewFilename = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
    }
    this.changeDetectorRef.detectChanges();
  }

  editDocument() {
    const selectedSite = this.siteStore.getSelectedSite();
    const mySiteRef = selectedSite.siteRef;
    const data = this.correspondencePreviewData;
    const fileExtension = data.fileType.toUpperCase();
    if (fileExtension === 'DOCX') {
      const myParams = {
        SiteID: mySiteRef,
        Context: 'ePracticeDocs',
        FileID: 'Correspondence\\' + data.documentFile,
        Mode: 'Normal',
        Action: 'Edit',
      };
    }
    if (fileExtension === 'PDF') {
    }
    if (fileExtension === 'JPG' || fileExtension === 'PNG' || fileExtension === 'BMP') {
      this.previewFilename = this.documentApiUrl + '/ViewGraphic?SiteID=' + mySiteRef +
        '&Context=ePracticeDocs&FileID=Correspondence\\' + data.documentFile
        + '&Token=' + this.userStore.getAuthToken();
      this.safePreviewFilename = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewFilename);
      this.safeViewFilename = this.previewFilename;
      const win = window.open(this.previewFilename, '_blank');
      win.opener = null;
      win.focus();
    }
  }

  GetMyDocumentId(urlParams: any) {
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

  cancel() {
    this.closed.emit();
  }
}