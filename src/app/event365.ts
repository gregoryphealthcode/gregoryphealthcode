// For a full list of fields, see
// https://docs.microsoft.com/graph/api/resources/event?view=graph-rest-1.0
export class Event {
    subject: string;
    organizer: Recipient;
    location: Location;
    start: DateTimeTimeZone;
    end: DateTimeTimeZone;
  }
  
  // https://docs.microsoft.com/graph/api/resources/recipient?view=graph-rest-1.0
  export class Recipient {
    emailAddress: EmailAddress;
  }
  
  export class Sender {
    emailAddress: EmailAddress;
  }

export class Body {
    content: string;
    contentType: string;
}

  export class Location {
    displayName: string;
  }
  

  // https://docs.microsoft.com/graph/api/resources/emailaddress?view=graph-rest-1.0
  export class EmailAddress {
    name: string;
    address: string;
  }

  // https://docs.microsoft.com/graph/api/resources/datetimetimezone?view=graph-rest-1.0
  export class DateTimeTimeZone {
    dateTime: string;
    timeZone: string;
  }

  export class Email {
      id: string;
      subject: string;
      isRead: boolean;
      importance: string;
      receivedDateTime: Date;
      sender: Sender;
      body: Body;
      bodyPreview: string;
      parentFolderId: string;

  }

  export class Folders {
    id: string;
    parentFolderId: string;
    displayName: string;
    unreadItemCount: number;
    totalItemCount: number;
    childFolderCount: number;
  }