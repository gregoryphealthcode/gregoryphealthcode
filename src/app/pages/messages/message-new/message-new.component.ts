import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, Input } from '@angular/core';
import { Location } from '@angular/common';
import { DxFormComponent, DxHtmlEditorComponent } from 'devextreme-angular';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { AppInfoService, ScreenService } from 'src/app/shared/services';
import ODataStore from 'devextreme/data/odata/store';
import Query from 'devextreme/data/query';
import Guid from 'devextreme/core/guid';
import validationEngine from 'devextreme/ui/validation_engine';
import { AuditModel, UserService } from 'src/app/shared/services/user.service';
import 'devextreme/ui/html_editor/converters/markdown';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { UserStore } from 'src/app/shared/stores/user.store';
import { SitesStore } from 'src/app/shared/stores/sites.store';

@AutoUnsubscribe
export class MessageModel {
  UniqueNo: number;
  MessageId: Guid;
  SiteId: Guid;
  RecipientId: Guid;
  SenderId: Guid;
  MessageDateTime: Date;
  Folder: string;
  Subject: string;
  FlagRed: boolean;
  FlagAmber: boolean;
  MessageText: any;
  IsRead: boolean;
}

@Component({
  selector: 'app-message-new',
  templateUrl: './message-new.component.html',
  styleUrls: ['./message-new.component.scss']
})
export class MessageNewComponent implements OnInit, AfterViewInit {
  @ViewChild('messageform') messageform: DxFormComponent;
  @ViewChild('htmleditor') htmleditor: DxHtmlEditorComponent;

  @Input() patientId: string;
  @Input() id: string;
  @Input() isInPopUp: boolean;
  @Input() Mode: string;

  @Output() MessageClosed = new EventEmitter();

  issmallscreen = false;
  mySiteRef = '';
  public showAttachmentPreview = false;
  isDropDownBoxOpened = false;
  uploadFilesValue: any[] = [];
  notetypes: any[];
  MessagesStore: ODataStore;
  UsersStore: any;
  users: any[];
  recipients: any[];
  jsonData: any;
  messageData: any = {
    SiteId: '',
    MessageDateTime: new Date(Date.now()),
  };
  dateCreated: number;
  todayButton: any;
  prevDateButton: any;
  nextDateButton: any;
  millisecondsInDay = 24 * 60 * 60 * 1000;
  screensize: any;
  preflabellocation = 'left';

  constructor(
    public appInfo: AppInfoService, public router: Router,
    public _location: Location, public screenService: ScreenService,
    public userService: UserService,
    private userStore: UserStore,
    private siteStore: SitesStore) {
    this.screensize = screenService.sizes;

    if (this.screenService.sizes['screen-small'] || this.screenService.sizes['screen-x-small']) {
      this.issmallscreen = true;
    }
    const loadoptions = {
      expand: ['User']
    };
    this.UsersStore.load(loadoptions).then(data => {
      data.forEach(item => {
        try {
          item.DisplayName = item.User.DisplayValue;
        } catch (e) { }
      });
      const selectedData = Query(data)
        .sortBy('User.DisplayName').toArray();
      this.users = selectedData;
    });
  }

  valueChange(value) {
    this.messageData.MessageText = value;
  }

  onFormSubmit(e) {
    console.log('form submitted');
  }

  closeDropDownBox(args) {
    this.isDropDownBoxOpened = false;
  }

  cancelClicked(e) {
    console.log('cancel clicked');
    this.MessageClosed.emit(true);
    if (!this.isInPopUp) {
      this._location.back();
    }
  }

  addMessageForm(mymessage: MessageModel) {
    mymessage.Folder = 'Inbox';
    mymessage.UniqueNo = undefined;
    console.log('add message: ', mymessage);
    this.MessagesStore.insert(mymessage).then(
      (dataObj) => {
        notify('Message Sent.', 'success');
        const auditModel: AuditModel = {
          userId: this.userStore.getUserId(),
          siteId: this.userStore.getSiteId(),
          eventCategory: 'Info',
          eventCode: 'MessageSent',
          details: 'Message sent.',
          reportedBy: 'ePractice',
          reason: '',
          patientId: null
        };
        this.userService.addAuditLog(auditModel).subscribe();
      },
      (error) => {
        console.log('Error sending message: ', error);
        const errorText = 'Error sending message! :' + error;
        notify(errorText, 'error');
      }
    );
  }

  saveMessageClicked(e) {
    console.log('save message clicked. Mode: ', this.Mode);
    const validationResult = validationEngine.validateGroup('messageData');
    if (!validationResult.isValid) {
      return;
    }

    if (this.Mode === 'Add') {
      const tmpid = new Guid();
      const mymessage: MessageModel = {
        UniqueNo: null,
        MessageId: tmpid.toString(),
        SiteId: this.userStore.getSiteId(),
        RecipientId: this.messageData.RecipientId,
        SenderId: this.userStore.getUserId(),
        MessageDateTime: this.messageData.MessageDateTime,
        Folder: this.messageData.Folder,
        Subject: this.messageData.Subject,
        FlagRed: false,
        FlagAmber: false,
        MessageText: this.messageData.MessageText,
        IsRead: false
      };
      this.addMessageForm(mymessage);
    } else {

    }
    if (!this.isInPopUp) {
      this._location.back();
    } else {
      this.MessageClosed.emit(true);
    }
  }

  form_fieldDataChanged(e) {
  }

  searchInputChanged(data) {

  }

  ngOnInit() { }

  formfieldDataChanged(e) {
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    setTimeout(() => {
      try {
      } catch { }
    }, 750);
    const selectedSite = this.siteStore.getSelectedSite();
    this.mySiteRef = selectedSite.siteRef;
  }
}