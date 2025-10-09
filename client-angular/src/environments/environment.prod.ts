export const environment: any = {
  production: true,
  baseUrl: '/api/v1/',
  shareUrl: 'https://activelearnergroup.com/',

  // baseUrl: 'http://localhost:3000/api/v1/',
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
};
