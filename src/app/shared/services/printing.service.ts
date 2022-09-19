import { Injectable } from "@angular/core";
import { HttpClient, HttpEvent } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { CorrespondenceViewModel } from "../models/CorrespondenceViewModel";
import {
  PrintQueueViewModel,
  PrintQueueListViewModel,
} from "../models/PrintQueueViewModel";
import { GenericResponse } from "../models/GenericResponseModel";
import Guid from "devextreme/core/guid";
import { ResponseModel } from "../models/ResponseModel";

@Injectable()
export class PrintingService {
  constructor(private router: Router, private http: HttpClient) {}

  public updatePrintQueue(model: PrintQueuePrintRequest): Observable<PrintQueuePrintResponseModel> {
    const url = `${environment.baseurl}/printing/updatePrintQueue/`;
    return this.http.post<PrintQueuePrintResponseModel>(url, model);
  }

  public getFileToPrint(id: string, siteCode: string) {
    const url = `${environment.baseurl}/printing/getFileToPrint/${id}/${siteCode}`;
    return this.http.get<Blob>(url, {
      observe: "response",
      responseType: "blob" as "json",
    });
  }

  public getFilesToPrint(documentIds: string[], siteCode: string) {
    const url = `${environment.baseurl}/printing/getFilesToPrint?siteCode=${siteCode}`;
    return this.http.post<Blob>(url, documentIds, {
      observe: "response",
      responseType: "blob" as "json",
    });
  }

  public addToPrintQueue(model: PrintQueueViewModel): Observable<boolean> {
    const url = `${environment.baseurl}/printing/addToPrintQueue`;
    return this.http.post<boolean>(url, model);
  }

  public addToQueue(model: AddToPrinQueueRequest): Observable<GenericResponse> {
    const url = `${environment.baseurl}/printing/addToQueue`;
    console.log(model);
    return this.http.post<GenericResponse>(url, model);
  }
  
  public deletePrintQueue(printQueueId: Guid): Observable<GenericResponse> {
    const url = `${environment.baseurl}/printing/deletePrintQueue`;
    return this.http.put<GenericResponse>(url, { printQueueId });
  }

  public regenerateDocument(documentId: string): Observable<GenericResponse> {
    const url = `${environment.baseurl}/printing/regenerateDocument/`;
    return this.http.post<GenericResponse>(url, { documentId });
  }
}

export interface AddToPrinQueueRequest {
  correspondenceId: string;
  batchId?: number;
}

export class PrintRequest {
  id: string[];
}

export interface PrintQueuePrintRequest {
  ids: string[];
}

export interface PrintQueuePrintResponseModel {
  correspondenceId: string | null;
  documentBatchId: string | null;
}
