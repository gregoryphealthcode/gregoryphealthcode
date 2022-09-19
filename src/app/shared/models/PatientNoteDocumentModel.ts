import Guid from 'devextreme/core/guid';

export class PatientNoteDocumentModel {
  patientId: Guid;
  dateUploaded: Date;
  siteRef : string;
  siteId : string;
  noteId : string;
  tempFileName : string;
  attachmentFile : string;
  attachmentType : string;
  attachmentMimeType : string;
  fileName  : string;
  attachmentId : string;

}
