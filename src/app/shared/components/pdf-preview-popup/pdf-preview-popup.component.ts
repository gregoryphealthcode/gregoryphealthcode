import { Component, EventEmitter, HostListener, Input, OnInit, Output, } from "@angular/core";
import { tap } from "rxjs/operators";
import { SubscriptionBase } from "../../base/subscribtion.base";
import { AppInfoService } from "../../services/app-info.service";
import { AppMessagesService } from "../../services/app-messages.service";
import { DocumentsStoreService } from "../../services/documents-store.service";
import { DocumentsService } from "../../services/documents.service";

@Component({
  selector: "app-pdf-preview-popup",
  templateUrl: "./pdf-preview-popup.component.html",
  styleUrls: ["./pdf-preview-popup.component.scss"],
})
export class PdfPreviewPopupComponent extends SubscriptionBase implements OnInit {
  @Input() title: string;

  @Output() closed = new EventEmitter();
  @Output() addedToPrintQueue = new EventEmitter();

  public showPrintPopup: boolean;
  public invViewUrl: string;
  private invViewUrlTemp: string;

  constructor(
    private documentsService: DocumentsStoreService,
    private appMessages: AppMessagesService, public appInfo: AppInfoService

  ) {
    super();
  }

  ngOnInit() {
    this.addToSubscription(
      this.documentsService.pdfDocumentViewUrl$.pipe(tap(x => {
        if (x) {
          this.showPrintPopup = true;
          this.invViewUrlTemp = x;
        }
      }))
    )
  }

  @HostListener("window:message", ["$event"])
  onMessage(e) {
    if (e.data && e.data === 'addedToPrintQueue') {
      this.showPrintPopup = false;
      this.appMessages.showSuccessInformationModal('Document successfully added to the print queue.')
      this.addedToPrintQueue.emit()
    }
  }

  onpopupshown() {
    this.invViewUrl = this.invViewUrlTemp;
  }

  closedHandler() {
    if (this.documentsService.isPrintQueue)
      this.documentsService.setPrintQueue(false);
    this.showPrintPopup = false;
  }
}
