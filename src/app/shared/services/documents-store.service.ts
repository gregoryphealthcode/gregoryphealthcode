import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/ResponseModel';
import { DocumentsService, GenerateDocumentViewerUrlRequest } from './documents.service';
import { SpinnerService } from './spinner.service';

@Injectable()
export class DocumentsStoreService {
  private pdfDocumentViewUrl = new BehaviorSubject<string>(undefined);
  public pdfDocumentViewUrl$ = this.pdfDocumentViewUrl.asObservable();

  private printQueue = new BehaviorSubject<boolean>(undefined);
  public printQueue$ = this.printQueue.asObservable().pipe();

  public setPrintQueue(value: boolean) {
    this.printQueue.next(value);
  }

  public get isPrintQueue() {
    return this.printQueue.value;
  }

  constructor(
    private documentsService: DocumentsService,
    ) 
    { }

  public openPdfInPopup(request: GenerateDocumentViewerUrlRequest) : Observable<string> {
    return this.documentsService.generateUrl(request)
    .pipe(map(x=>  `${environment.serverUrl}/pdf?url=${x.data}`), tap(x=> this.pdfDocumentViewUrl.next(x)));
  }

  public openPrintQueuePdfsInPopup(printQueueDocuments: string[]) : Observable<string> {
   const request = {printQueueDocuments}
   return this.documentsService.generateUrl(request)
    .pipe(map(x=>  `${environment.serverUrl}/pdf?url=${x.data}`), tap(x=> this.pdfDocumentViewUrl.next(x)));
  }
}
