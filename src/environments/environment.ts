// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'https://loyaltynew.bondly.io/api',
  apiUrl: 'https://loyalty.bondly.io/api',
  /* user@example.com
  program: 'Yalla Rewards',
  program_id: 2,
  user_id: 2,*/
  program: 'Yalla Rewards',
  program_id: 37,
  user_id: 194,
  firebase: {
    apiKey: 'AIzaSyB65xvHpbuYl-_n9T6FKCmaaPen8kp_DEw',
    authDomain: '',
    databaseURL: '',
    projectId: 'loyaltypwa-ee381',
    storageBucket: '',
    messagingSenderId: '1067060355766',
    appId: '1:1067060355766:android:6b02be17ca77954bc7fc17'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
