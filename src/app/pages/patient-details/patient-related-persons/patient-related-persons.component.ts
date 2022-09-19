import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { DialogTemplateComponent } from 'src/app/shared/components/dialog/dialog-template.component';
import { RelatedPersonService, RelatedPersonsViewModel } from 'src/app/shared/services/related-person.service';
import Guid from 'devextreme/core/guid';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';

@Component({
  selector: 'app-patient-related-persons',
  templateUrl: './patient-related-persons.component.html'
})

@AutoUnsubscribe
export class PatientRelatedPersonsComponent extends SubscriptionBase implements OnDestroy, OnInit {
  @Input() patientId: string;
  @Input() siteId: string;

  showPopup: boolean;
  relatedPersons: RelatedPersonsViewModel[] = [];
  relatedPersonData: RelatedPersonsViewModel;
  isEdit = false;
  showPanel = false;

  constructor(
    private relatedPersonService: RelatedPersonService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private appMessage: AppMessagesService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.patientId !== undefined) {
      this.getRelatedPersons();
    }
  }

  getRelatedPersons() {
    this.subscription.add(this.relatedPersonService.getRelatedPersonsForPatient(this.patientId).subscribe(data => {
      this.relatedPersons = data;
    }));
  }

  onFocusedRowChanged(e) {
    console.log(e);
    this.relatedPersonData = e.row.data;
    this.showPanel = true;
  }

  private edit(data: any) {
    this.isEdit = true;
    this.relatedPersonData = data;
    this.showPopup = true;
  }

  editClicked(e) {
    this.edit(e.data);
  }

  deleteClicked(e) {
    const callback = () => {
      this.spinnerService.start();
      this.relatedPersonService.deleteRelatedPerson(e.key.relatedPersonId).subscribe(x => {
        if (x.success) {
          this.snackBar.open('Related Person deleted successfully', 'Close', {
            panelClass: 'badge-success',
            duration: 3000
          });
        }
        else {
          this.snackBar.open(x.errors[0], 'Close', {
            panelClass: 'badge-danger',
            duration: 3000
          });
        }
        this.getRelatedPersons();
        this.relatedPersonData = null;
        this.spinnerService.stop();
      });
    }

    this.appMessage.showDeleteConfirmation(callback, "Are you sure you want to delete this related person?");
  }

  add() {
    this.isEdit = false;
    this.relatedPersonData = new RelatedPersonsViewModel();
    this.showPopup = true;
  }
}