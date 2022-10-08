export const environment = {
  production: true,
  development: false,

  environmentName: 'hc-sit',
  testMode: true,

  serverUrl: 'https://api.epractice.sit.healthcode.co.uk',
  authserverBaseurl: 'https://api.epractice.sit.healthcode.co.uk',
  baseurl: 'https://api.epractice.sit.healthcode.co.uk/api',
  documentApiUrl: 'https://api.epractice.sit.healthcode.co.uk/ePracticeDocViewer',
  medSecBaseurl: 'https://api.epractice.sit.healthcode.co.uk/ePracticeMedSec/',
  RouterTraceEnabled: false,
  webPageRoot: 'https://epractice.sit.healthcode.co.uk/',


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

  msgurl: 'http://www.sit2.healthcode.co.uk/secure-messaging/prelogin/auth/preauth.jsp',
  pprurl: 'http://www.sit2.healthcode.co.uk/pprepractice/pages/pprspecialist/prelogin/auth/preauth.jsp',
  codeSearchUrl: 'http://www.sit2.healthcode.co.uk/Code-Search/prelogin/auth/preauth.jsp'
};
