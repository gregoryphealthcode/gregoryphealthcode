import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { ContactService, TelecomsViewModel } from 'src/app/shared/services/contact.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DxDataGridComponent } from 'devextreme-angular';
import Guid from 'devextreme/core/guid';
import { AppInfoService } from 'src/app/shared/services/app-info.service';

@Component({
  selector: 'app-contact-telecom',
  templateUrl: './contact-telecom.component.html',
  styleUrls: ['./contact-telecom.component.scss'],
})
@AutoUnsubscribe
export class ContactTelecomComponent extends SubscriptionBase implements OnInit {
  constructor(
    private contactService: ContactService,
    private snackBar: MatSnackBar,
    public appInfo: AppInfoService
  ) {
    super();
  }

  @ViewChild('grdContactTelecom') gridContactTelecomGrid: DxDataGridComponent;

  @Input() contactId: Guid;
  @Input() siteId: Guid;
  
  telecoms: TelecomsViewModel[];
  telecomId: Guid;
  isNew = false;
  showPopup: boolean;

  ngOnInit(): void {
    this.getTelecoms();
  }

  getTelecoms() {
    this.contactService.getContactTelecoms(this.contactId, this.siteId).subscribe(x => {
      this.telecoms = x;
    });
  }

  onFocusedRowChanged(e) {
    this.telecomId = e.row.data.telecomId;
  }

  editTelecom() {
    this.edit(this.telecomId);
  }

  public doubleClickHandled(e) {
    this.edit(e.data.telecomId);
  }

  private edit(telecomId: Guid) {
    this.isNew = false;
    this.telecomId = telecomId;
    this.showPopup = true;
  }

  add() {
    this.isNew = true;
    this.showPopup = true;
  }

  hidePopup() {
    this.showPopup = false;
  }

  save(e: TelecomsViewModel[]) {
    this.showPopup = false;
    this.snackBar.open('Contact details updated', 'Close', {
      panelClass: 'badge-success',
      duration: 3000,
    });
    this.getTelecoms();
  }

  delete() {
    this.contactService.deleteContactTelecom(this.telecomId).subscribe(x => {
      if (x) {
        this.snackBar.open('Contact details deleted', 'Close', {
          panelClass: 'badge-success',
          duration: 3000,
        });
        this.getTelecoms();
      }
      else {
        this.snackBar.open("Contact details could not be deleted", 'Close', {
          panelClass: 'badge-danger',
          duration: 3000,
        });
      }
    })
  }
}