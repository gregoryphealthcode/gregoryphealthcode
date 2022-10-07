export const environment = {
  production: true,
  development: false,

  environmentName: 'petes-srv',
  testMode: true,

  // serverUrl: 'https://api.epractice.sit.healthcode.co.uk',
  // authserverBaseurl: 'https://api.epractice.sit.healthcode.co.uk',
  // baseurl: 'https://api.epractice.sit.healthcode.co.uk/api',
  // documentApiUrl: 'https://api.epractice.sit.healthcode.co.uk/ePracticeDocViewer',
  // medSecBaseurl: 'https://api.epractice.sit.healthcode.co.uk/ePracticeMedSec/',
  // RouterTraceEnabled: false,
  // webPageRoot: 'https://epractice.sit.healthcode.co.uk/',


  serverUrl: 'https://www.my-ebooking.co.uk/ePractice2Data',
  authserverBaseurl: 'https://www.my-ebooking.co.uk/ePractice2Data',
  baseurl: 'https://www.my-ebooking.co.uk/epractice2Data/api',
  documentApiUrl: 'https://www.my-ebooking.co.uk/ePractice2Data/ePracticeDocViewer',
  medSecBaseurl: 'https://www.my-ebooking.co.uk/ePractice2Data/ePracticeMedSec/',
  RouterTraceEnabled: false,
  webPageRoot: 'https://www.my-ebooking.co.uk/epractice/',


  // OAuthSettings: {
  //   appId: '1f68a230-2c7b-4d3a-a295-d64fef17fd19',
  //   scopes: [
  //     'user.read',
  //     'calendars.read',
  //     'mail.send'
  //   ]
  //  },

   HelpHeroPlatform: 'Dev Server',

   // enableLocalAuth: false,
   enableLocalAuth: true,

   healthCode:{
    clientId: 'epractice',
    // mainUrl: 'https://auth.sit.healthcode.co.uk',
    mainUrl: 'https://auth.dev.healthcode.co.uk',
    scope:'openid siteid email offline_access',
    authorizePath: 'authorize',
    // redirectPath: 'https://epractice.sit.healthcode.co.uk/postauth'
    redirectPath: 'https://www.my-ebooking.co.uk/epractice/postauth'
  },

  msgurl: 'http://www.dev.healthcode.co.uk/secure-messaging/prelogin/auth/preauth.jsp',
  pprurl: 'http://www.dev.healthcode.co.uk/pprepractice/pages/pprspecialist/prelogin/auth/preauth.jsp',
  codeSearchUrl: 'http://www.dev.healthcode.co.uk/Code-Search/prelogin/auth/preauth.jsp'
};
