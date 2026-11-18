import "i18next";

import type faTranslation from "./locales/fa.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "MAIN";
    resources: {
      MAIN: typeof faTranslation;
    };
  }
}
