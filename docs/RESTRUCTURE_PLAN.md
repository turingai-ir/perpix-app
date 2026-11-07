# پلن بازسازی معماری PerPix Frontend (استاندارد ۲۰۲۷)

> وضعیت: پیش‌نویس برای تأیید. تا تأیید شما هیچ فایلی حذف یا جابه‌جا نشده است.
> مبنا: بررسی ساختار `src/`، ریشه‌ی ریپو، `package.json` و `docs/agent-guides/FRONTEND_ARCHITECTURE_FULL.md`.

---

## ۱. تشخیص وضعیت فعلی (مشکلات واقعی)

| # | مشکل | شواهد |
|---|------|-------|
| 1 | **دو پوشه‌ی feature موازی** | `src/feature/` (۹ ماژول: payment, pricing, wallet, user, pwa, support-chat, media-uploader, ai-task-events, file-manager) و `src/features/` (۸ ماژول: auth, editor, file-manager, payment, runtime, app-runtime, boot-splash). `file-manager` و `payment` در **هر دو** وجود دارند. |
| 2 | ماژول‌های `feature/` ساختار حلقه‌ای ندارند | فایل‌ها تخت‌اند (`api.ts`, `hook.tsx`, `state.ts`, `types.tsx`) و با `model/services/hooks/components` که در سند معماری آمده نمی‌خوانند. |
| 3 | صفحات منطق دامنه دارند | `src/pages/(app)/generation/*` (image/video/_components/_hooks/_utils) و `src/pages/editor/*` هر کدام ده‌ها فایل منطق، مدل و hook دارند؛ صفحه باید فقط «ترکیب» باشد. |
| 4 | **CSS پراکنده و حجیم** | ۳۰ فایل `.css/.module.css` در کنار کامپوننت‌ها؛ `dashboard.module.css` ۲٬۲۳۷ خط، `composer.module.css` ۱٬۳۵۱، `editor-studio.css` ۱٬۰۸۴. با قانون Tailwind v4 پروژه (و کامیت اخیر gallery) هم‌خوان نیست. |
| 5 | پوشه‌های «کیسه‌ی عمومی» | `utils/` (`consts-only`, `app-keys`, `regex`, `string`…), `lib/`, `hooks/` (مخلوط hookهای UI و hookهای دامنه مثل `use-dynamic-config-form`), `state/` (فقط یک atom)، `components/custom/` (شامل منطق ویدیو: `use-video-output.ts`). |
| 6 | قراردادهای نام‌گذاری ناسازگار | `_tests` / `__tests__` / `_components` / `_hooks`، `services/i18` به‌جای `i18n`، `hook.tsx` و `types.tsx` (بدون JSX). |
| 7 | فایل‌های بزرگ | `use-dynamic-config-form/schema.ts` ۱٬۰۰۰ خط، `ui/sidebar.tsx` ۷۲۱ خط، `home-dashboard.spec.ts` ۱٬۳۰۶ خط. سقف ۱۰۰ خطی سند معماری رعایت نمی‌شود. |
| 8 | تست‌ها دو جا | `__tests__/` ریشه (۴۸ فایل، ۵۷۲KB، شامل `generation-video-prompt-box.spec.ts` با ۶۷KB) + `_tests/` کنار کد. |
| 9 | **آشغال tracked در git** | `.tmp-hero.png`, `.tmp-hero-mobile.png`, `.tmp-hero-view.mjs`, `.tmp-hero-playwright.config.ts`, `.tmp-image-studio-playwright.config.ts`, `docs/auth-*-preview.png`, `.kilo/`, `.claude/CLAUDE.md` (تکراری)، `skills-lock.json`. |
| 10 | **۱۷۹ فایل `.agents/` در git** (۱۹MB) | skillهای شخص‌ثالث (impeccable، better-*…) که نباید در ریپوی محصول باشند. |
| 11 | docs پر از خروجی یک‌بارمصرف | `docs/qa/feature-1-release-*` (csv/json/md)، `release-readiness-2026-10-17.md` (۵۰KB)، `test-server-handoff.md`، mockup PNGها. |
| 12 | فایل‌های پیکربندی مرده | `tailwind.config.js` (۸۵ بایت؛ Tailwind v4 به config نیاز ندارد)، `components-registry.json`. |
| 13 | وابستگی‌های مشکوک | `universal-cookie` (۰ import)، `react-icons` (۱ فایل با وجود `lucide-react` در ۱۳۴ فایل)، `react-use` (۱)، `vaul` (۱)، `cmdk` (۱). |
| 14 | مرز feature نقض شده | ۳ import عمیق بین feature‌ها بیرون از ماژول خودشان (`@/features/x/y/...`). |
| 15 | ایمپورت‌ها بدون enforcement | هیچ قانون lint برای مرز لایه‌ها نیست؛ سند معماری فقط «توصیه» است. |

> نکته: بخشی از تحلیل بالا با grep انجام شده؛ پیش از فاز ۴ و ۷ با ابزار دقیق‌تر (`knip`/`dependency-cruiser`) تأیید می‌شود.

---

## ۲. معماری هدف

اصول: **Feature-Sliced** سبک (لایه‌ها یک‌طرفه به سمت پایین)، **یک پوشه‌ی feature**، **صفحه = ترکیب‌کننده**، **مرزها با lint اجرا شوند نه با سند**.

```
src/
├── app/                      # ورودی و wiring سراسری
│   ├── main.tsx
│   ├── app.tsx
│   ├── providers/            # Query, Jotai, i18n, Theme, Sentry, Toaster
│   ├── router/               # routes.ts, router.tsx, dynamic-import-recovery
│   └── styles/               # tailwind.css (tokens/theme)، globals.css
│
├── pages/                    # فقط route-level؛ هر صفحه ≤ ~۸۰ خط ترکیب
│   ├── (root)/ (app)/ auth/ profile/ editor/ payment/
│   └── <page>/page.tsx  (+ در صورت نیاز _sections/ مخصوص layout همان صفحه)
│
├── features/                 # تنها محل منطق دامنه
│   └── <feature>/
│       ├── index.ts          # تنها API عمومی
│       ├── model/            # type, zod, ثابت‌ها، توابع خالص (بدون React)
│       ├── services/         # API, SSE, IndexedDB (idb-keyval)
│       ├── hooks/            # TanStack Query, atomهای محلی، ViewModel
│       ├── components/       # UI فیچر
│       └── __tests__/        # یک قرارداد واحد برای تست
│
├── shared/                   # بدون دانش دامنه؛ همه‌جا قابل استفاده
│   ├── ui/                   # shadcn / Base UI primitives (فعلی components/ui)
│   ├── components/           # ErrorBoundary, Loading, ErrorSection… (بدون منطق دامنه)
│   ├── hooks/                # useMobile, useInfiniteScroll, useRouteBack…
│   ├── lib/                  # cn, dayjs, react-query client, jotai store, event-bus, observability
│   ├── api/                  # client.ts و api.ts تولیدشده (جابه‌جایی همراه با آپدیت generate-api)
│   ├── i18n/                 # config + locales
│   └── config/               # APP_KEYS, consts, regex (جایگزین utils/)
│
└── vite-env.d.ts
```

### فیچرهای هدف (ادغام `feature/` + `features/`)

| فیچر هدف | منبع فعلی |
|----------|-----------|
| `auth` | `features/auth` |
| `app-runtime` | `features/app-runtime` + `features/runtime` (در صورت هم‌پوشانی ادغام) |
| `boot-splash` | `features/boot-splash` |
| `file-manager` | `features/file-manager` + `feature/file-manager` (**ادغام**) |
| `payment` | `features/payment` + `feature/payment` (**ادغام**) |
| `pricing` | `feature/pricing` |
| `wallet` | `feature/wallet` |
| `user` | `feature/user` |
| `media-uploader` | `feature/media-uploader` |
| `ai-task-events` | `feature/ai-task-events` |
| `support-chat` | `feature/support-chat` |
| `pwa` | `feature/pwa` |
| `editor` | `features/editor` + منطق `pages/editor/_hooks,_model` |
| `generation` | **جدید**: منطق `pages/(app)/generation/*` (image، video، prompt-box، dynamic-config) |
| `dynamic-config` | **جدید**: `hooks/use-dynamic-config-form` (schema، json-forms adapter) + `generation/.../dynamic-config` |
| `video-output` | از `components/custom/video-output*` و `use-video-output` (یا زیرمجموعه‌ی generation) |

### قوانین مرز (با lint اجرا می‌شود)

```
app → pages → features → shared
```
- `shared` به هیچ `features` یا `pages` وابسته نیست.
- `features/A` فقط از `features/B` (از `index.ts` آن) import می‌کند؛ import چرخه‌ای ممنوع.
- `pages` فقط از `features/*/index.ts` و `shared` import می‌کند و **هیچ** fetch/Query مستقیم ندارد.
- داخل فیچر: `components → hooks → services → model`.
- ابزار enforcement: `eslint-plugin-boundaries` یا `dependency-cruiser` (پیشنهاد: dependency-cruiser + اجرای CI چون چرخه‌ها را هم می‌گیرد). **افزودن وابستگی جدید نیازمند تأیید شماست** (طبق AGENTS.md).

---

## ۳. استانداردهای ۲۰۲۷ (کد، استایل، کیفیت)

1. **TypeScript**: `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` (تدریجی)، بدون `any`، `verbatimModuleSyntax`، `import type`.
2. **Barrel فقط در `features/*/index.ts`** — حذف barrelهای عمومی (`utils/index.ts`, `hooks/index.ts`, `components/custom/index.ts`) تا tree-shaking و HMR بهتر شود.
3. **استایل**: Tailwind v4 تنها منبع حقیقت؛ توکن‌ها در `@theme`؛ **حذف تدریجی تمام `*.module.css`/`*.css` کامپوننتی** مگر keyframes/خواص غیرقابل‌بیان در Tailwind (آن‌ها در `shared/styles/animations.css` یا `@utility`). ترتیب مهاجرت از بزرگ‌ترین: dashboard → composer → editor-studio → studio → sidebar…
4. **نام‌گذاری**: همه‌ی فایل‌ها `kebab-case`؛ پسوند `.tsx` فقط اگر JSX دارد؛ پوشه‌ی تست یکسان `__tests__/`؛ پوشه‌ی i18n به‌صورت `i18n`.
5. **سقف اندازه**: کامپوننت/هوک ≤ ۱۰۰ خط منطقی (قانون فعلی)؛ فایل‌های بزرگ (`schema.ts` ۱۰۰۰ خطی، `sidebar.tsx`) به‌صورت تدریجی شکسته شوند، بدون بازنویسی اجباری.
6. **State**: Server state فقط TanStack Query (+`openapi-react-query`)؛ Client state فقط Jotai محلی به فیچر؛ `state/index.ts` به `shared/lib` یا `features/app-settings` منتقل شود.
7. **عملکرد**: route-level `lazy`، جدا کردن chunk برای `three`/`@react-three`/`konva`/`gsap` (فقط روی صفحاتی که لازم‌اند)، بودجه‌ی bundle در تست `production-bundle.spec.ts`.
8. **دسترسی‌پذیری و RTL/i18n**: بدون تغییر در قوانین فعلی؛ lint برای رشته‌های سخت‌کد (`i18next/no-literal-string` — نیاز به تأیید وابستگی).
9. **کیفیت خودکار**: `pnpm lint`, `tsc -b`, تست مرز، `knip` برای کد/وابستگی مرده، CI روی PR.
10. **امنیت/عملیات**: `.env*` خارج از git (الان هست)، `Dockerfile`/`nginx.conf` بدون تغییر در این بازسازی.

---

## ۴. فایل‌ها و پوشه‌هایی که پیشنهاد حذف دارند

> هیچ‌کدام بدون تأیید شما حذف نمی‌شوند. دسته‌بندی بر اساس ریسک:

### الف) ایمن (آشغال محض)
- `.tmp-hero.png`, `.tmp-hero-mobile.png`, `.tmp-hero-view.mjs`, `.tmp-hero-playwright.config.ts`, `.tmp-image-studio-playwright.config.ts`
- `tailwind.config.js` (Tailwind v4؛ بعد از بررسی `@config` در `tailwind.css`)
- `components-registry.json` (اگر `scripts/add-shadcn` به آن وابسته نباشد — بررسی لازم)
- `docs/auth-login-preview.png`, `docs/auth-success-preview.png`
- ناپدید شدن پوشه‌های untracked/تولیدی از دیسک: `dev-dist/`, `playwright-report/`, `test-results/` (در `.gitignore` هستند؛ فقط پاک‌سازی محلی)

### ب) نیاز به تصمیم شما
- `.agents/` (۱۷۹ فایل، ۱۹MB) و `.kilo/`، `skills-lock.json`، `.claude/CLAUDE.md` (تکراری با `AGENTS.md`): ابزار AI شخصی‌اند → پیشنهاد: از git خارج (`git rm -r --cached`) و در `.gitignore`، `scripts/setup-ai-tools.*` بماند تا هر نفر لوکال بسازد.
- `docs/qa/feature-1-*`, `docs/release-readiness-2026-10-17.md`, `docs/test-server-handoff.md`, `docs/design/*-mockups/*.png`: مستندات یک‌بارمصرف → پیشنهاد: انتقال به `docs/archive/` یا حذف از git (در تاریخچه می‌ماند).
- `src/pages/design-preview/` (صفحه‌ی پیش‌نمایش طراحی): اگر مسیر production نیست، حذف یا فقط در dev.
- `__tests__/` ریشه: ادغام با تست‌های کنار فیچر (فاز ۶).

### پ) وابستگی‌ها (فقط پس از تأیید و با `knip`)
- `universal-cookie` (۰ استفاده)، `react-icons` (۱ فایل → جایگزین با `lucide-react`)، `react-use` (۱ فایل)، `vaul` و `cmdk` (۱ فایل؛ ممکن است وابسته‌ی shadcn باشند — بررسی).

---

## ۵. فازهای اجرا (هر فاز = یک PR جدا، build سبز در پایان)

> قاعده‌ی کلی: جابه‌جایی با `git mv` (حفظ history)، بدون تغییر منطق در همان کامیت. aliasهای `@/…` برای مسیر جدید در `tsconfig.app.json` و `vite.config.ts` اصلاح می‌شود. بعد از هر فاز: `pnpm lint && pnpm build` + تست‌های هدفمند، و `graphify update .`.

### فاز ۰ — Baseline و ایمنی (۰.۵ روز)
- شاخه‌ی جدا از `turing-devAmir`.
- اجرای `pnpm lint`, `pnpm build` و ثبت خروجی/وضعیت تست‌ها به‌عنوان baseline.
- نصب‌نکردن چیزی؛ اجرای `knip` و `dependency-cruiser` با `pnpm dlx` (بدون تغییر package.json) برای گزارش کد/وابستگی مرده و چرخه‌ها.

### فاز ۱ — پاک‌سازی ریشه‌ی ریپو (۰.۵ روز، ریسک پایین)
- حذف دسته‌ی (الف) بخش ۴.
- تصمیم و اجرای دسته‌ی (ب): `.agents`/`.kilo`/`skills-lock` از git خارج؛ `docs` به `archive/`.
- به‌روزرسانی `.gitignore` و `README.md`.

### فاز ۲ — ایجاد `shared/` و `app/` (۱–۲ روز)
- `components/ui` → `shared/ui`؛ `components/custom` (غیر دامنه) → `shared/components`؛ `lib/*`, `utils/*`, `hooks/*` (عمومی) → `shared/*`.
- `services/api` → `shared/api`، `services/i18` → `shared/i18n`.
- `main.tsx`, `app.tsx`, `router/`, `styles/` → `app/`.
- اجرا با codemod ساده‌ی جایگزینی importها (sed/ts-morph) + `tsc -b` برای تأیید.
- **ریسک**: `generate-api` به مسیر `src/services/api/api.ts` اشاره دارد → اسکریپت و ماژول‌های وابسته در همین فاز به‌روز شود (اجرای `generate-api` فقط تأیید مسیر، نه تغییر قرارداد). `api.ts` دستی ویرایش نمی‌شود.

### فاز ۳ — یکی‌سازی `feature/` و `features/` (۲–۳ روز)
- به ترتیب: `pwa`, `support-chat`, `user`, `wallet`, `ai-task-events`, `media-uploader`, `pricing`, سپس موارد دوپاره‌ی `file-manager` و `payment`.
- هر ماژول به ساختار `model/services/hooks/components/__tests__` + `index.ts` تبدیل شود (`api.ts`→`services/`, `types.tsx`→`model/types.ts`, `hook.tsx`→`hooks/`, `state.ts`→`hooks/` یا `model/`).
- رفع ۳ import عمیق و ایمپورت‌های `@/feature/*` (شمارش فعلی: file-manager ۱۸، payment ۱۱، pricing ۱۲، media-uploader ۹ ، wallet ۶، user ۳، بقیه ۱).
- بعد از اتمام، پوشه‌ی `src/feature/` حذف می‌شود.

### فاز ۴ — استخراج دامنه از `pages/` (۳–۵ روز، پرریسک‌ترین فاز)
- `pages/(app)/generation/*` → `features/generation` (`image`, `video`, `prompt-box`, `history`) و `features/dynamic-config` (از `hooks/use-dynamic-config-form` + `dynamic-config`).
- `pages/editor/{_hooks,_model,_components}` → `features/editor`.
- `pages/profile/*` (finance، settings) → `features/profile` یا به `wallet`/`user` اضافه شود.
- هر صفحه‌ی `page.tsx` تنها از `index.ts` فیچر import می‌کند. هدف: صفحات ≤ ۸۰ خط.
- پیش از شروع، `FRONTEND_ARCHITECTURE_FULL.md` را کامل می‌خوانیم (تغییر Critical طبق AGENTS.md) و Playwright مربوط به generation/editor را baseline می‌گیریم.

### فاز ۵ — مهاجرت CSS به Tailwind (۴–۶ روز، موازی با فاز ۴ ممکن)
- ۳۰ فایل CSS به ترتیب حجم؛ الگوی کامیت gallery (`30217e9`) مرجع است.
- keyframeهای مشترک → `app/styles/animations.css` یا `@theme`.
- هر مهاجرت با اسکرین‌شات قبل/بعد (Playwright) و بررسی RTL/dark.
- هدف نهایی: صفر `*.module.css`.

### فاز ۶ — یکسان‌سازی تست‌ها (۱–۲ روز)
- هر تست متعلق به فیچر → `features/<f>/__tests__/`؛ تست‌های E2E سراسری و `fixtures/support/release-qa` → `e2e/` (یا همان `__tests__/` ریشه با نام `e2e/`) + configهای Playwright در یک پوشه.
- شکستن `generation-video-prompt-box.spec.ts` (۶۷KB) و `home-dashboard.spec.ts` (۱٬۳۰۶ خط).
- ادغام ۶ فایل `*.playwright.config.ts` به یک config با `projects`.

### فاز ۷ — Enforcement و استانداردها (۱–۲ روز)
- افزودن قوانین مرز (dependency-cruiser یا eslint-plugin-boundaries) — **نیازمند تأیید برای افزودن وابستگی**.
- `knip` در CI؛ سخت‌گیری تدریجی tsconfig؛ قانون سقف خط (`max-lines`) به‌صورت warning.
- حذف وابستگی‌های مرده (دسته‌ی پ) و barrelهای عمومی.
- به‌روزرسانی `AGENTS.md` و `FRONTEND_ARCHITECTURE_FULL.md` با ساختار نهایی (`features/`, `shared/`, `app/`) و حذف مفاد منسوخ.

### فاز ۸ — بهینه‌سازی و بستن (۱–۲ روز)
- تحلیل bundle (`three`, `konva`, `gsap` به chunk جدا / lazy)، بودجه‌ی اندازه.
- اجرای کامل: `pnpm lint`, `pnpm build`, Playwright کامل، `production-bundle.spec.ts`.
- `graphify update .`.

**مجموع تقریبی**: ۱۵–۲۲ روز کاری؛ فازهای ۱–۳ به‌تنهایی بیشترین ارزش را با کمترین ریسک می‌دهند.

---

## ۶. ریسک‌ها و راهکار

| ریسک | راهکار |
|------|--------|
| شکستن importها در جابه‌جایی انبوه | `git mv` + codemod + `tsc -b` در هر مرحله؛ PR کوچک |
| از دست رفتن history | فقط `git mv`، بدون تغییر محتوا در همان کامیت |
| تعارض با کار موازی تیم | فریز شاخه‌ی هدف در طول هر فاز؛ فاز ۴ و ۵ جدا از توسعه‌ی فیچر |
| رگرسیون بصری هنگام حذف CSS | اسکرین‌شات Playwright قبل/بعد، بررسی RTL و dark |
| `generate-api` مسیر قدیمی را بازنویسی کند | اصلاح مسیر خروجی در اسکریپت در فاز ۲ |
| وابستگی ناخواسته‌ی مسیرهای `@/…` در `index.html`/PWA/Sentry | بررسی `vite.config.ts` و `workbox` قبل از فاز ۲ |

---

## ۷. تعریف «تمام شد» (Definition of Done)

- فقط `app/`, `pages/`, `features/`, `shared/` در `src/` وجود دارد.
- هیچ import عمیق بین فیچرها و هیچ چرخه‌ای نیست (CI سبز).
- صفر فایل `*.module.css` / CSS کامپوننتی.
- صفر آشغال tracked در ریشه و `docs/` مرتب.
- `pnpm lint`, `pnpm build` و Playwright کامل سبز.
- مستندات (`AGENTS.md`, سند معماری) با ساختار واقعی هم‌خوان.

---

## ۸. تصمیم‌هایی که از شما لازم است

1. **`.agents/`، `.kilo/`، `skills-lock.json`**: از git خارج شوند؟ (پیشنهاد: بله)
2. **docs یک‌بارمصرف** (QA/release/mockup): حذف یا `docs/archive/`؟ (پیشنهاد: archive)
3. **افزودن ابزار enforcement** (`dependency-cruiser`، `knip`)؟ (پیشنهاد: بله، به‌عنوان devDependency)
4. **نام لایه‌ی مشترک**: `shared/` (پیشنهادی) یا `core/`؟
5. **`pages/design-preview`**: حذف یا فقط dev؟
6. **شروع از کدام فاز؟** پیشنهاد: فاز ۰ → ۱ → ۲ → ۳ را در همین ترتیب انجام دهیم و بعد درباره‌ی فاز ۴ تصمیم بگیریم.

---

## ۹. قواعد سیستم استایل (فاز ۵ — مصوب)

1. **ترتیب انتخاب**: کامپوننت shadcn (`@/shared/ui`, استایل `base-nova`، CLI نسخه‌ی latest) ← کامپوننت ترکیبی ما در `@/shared/components` ← utility کلاس‌های Tailwind. CSS اختصاصی آخرین راه است.
2. **کامپوننت شدن**: الگوی تکراری UI (کارت آمار، هدر صفحه، حالت خالی، پنل شیشه‌ای…) به‌جای کپی کلاس، کامپوننت می‌شود (برای این فاز قانون «سه‌بار» کنار گذاشته شد، چون هدف یک‌دست‌سازی است).
3. **رنگ و فاصله فقط از توکن**: رنگ سخت‌کد (`#9188a5`) به توکن در `app/styles/tokens.css` نگاشت می‌شود؛ مقدارهای تکراری توکن جدید می‌گیرند.
4. **`app/styles/`** فقط شامل tokens، theme (`@theme`)، base، `@keyframes` مشترک و `@utility`‌های مشترک است؛ استایل کامپوننت هرگز.
5. **اعتبارسنجی**: مقایسه‌ی computed-style و موقعیت المان‌ها قبل/بعد برای هر صفحه (دسکتاپ و موبایل) — ابزار محلی در `.visual/` (خارج از git).
6. **استاندارد موبایل (لمسی)**: روی `pointer: coarse` کنترل‌ها حداقل ۴۴px هستند (دکمه‌ی پیش‌فرض `h-11`، `lg` ‏`h-12`، `sm` ‏`h-10`، `xs` ‏`h-9`؛ input و select ‏`h-11`) و فیلد متنی `text-base` (۱۶px) است تا iOS زوم نکند. این در خود کامپوننت‌های `shared/ui` با variant ‏`pointer-coarse:` پیاده شده؛ در صفحات سایز دستی ننویسید.
7. **رنگ**: فقط توکن‌های semantic شادسی‌ان (`background`, `foreground`, `card`, `muted`, `primary`, `border`, `ring`, `destructive`) + توکن‌های برند (`--brand-*`, `--image-accent`, `--video-accent`). `#hex` و `rgb()` در کامپوننت ممنوع.
8. **سایز/فاصله**: فقط مقیاس Tailwind (`gap-2`, `p-4`, `text-sm`…)؛ مقدار دلخواه `[13px]` فقط با دلیل و ترجیحاً با توکن.
9. **Mobile-first**: کلاس پایه برای موبایل، `md:`/`lg:` برای بزرگ‌تر؛ breakpointهای `max-width` ممنوع.
