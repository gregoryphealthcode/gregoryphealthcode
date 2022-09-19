import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { tap } from "rxjs/operators";
import { AppMessagesService } from "src/app/shared/services/app-messages.service";
import { Address, ContactDepartmentsModel, ContactDetailsModel, ContactLinkedContactsModel, ContactModel, ContactService, linkedDepartmentModel, linkedPatientModel, } from "src/app/shared/services/contact.service";
import { SpinnerService } from "src/app/shared/services/spinner.service";

@Injectable()
export class ContactViewStore {
  private contactId = new BehaviorSubject<string>(undefined);
  public contactId$ = this.contactId.asObservable();

  private contact = new BehaviorSubject<ContactDetailsModel>(undefined);
  public contact$ = this.contact.asObservable().pipe(
    tap((x) => {
      if (x && !x.displayName) {
        x.displayName = x.firstName + " " + x.lastName;
      }
      if (x && x.addresses) {
        this.addresses.next(x.addresses);
      }     
    })
  );

  private patients = new BehaviorSubject<linkedPatientModel[]>(undefined);
  public patients$ = this.patients.asObservable();

  private addresses = new BehaviorSubject<Address[]>(undefined);
  public addresses$ = this.addresses.asObservable();

  private departments = new BehaviorSubject<ContactDepartmentsModel>(undefined);
  public departments$ = this.departments.asObservable();

  private linkedContacts = new BehaviorSubject<ContactLinkedContactsModel>(undefined);
  public linkedContacts$ = this.linkedContacts.asObservable();

  private addressToAddOrEdit = new BehaviorSubject<string>(undefined);
  public addressToAddOrEdit$ = this.addressToAddOrEdit.asObservable();

  private telecomToAddOrEdit = new BehaviorSubject<string>(undefined);
  public telecomToAddOrEdit$ = this.telecomToAddOrEdit.asObservable();

  private departmentToAddOrEdit = new BehaviorSubject<string>(undefined);
  public departmentToAddOrEdit$ = this.departmentToAddOrEdit.asObservable();

  private tabIndex = new BehaviorSubject<number>(0);
  public tabIndex$ = this.tabIndex.asObservable();

  public organisationCount = 0;

  constructor(
    private spinner: SpinnerService,
    private contactService: ContactService,
    private snackBar: MatSnackBar,
    private appMessages: AppMessagesService,
    private router: Router
  ) { }

  public setTab(tabIndex: number) {
    this.tabIndex.next(tabIndex);
  }

  public getContact(contactId: string) {
    this.spinner.start();
    this.contactId.next(contactId);

    this.getContactDetails$();
    this.getContactLinks$();
    this.getContactDepartments$();
    this.getContactPatients$();      
  }

  getContactDetails$() {
    this.contactService
      .getContactDetails(this.contactId.value)
      .subscribe((x) => {
        this.contact.next(x);
      });
  }

  getContactLinks$() {
    this.contactService.getContactLinks(this.contactId.value).subscribe((x) => {
      this.linkedContacts.next(x);
      this.organisationCount = x.linkedOrganisations.length;
    });
  }

  getContactDepartments$() {
    this.contactService.getContactDepartments(this.contactId.value).subscribe((x) => {
      this.departments.next(x);
    });
  }

  getContactPatients$() {
    this.contactService.getContactPatients(this.contactId.value).subscribe((x) => {
      this.patients.next(x);
      this.spinner.stop();
    });
  }

  public showAddAddress() {
    this.addressToAddOrEdit.next("0");
  }

  public showUpdateAddress(addressId: string) {
    this.addressToAddOrEdit.next(addressId);
  }

  public deleteAddress(addressId) {
    const text = 'Are you sure you want to delete this Address?'

    const callback = () => {
      this.spinner.start();
      this.contactService.deleteContactAddress(addressId).subscribe(
        (x) => {
          this.spinner.stop();
          this.snackBar.open("Address deleted", "Close", {
            panelClass: "badge-success",
            duration: 3000,
          });
          this.getContactDetails$();
        },
        (e) => { this.spinner.stop(); this.appMessages.showApiErrorNotification(e) }
      );
    };

    this.appMessages.showDeleteConfirmation(callback, text);
  }

  public showAddTelecom() {
    this.telecomToAddOrEdit.next("0");
  }

  public showUpdateTelecom(telecomId: string) {
    this.telecomToAddOrEdit.next(telecomId);
  }

  public deleteTelecom(telecomId) {
    const text = 'Are you sure you want to delete this Telecom?'

    const callback = () => {
      this.spinner.start();
      this.contactService.deleteContactTelecom(telecomId).subscribe(
        (x) => {
          this.snackBar.open("Telecom deleted", "Close", {
            panelClass: "badge-success",
            duration: 3000,
          });
          this.spinner.stop();
          this.getContactDetails$();
        },
        (e) => { this.spinner.stop(); this.appMessages.showApiErrorNotification(e) }
      );
    };

    this.appMessages.showDeleteConfirmation(callback, text);
  }

  deleteContact(): void {
    const text = 'Are you sure you want to delete this Contact?'

    const callback = () => {
      this.spinner.start();
      this.contactService
        .deleteContact(this.contactId.value)
        .subscribe((data) => {
          if (data) {
            this.appMessages.showSuccessInformationModal(
              "Contact successfully deleted!"
            );
            this.spinner.stop();
            this.router.navigate(["/contacts/list-contacts"]);
          } else {
            this.appMessages.showSwallError("Unable to delete contact!")
          }
        });
    };

    this.appMessages.showDeleteConfirmation(callback, text);
  }

  view(contactId: string) {
    this.router.navigate(["/view-contact/" + contactId]);
  }

  unlinkConnection(connectionId: string) {
    const text = 'Are you sure you want to unlink this Contact?'

    const callback = () => {
      this.spinner.start();
      this.contactService.deleteConnection(this.contactId.value, connectionId).subscribe(x => {
        this.spinner.stop();
        this.snackBar.open("Contact link removed", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
        this.getContactLinks$();
      },
        (e) => { this.spinner.stop(); this.appMessages.showApiErrorNotification(e) }
      );
    };
    this.appMessages.showDeleteConfirmation(callback, text, "Unlink Confirmation");
  }

  unlinkPatient(patientId: string) {
    const text = 'Are you sure you want to unlink this Patient?'

    const callback = () => {
      this.spinner.start();
      this.contactService.unlinkPatient(this.contactId.value, patientId).subscribe(x => {
        this.spinner.stop();
        this.snackBar.open("Patient link removed", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
        this.getContactPatients$();
      },
        (e) => { this.spinner.stop(); this.appMessages.showApiErrorNotification(e) }
      );
    };
    this.appMessages.showDeleteConfirmation(callback, text);
  }

  addConnection(connectionId: string) {
    this.spinner.start();
    this.contactService.addConnection(this.contactId.value, connectionId).subscribe(x => {
      this.spinner.stop();
      this.getContactLinks$();
    },
      (e) => { this.spinner.stop(); this.appMessages.showApiErrorNotification(e) }
    );
  }

  addDepartmentConnection(e) {
    this.spinner.start();
    this.contactService.addDepartmentConnection(this.contactId.value, e).subscribe(x => {
      this.spinner.stop();
      this.getContactDepartments$();
    },
      (e) => { this.spinner.stop(); this.appMessages.showApiErrorNotification(e) }
    );
  }

  linkPatient(model: ContactModel) {
    this.spinner.start();
    this.contactService.linkPatient(model).subscribe(x => {
      this.spinner.stop();
      this.getContactPatients$();
    },
      (e) => { this.spinner.stop(); this.appMessages.showApiErrorNotification(e) }
    );
  }

  deleteDepartment(departmentId: string) {
    const text = 'Are you sure you want to delete this Department from the organisation?'

    const callback = () => {
      this.spinner.start();
      this.contactService.deleteDepartment(this.contactId.value, departmentId).subscribe(x => {
        this.spinner.stop();
        this.getContactDepartments$();
        this.snackBar.open("Department deleted", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
      },
        (e) => { this.spinner.stop(); this.appMessages.showApiErrorNotification(e) }
      );
    };
    this.appMessages.showDeleteConfirmation(callback, text);
  }

  unlinkDepartment(departmentId: string) {
    const text = 'Are you sure you want to unlink this Department?'

    const callback = () => {
      this.spinner.start();
      this.contactService.unlinkDepartment(this.contactId.value, departmentId).subscribe(x => {
        this.spinner.stop();
        this.getContactDepartments$();
        this.snackBar.open("Department link removed", "Close", {
          panelClass: "badge-success",
          duration: 3000,
        });
      },
        (e) => { this.spinner.stop(); this.appMessages.showApiErrorNotification(e) }
      );
    };
    this.appMessages.showDeleteConfirmation(callback, text);
  }
}