export const environment = {
  production: true,
  development: false,

  environmentName: 'hc-peter',
  testMode: true,

  serverUrl: 'https://www.my-ebooking.co.uk/ePractice2Data',
  authserverBaseurl: 'https://www.my-ebooking.co.uk/ePractice2Data',
  baseurl: 'https://www.my-ebooking.co.uk/ePractice2Data/api',
  documentApiUrl: 'https://www.my-ebooking.co.uk/ePracticeDocViewer',
  medSecBaseurl: 'https://www.my-ebooking.co.uk/ePractice2Data/ePracticeMedSec/',
  RouterTraceEnabled: false,
  webPageRoot: 'https://www.my-ebooking.co.uk/epractice/',


  // serverUrl: 'https://www.my-ebooking.co.uk/epractice/ePractice2Data',
  // authserverBaseurl: 'https://www.my-ebooking.co.uk/ePractice2Data',
  // baseurl: 'https://www.my-ebooking.co.uk/epractice',
  // documentApiUrl: 'https://www.my-ebooking.co.uk/epractice',
  // medSecBaseurl: 'https://www.my-ebooking.co.uk/epractice/ePracticeMedSec/',
  // RouterTraceEnabled: false,
  // webPageRoot: 'https://www.my-ebooking.co.uk/epractice/',


  // OAuthSettings: {
  //   appId: '1f68a230-2c7b-4d3a-a295-d64fef17fd19',
  //   scopes: [
  //     'user.read',
  //     'calendars.read',
  //     'mail.send'
  //   ]
  //  },

   HelpHeroPlatform: 'Dev Server',
   enableLocalAuth: false,
   healthCode:{
    clientId: 'epractice',
    mainUrl: 'https://auth.dev.healthcode.co.uk',
    scope:'openid siteid email offline_access',
    authorizePath: 'authorize',
    redirectPath: 'https://www.my-ebooking.co.uk/epractice/postauth'
  },

  msgurl: 'http://www.dev2.healthcode.co.uk/secure-messaging/prelogin/auth/preauth.jsp',
  pprurl: 'http://www.dev2.healthcode.co.uk/pprepractice/pages/pprspecialist/prelogin/auth/preauth.jsp',
  codeSearchUrl: 'http://www.dev2.healthcode.co.uk/Code-Search/prelogin/auth/preauth.jsp'
};
