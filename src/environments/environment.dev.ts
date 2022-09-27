export const environment = {
    production: true,
    development: false,
    serverUrl: 'https://api.epractice.dev.healthcode.co.uk',
    authserverBaseurl: 'https://api.epractice.dev.healthcode.co.uk',
    baseurl: 'https://api.epractice.dev.healthcode.co.uk/api',
    documentApiUrl: 'https://api.epractice.dev.healthcode.co.uk/ePracticeDocViewer',
    medSecBaseurl: 'https://api.epractice.dev.healthcode.co.uk/ePracticeMedSec/',
    RouterTraceEnabled: false,
    webPageRoot: 'https://epractice.dev.healthcode.co.uk/',
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
      redirectPath: 'https://epractice.dev.healthcode.co.uk/postauth'
    },
  
    msgurl: 'http://www.dev2.healthcode.co.uk/secure-messaging/prelogin/auth/preauth.jsp',
    pprurl: 'http://www.dev2.healthcode.co.uk/pprepractice/pages/pprspecialist/prelogin/auth/preauth.jsp',
    codeSearchUrl: 'http://www.dev2.healthcode.co.uk/Code-Search/prelogin/auth/preauth.jsp'
  };
  