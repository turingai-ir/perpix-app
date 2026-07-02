export const APP_ROUTES_KEY = {
  auth: {
    path: "/auth",
    login: {
      path: "/auth/login",
    },
  },
  app: {
    path: "/",
  },
  gallery: {
    path: "/gallery",
  },
  profile: {
    root: {
      path: "/profile",
    },
    settings: {
      path: "/profile/settings",
    },
  },
  generation: {
    image: {
      path: "/generation/image",
      history: {
        path: "/generation/image/:chatId",
      },
    },
    video: {
      path: "/generation/video",
      history: {
        path: "/generation/video/:chatId",
      },
    },
  },
  payment: {
    result: {
      path: "/payment/verify/:paymentUuid",
    },
  },
} as const;
