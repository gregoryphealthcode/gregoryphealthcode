import Guid from 'devextreme/core/guid';
import { DocumentTemplateViewModel } from '../services/sites.service';
import { UserStore } from '../stores/user.store';
import { formatDate } from '@angular/common';

export class AddCorrespondenceModel {
  SiteId: Guid;
  PatientId: Guid;
  PatientText: string;
  RecipientId: Guid;
  RecipientType: string;
  RecipientText: string;
  DocumentFile: string;
  CorrespondenceType: string;
  FileType: string;
  MimeType: string;
  Comments: string;
  DownloadUrl: string;
  CorrespondenceDate: Date;
  DateCreated: Date;
  DateDictated: Date;
  AuthorName: string;
  AuthorUserId: string;
  SentOrReceived: string;

  buildNewPatientAppointment(
    userStore: UserStore,
    template: DocumentTemplateViewModel,
    patientId: string,
    patientName: string
  ) {
    const outputFile = '' + formatDate(new Date(), 'yyyyMMdd_HHmmssSSS_', 'en') + template.fileName;

    this.SiteId = userStore.getSiteId();
    this.PatientId = patientId;
    this.PatientText = patientName;
    this.RecipientId = patientId;
    this.RecipientType = 'Patient';
    this.RecipientText =  patientName;
    this.DocumentFile = outputFile;
    this.CorrespondenceType = template.description;
    this.FileType = 'DOCX';
    this.MimeType = 'application/octet-stream';
    this.Comments = '';
    this.DownloadUrl = '#';
    this.CorrespondenceDate = new Date(Date.now());
    this.DateCreated = new Date(Date.now());
    this.DateDictated = new Date(Date.now());
    this.AuthorName = userStore.getDisplayName();
    this.AuthorUserId = userStore.getUserId();
    this.SentOrReceived = 'S';
  }


  buildInvoice(
    userStore: UserStore,
    template: DocumentTemplateViewModel,
    patientId: string,
    patientName: string,
    outputFile : string,
    fileType : string,
    mimeType : string
  ) {
  //  const outputFile = '' + formatDate(new Date(), 'yyyyMMdd_HHmmssSSS_', 'en') + template.fileName; 'application/octet-stream';

    this.SiteId = userStore.getSiteId();
    this.PatientId = patientId;
    this.PatientText = patientName;
    this.RecipientId = patientId;
    this.RecipientType = 'Patient';
    this.RecipientText =  patientName;
    this.DocumentFile = outputFile;
    this.CorrespondenceType = template.description;
    this.FileType =  fileType;
    this.MimeType = mimeType;
    this.Comments = '';
    this.DownloadUrl = '#';
    this.CorrespondenceDate = new Date(Date.now());
    this.DateCreated = new Date(Date.now());
    this.DateDictated = new Date(Date.now());
    this.AuthorName = userStore.getDisplayName();
    this.AuthorUserId = userStore.getUserId();
    this.SentOrReceived = 'S';
  }
}



