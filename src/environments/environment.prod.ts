export const environment = {
  environment_name: '',
  production: true,
  development: false,
  serverUrl: 'https://api.epractice.prod.healthcode.co.uk',
  authserverBaseurl: 'https://api.epractice.prod.healthcode.co.uk/api',
  baseurl: 'https://api.epractice.prod.healthcode.co.uk/api',
  documentApiUrl: 'https://api.epractice.prod.healthcode.co.uk/ePracticeDocViewer',
  medSecBaseurl: 'https://api.epractice.prod.healthcode.co.uk/ePracticeMedSec/',
  RouterTraceEnabled: false,
  webPageRoot: 'https://epractice.sit.healthcode.co.uk/',

   HelpHeroPlatform: 'Dev Server',
   enableLocalAuth: true,
   healthCode:{
    clientId: 'epractice',
    mainUrl: 'https://auth.prod.healthcode.co.uk',
    scope:'openid siteid email offline_access',
    authorizePath: 'authorize',
    redirectPath: 'https://epractice.prod.healthcode.co.uk/postauth'
  },

  msgurl: 'http://www.prod.healthcode.co.uk/secure-messaging/prelogin/auth/preauth.jsp',
  pprurl: 'http://www.prod.healthcode.co.uk/pprepractice/pages/pprspecialist/prelogin/auth/preauth.jsp',
  codeSearchUrl: 'http://www.prod.healthcode.co.uk/Code-Search/prelogin/auth/preauth.jsp'
};
