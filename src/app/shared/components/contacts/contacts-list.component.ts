import { Component, OnInit, Input, Output, EventEmitter, ViewChild, } from '@angular/core';
import { Router, } from '@angular/router';
import {
  ContactService, ContactListViewModel, PatientContactDetails, LinkedPracticeDetailsViewModel, Address,
  ContactTelecomsViewModel, ContactGridModel, ContactDetailsModel,
} from 'src/app/shared/services/contact.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { PatientInsurerViewModel } from '../../services/patient.service';
import { DxTreeListComponent } from 'devextreme-angular';
import { SitesStore } from '../../stores/sites.store';
import { SubscriptionBase } from '../../base/subscribtion.base';
import { SpinnerService } from '../../services/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogTemplateComponent } from '../dialog/dialog-template.component';
import { MatDialog } from '@angular/material/dialog';
import { ContactTypeViewModel } from '../../models/ContactTypeViewModel';
import Guid from 'devextreme/core/guid';
import { UserStore } from '../../stores/user.store';
import { MedSecSiteSelectorComponent } from '../med-sec-site-selector/med-sec-site-selector/med-sec-site-selector.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
  styleUrls: ['./contacts-list.component.scss'],
})
@AutoUnsubscribe
export class ListContactsComponent extends SubscriptionBase implements OnInit { 
  @ViewChild('contactList') contactsList: DxTreeListComponent;
  @ViewChild(MedSecSiteSelectorComponent) siteSelector: MedSecSiteSelectorComponent;

  @Input() isInContactDetails = false;
  @Input() saveOnAddContact = true;
  @Input() isInPopup = false;
  @Input() addToContact = false;
  @Input() showButtons = true;
  @Input() filterOn: ContactTypeViewModel;
  @Input() addToPatient: boolean;
  @Input() parentContactId: Guid;
  @Input() connections: ContactGridModel[];
  @Input() classificationTypeId: number;
  @Input() patientId: string;
  @Input() isBilling: boolean;

  @Output() selectConnectionFormOK = new EventEmitter();
  @Output() addOrgToContact = new EventEmitter();
  @Output() addContactToParentHandler = new EventEmitter();
  @Output() payorDetails = new EventEmitter<PatientInsurerViewModel>();
  @Output() contactAdded = new EventEmitter<PatientContactDetails>();
  @Output() selectedContactId = new EventEmitter();
  @Output() connectionsUpdated = new EventEmitter<ContactGridModel[]>();
  @Output() showConnection = new EventEmitter<boolean>();

  private searchCriteria: string | null;

  siteId: string;
  contacts: ContactGridModel[] = [];
  filteredContacts: ContactListViewModel[] = [];
  _addToPatient: boolean;
  _patientId: string;
  referrer = false;
  theirRef: string;
  searchPanel: any;
  rowsExpanded = false;
  contactId: string;
  showPanel = false;
  telecomSystem: ContactTelecomsViewModel = new ContactTelecomsViewModel();
  contactClassification = 1;
  isGP = false;
  isPerson = false;
  primaryAdress: Address;
  preferredMethod: string;
  preferredMethodValue: string;
  mode = 'fullBranch';
  term = '';
  searchTypeSelected = '';
  searchTimeout: any;
  searchContactClassificationId = 0;
  contactVM: ContactDetailsModel;
  linkedPracticeVM: LinkedPracticeDetailsViewModel = new LinkedPracticeDetailsViewModel();
  selectedRow: ContactListViewModel;
  showAddOrganisation = false;
  showAddContact = false;
  searchClassification: number = 0;
  defaultContacts: ContactGridModel[] = [];
  selectContactType: string;
  selectedRowsData: ContactDetailsModel;
  minutesUntilSearch = 1;
  contextMenuItems = [
    {
      text: 'Item 1',
      icon: 'fas fa-print'
    },
    {
      text: 'Item 2',
      icon: 'fas fa-eye'
    },
    {
      text: 'Item 3',
      icon: 'fas fa-download'
    },
  ];

  items = [
    { id: 1, description: "New Person", icon: "far fa-user" },
    { id: 2, description: "New Organisation", icon: "far fa-building" },
    //{ id: 3, description: "New Department", icon: "far fa-project-diagram" }
  ];

  itemSelected;

  constructor(
    private router: Router,
    private siteStore: SitesStore,
    private contactService: ContactService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public userStore: UserStore,
    private authService: AuthService,
  ) {
    super();
  }

  setSearchItem(e) {
    this.searchCriteria = e.value;
  }

  onToolbarPreparing(e) { }

  ngOnInit(): void {
  }

  addContact() {
    this.contactClassification = 1;
    this.showAddContact = true;
  }

  addOrganisation() {
    this.contactClassification = 2;
    this.showAddContact = true;
  }

  addDepartment() {
    this.contactClassification = 3;
    this.showAddContact = true;
  }

  onRowClick(e) {
    const i = e.rowIndex + 1;
    this.contactsList.instance.expandRow(i);
  }

  selectedRowHandler(data) {
    if (data && data.contactId) {
      this.showPanel = true;
      this.contactId = data.contactId;
    }
  }

  itemClicked(item) {
    this.itemSelected = item;
    if (this.userStore.isMedSecUser() && !this.userStore.hasSelectedASite()) {
      this.siteSelector.show();
    } else {
      this.addClicked();      
    }
  }

  addClicked() {
    switch (this.itemSelected.id) {
      case 1:
        this.addContact();
        break;
      case 2:
        this.addOrganisation();
        break;
      case 3:
        this.addDepartment();
        break;
      default:
        break;
    }
  }

  doubleClickedRowHandler(data) {
    this.contactId = data.contactId;
    this.editContactDetails();
  }

  calculateWorkTelephone(rowData) {
    return 'n/a';
  }
  calculatePostcodeValue(rowData) {
    return 'n/a';
  }

  editContactsShown() {
  }

  editContactDetails() {
    this.router.navigate(['/view-contact/' + this.contactId]);
  }

  addContactToParent(e) {
    this.addContactToParentHandler.emit(e);
  }

  getPayorContacts() {
  }

  getSitePayorContacts() {
  }

  cancelClicked() {
    this.selectConnectionFormOK.emit(null);
  }

  clear(e) {
    if (e.value === '') {
      this.contactsList.instance.searchByText(e.value);
    }
  }


  setSearchFilter() {
    this.searchContactClassificationId = 2;
    this.searchTypeSelected = 'All';
  }

  delete(e) {
    this.deleteContact(e.row.data.contactId);
  }

  deleteContact(contactId: string) {
    const dialogRef = this.dialog.open(DialogTemplateComponent, {
      width: '250px',
      data: {
        title: 'Are you sure?',
        message: 'Are you sure you want to delete this item?',
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.spinnerService.start();
        this.subscription.add(
          this.contactService.deleteContact(contactId).subscribe(
            (data) => {
              this.snackBar.open('Contact deleted successfully', 'Close', {
                panelClass: 'badge-success',
                duration: 3000,
              });
              this.spinnerService.stop();
              this.showPanel = false;
            },
            (error) => {
              this.snackBar.open('An error occurred', 'Close', {
                panelClass: 'badge-danger',
                duration: 3000,
              });
              this.spinnerService.stop();
            }
          )
        );
      }
    });
  }

  handleItemClickEvent(e) {
  }

  treeViewItemContextMenu(e) {
  }

  continue() {
  }

  savedHandler() {
    if (this.userStore.isMedSecUser())
      this.unselectSite();
  }

  private unselectSite(callback?) {
    if (this.userStore.isMedSecUser()) {
      this.subscription.add(
        this.authService.unselectSite().subscribe(() => {
          if (callback) {
            callback();
          }
        })
      );
    }
  }
}