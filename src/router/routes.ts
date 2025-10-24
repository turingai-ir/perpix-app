export const APP_ROUTES_KEY = {
  auth: {
    path: '/auth',
    login: {
      path: '/auth/login',
    },
  },
  app: {
    path: '/',
  },
  profile: {
    root: {
      path: '/profile',
    },
    settings: {
      path: '/profile/settings',
    },
  },
  generation: {
    image: {
      path: '/generation/image',
      history: {
        path: '/generation/image/:chatId',
      },
    },
  },
} as const;
