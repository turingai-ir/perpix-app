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

  text: {
    root: {
      path: '/text',
    },
    chat: {
      path: '/text/:id',
    },
  },
  image: {
    root: {
      path: '/image',
    },
    chat: {
      path: '/image/:id',
    },
  },
} as const;
