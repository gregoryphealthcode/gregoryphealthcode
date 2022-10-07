// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  environment_name: 'HealthFirst',
  production: false,
  development: true,

  serverUrl: 'https://localhost:44331',               //** change to url used for epractice on hf environment */
  authserverBaseurl: 'https://localhost:44331/api',   //** change to url used for epractice on hf environment */
  baseurl: 'https://localhost:44331/api',             //** change to url used for epractice on hf environment */

  documentApiUrl: 'https://localhost:44331/ePracticeDocViewer',    //** change to url used for epractice on hf environment */
  medSecBaseurl: 'https://localhost:44331/ePracticeMedSec/',       //** change to url used for epractice on hf environment */

  RouterTraceEnabled: true,
  webPageRoot: 'https://localhost:4433/',        //** change to url used for epractice on hf environment */
  HelpHeroPlatform: 'Dev Server',
  enableLocalAuth: true,
  healthCode: {
    clientId: 'epractice',
    // mainUrl: 'https://auth.sit.healthcode.co.uk',    //** auth against SIT */
    mainUrl: 'https://auth.dev.healthcode.co.uk',       //** auth against DEV */
    scope: 'openid siteid email offline_access',
    authorizePath: 'authorize',
    redirectPath: 'https://localhost:4200/postauth'   //** change to url used for epractice on hf environment */
  },
  msgurl: 'http://www.dev2.healthcode.co.uk/secure-messaging/prelogin/auth/preauth.jsp',
  pprurl: 'http://www.dev2.healthcode.co.uk/pprepractice/pages/pprspecialist/prelogin/auth/preauth.jsp',
  codeSearchUrl: 'http://www.dev2.healthcode.co.uk/Code-Search/prelogin/auth/preauth.jsp'
};

import 'zone.js/dist/zone-error';
