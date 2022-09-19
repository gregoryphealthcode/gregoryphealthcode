import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-site-healthcode',
  templateUrl: './site-healthcode.component.html',
  styleUrls: ['./site-healthcode.component.scss']
})
export class SiteHealthcodeComponent extends ReactiveFormBase implements OnInit {
  constructor(
    private siteService: SitesService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  element: any; 

  httpRequest = (x) => { 
    return this.siteService.updateCurrentSiteHealthcodeDetails(x); 
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
    this.element = document.getElementById('pageMainHC');
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
      hcApiUserId: new FormControl(" ", [Validators.required, Validators.maxLength(250)]),
      hcApiPassword: new FormControl(" ",  [Validators.required, Validators.maxLength(500)]),
    });    
  }

  onMouseWheel(e) {
    this.element.scrollTop += e.deltaY;
  }
}
