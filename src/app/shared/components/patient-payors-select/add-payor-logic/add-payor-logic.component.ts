import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from "@angular/core";
import { DxContextMenuComponent } from "devextreme-angular";
import Guid from "devextreme/core/guid";
import { switchMap, tap } from "rxjs/operators";
import {
  GetPatientPotentialPayorResponseModel,
  InvoiceAddEditService,
  InvoicePayorTypeEnum,
} from "src/app/pages/accounts/invoice-add-edit/invoice-add-edit.service";
import { SubscriptionBase } from "src/app/shared/base/subscribtion.base";
import { AppInfoService } from "src/app/shared/services/app-info.service";
import { ContactModel, ContactService } from "src/app/shared/services/contact.service";
import { RelatedPersonService } from "src/app/shared/services/related-person.service";

@Component({
  selector: "app-add-payor-logic",
  templateUrl: "./add-payor-logic.component.html",
  styleUrls: ["./add-payor-logic.component.scss"],
})
export class AddPayorLogicComponent extends SubscriptionBase implements OnInit {
  @ViewChild(DxContextMenuComponent) menu: DxContextMenuComponent;

  @Input() patientId: string;
  @Input() targetId: string;
  @Input() showInsurers: boolean;

  @Output() added = new EventEmitter<any>();

  public showInsurerPopup: boolean;
  public showRelatedPopup = false;

  public showAddContact = false;
  public contactClassification = 1;

  public showExistingContactsList = false;
  public showReferrers = false;
  public contactId: string;

  public contacts: GetPatientPotentialPayorResponseModel[];
  public related: GetPatientPotentialPayorResponseModel[];

  public dataSource: any;

  // @HostListener('click', ['$event'])
  // public onClick(): void {
  //   this.menu.instance.show()
  // }

  constructor(
    private relatedPersonsService: RelatedPersonService,
    private contactService: ContactService,
    private payorsService: InvoiceAddEditService,
    public appInfo: AppInfoService
  ) {
    super();
  }

  show() {
    this.menu.instance.show();
  }

  addedPayor(payorId) {
    this.added.emit(payorId);
    this.menu.instance.hide();
  }


  ngOnInit() {
    this.subscription.add(this.getPotentialPayors$(this.patientId).subscribe());
    this.setupDataSource();
  }

  private getPotentialPayors$(patientId) {
    return this.payorsService.getPotentialPayors(patientId).pipe(
      tap((x) => {

        x.contacts.forEach(el => el.icon = 'fal fa-user-circle');
        x.related.forEach(el => el.icon = 'fal fa-user-circle');

        const startIndex = this.showInsurers ? 1 : 0;

        this.dataSource[startIndex].items.splice(2, this.dataSource[startIndex].items.length);
        this.dataSource[startIndex].items.push(x.contacts);

        this.dataSource[startIndex + 1].items.splice(1, this.dataSource[startIndex + 1].items.length);
        this.dataSource[startIndex + 1].items.push(x.related);
      })
    );
  }

  private setupDataSource() {
    this.dataSource = [
      {
        firstName: "From Contact",
        icon: "fal fa-address-book",
        items: [
          { firstName: "From Existing", payorId: "FromExisting", icon: "fal fa-plus", type: InvoicePayorTypeEnum.Contact, break: true },
          { firstName: "New Person", payorId: "NewContact", icon: "fal fa-plus", type: InvoicePayorTypeEnum.Contact, break: true },
          { firstName: "New Organisation", payorId: "NewOrganisation", icon: "fal fa-plus", type: InvoicePayorTypeEnum.Contact, break: true }
        ],
      },
      {
        firstName: "From Related",
        icon: "fal fa-user-friends",
        items: [
          { firstName: "New Related", payorId: "NewRelated", icon: "fal fa-plus", type: InvoicePayorTypeEnum.Relative, break: true }
        ],
      }
    ];

    if (this.showInsurers) {
      this.dataSource.unshift(
        {
          firstName: "New Insurer",
          icon: "fal fa-plus",
          payorId: "NewInsurer",
          type: InvoicePayorTypeEnum.Insurer,
        }
      )
    }
  }

  itemClick(e) {
    if (!e.itemData.items) {
      const item = e.itemData;
      if (item.type === InvoicePayorTypeEnum.Insurer && item.payorId == "NewInsurer") {
        this.showInsurerPopup = true;
        return;
      }

      if (item.type === InvoicePayorTypeEnum.Contact && item.payorId) {
        switch (item.payorId) {
          case 'FromExisting':
            this.showExistingContactsList = true;
            break;
          case 'NewContact':
            this.addContact();
            break;
          case 'NewOrganisation':
            this.addOrganisation();
            break;
          default:
            this.setContactAsPayor(item.payorId);
            break;
        }
        return;
      }

      if (item.type === InvoicePayorTypeEnum.Relative && item.payorId) {
        switch (item.payorId) {
          case 'NewRelated':
            this.showRelatedPopup = true;
            break;
          default:
            this.setRelatedAsPayor(item.payorId);
            break;
        }
        return;
      }
    }
  }

  private addContact() {
    this.contactClassification = 1;
    this.showAddContact = true;
  }

  private addOrganisation() {
    this.contactClassification = 2;
    this.showAddContact = true;
  }

  public setRelatedAsPayor(relatedPersonId) {
    this.subscription.add(
      this.relatedPersonsService
        .setAsPayor(relatedPersonId)
        .pipe(
          tap(() => this.addedPayor(relatedPersonId)),
          switchMap(() => this.getPotentialPayors$(this.patientId)))
        .subscribe()
    );
  }

  public contactAdded(contactSavedResponse: any) {
    if (contactSavedResponse.data)
      this.contactId = contactSavedResponse.data.contactId;
    else
      this.contactId = contactSavedResponse.contactId;
    var request = new ContactModel();
    request.patientId = this.patientId,
      request.contactId = this.contactId,
      request.theirRef = '',
      request.referrer = false,
      request.isPrimary = false,

      this.showAddContact = false;
    this.showExistingContactsList = false;

    let id = this.contactId;
    if (contactSavedResponse.data) {
      if (contactSavedResponse.data.connectionId)
        id = contactSavedResponse.data.connectionId;
    }
    else {
      if (contactSavedResponse.connectionId)
        id = contactSavedResponse.connectionId;
    }

    this.subscription.add(
      this.contactService
        .addContactToPatient(request)
        .pipe(
          switchMap(() => this.setContactAsPayor$(id))
        )
        .subscribe()
    );
  }

  public relatedAdded(relatedSavedResponse: any) {
    this.showRelatedPopup = false
    const relatedId = relatedSavedResponse.data;
    this.setRelatedAsPayor(relatedId);
  }

  public setContactAsPayor(contactId: string) {
    this.subscription.add(
      this.setContactAsPayor$(contactId)
        .subscribe()
    );
  }

  public setContactAsPayor$(contactId: string) {
    return this.contactService.setAsPayor(contactId)
      .pipe(
        tap(() => this.addedPayor(contactId)),
        switchMap(() => this.getPotentialPayors$(this.patientId))
      )
  }

  insurerAddedHandler(e) {
    this.added.emit(e);
  }
}
