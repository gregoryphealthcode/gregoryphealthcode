import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { showSuccessSnackbar, showErrorSnackbar } from 'src/app/shared/helpers/other';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { CorrespondenceService } from 'src/app/shared/services/correspondence.service';
import { DocumentTemplateViewModel } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';

@Component({
  selector: 'app-templates-preferences',
  templateUrl: './templates-preferences.component.html',
  styleUrls: ['./templates-preferences.component.scss'],
  host: { class: 'd-flex flex-grow-1' }
})
@AutoUnsubscribe
export class TemplatesPreferencesComponent extends SubscriptionBase implements OnInit {
  showAddTemplate = false;
  templateDetails: DocumentTemplateViewModel;
  refreshSubject = new Subject();
  refresh: any;

  constructor(
    private appMessage: AppMessagesService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private correspondenceService: CorrespondenceService
  ) {
    super();
  }

  ngOnInit() {
    this.refreshSubject.subscribe(next => {
      this.refresh = next;
    })
  }

  newTemplate() {
    this.templateDetails = null;
    this.showAddTemplate = true;
  }

  edit(e) {
    this.templateDetails = e;
    this.showAddTemplate = true;
  }

  refreshGrid() {
    this.refreshSubject.next(true);
    setTimeout(() => {
      this.refreshSubject.next(false)
    }, 2000)
  }

  delete(e) {
    this.templateDetails = e;
    const text = `Are you sure you want to delete this template? `;
    this.appMessage.showAskForConfirmationModal(
      `Delete ${this.templateDetails.description} Template`,
      text,
      () => this.confirmDelete(this.templateDetails.templateId),
      () => { }

    );
    return;
  }

  confirmDelete(templateId) {

    this.spinnerService.start();
    this.subscription.add(this.correspondenceService.deleteTemplate(templateId).subscribe(data => {
      this.refreshGrid();
      showSuccessSnackbar(this.snackBar, `${this.templateDetails.description} Type Deleted`);
      this.spinnerService.stop();
    },
      error => {
        showErrorSnackbar(this.snackBar);
        this.spinnerService.stop();
      }));
  }
}