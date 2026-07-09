export const APP_ROUTES_KEY = {
  auth: {
    path: "/auth",
    login: {
      path: "/auth/login",
      meta: {
        title: "pages.auth.login.title",
      },
    },
  },
  app: {
    path: "/",
    meta: {
      title: "pages.root.title",
    },
  },
  gallery: {
    path: "/gallery",
    meta: {
      title: "pages.gallery.title",
    },
  },
  profile: {
    root: {
      path: "/profile",
    },
    settings: {
      path: "/profile/settings",
      meta: {
        title: "pages.profile.settings.title",
      },
    },
    payments: {
      path: "/profile/payments",
      meta: {
        title: "pages.profile.payments.title",
      },
    },
    walletTransactions: {
      path: "/profile/wallet-transactions",
      meta: {
        title: "pages.profile.walletTransactions.title",
      },
    },
  },
  generation: {
    image: {
      path: "/generation/image",
      meta: {
        title: "pages.generation.image.title",
      },
      history: {
        path: "/generation/image/:chatId",
        meta: {
          title: "pages.generation.image.title",
        },
      },
    },
    video: {
      path: "/generation/video",
      meta: {
        title: "pages.generation.video.title",
      },
      history: {
        path: "/generation/video/:chatId",
        meta: {
          title: "pages.generation.video.title",
        },
      },
    },
  },
  payment: {
    result: {
      path: "/payment/verify/:paymentUuid",
      meta: {
        title: "pages.payment.result.title",
      },
    },
  },
  editor: {
    path: "/editor",
    meta: {
      title: "pages.editor.title",
    },
  },
} as const;
