import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss']
})
export class SiteDetailsComponent extends ReactiveFormBase implements OnInit {
  constructor(
    private siteService: SitesService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  siteTypeList = ["Basic", "Lite", "Pro"];
  element: any; 

  httpRequest = (x) => {
    this.spinnerService.start();
    return this.siteService.updateCurrentSiteDetails(x);
  }

  onSuccessfullySaved = (x) => {
    if (x.success) {
      this.snackBar.open("Site details updated", "Close", {
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
    this.element = document.getElementById('pageMainDetails');
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
      siteName: new FormControl(null, Validators.maxLength(50)),
      siteRef: new FormControl(null, Validators.maxLength(50)),
      ePracticeVariant: new FormControl(null, Validators.maxLength(50)),
      parentSiteId: new FormControl(null, null),
      isSingleSpecialist: new FormControl(false, null),
      hasChildSites: new FormControl(false, null),
      useEBooking: new FormControl(false, null),
      contactName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(50)]),
      contactRole: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(50)]),
      contactNumber: new FormControl(null, [Validators.required, Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/)]),
      smsSenderTag: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(100)]),
      documentReference: new FormControl(null, Validators.maxLength(100)),
      clientSecret: new FormControl(null, Validators.maxLength(250)),     
      siteNotes: new FormControl(null, null),
    });
  }

  onMouseWheel(e) {
    this.element.scrollTop += e.deltaY;
  }
}