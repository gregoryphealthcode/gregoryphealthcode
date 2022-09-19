import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import Guid from "devextreme/core/guid";
import { tap } from "rxjs/operators";
import { SubscriptionBase } from "src/app/shared/base/subscribtion.base";
import { MedSecSiteSelectorComponent } from "src/app/shared/components/med-sec-site-selector/med-sec-site-selector/med-sec-site-selector.component";
import { AppInfoService } from "src/app/shared/services/app-info.service";
import { ContactDetailsModel, linkedPatientModel, TelecomsViewModel } from "src/app/shared/services/contact.service";
import { UserStore } from "src/app/shared/stores/user.store";
import { ContactViewStore } from "./contact-view-store.service";

@Component({
  selector: "app-contact-view",
  templateUrl: "./contact-view.component.html",
  styleUrls: ["./contact-view.component.scss"],
  providers: [ContactViewStore],
})
export class ContactViewComponent extends SubscriptionBase implements OnInit {
  @ViewChild(MedSecSiteSelectorComponent) siteSelector: MedSecSiteSelectorComponent;

  public selectedIndex = 1;

  public contactId: Guid;
  public patientId: Guid;

  patient: linkedPatientModel;

  public contact: ContactDetailsModel;
  contactClassification: number;
  public isOrganisation: boolean;

  showAddConnectionPopup: boolean;
  showAdditionalInfoPopup: boolean;
  showSelectDepartmentPopup: boolean;
  showAddDepartmentPopup: boolean;

  public addressId: any;
  public telecomId: any;
  public departmentId: any;
  public contactToEdit: any;
  public telecoms: TelecomsViewModel[];
  public isUpdate: boolean;

  public patientsCount: number;
  public organisationsCount: number = 0;
  public personsCount: number = 0;

  public addConnectionContactClassificationId: number;

  public badge: string;

  constructor(
    private route: ActivatedRoute,
    public store: ContactViewStore,
    private snackBar: MatSnackBar,
    public userStore: UserStore, public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit() {
    this.addToSubscription(
      this.route.params.pipe(
        tap((params) => {
          this.contactId = params.contactId;
          this.store.getContact(params.contactId);
        })
      )
    );

    this.addToSubscription(
      this.store.contact$.pipe(
        tap((x) => {
          if (x) {
            this.contact = x;
            this.telecoms = x.telecoms;
            this.contactClassification = this.contact.contactType.contactClassificationId;
            this.contactId = this.contact.contactId;
            this.isOrganisation = x.contactType.contactClassificationId > 1;

            if (this.isOrganisation) {
              this.addConnectionContactClassificationId = 1;
            } else {
              this.addConnectionContactClassificationId = 2;
            }
          }
        })
      )
    );

    this.addToSubscription(
      this.store.patients$.pipe(
        tap((x) => {
          if (x) {
            this.patientsCount = x.length;
          }
        })
      )
    )

    this.addToSubscription(
      this.store.addressToAddOrEdit$.pipe(
        tap((x) => {
          if (!x) return;
          this.addressId = { id: x };
        })
      )
    );

    this.addToSubscription(
      this.store.telecomToAddOrEdit$.pipe(
        tap((x) => {
          if (!x) return;
          this.telecomId = { id: x };
        })
      )
    );

    this.addToSubscription(
      this.store.departmentToAddOrEdit$.pipe(
        tap((x) => {
          if (!x) return;
          this.departmentId = { id: x };
        })
      )
    );
  }


  getBackgroundColor() {
    if (this.contact)
      return this.contact.backgroundColor;
  }

  addressSaved(e) {
    this.store.getContactDetails$();
    this.snackBar.open("Address updated", "Close", {
      panelClass: "badge-success",
      duration: 3000,
    });
  }

  telecomSaved(e) {
    this.store.getContactDetails$();
    this.snackBar.open("Telecom updated", "Close", {
      panelClass: "badge-success",
      duration: 3000,
    });
  }

  departmentSaved(e) {
    this.store.getContactDepartments$();
    this.snackBar.open("Department updated", "Close", {
      panelClass: "badge-success",
      duration: 3000,
    });
  }

  patientSelectedHandler(e) {
    this.patient = e;
  }

  patientAddedSelectedHandler(e) {
    this.patientId = e.patientId;
    this.showAdditionalInfoPopup = true;
  }

  editDepartmentHandler(e) {
    this.isUpdate = true;
    this.departmentId = e;
    this.showAddDepartmentPopup = true;
  }

  savedHandler(e) {
    this.showAddDepartmentPopup = false;
    if (!this.isUpdate)
      this.store.addDepartmentConnection(e.data.contactId);
    else {
      this.isUpdate = false;
      this.store.getContactDepartments$();
    }
  }

  showAddDepartmentPopupHandler() {
    if (this.userStore.isMedSecUser() && !this.userStore.hasSelectedASite()) {
      this.siteSelector.show();
    } else {
      this.showAddDepartmentPopup = true;
    }
  }

  addClicked() {
    this.showAddDepartmentPopup = true;
  }
}