export const APP_ROUTES_KEY = {
  smsTest: { path: "/sms-test", meta: { title: "تست پیامک | پرپیکس" } },
  overview: {
    path: "/overview",
    meta: { title: "نمای کلی | پرپیکس" },
  },
  users: {
    list: {
      path: "/users",
      meta: { title: "مدیریت کاربران | پرپیکس" },
    },
    detail: {
      path: "/users/:userUuid",
      meta: { title: "جزئیات کاربر | پرپیکس" },
    },
  },
  finance: {
    payments: {
      list: {
        path: "/finance/payments",
        meta: { title: "پرداخت‌ها | پرپیکس" },
      },
      detail: {
        path: "/finance/payments/:paymentUuid",
        meta: { title: "جزئیات پرداخت | پرپیکس" },
      },
    },
    wallets: {
      list: {
        path: "/finance/wallets",
        meta: { title: "کیف پول‌ها | پرپیکس" },
      },
      detail: {
        path: "/finance/wallets/:walletUuid",
        meta: { title: "جزئیات کیف پول | پرپیکس" },
      },
    },
    transactions: {
      path: "/finance/transactions",
      meta: { title: "تراکنش‌های کیف پول | پرپیکس" },
    },
    topupPolicy: {
      path: "/finance/topup-policy",
      meta: { title: "تنظیمات شارژ کیف پول | پرپیکس" },
    },
    exchangeRate: {
      path: "/finance/exchange-rate",
      meta: { title: "نرخ ارز و گزارش‌ها | پرپیکس" },
    },
  },
  subscriptions: {
    list: {
      path: "/subscriptions",
      meta: { title: "مدیریت اشتراک‌ها | پرپیکس" },
    },
    detail: {
      path: "/subscriptions/:subscriptionUuid",
      meta: { title: "جزئیات اشتراک | پرپیکس" },
    },
    plans: {
      path: "/subscription-plans",
      meta: { title: "پلن‌های اشتراکی | پرپیکس" },
    },
    operations: {
      path: "/subscription-operations",
      meta: { title: "سوابق عملیات اشتراک | پرپیکس" },
    },
  },
  ai: {
    tasks: {
      list: {
        path: "/ai/tasks",
        meta: { title: "وظایف هوش مصنوعی | پرپیکس" },
      },
      detail: {
        path: "/ai/tasks/:taskUuid",
        meta: { title: "جزئیات وظیفه هوش مصنوعی | پرپیکس" },
      },
    },
    gateway: {
      list: {
        path: "/ai/gateway-requests",
        meta: { title: "درخواست‌های Gateway | پرپیکس" },
      },
      detail: {
        path: "/ai/gateway-requests/:requestUuid",
        meta: { title: "جزئیات درخواست Gateway | پرپیکس" },
      },
    },
    models: {
      path: "/ai/models",
      meta: { title: "مدل‌های هوش مصنوعی | پرپیکس" },
    },
    modelDetail: {
      path: "/ai/models/:modelUuid",
      meta: { title: "جزئیات مدل هوش مصنوعی | پرپیکس" },
    },
    providers: {
      path: "/ai/providers",
      meta: { title: "ارائه‌دهندگان هوش مصنوعی | پرپیکس" },
    },
  },
  studio: {
    captionPresets: {
      path: "/studio/caption-presets",
      meta: { title: "قالب‌های کپشن | پرپیکس" },
    },
  },
  files: {
    list: {
      path: "/files",
      meta: { title: "مدیریت فایل‌ها | پرپیکس" },
    },
    detail: {
      path: "/files/:fileUuid",
      meta: { title: "جزئیات فایل | پرپیکس" },
    },
  },
  security: {
    sessions: {
      path: "/auth/sessions",
      meta: { title: "مدیریت نشست‌ها | پرپیکس" },
    },
    tokens: {
      path: "/auth/api-tokens",
      meta: { title: "توکن‌های API | پرپیکس" },
    },
    audit: {
      path: "/auth/audit-events",
      meta: { title: "رویدادهای امنیتی | پرپیکس" },
    },
  },
  root: {
    path: "/",
    meta: {
      title: "داشبورد مدیریت",
    },
  },
  app: {
    path: "/",
    meta: {
      title: "داشبورد مدیریت",
    },
  },
  auth: {
    login: {
      path: "/login",
      meta: {
        title: "ورود به پنل مدیریت",
      },
    },
  },
} as const;
