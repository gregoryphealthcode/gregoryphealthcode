import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { InvoiceAddEditStoreService } from './invoice-add-edit-store.service';
import { InvoiceServicesStoreService } from 'src/app/shared/components/invoice-services-select/invoice-services-store.service';
import { InvoiceAddEditSectionEnum } from './invoice-add-edit-constants';
import { ErrorData } from 'src/app/shared/models/ErrorData';
import { EMPTY } from 'rxjs';
import { DocumentsStoreService } from 'src/app/shared/services/documents-store.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  providers: [InvoiceAddEditStoreService, InvoiceServicesStoreService, DocumentsStoreService],
  host: { class: "d-flex flex-column flex-grow-1" },
})
export class InvoiceComponent extends SubscriptionBase implements OnInit {
  @ViewChild('pdfViewer') public pdfViewer;

  set errors(value: ErrorData[]) {
    if (value) {
      this._errors = value.filter(x => x.sectionIndex === 0);
    }
  };
  get errors(): ErrorData[] { return this._errors };
  get sectionEnum() { return InvoiceAddEditSectionEnum; }

  private _errors: ErrorData[];
  public invoiceId: string;
  public patientId: string;
  public correspondenceId: string;
  public editableSectionIndex: number;
  public refreshEpisode: boolean;

  constructor(
    public store: InvoiceAddEditStoreService,
    private route: ActivatedRoute,
    private documentsService: DocumentsStoreService,
  ) {
    super();
  }

  ngOnInit() {
    this.subscription.add(
      this.route.queryParams.subscribe((params) => {
        const invoiceId = params.invoiceId;

        if (invoiceId) {
          this.store.setInvoiceId(invoiceId);
          return;
        }

        const appointmentId = params.appointmentId;
        if (appointmentId) {
          this.store.getAppointmentDetails(appointmentId);
        }

        const autoPopId = params.autoPopId;
        if (autoPopId) {
          this.store.getAutoPopInvoiceDetails(autoPopId)
        }    

        const patientId = params.patientId;          
        if (patientId) {        
          this.store.setPatientId(patientId);
          return;
        }

        this.store.onNewInvoice();
      })
    )

    this.route.fragment.subscribe((fragment: string) => {
      this.store.sectionManager.setTab(+fragment);
    });

    this.addToSubscription(
      this.store.invoiceId$.pipe(tap(x => this.invoiceId = x)
      )
    )

    this.subscription.add(
      this.store.invoicePdf$
        .pipe(switchMap(x => {
          if (x) {
            this.correspondenceId = x;
            return this.documentsService.openPdfInPopup({ correspondenceId: this.correspondenceId })
          } else {
            return EMPTY;
          }
        })).subscribe()
    )

    this.store.patientId$.subscribe(
      x => this.patientId = x
    )

    this.addToSubscription(
      this.store.sectionManager.editableSectionIndex$.pipe(tap(x =>
        this.editableSectionIndex = x
      )
      )
    )

    this.addToSubscription(
      this.store.errors$.pipe(
        tap(x => this.errors = x)
      ));
  }

  payorSelectedHandler(payor) {
    this.store.setPayor(payor);
  }

  addedToPrintQueue() {
    this.store.goBack();
  }

  closedHandler() {
    this.errors = [];
    if (this.store.isNewInvoice)
      this.store.goBack();
    this.store.goBack();
  }
}