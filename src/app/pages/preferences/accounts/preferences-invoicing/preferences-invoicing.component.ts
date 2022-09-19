import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import notify from "devextreme/ui/notify";
import { ReactiveFormBase } from "src/app/shared/base/reactiveForm.base";
import { AppInfoService } from "src/app/shared/services";
import { InvoiceNumberViewModel, SitesService } from "src/app/shared/services/sites.service";
import { SpinnerService } from "src/app/shared/services/spinner.service";
import { UserStore } from "src/app/shared/stores/user.store";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";


@Component({
  selector: 'app-preferences-invoicing',
  templateUrl: './preferences-invoicing.component.html',
  styleUrls: ['./preferences-invoicing.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})

@AutoUnsubscribe
export class PreferencesInvoicingComponent extends ReactiveFormBase implements OnInit {
  element: any; 

  constructor(
    public appInfo: AppInfoService,
    private siteService: SitesService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  httpRequest = (x) => {
    this.spinnerService.start();
    return this.siteService.updateInvoiceNumberDetails(x);
  }

  onSuccessfullySaved = (x) => {
    if (x.success) {
      this.snackBar.open("Invoice number details updated", "Close", {
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
    this.spinnerService.start();
    this.setupForm();
    this.getInvoiceNumberDetails();    
  }

  setupForm() {
    this.editForm = new FormGroup({
      uniqueNo: new FormControl(null, null),
      prefix: new FormControl(null, [Validators.maxLength(5)]),
      suffix: new FormControl(null, [Validators.maxLength(5)]),
      nextNo: new FormControl(null, [Validators.required]),
    });
  }

  getInvoiceNumberDetails() {
    this.siteService.getInvoiceNumberDetails().subscribe(data => 
      {
      this.populateForm(data);
      this.spinnerService.stop();
      },
      error => {
        this.spinnerService.stop();
      }
    );
  }

  onMouseWheel(e) {
    this.element.scrollTop += e.deltaY;
  }
}
