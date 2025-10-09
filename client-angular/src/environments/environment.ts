// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */

export const environment: any = {
  production: false,
  baseUrl: 'https://activelearnergroup.com/api/v1/',
  shareUrl: 'https://activelearnergroup.com/',
  // baseUrl: 'http://localhost:3000/api/v1/',
  // baseUrl: '/',
  cookieToken: 'actives1qazLearnerxsw2Group',
  cookieExpirationTime: 10,
  sessionTime: 5,
  uploadsFolder: {
    profile: 'profile',
  },
  jwtTokenKey: 'activeLearnerGroup_JwtTken',
  currentUserKey: 'activeLearnerGroup_currentUser',
  role: {
    userRole: 'user',
    adminRole: 'admin',
  },
  audioFileSize: 10 * 1024 * 1024,
  audioFileTypes: ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/aac']
};
