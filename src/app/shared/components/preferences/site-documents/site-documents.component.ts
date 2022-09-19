import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-site-documents',
  templateUrl: './site-documents.component.html',
  styleUrls: ['./site-documents.component.scss']
})
export class SiteDocumentsComponent extends ReactiveFormBase implements OnInit {
  constructor(
    private siteService: SitesService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  element: any; 

  shortDateFormatList = ['dd/MM/yyyy', 'dd-MM-yyyy', 'dd-MMM-yyyy', 'MM/dd/yyyy', 'MM-dd-yyyy', 'dd/MM/yy', 'dd-MM-yy'];
  dateTimeFormatList = ['dd/MM/yyyy HH:mm', 'dd/MM/yyyy hh:mm a', 'dd/MM/yy HH:mm', 'dd/MM/yy hh:mm a', 'MM/dd/yyyy HH:mm', 'MM/dd/yy HH:mm',
    'dd/MMM/yyyy HH:mm', 'dd/MMM/yyyy hh:mm a', 'dd/MMM/yy HH:mm', 'dd/MMM/yy hh:mm a', 'MMM/dd/yyyy HH:mm', 'MMM/dd/yy HH:mm',
    'dd-MM-yyyy HH:mm', 'dd-MM-yyyy hh:mm a', 'dd-MM-yy HH:mm', 'dd-MM-yy hh:mm a',
    'dd-MMM-yyyy HH:mm', 'dd-MMM-yyyy hh:mm a', 'dd-MMM-yy HH:mm', 'dd-MMM-yy hh:mm a', 'MM-dd-yyyy HH:mm', 'MM-dd-yy HH:mm'];
  longDateFormatList = ['MMM d, yyyy', 'ddd MMM yyyy', 'ddd MMMM yyyy', 'EEE dd MMMM yyyy', 'EEEE dd MMMM yyyy', 'EEEE ddd MMMM yyyy'];

  httpRequest = (x) => { 
    return this.siteService.updateCurrentSiteDocuments(x); 
  }

  onSuccessfullySaved = (x) => {
    if (x.success) {
      this.snackBar.open("Site document settings updated", "Close", {
        panelClass: "badge-success",
        duration: 3000,
      });
    }
    else if (x.error) {
      this.snackBar.open("An error occurred", "Close", {
        panelClass: "badge-danger",
        duration: 3000,
      });
    }
    this.spinnerService.stop();
  };

  ngOnInit() {
    this.element = document.getElementById('pageMainDocuments');
    this.getSiteDetails();
    this.setupForm();
  }


  getSiteDetails() {
    this.siteService.getCurrentSiteDetails().subscribe(x => {
      super.populateForm(x);
    })
  }

  setupForm() {
    this.editForm = new FormGroup({
      dateTimeFormat: new FormControl(null, Validators.required),
      shortDateFormat: new FormControl(null, Validators.required),
      longDateFormat: new FormControl(null, Validators.required),
      useDefaultReceipt: new FormControl(false),
      useDefaultConfirmationEmail: new FormControl(false),
      useDefaultConfirmationLetter: new FormControl(false),
      useDefaultConfirmationSms: new FormControl(false),
      useDefaultCancellationEmail: new FormControl(false),
      useDefaultCancellationLetter: new FormControl(false),
      useDefaultCancellationSms: new FormControl(false),
    });    
  }

  onMouseWheel(e) {
    this.element.scrollTop += e.deltaY;
  }
}