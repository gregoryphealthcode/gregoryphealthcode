import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridBase } from 'src/app/shared/base/grid.base';
import { DialogTemplateComponent } from 'src/app/shared/components/dialog/dialog-template.component';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { DocumentsService } from 'src/app/shared/services/documents.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { TemplateService } from 'src/app/shared/services/template.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-preferences-templates-grid',
  templateUrl: './preferences-templates-grid.component.html',
  styleUrls: ['./preferences-templates-grid.component.scss']
})
export class PreferencesTemplatesGridComponent extends GridBase implements OnInit {
  @Input() category: number;

  @Input() get isMedsec(): boolean {
    return this._isMedsec;
  }
  set isMedsec(value: boolean) {
    if (value) {
      this.getMedsecTemplates();
    }
    else {
      this.getSiteTemplates();
    }
    this._isMedsec = value;
  }

  private _isMedsec;

  selectedTemplateId: string;
  selectedRecord: any;
  action: string;
  showSites = false;

  constructor(
    private templateService: TemplateService,
    private documentService: DocumentsService,
    private spinnerService: SpinnerService,
    private appMessages: AppMessagesService,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit() {
  }

  getMedsecTemplates() {
    this.controllerUrl = `${environment.baseurl}/bureauTemplates/`;
    this.setupDataSource({
      key: 'templateId',
      loadParamsCallback: () => [
        { name: 'category', value: this.category },
      ],
    });
  }

  getSiteTemplates() {
    this.controllerUrl = `${environment.baseurl}/llu_Templates/`;
    this.setupDataSource({
      key: 'templateId',
      loadParamsCallback: () => [
        { name: 'category', value: this.category },
      ],
    });
  }

  public addClicked() {
    this.action = 'Add';
    this.selectedRecord = { id: 0, templateCategory: + this.category };
  }

  public editClicked(e) {
    this.action = 'Edit';
    this.selectedRecord = { id: e.data.templateId, templateCategory: + this.category };
  }

  public editDocumentClicked(e) {
    if (this.isMedsec)
      this.subscription.add(this.documentService.editMedsecTemplate(e.data.templateId).subscribe(x => {

      }));
    else
      this.subscription.add(this.documentService.editSiteTemplate(e.data.templateId).subscribe(x => {

      }));
  }

  deleteClicked(e) {
    const dialogRef = this.dialog.open(DialogTemplateComponent, {
      width: '250px',
      data: {
        title: 'Are you sure?',
        message: 'Are you sure you want to delete this item?',
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.spinnerService.start();
        if (this.isMedsec) {
          this.subscription.add(this.templateService.deleteMedsecTemplate(e.data.templateId).subscribe(data => {
            if (data.success) {
              this.appMessages.showSuccessSnackBar("Template deleted.");
            }
            if (data.errors) {
              this.appMessages.showFailedSnackBar(data.errors[0]);
            }
            this.spinnerService.stop();
            this.getMedsecTemplates();
          }));
        }

        else {
          this.subscription.add(this.templateService.deleteSiteTemplate(e.data.templateId).subscribe(data => {
            if (data.success) {
              this.appMessages.showSuccessSnackBar("Template deleted.");
            }
            if (data.errors) {
              this.appMessages.showFailedSnackBar(data.errors[0]);
            }
            this.spinnerService.stop();
            this.getSiteTemplates();
          }, (e) => {
            this.appMessages.showFailedSnackBar(e.error.errors[0]);
            this.spinnerService.stop();
          }));
        }
      }
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

    if (this.isMedsec)
      this.getMedsecTemplates();
    else
      this.getSiteTemplates();
  }

  shareClicked(e) {
    this.showSites = true;
    this.selectedTemplateId = e.data.templateId;
  }

  savedSiteHandler(e) {
    this.showSites = false;
    if (e.success)
      this.appMessages.showSuccessSnackBar("Template shared.");
    if (e.errors)
      this.appMessages.showFailedSnackBar(e.errors[0]);
  }
}
