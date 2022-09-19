import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { PostcodeToAddressResponseModel } from "src/app/shared/components/postcode-to-address/postcode-to-address.service";
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { SitesService } from 'src/app/shared/services/sites.service';

@Component({
  selector: 'app-site-admin-add-edit',
  templateUrl: './site-admin-add-edit.component.html',
  styleUrls: ['./site-admin-add-edit.component.scss']
})
export class SiteAdminAddEditComponent extends PopupReactiveFormBase implements OnInit {
  constructor(
    private sitesService: SitesService, public appInfo: AppInfoService

  ) {
    super();
  }

  ePracticeVariants = ["Basic", "Lite", "Pro"];
  titles;
  siteActive = true;

  protected controllerName = "site";
  protected onOpened = (data) => {
    this.setupForm();
    this.getTitles();
    this.setup(data);
  };

  ngOnInit() {
    this.setupForm();
    this.getTitles();
  }

  getTitles() {
    // if (this.isNew) {
    //   this.siteId = '00000000-0000-0000-0000-000000000000'
    // }
    this.sitesService.getGlu_Titles().subscribe(data => {
      this.titles = data;
      this.titles.sort(function (a, b) {
        if (a.title < b.title) return -1;
        if (a.title > b.title) { return 1; }
        return 0;
      })
    });
  }

  setupForm() {
    this.editForm = new FormGroup({
      siteId: new FormControl(null, null),
      siteRef: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      siteName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      ePracticeVariant: new FormControl(null, Validators.required),
      sitePostcode: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
      siteAddress1: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      siteAddress2: new FormControl(null, Validators.maxLength(50)),
      siteAddress3: new FormControl(null, Validators.maxLength(50)),
      siteAddress4: new FormControl(null, Validators.maxLength(50)),

      payeeProviderHcCode: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      payeeProviderDisplayName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$')]),
      payeeProviderLastName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$')]),
      payeeProviderFirstName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$')]),
      payeeProviderTitle: new FormControl(null, [Validators.required]),
      payeeProviderPractitionerCode: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      payeeProviderPostcode: new FormControl(null, [Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
      payeeProviderAddress1: new FormControl(null, Validators.maxLength(50)),
      payeeProviderAddress2: new FormControl(null, Validators.maxLength(50)),
      payeeProviderAddress3: new FormControl(null, Validators.maxLength(50)),
      payeeProviderAddress4: new FormControl(null, Validators.maxLength(50)),
      siteActive: new FormControl(true),
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
      payeeProviderAddress1: line1,
      payeeProviderAddress2: line2,
      payeeProviderAddress3: line3,
      payeeProviderAddress4: line4,
    });
  }
}