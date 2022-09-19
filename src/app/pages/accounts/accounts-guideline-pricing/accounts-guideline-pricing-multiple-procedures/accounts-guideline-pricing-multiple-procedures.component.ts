import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { subscribeProperties } from '@devexpress/analytics-core/analytics-wizard-internal';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { MultiProcedureSetDetailModel, MultiProcedureSetModel, PricingMatrixService, ProceduresDetailsModel } from 'src/app/shared/services/pricing-matrix.service';

@Component({
  selector: 'app-accounts-guideline-pricing-multiple-procedures',
  templateUrl: './accounts-guideline-pricing-multiple-procedures.component.html',
  styleUrls: ['./accounts-guideline-pricing-multiple-procedures.component.scss']
})
export class AccountsGuidelinePricingMultipleProceduresComponent extends SubscriptionBase implements OnInit {
  @Output() closePopup = new EventEmitter();

  procedureSets: MultiProcedureSetModel[] = [];
  procedureSetDetails: MultiProcedureSetDetailModel[] = [];
  editForm: FormGroup;
  
  constructor(
    private pricingMatrixService: PricingMatrixService,
  ) 
  { 
    super();
  }

  ngOnInit() {
    this.setupForm();
    this.getMultipleProcedureSets();

    this.subscription.add(
      this.editForm.get("procedureSets").valueChanges.subscribe(x => {
        this.getProcedureDetails(x);
      })
    );
  }  

  setupForm() {
    this.editForm = new FormGroup({
      procedureSets: new FormControl(null),
    });
  }

  getMultipleProcedureSets() {
    this.pricingMatrixService.getMultiProcedureSets().subscribe(x => {
      this.procedureSets = x.data;
    })
  }  

  getProcedureDetails(setId) {
    this.pricingMatrixService.getMultiProcedureSetDetails(setId).subscribe(x => {
      this.procedureSetDetails = x.data;

      this.procedureSetDetails.forEach(procedureSetDetail => {
        procedureSetDetail.proceduresCount = procedureSetDetail.proceduresCount.replace(/^0+/, '');
      });
    })
  }
}
