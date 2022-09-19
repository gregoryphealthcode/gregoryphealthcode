import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import DataSource from "devextreme/data/data_source";
import { PopupReactiveFormBase } from "src/app/shared/base/popupReactiveForm.base";
import { AppInfoService } from "src/app/shared/services/app-info.service";
import { NewServiceModel, PricingMatrixService } from "src/app/shared/services/pricing-matrix.service";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";

@Component({
  selector: 'app-accounts-guideline-pricing-add-service',
  templateUrl: 'accounts-guideline-pricing-add-service.component.html',
  styleUrls: ['accounts-guideline-pricing-add-service.component.scss']
})

@AutoUnsubscribe
export class AccountsGuidelinePricingAddServiceComponent extends PopupReactiveFormBase implements OnInit {
  services: DataSource;
  procedures: DataSource;
  editForm: any;

  constructor(
    private pricingMatrixService: PricingMatrixService, public appInfo: AppInfoService

  ) {
    super();
  }

  protected controllerName = "managedService";
  protected onOpened = (data) => {
    this.setupForm();
    this.setup(data);
  };

  ngOnInit() {
    this.getServices();
    this.getProcedures();
    this.setupForm();
  }

  getServices() {
    this.pricingMatrixService.getServices().subscribe(data => {
      data.sort(function (a, b) {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      })
      this.services = new DataSource({
        store: {
          data: data,
          type: 'array',
        },
        paginate: true,
        pageSize: 50,
      })

    })
  }

  getProcedures() {
    this.pricingMatrixService.getProcedures().subscribe(data => {
      data.sort(function (a, b) {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      })
      this.procedures = new DataSource({
        store: {
          data: data,
          type: 'array',
        },
        paginate: true,
        pageSize: 50,
      })
    })
  }


  setupForm() {
    this.editForm = new FormGroup({
      serviceCode: new FormControl(null, Validators.required),
      procedureCode: new FormControl(null),
    });
  }
}