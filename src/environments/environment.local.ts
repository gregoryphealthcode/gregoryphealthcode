export const environment = {
  production: true,
  development: false,

  environmentName: 'hc-dev',
  testMode: true,


  // serverUrl: 'https://api.epractice.dev.healthcode.co.uk',
  // authserverBaseurl: 'https://api.epractice.dev.healthcode.co.uk',
  // baseurl: 'https://api.epractice.dev.healthcode.co.uk/api',
  // documentApiUrl: 'https://api.epractice.dev.healthcode.co.uk/ePracticeDocViewer',
  // medSecBaseurl: 'https://api.epractice.dev.healthcode.co.uk/ePracticeMedSec/',
  // RouterTraceEnabled: false,
  // webPageRoot: 'https://epractice.dev.healthcode.co.uk/',

  serverUrl: 'https://localhost:44331',
  authserverBaseurl: 'https://localhost:44331',
  baseurl: 'https://localhost:44331/api',
  documentApiUrl: 'https://localhost:44331',
  medSecBaseurl: 'https://localhost:44331/ePracticeMedSec/',
  RouterTraceEnabled: false,
  webPageRoot: 'https://localhost /',


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
   enableLocalAuth: true,

   healthCode:{
    clientId: 'epractice',
    mainUrl: 'https://auth.sit.healthcode.co.uk',
    scope:'openid siteid email offline_access',
    authorizePath: 'authorize',
    redirectPath: 'https://epractice.sit.healthcode.co.uk/postauth'
  },

  msgurl: 'http://www.sit.healthcode.co.uk/secure-messaging/prelogin/auth/preauth.jsp',
  pprurl: 'http://www.sit.healthcode.co.uk/pprepractice/pages/pprspecialist/prelogin/auth/preauth.jsp',
  codeSearchUrl: 'http://www.sit.healthcode.co.uk/Code-Search/prelogin/auth/preauth.jsp'
};
