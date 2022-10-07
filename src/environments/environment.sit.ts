export const environment = {
  environment_name: 'SIT',
  production: true,
  development: false,

  serverUrl: 'https://api.epractice.sit.healthcode.co.uk',
  authserverBaseurl: 'https://api.epractice.sit.healthcode.co.uk/api',
  baseurl: 'https://api.epractice.sit.healthcode.co.uk/api',
  documentApiUrl: 'https://api.epractice.sit.healthcode.co.uk/ePracticeDocViewer',
  medSecBaseurl: 'https://api.epractice.sit.healthcode.co.uk/ePracticeMedSec/',
  RouterTraceEnabled: false,
  webPageRoot: 'https://epractice.sit.healthcode.co.uk/',
  HelpHeroPlatform: 'SIT Server',
  enableLocalAuth: false,
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
