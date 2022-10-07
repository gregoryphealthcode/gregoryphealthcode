export const environment = {
  environment_name: 'default',
  production: false,
  development: true,


  serverUrl: 'https://localhost:44331',
  authserverBaseurl: 'https://localhost:44331/api',
  baseurl: 'https://localhost:44331/api',

  documentApiUrl: 'https://localhost:44331/ePracticeDocViewer',
  medSecBaseurl: 'https://localhost:44331/ePracticeMedSec/',

  RouterTraceEnabled: false,
  webPageRoot: 'https://localhost:4433/',
  HelpHeroPlatform: 'Dev Server',
  enableLocalAuth: true,
  healthCode: {
    clientId: 'epractice',
    // mainUrl: 'https://auth.sit.healthcode.co.uk',    //** auth against SIT */
    mainUrl: 'https://auth.dev.healthcode.co.uk',       //** auth against DEV */
    scope: 'openid siteid email offline_access',
    authorizePath: 'authorize',
    redirectPath: 'https://localhost:4433/postauth'
  },
  msgurl: 'http://www.dev2.healthcode.co.uk/secure-messaging/prelogin/auth/preauth.jsp',
  pprurl: 'http://www.dev2.healthcode.co.uk/pprepractice/pages/pprspecialist/prelogin/auth/preauth.jsp',
  codeSearchUrl: 'http://www.dev2.healthcode.co.uk/Code-Search/prelogin/auth/preauth.jsp'
};

import 'zone.js/dist/zone-error';
