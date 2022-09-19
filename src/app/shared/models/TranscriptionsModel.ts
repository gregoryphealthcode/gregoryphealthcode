import { data } from "jquery";

export class TranscriptionsModel
{
   siteId : string;
   patientId : string;
   status: string;
   audioURI : string;
   dateUploaded : Date;
   authorName : string;
   authorId : string;
   transcriptionMethod: string;
   transcriptionBureau: string;
   dateCollected  : Date;
   dateTranscriptionReturned  : Date;
   transcribedText : string;
   correspondenceId : string;
   templateId : string;
   templateName : string;
   urgent : boolean;
   patientName : string;
}
