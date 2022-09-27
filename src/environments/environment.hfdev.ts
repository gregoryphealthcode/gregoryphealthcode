export const environment = {
    production: true,
    development: false,
    serverUrl: 'https://api.epractice.qa.healthfirsttech.com',
    authserverBaseurl: 'https://api.epractice.qa.healthfirsttech.com',
    baseurl: 'https://api.epractice.qa.healthfirsttech.com/api',
    documentApiUrl: 'https://api.epractice.qa.healthfirsttech.com/ePracticeDocViewer',
    medSecBaseurl: 'https://api.epractice.qa.healthfirsttech.com/ePracticeMedSec/',
    RouterTraceEnabled: false,
    webPageRoot: 'https://epractice.qa.healthfirsttech.com/',
    // OAuthSettings: {
    //   appId: '1f68a230-2c7b-4d3a-a295-d64fef17fd19',
    //   scopes: [
    //     'user.read',
    //     'calendars.read',
    //     'mail.send'
    //   ]
    //  },
  
    //  HelpHeroPlatform: 'Dev Server',
    //  enableLocalAuth: false,
    HelpHeroPlatform: 'Local',
    enableLocalAuth: true,
     healthCode:{
      clientId: 'epractice',
      mainUrl: 'https://auth.qa.healthfirsttech.com',
      scope:'openid siteid email offline_access',
      authorizePath: 'authorize',
      redirectPath: 'https://epractice.qa.healthfirsttech.com/postauth'
    },
  
    msgurl: 'http://www.dev2.healthcode.co.uk/secure-messaging/prelogin/auth/preauth.jsp',
    pprurl: 'http://www.dev2.healthcode.co.uk/pprepractice/pages/pprspecialist/prelogin/auth/preauth.jsp',
    codeSearchUrl: 'http://www.dev2.healthcode.co.uk/Code-Search/prelogin/auth/preauth.jsp'
  };
  