// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  development: false,
  // serverUrl: 'https://api.epractice.sit.healthcode.co.uk',
  // authserverBaseurl: 'https://api.epractice.sit.healthcode.co.uk',
  // baseurl: 'https://api.epractice.sit.healthcode.co.uk',
  // documentApiUrl: 'https://api.epractice.sit.healthcode.co.uk',
  // medSecBaseurl: 'https://api.epractice.sit.healthcode.co.uk/ePracticeMedSec/',
  // RouterTraceEnabled: false,
  // webPageRoot: 'https://epractice.sit.healthcode.co.uk /',
  serverUrl: 'https://localhost:44331',
  authserverBaseurl: 'https://localhost:44331',
  baseurl: 'https://localhost:44331/api',
  documentApiUrl: 'https://localhost:44392',
  medSecBaseurl: 'https://localhost:44368/',
  RouterTraceEnabled: false,
  webPageRoot: 'http://localhost:4200/',

  // OAuthSettings: {
  //   appId: '1f68a230-2c7b-4d3a-a295-d64fef17fd19',
  //   scopes: [
  //     'user.read',
  //     'calendars.read',
  //     'mail.send'
  //   ]
  //  },
  //HelpHeroPlatform: 'Dev Server',
  HelpHeroPlatform: 'Local',
  enableLocalAuth: true,
  healthCode: {
    clientId: 'epractice',
    mainUrl: 'https://auth.dev.healthcode.co.uk',
    scope: 'openid siteid email offline_access',
    authorizePath: 'authorize',
    redirectPath: 'https://localhost:4200/postauth'
  },
  msgurl: 'http://www.dev2.healthcode.co.uk/secure-messaging/prelogin/auth/preauth.jsp',
  pprurl:
    'http://www.dev2.healthcode.co.uk/pprepractice/pages/pprspecialist/prelogin/auth/preauth.jsp',
  codeSearchUrl: 'http://www.dev2.healthcode.co.uk/Code-Search/prelogin/auth/preauth.jsp'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
