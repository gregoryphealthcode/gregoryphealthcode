
export const environment = {
  environment_name: 'local',
  production: false,
  development: true,


  serverUrl: 'https://my-ebooking.co.uk/epractice2data',
  authserverBaseurl: 'https://my-ebooking.co.uk/epractice2data/api',
  baseurl: 'https://my-ebooking.co.uk/epractice2data/api',

  documentApiUrl: 'https://my-ebooking.co.uk/ePracticeDocViewer',
  medSecBaseurl: 'https://my-ebooking.co.uk/ePracticeMedSec/',

  RouterTraceEnabled: false,
  webPageRoot: 'https://my-ebooking/epractice',

  HelpHeroPlatform: 'Dev Server',

  enableLocalAuth: false,

  healthCode: {
    clientId: 'epractice',
    // mainUrl: 'https://auth.sit.healthcode.co.uk',    //** auth against SIT */
     // mainUrl: 'https://auth.dev.healthcode.co.uk',       //** auth against DEV */
     mainUrl: '/epractice/HCAuthApi',         //** localproxy */


    scope: 'openid siteid email offline_access',
    authorizePath: 'authorize',
    redirectPath: 'https://localhost:4433/postauth'
  },
  msgurl: 'http://www.dev2.healthcode.co.uk/secure-messaging/prelogin/auth/preauth.jsp',
  pprurl:
    'http://www.dev2.healthcode.co.uk/pprepractice/pages/pprspecialist/prelogin/auth/preauth.jsp',
  codeSearchUrl: 'http://www.dev2.healthcode.co.uk/Code-Search/prelogin/auth/preauth.jsp'
};
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
