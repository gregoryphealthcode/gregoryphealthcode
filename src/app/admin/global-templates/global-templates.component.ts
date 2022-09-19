import { Component, OnInit } from '@angular/core';
import { GridBase } from 'src/app/shared/base/grid.base';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { DocumentsService } from 'src/app/shared/services/documents.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { TemplateService } from 'src/app/shared/services/template.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-global-templates',
  templateUrl: './global-templates.component.html',
  styleUrls: ['./global-templates.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' },
})
export class GlobalTemplatesComponent extends GridBase implements OnInit {
  constructor(
    private appMessages: AppMessagesService,
    private templateService: TemplateService,
    private documentService: DocumentsService,
    private spinner: SpinnerService
  ) {
    super();
  }

  selectedRecord: any;
  action: string;

  ngOnInit() {
    this.getTemplates();
  }

  getTemplates() {
    this.controllerUrl = `${environment.baseurl}/glu_Templates/`;
    this.setupDataSource({
      key: 'id',
      loadParamsCallback: () => [
      ],
    });
  }

  saved(e) {
    if (e.success) {
      if (this.action == "Add")
        this.appMessages.showSuccessSnackBar("Template added.");
      
      if (this.action == "Edit")
        this.appMessages.showSuccessSnackBar("Template updated.");
    }
    if (e.errors) {
      this.appMessages.showFailedSnackBar(e.errors[0]);
    }

    this.action = "";
    this.refreshData();
  }

  public addClicked() {
    this.action = "Add";
    this.selectedRecord = { id: 0 };
  }

  public editClicked(e) {
    this.action = "Edit";
    this.selectedRecord = { id: e.data.id };
  }

  public editDocumentClicked(e) {
    this.subscription.add(this.documentService.editGlobalTemplate(e.data.id).subscribe(x => {

    }));
  }

  public deleteClicked(e) {
    const callback = () => {
      this.spinner.start();
      this.templateService.deleteGlobalTemplate(e.data.id).subscribe(
        (x) => {
          this.spinner.stop();
          this.appMessages.showSuccessSnackBar("Template deleted.")
          this.getTemplates();
        },
        (e) => { this.spinner.stop(); this.appMessages.showApiErrorNotification(e) }
      );
    };

    this.appMessages.showDeleteConfirmation(callback, 'Are you sure you want to delete this template?');
  }
}
