import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { TitlesViewModel } from 'src/app/shared/services/app-info.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { BillingService } from 'src/app/shared/services/billing.service';
import { SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { UserStore } from 'src/app/shared/stores/user.store';
import { PostcodeToAddressResponseModel } from '../../postcode-to-address/postcode-to-address.service';

@Component({
  selector: 'app-site-payee-providers',
  templateUrl: './site-payee-providers.component.html',
  styleUrls: ['./site-payee-providers.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})
export class SitePayeeProvidersComponent extends ReactiveFormBase implements OnInit {
  constructor(
    private siteService: SitesService,
    private userStore: UserStore,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private billingService: BillingService,
    private appMessage: AppMessagesService,
  ) {
    super();
  }

  element: any;
  public titles: TitlesViewModel[] = [];

  httpRequest = (x) => {
    return this.siteService.updateCurrentSitePayeeProvider(x);
  }

  onSuccessfullySaved = (x) => {
    if (x.success) {
      this.snackBar.open("Site payee provider updated", "Close", {
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
    this.element = document.getElementById('pageMainPayee');
    this.getTitles();
    this.getSitePayeeProvider();
    this.setupForm();
  }

  getTitles() {
    this.siteService.getTitlesForSite().subscribe(data => {
      this.titles = data;
      this.titles.sort(function (a, b) {
        if (a.title < b.title) return -1;
        if (a.title > b.title) { return 1; }
        return 0;
      })
    }
    );
  }

  getSitePayeeProvider() {
    this.siteService.getSitePayeeProvider().subscribe(x => {
      super.populateForm(x);
    })
  }

  setupForm() {
    this.editForm = new FormGroup({
      uniqueNo: new FormControl(null, null),
      hcCode: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      displayName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      practitionerCode: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      firstName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(100)]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(100)]),
      title: new FormControl(null, [Validators.required]),
      address1: new FormControl(null, Validators.maxLength(50)),
      address2: new FormControl(null, Validators.maxLength(50)),
      address3: new FormControl(null, Validators.maxLength(50)),
      address4: new FormControl(null, Validators.maxLength(50)),
      postcode: new FormControl(null, [Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
    });
  }

  postcodeResolverAddressSelectHandler(value: PostcodeToAddressResponseModel) {
    this.updateFormAddressLines(value.line_1, value.post_Town, value.line_3, value.county);
  }

  private updateFormAddressLines(line1: string, line2: string, line3: string, line4: string) {
    this.editForm.patchValue({ address1: line1 });
    this.editForm.patchValue({ address2: line2 });
    this.editForm.patchValue({ address3: line3 });
    this.editForm.patchValue({ address4: line4 });
  }

  onMouseWheel(e) {
    this.element.scrollTop += e.deltaY;
  }

  getProvider() {
    this.billingService.getPayeeProvider().subscribe(x => {
      if (x.success) {
        this.populateForm(x.data);
      }
      if (x.errors) {
        this.appMessage.showFailedSnackBar(x.errors[0]);
      }
    })
  }
}