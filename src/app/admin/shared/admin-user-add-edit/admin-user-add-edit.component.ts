import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { AppInfoService } from 'src/app/shared/services';
import { SitesService, SiteAdminModel } from 'src/app/shared/services/sites.service';
import { UserService, UserTypeModel, UserSiteAdminModel } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-admin-user-add-edit',
  templateUrl: './admin-user-add-edit.component.html',
  styleUrls: ['./admin-user-add-edit.component.scss']
})
export class AdminUserAddEditComponent extends PopupReactiveFormBase implements OnInit {
  constructor(
    private sitesService: SitesService,
    private userService: UserService,
    public appInfo: AppInfoService
  ) {
    super();
  }

  sites: SiteAdminModel[] = [];
  siteAccessRoles: string[] = [];
  userTypes: UserTypeModel[] = [];
  pin = "-111";
  userSites: UserSiteAdminModel[] = [];

  protected controllerName = "user";
  protected onOpened = (data) => {
    this.getSites();
    this.getSiteAccess();
    this.getUserTypes();
    this.setupForm();
    this.setup(data);
  };

  ngOnInit() {
    this.setupForm();
  }

  getSites() {
    this.sitesService.getSites().subscribe(data => {
      this.sites = data;
      this.sites.sort(function (a, b) {
        if (a.siteName < b.siteName) return -1;
        if (a.siteName > b.siteName) { return 1; }
        return 0;
      })
    });
  }

  getSiteAccess() {
    this.sitesService.getSiteAccessRoles().subscribe(data => {
      this.siteAccessRoles = data;
      this.siteAccessRoles.sort(function (a, b) {
        if (a < b) return -1;
        if (a > b) { return 1; }
        return 0;
      })
    });
  }

  getUserTypes() {
    this.userService.getUserTypes().subscribe(data => {
      this.userTypes = data;
      this.userTypes.sort(function (a, b) {
        if (a.userTypeDescription < b.userTypeDescription) return -1;
        if (a.userTypeDescription > b.userTypeDescription) { return 1; }
        return 0;
      })
    });
  }

  protected populateForm(x) {
    this.userSites = x.sites;
    super.populateForm(x);

    //to be removed eventually
    this.editForm.patchValue({ userTypeId: 5 });
    if (x.pin != null)
      this.editForm.patchValue({ pin: "-111" });
  }

  setupForm() {
    this.editForm = new FormGroup({
      userId: new FormControl(null),
      userName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      userTypeId: new FormControl(5, [Validators.required]),
      forename: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(40)]),
      surname: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(50)]),
      email: new FormControl(null, [Validators.required, Validators.pattern(this.appInfo.getEmailFormat()), Validators.maxLength(50)]),
      contactTel: new FormControl(null, [Validators.required, Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/)]),
      pin: new FormControl(null, [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9 -]*$')]),
      pinChanged: new FormControl(false),
      sites: new FormControl(null),
    });

    this.editForm.get('pin').valueChanges.subscribe(x => {
      if (this.isNew)
        this.editForm.patchValue({ pinChanged: false });

      if (!this.isNew && this.pin != x)
        this.editForm.patchValue({ pinChanged: true })
    });
  }

  onValueChanged(e, siteId) {

  }
}