import { Component, OnDestroy, OnInit, Input, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { SitesService } from 'src/app/shared/services/sites.service';
import { PatientService } from 'src/app/shared/services/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { MatDialog } from '@angular/material/dialog';
import { PatientContactDetails, ContactListViewModel, ContactService, ContactDetailsModel } from 'src/app/shared/services/contact.service';
import { DialogTemplateComponent } from 'src/app/shared/components/dialog/dialog-template.component';
import { DxPopupComponent, DxTextBoxComponent } from 'devextreme-angular';
import { ContactTypeViewModel } from 'src/app/shared/models/ContactTypeViewModel';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';


@Component({
  selector: 'app-patient-connections',
  templateUrl: './patient-connections.component.html',
  styleUrls: ['./patient-connections.component.scss']
})

@AutoUnsubscribe
export class PatientConnectionsComponent extends SubscriptionBase implements OnDestroy, OnInit {
  @ViewChild('selectConnectionPopup') selectConnectionPopup: DxPopupComponent;
  @ViewChild('editConnectionPopup') editContactPopup: DxPopupComponent;
  @ViewChild('summaryConnectionPopup') summaryConnectionPopup: DxPopupComponent;
  @ViewChild('theirRef') theirRef: DxTextBoxComponent;

  @Input() selectedContactId: string;
  @Input() patientId: string;
  @Input() siteId: string;

  gluContactTypes: ContactTypeViewModel[] = [];
  contacts: PatientContactDetails[] = [];
  selectedRowsData: ContactListViewModel;
  organisationId: string;
  contactVM: ContactDetailsModel;
  showEditConnection = false;
  showSummaryView = false;
  filterOn: ContactTypeViewModel;
  contactId: string;
  contactClassification: number;
  contactName: string;
  showPanel = false;
  isEdit: boolean;
  showExistingContactsList = false;
  showReferrers = false;

  constructor(
    private siteService: SitesService,
    private patientService: PatientService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private contactService: ContactService,
    public appInfo: AppInfoService,
    private appMessage: AppMessagesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getContactTypes();
    if (this.patientId !== undefined) {
      this.getPatientContacts();
    }
  }

  getPatientContacts() {
    this.patientService.getContacts(this.patientId).subscribe(data => {
      this.contacts = data;
    });
  }

  viewSummary(e) {
    this.contactName = e.row.data.displayName;
    this.selectedRowsData = e.row.data;
    this.showSummaryView = true;
  }

  editClicked(e) {
    this.contactId = e.row.data.contactId;
    this.showReferrers = true;
    this.isEdit = true;
  }

  getContactTypes() {
    this.subscription.add(this.siteService.getContactTypes().subscribe(data => {
      this.gluContactTypes = data;
    }));
  }

  onFocusedRowChanged(e) {
    this.showPanel = true;
    this.selectedRowsData = e.row.data;
  }

  deleteClicked(e) {
    const callback = () => {
      this.spinnerService.start();
      this.patientService.deletePatientContact(e.key.uniqueNo).subscribe(data => {
        this.snackBar.open('Contact unlinked', 'Close', {
          panelClass: 'badge-success',
          duration: 3000
        });
        this.showPanel = false;
        this.getPatientContacts();
        this.spinnerService.stop();
      },
        error => {
          this.snackBar.open('An error occurred', 'Close', {
            panelClass: 'badge-danger',
            duration: 3000
          });
          this.spinnerService.stop();
        });
    }

    this.appMessage.showDeleteConfirmation(callback, "Are you sure you want to unlink this contact?", "Unlink Contact");
  }
  
  enterRef(e) {
    const model: PatientContactDetails = new PatientContactDetails();
    model.uniqueNo = this.selectedRowsData.uniqueNo;
    model.referrer = this.selectedRowsData.referrer;
    model.theirRef = this.theirRef.instance.option('text');
    this.updateContactToPatient(model);
  }
  
  handleValueChange(e) {
    const model: PatientContactDetails = new PatientContactDetails();
    model.uniqueNo = this.selectedRowsData.uniqueNo;
    model.referrer = e.value;
    model.theirRef = this.selectedRowsData.theirRef;
    this.updateContactToPatient(model);
  }

  private updateContactToPatient(model: PatientContactDetails) {
    this.subscription.add(
      this.contactService.updateContactPatient(model).subscribe((value) => {
        this.getPatientContacts();
      })
    );
  }

  selectedExistingContact(item) {
    this.contactId = item.contactId;
    this.organisationId = item.connectionId;
    this.showExistingContactsList = false;
    this.showReferrers = true;
  }

  getBackgroundColor(cellInfo) {
    return cellInfo.data.backgroundColor;
  }
}