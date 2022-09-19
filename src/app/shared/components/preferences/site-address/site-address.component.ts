import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnyRecord } from 'dns';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { PostcodeToAddressResponseModel } from '../../postcode-to-address/postcode-to-address.service';

@Component({
  selector: 'app-site-address',
  templateUrl: './site-address.component.html',
  styleUrls: ['./site-address.component.scss']
})
export class SiteAddressComponent extends ReactiveFormBase implements OnInit {
  constructor(
    private siteService: SitesService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  element: any; 

  httpRequest = (x) => { 
    return this.siteService.updateCurrentSiteAddress(x);
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
    this.element = document.getElementById('pageMainAddress');
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
     
      address1: new FormControl(null, [Validators.required,Validators.maxLength(50)]),
      address2: new FormControl(null, Validators.maxLength(50)),
      address3: new FormControl(null, Validators.maxLength(50)),
      address4: new FormControl(null, Validators.maxLength(50)),
      postcode: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
      });    
  }

  postcodeResolverAddressSelectHandler(value: PostcodeToAddressResponseModel) {
    this.updateFormAddressLines(
      value.line_1,
      value.line_2,
      value.line_3,
      value.post_Town
    );
  }

  private updateFormAddressLines(
    line1: string,
    line2: string,
    line3: string,
    line4: string
  ) {
    this.editForm.patchValue({
      address1: line1,
      address2: line2,
      address3: line3,
      address4: line4,
    });
  }

  onMouseWheel(e) {
    this.element.scrollTop += e.deltaY;
  }
}