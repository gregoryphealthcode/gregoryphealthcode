import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-site-patient-zone',
  templateUrl: './site-patient-zone.component.html',
  styleUrls: ['./site-patient-zone.component.scss']
})
export class SitePatientZoneComponent extends ReactiveFormBase implements OnInit {
  constructor(
    private siteService: SitesService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }
  
  element: any; 
  pzEnabled: boolean;

  httpRequest = (x) => {
    return this.siteService.updateCurrentSitePatientZoneDetails(x);
  }

  onSuccessfullySaved = (x) => {
    if (x.success) {
      this.snackBar.open("Site patient zone details updated", "Close", {
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
    this.element = document.getElementById('pageMainPZ');
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
      pzEnabled: new FormControl(null, Validators.required),
      pzApiKey: new FormControl(null, null),
      pzRegistrationReference: new FormControl(null, null),
      pzOrganisationCode: new FormControl(null, null),
      pzInvoices: new FormControl(null, null),
      pzShortfalls: new FormControl(null, null),
      pzCredit: new FormControl(null, null),
      pzReminders: new FormControl(null, null),
      pzReallocations: new FormControl(null, null),
    });
  }

  patientzoneEnabled(e) {
    if (e) {
      this.editForm.controls["pzApiKey"].setValidators([Validators.required, Validators.maxLength(50)]);
      this.editForm.controls["pzRegistrationReference"].setValidators([Validators.required, Validators.maxLength(250)]);
      this.editForm.controls["pzOrganisationCode"].setValidators([Validators.required, Validators.maxLength(10)]);
    }
    else {
      this.editForm.controls["pzApiKey"].setValidators(Validators.maxLength(50));
      this.editForm.controls["pzRegistrationReference"].setValidators(Validators.maxLength(250));
      this.editForm.controls["pzOrganisationCode"].setValidators( Validators.maxLength(10));
    }
  }

  onMouseWheel(e) {
    this.element.scrollTop += e.deltaY;
  }
}
