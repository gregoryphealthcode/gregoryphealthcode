import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { DiagnosisCodesViewModel, UserService } from 'src/app/shared/services/user.service';
import { InvoiceAddEditStoreService } from '../../invoice-add-edit-store.service';
import { GetInvoiceDiagnosisCodesResponseModel, GetInvoicePayorResponseModel } from '../../invoice-add-edit.service';

@Component({
  selector: 'app-diagnosis-edit',
  templateUrl: './diagnosis-edit.component.html',
  styleUrls: ['./diagnosis-edit.component.scss']
})
export class DiagnosisEditComponent extends SubscriptionBase implements OnInit {

  public payor: GetInvoicePayorResponseModel;
  public invoiceCodes: GetInvoiceDiagnosisCodesResponseModel[];
  public searchResult: DiagnosisCodesViewModel[];
  public addingDiagnosisCode: boolean;

  public term = '';
  private searchTerms = new BehaviorSubject<string>('');

  constructor(
    private store: InvoiceAddEditStoreService,
    private userService: UserService
  ) {
    super()
  }

  ngOnInit() {
    this.subscription.add(
      this.store.invoiceDiagnosisCodes$.subscribe(
        x => { this.invoiceCodes = x }
      )
    )

    this.subscription.add(
      this.store.invoicePayorDetails$.subscribe(
        x => { this.payor = x }
      )
    )

    this.subscription.add(
      this.searchTerms
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap((x) => this.userService.getDiagnosisCodes(x)),
          tap((x) => {
            this.searchResult = x;
          })
        )
        .subscribe()
    );
  }

  searchForCode() {
    this.searchTerms.next(this.term);
  }

  searchClear() {
    this.term = '';
    this.searchForCode();
  }

  updatePrimary(e) {
    const data: GetInvoiceDiagnosisCodesResponseModel = e.data;
    this.store.setDiagnosisAsPrimary(data.id);
  }

  delete(e) {
    const data: GetInvoiceDiagnosisCodesResponseModel = e.data;
    this.store.removeDiagnosis(data.id);
  }

  add(e) {
    this.addingDiagnosisCode = true;
    const data: DiagnosisCodesViewModel = e.data;
    this.store.addDiagnosis(data.code, () => { this.addingDiagnosisCode = false; this.searchClear() });
  }

  goToServices() {
    this.store.sectionManager.goToServices();
  }
}