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
} as const;
