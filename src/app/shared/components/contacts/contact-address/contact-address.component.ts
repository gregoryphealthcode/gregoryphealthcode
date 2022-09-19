import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { Component, OnDestroy, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { FormGroup } from '@angular/forms';
import { Address, ContactService } from 'src/app/shared/services/contact.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { UserService } from 'src/app/shared/services/user.service';
import Guid from 'devextreme/core/guid';
import { AppInfoService } from 'src/app/shared/services/app-info.service';

@Component({
  selector: 'app-contact-address',
  templateUrl: './contact-address.component.html',
  styleUrls: ['./contact-address.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' },
})
@AutoUnsubscribe
export class ContactAddressComponent extends SubscriptionBase implements OnDestroy, OnInit, OnChanges {
  constructor(
    private contactService: ContactService,
    private snackBar: MatSnackBar,    public appInfo: AppInfoService
  ) {
    super();
  }

  @ViewChild('grdContactAddresses') gridContactAddressGrid: DxDataGridComponent;

  @Input()
  get contactId(): string {
    return this._contactId;
  }
  set contactId(value: string) {
    this._contactId = value;
  }
  @Input()
  get siteId(): string {
    return this._siteId;
  }
  set siteId(value: string) {
    this._siteId = value;
  }

  private _siteId: string;
  private _contactId: string;

  showPopup: boolean; 
  form: FormGroup;
  validAddressType = false;
  addresses: Address[] = [];
  addressId: Guid;
  isNew = false;
  showPanel = false;

  ngOnInit(): void {
    if (this.contactId !== undefined) {
      this.getAddresses();
    }
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void { }

  onFocusedRowChanged(e) {
    this.showPanel = true;
    this.addressId = e.row.data.addressId;
  }

  getAddresses() {
    this.subscription.add(
      this.contactService.getContactAddresses(this.contactId).subscribe((data) => {
        this.addresses = data;
        const index = this.addresses.findIndex(
          (x) => x.primaryAddress === true
        );
        this.gridContactAddressGrid.instance.option(
          'focusedRowIndex',
          index
        );
      })
    );
  }

  editAddress() {
    this.edit(this.addressId);
  }

  public doubleClickHandled(e) {
    this.edit(e.data.addressId);
  }

  private edit(addressId: Guid) {
    this.isNew = false;
    this.addressId = addressId;
    this.showPopup = true;
  }

  add() {
    this.isNew = true;
    this.showPopup = true;
  }

  hidePopup() {
    this.showPopup = false;
  }

  save() {
    console.log("here");
    this.showPopup = false;
    this.snackBar.open('Address updated', 'Close', {
      panelClass: 'badge-success',
      duration: 3000,
    });
    this.getAddresses();
  }

  delete() {
    this.contactService.deleteContactAddress(this.addressId).subscribe(x => {
      if (x) {
        this.snackBar.open('Address deleted', 'Close', {
          panelClass: 'badge-success',
          duration: 3000,
        });
        this.getAddresses();
      }
      else {
        this.snackBar.open("Unable to delete address", 'Close', {
          panelClass: 'badge-danger',
          duration: 3000,
        });
      }
    })
  }
}