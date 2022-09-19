import { Injectable } from '@angular/core';
import { Client } from '@microsoft/microsoft-graph-client';


import { Event, Email, Folders } from './event365';
import { AlertService } from './shared/services/alert.service';
import { AuthService } from './shared/services/auth.service';
// import { LocalAuthServiceOld } from './shared/services/localauth.service';


@Injectable({
  providedIn: 'root'
})
export class Graph365Service {

  private graph365Client: Client;
  constructor(
    // private localAuthService: LocalAuthServiceOld,
    private authService: AuthService,
    private alertsService: AlertService) {

    // Initialize the Graph client
    // this.graph365Client = Client.init({
    //   authProvider: async (done) => {
    //     // Get the token from the auth service
    //     let token = await this.authService.getAccess365Token()
    //       .catch((reason) => {
    //         done(reason, null);
    //       });

    //     if (token)
    //     {
    //       done(null, token);
    //     } else {
    //       done('Could not get an Office365 access token', null);
    //     }
    //   }
    // });
  }

  async sendMail(email): Promise<Email> {
    try {
      let myEmail: any = {
        message: {
          toRecipients:[
           email.sender
           ],
           subject: email.subject,
           body: {
             contentType: 'html',
             content: email.sendBodyHtml
           }
        },
      };

      let result = await this.graph365Client.api('/me/sendMail').post(myEmail)
      return result.value;
    } catch (error) {
      console.log('[Graph365] Could send mail', JSON.stringify(error, null, 2));
    }
  }


  async sendReply(email): Promise<any> {
    // try {
      let myReply: any = {
        message: {
          toRecipients:[
           email.sender
           ],
           subject: email.subject,
           body: {
             contentType: 'html',
             content: email.sendBodyHtml
           }
        },
      };

      const result = await this.graph365Client.api('/me/messages/' + email.id + '/reply').post(myReply);
      // const draft = await this.graph365Client.api('/me/messages/' + email.id + '/createReply').post(null);
      // console.log('draft email reply: ', draft);
      // draft.subject = email.subject;
      // draft.body.content = email.sendBodyHtml;
      // console.log('send email reply: ', draft);
      // const result = await this.graph365Client.api('/me/sendMail').post(draft);
      console.log('result: ', result);
      return result;
    // } catch (error) {
    //  console.log('[Graph365] Could not get events', JSON.stringify(error, null, 2));
    //}
  }


  async getEvents(): Promise<Event[]> {
    try {
      let result =  await this.graph365Client
        .api('/me/events')
        .select('subject,organizer,location,start,end')
        .orderby('createdDateTime DESC')
        .get();

      return result.value;
    } catch (error) {
      console.log('[Graph365] Could not get events', JSON.stringify(error, null, 2));
    }
  }

  async getEmails(): Promise<Email[]> {
    try {
      let result =  await this.graph365Client
        .api('/me/messages')
        .select('subject,sender,bodyPreview,receivedDateTime,isRead')
        .orderby('receivedDateTime DESC')
        .get();

      return result.value;
    } catch (error) {
      console.log('[Graph365] Could not get emails', JSON.stringify(error, null, 2));
    }
  }

  async getFolders(): Promise<Folders[]> {
    try {
      let result =  await this.graph365Client
        .api('/me/mailFolders')
        // .select('subject,sender,bodyPreview,receivedDateTime,isRead')
        // .orderby('receivedDateTime DESC')
        .get();

      return result.value;
    } catch (error) {
      console.log('[Graph365] Could not get folders', JSON.stringify(error, null, 2));
    }
  }

  async getFolderById(myid): Promise<Folders> {
    try {
      let result =  await this.graph365Client
        .api('/me/mailFolders/' + myid)
        .get();
      return result;
    } catch (error) {
      console.log('[Graph365] Could not get folderById', JSON.stringify(error, null, 2));
    }
  }

}

