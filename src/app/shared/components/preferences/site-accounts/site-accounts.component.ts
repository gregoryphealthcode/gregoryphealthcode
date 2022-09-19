import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-site-accounts',
  templateUrl: './site-accounts.component.html',
  styleUrls: ['./site-accounts.component.scss']
})
export class SiteAccountsComponent extends ReactiveFormBase implements OnInit {
  constructor(
    private siteService: SitesService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  element: any; 
  currencyList = [{ id: 'GBP', text: '£' }, { id: 'USD', text: '$' }, { id: 'EUR', text: '€' }, { id: 'JPY', text: '¥' }];  

  httpRequest = (x) => {
    return this.siteService.updateCurrentSiteAccounts(x);
  }

  onSuccessfullySaved = (x) => {
    if (x.success) {
      this.snackBar.open("Site account details updated", "Close", {
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
    this.element = document.getElementById('pageMainAccounts');
    this.getSiteDetails();
    this.setupForm();

    this.editForm.get('currencyCode').valueChanges.subscribe(x => {
      this.editForm.patchValue({ currencySymbol: this.currencyList.find(x => x.id == this.editForm.get('currencyCode').value)?.text });
    });
  }

  getSiteDetails() {
    this.siteService.getCurrentSiteDetails().subscribe(x => {
      this.populateForm(x);
    })
  }

  setupForm() {
    this.editForm = new FormGroup({
      currencySymbol: new FormControl(null, Validators.required),
      currencyCode: new FormControl(null, null),
      financialYearStart: new FormControl(null, Validators.required),
      financialYearEnd: new FormControl(null, Validators.required),
      financialLock: new FormControl(false, null),
      financialLockDate: new FormControl(null, null),      
      autoAnalyseBulkPayment: new FormControl(null, null),
    });
  }

  populateForm(x) {
    this.editForm.patchValue({currencyCode : x.currencyCode});
    this.editForm.patchValue({financialYearStart : x.financialYearStart});
    this.editForm.patchValue({financialYearEnd : x.financialYearEnd});
    this.editForm.patchValue({financialLock : x.financialLock != null? x.financialLock : false});
    this.editForm.patchValue({financialLockDate : x.financialLockDate});
    this.editForm.patchValue({autoAnalyseBulkPayment : x.autoAnalyseBulkPayment != null? x.autoAnalyseBulkPayment : false});
  }

  financialLockChanged(e) {
    if (e)
      this.editForm.patchValue({financialLockDate : new Date()});
  }

  onMouseWheel(e) {
    this.element.scrollTop += e.deltaY;
  }
}
