export const ROUTES_KEY = {
  auth: {
    path: '/auth',
    login: {
      path: '/auth/login',
    },
  },
  root: {
    path: '/',
  },
  profile: {
    root: '/profile',
    settings: '/profile/settings',
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
