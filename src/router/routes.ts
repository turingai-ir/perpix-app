export const ROUTES_KEY = {
  root: {
    path: '/',
  },
  login: {
    path: '/login',
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
