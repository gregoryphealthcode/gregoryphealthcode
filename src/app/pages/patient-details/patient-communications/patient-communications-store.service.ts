import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { BehaviorSubject } from "rxjs";
import { AppInfoService } from "src/app/shared/services";
import { AppMessagesService } from "src/app/shared/services/app-messages.service";
import { DocumentsService, PatientLetterModel } from "src/app/shared/services/documents.service";
import { PatientDocumentModel, PatientDocumentService } from "src/app/shared/services/patient-document-service";
import { PatientCommunicationSummaryModel, PatientService, PatientSmsModel } from "src/app/shared/services/patient.service";
import { SpinnerService } from "src/app/shared/services/spinner.service";

@Injectable()
export class PatientCommunicationStore {
  private patientId = new BehaviorSubject<string>(undefined);
  public patientId$ = this.patientId.asObservable();

  private documentSummary = new BehaviorSubject<PatientCommunicationSummaryModel[]>(undefined);
  public documentSummary$ = this.documentSummary.asObservable();

  private letters = new BehaviorSubject<PatientLetterModel[]>(undefined);
  public letters$ = this.letters.asObservable();

  private accountLetters = new BehaviorSubject<PatientLetterModel[]>(undefined);
  public accountLetters$ = this.accountLetters.asObservable();

  private documents = new BehaviorSubject<PatientDocumentModel[]>(undefined);
  public documents$ = this.documents.asObservable();

  private sms = new BehaviorSubject<PatientSmsModel[]>(undefined);
  public sms$ = this.sms.asObservable();

  private documentType = "All";
  private letterStatus = "All";

  constructor(
    private patientService: PatientService,
    private documentsService: DocumentsService,
    private patientDocumentService: PatientDocumentService,
    private appInfoService: AppInfoService,
    private spinner: SpinnerService,
    private appMessages: AppMessagesService,
    private sanitizer: DomSanitizer,    
  ) 
  {  }

  setPatientId$(patientId) {
    this.patientId.next(patientId);
    this.getPatientCommunicationSummary$();
    this.getPatientLetters$();
    this.getPatientDocuments$();
    this.getPatientSMS$();
  }

  setDocumentType$(documentType) {
    this.documentType = documentType;
    this.getPatientDocuments$();
  }

  setLetterStatus$(letterStatus) {
    this.letterStatus = letterStatus;
    this.getPatientLetters$();
  }

  getPatientCommunicationSummary$() {
    this.patientService.getPatientCommunicationSummary(this.patientId.value).subscribe(data => {
      this.documentSummary.next(data);
    })
  }

  getPatientDocuments$() {
    this.patientDocumentService.getPatientDocuments(this.patientId.value, this.documentType).subscribe(data => {
      this.documents.next(data);
    })
  }

  getPatientLetters$() {
    this.documentsService.getPatientLetters(this.patientId.value, this.letterStatus).subscribe(data => {
      this.letters.next(data.filter(x => x.category != "Accounts"));
      this.accountLetters.next(data.filter(x => x.category == "Accounts"));
    })
  }

  getPatientSMS$() {    
    this.patientService.getPatientSms(this.patientId.value).subscribe(data => {
      this.sms.next(data);
    })
  }

  get getPatientId() {
    return this.patientId.value;
  }
}