# معماری فرانت PerPix

> وضعیت: ۱۰ نوامبر ۲۰۲۶ · مرجع اصلی معماری که `AGENTS.md` به آن ارجاع می‌دهد.
> قواعد استایل، i18n و محدوده‌ی تغییر در `AGENTS.md` هستند و این‌جا تکرار نمی‌شوند.

این سند می‌گوید هر تکه کد کجا زندگی می‌کند و به چه چیزی اجازه دارد وابسته باشد. ساختار پروژه از قبل درست طراحی شده بود. مشکل این بود که مرزها رعایت نمی‌شدند: منطق داده داخل کامپوننت، هوک داخل `components/`، و فایل‌هایی که چند مسئولیت بی‌ربط را با هم داشتند.

---

## ۱. لایه‌های برنامه

```
src/
  app/        راه‌اندازی، router، providerهای سراسری، استایل‌های پایه
  pages/      صفحه‌های route؛ فقط featureها را کنار هم می‌گذارند
  features/   هر قابلیت محصول (generation, wallet, payment, auth, …)
  shared/     کد بدون دانش محصول (ui, components, hooks, lib, utils, api, i18n)
```

جهت مجاز وابستگی فقط رو به پایین است:

```
app  →  pages  →  features  →  shared
```

- `shared` هیچ‌وقت از `features` یا `pages` import نمی‌کند.
- `pages` نازک است: featureها را import می‌کند و کنار هم می‌گذارد. اگر صفحه‌ای به دو feature نیاز دارد که نباید همدیگر را بشناسند، اتصالشان در `pages` انجام می‌شود. مثال: `src/pages/payment/result/page.tsx` گام بعدیِ کیف پول را از `wallet` و وضعیت اشتراک را از `pricing` می‌گیرد و به `PaymentResultPage` می‌دهد، بدون این‌که `payment` آن دو را بشناسد.
- یک feature فقط از `index.ts` featureهای دیگر import می‌کند، نه از فایل‌های داخلی آن‌ها.

### چرخه‌ی وابستگی بین featureها ممنوع است

جهت‌های فعلی که باید حفظ شوند:

| این feature | به این‌ها وابسته است | پس این‌ها نباید آن را import کنند |
| --- | --- | --- |
| `app-layout` | `ai-task-events`, `auth`, `generation`, `payment`, `pricing`, `pwa`, `user`, `wallet` | هیچ‌کدام از این featureها |
| `generation` | `dynamic-config`, `media-uploader`, `pricing`, `wallet` | هیچ‌کدام از این featureها |
| `wallet` | `payment`, `pricing` | `payment`, `pricing` |
| `pricing` | `payment` | `payment` |
| `payment` | `auth` | `auth` |

اگر یک feature باید کاری را در feature بالادست راه بیندازد، آن کار به feature پایین‌دست منتقل می‌شود. مثال: باز کردن پنجره‌ی شارژ کیف پول از داخل `generation` لازم بود، ولی وضعیت آن پنجره در `app-layout` بود. وضعیت به `wallet` منتقل شد (`useWalletChargeDialog`) تا هم `generation` و هم `app-layout` بتوانند از آن استفاده کنند.

---

## ۲. ساختار داخل هر feature

```
features/<name>/
  components/   فقط نمایش (JSX، استایل، رفتار تعاملی UI)
  hooks/        اتصال به React: state، effect، query، mutation، cache
  model/        قواعد و داده‌ی خالص؛ بدون React و بدون شبکه
  services/     کار با بیرون: fetch، stream، storage، فایل
  _tests/       تست‌های همان feature
  index.ts      API عمومی feature
```

### مسئولیت هر پوشه

| پوشه | مجاز | ممنوع |
| --- | --- | --- |
| `components/` | JSX، کلاس‌های Tailwind، `*-styles.ts`، state و effectِ صرفاً بصری (اندازه‌گیری DOM، انیمیشن، focus، باز و بسته بودن یک پنجره)، صدا زدن **یک** هوک feature | `useQuery`، `useMutation`، `queryClient`، `apiClient`، `fetch`، قواعد کسب‌وکار، export کردن هوک یا تابع غیرکامپوننتی |
| `hooks/` | `useState`، `useEffect`، React Query، Jotai، `navigate`، `toast`، ترکیب model و service | JSX؛ قاعده‌ای که بدون React هم قابل بیان است (آن را به `model` ببر) |
| `model/` | تابع خالص، ثابت، type، schema (مثل zod)، enum | React، شبکه، `window`، import **مقدار** runtime از `@/shared/api` |
| `services/` | `apiClient`، stream، `localStorage`، IndexedDB، تبدیل فایل | React، JSX |

### الگوی هدف برای یک کامپوننت

کامپوننت یک هوک صدا می‌زند و فقط چیزی را که برمی‌گرداند نمایش می‌دهد:

```tsx
// components/ai-task-events-provider.tsx
export function AiTaskEventsProvider() {
  useAiTaskNotifications();
  return null;
}
```

```ts
// hooks/use-ai-task-notifications.ts  → کش، toast، navigate
// model/task-events.ts                → حذف رویداد تکراری، ساخت URL (خالص و قابل تست)
```

### چرا model نباید مقدار runtime از `@/shared/api` بگیرد

باره‌ی `@/shared/api` کلاینت API را هم بار می‌کند و آن کلاینت هنگام بارگذاری `import.meta.env.VITE_PERPIX_API_URL` را می‌خواند. پس فایلی در `model/` که مثلاً `AiTaskRuleEnumMap` را import کند، در تست واحد Node اجرا نمی‌شود.

- **مجاز:** `import type { SchemaAiTaskMessageResponse } from "@/shared/api"`
- **به جای enum:** مقدار literal بنویس، مثل `message.role === "ASSISTANT"`.

### یک فایل، یک مسئولیت

نشانه‌ی فایلی که باید شکسته شود: چند هوک یا تابع export شده که با هم ربطی ندارند، یا هوکی بالای حدود ۱۵۰ خط. الگوی شکستن را در `generation` ببین:

| قبل | بعد |
| --- | --- |
| `hooks/model.ts` (۳۷۵ خط: انتخاب مدل، تولید، polling، لیست تاریخچه، helperهای وضعیت) | `use-model.ts`، `use-ai-generate.ts` (`useAiTask` و `useAiGenerate` جدا)، `use-ai-task-result-polling.ts`، `use-ai-tasks-list.ts`، `model/task-message-status.ts`، `model/ai-tasks-list-cache.ts` |
| `hooks/generation-page.ts` (۴۵۳ خط) | `use-conversation-task.ts`، `use-generation-submission.ts`، `use-generation-retry.ts`، `use-message-hash-scroll.ts`، `model/conversation-messages.ts`؛ خود `generation-page.ts` فقط این‌ها را کنار هم می‌گذارد |

---

## ۳. قراردادها

### نام‌گذاری

| نوع | قالب | مثال |
| --- | --- | --- |
| فایل | kebab-case | `use-file-field.ts`، `payment-events.ts` |
| هوک | `use-<کار>.ts`، یک هوک اصلی در هر فایل | `useGenerationSubmission` |
| model | اسم مفهوم، نه «utils» | `conversation-messages.ts`، `file-media.ts` |
| استایل‌های مشترک یک کامپوننت | `<نام>-styles.ts` کنار همان کامپوننت | `studio-styles.ts` |
| تست | `_tests/<موضوع>.spec.ts` | `_tests/retry-config.spec.ts` |

### API عمومی feature

- هر چیزی که بیرون از feature لازم است، از `index.ts` export می‌شود.
- چیزی را که فقط داخل فایل خودش استفاده می‌شود export نکن. در زمان نوشتن این سند حدود ۱۰۰ export از این نوع وجود دارد (بیشترشان API استاندارد shadcn هستند که می‌مانند).

### فایل‌های تولیدی و حساس

- `src/shared/api/api.ts` تولیدی است. هرگز دستی ویرایش نشود و هرگز Prettier روی کل `src/shared` اجرا نشود، چون این فایل را بازنویسی می‌کند. Prettier را فقط روی فایل‌های تغییرکرده اجرا کن.
- `src/shared/i18n/locales/fa.json` را کامل نخوان. کلید را جستجو کن. اگر با اسکریپت تغییرش دادی، مطمئن شو diff فقط حذف یا افزودن همان کلیدهاست و قالب‌بندی بقیه‌ی فایل تغییر نکرده است.

### محدودیت زبانی

`tsconfig.app.json` روی `lib: ES2020` است. متدهایی مثل `Array.prototype.findLast` و `.at()` در کد برنامه type error می‌دهند. یا helper بنویس یا اول با تیم درباره‌ی بالا بردن `lib` تصمیم بگیر.

---

## ۴. تست

- **model:** هر قاعده‌ی خالص تست واحد دارد (`@playwright/test` بدون `page`). این تست‌ها چند ثانیه طول می‌کشند و بعد از هر تغییر اجرا می‌شوند.
  ```
  pnpm exec playwright test src/features/<feature>/_tests --project=chromium
  ```
- **رفتار UI:** تست e2e در `__tests__/` با API ماک‌شده. سرور dev باید روی `http://localhost:5173` بالا باشد.
- **قبل از تغییرات بزرگ:** یک baseline کامل بگیر (`pnpm exec playwright test --project=chromium`) تا بدانی کدام شکست‌ها از قبل بوده‌اند.
- **مرورگر:** اگر Playwright پیغام `Executable doesn't exist` داد، `pnpm exec playwright install chromium` را اجرا کن. این فقط کش مرورگر را پر می‌کند و `package.json` را تغییر نمی‌دهد.

---

## ۵. قراردادهای بک‌اند که فرانت باید رعایت کند

این‌ها از کد `perpix-core-api` استخراج شده‌اند. اگر بک‌اند عوض شد، این بخش و کد متناظر با هم به‌روز شوند.

### پیام‌های تسک و config ذخیره‌شده

- `POST /api/v1/ai-task/generate` برای هر درخواست یک پیام `USER` و یک پیام `ASSISTANT` می‌سازد و روی هر دو config ذخیره می‌کند.
- config ذخیره‌شده ورودی خام نیست، بلکه `canonical_config` gateway است:
  - با schema همان mode نرمال می‌شود؛ وقتی schema `additionalProperties: false` دارد، `mode` حذف می‌شود.
  - مقدارهای پیش‌فرض اعمال می‌شوند.
  - `include_cost: true` اضافه می‌شود.
- **نتیجه برای فرانت:** هر جا config ذخیره‌شده دوباره به فرم یا به `generate` برمی‌گردد (retry، ادامه‌ی چت، ویرایش درخواست):
  - `mode` با همان منطق `resolve_mode` بک‌اند حدس زده می‌شود: کلیدهای خارج از schema نادیده گرفته می‌شوند، کلیدهای ورودی باید زیرمجموعه‌ی فیلدهای mode باشند، و فیلدهای required یا موجودند یا پیش‌فرض دارند. پیاده‌سازی: `withInferredMode` در `features/generation/model/retry-config.ts`.
  - `images_generated`، `videos_generated` و `include_cost` حذف می‌شوند.
- بدون این دو کار، فرم به mode اول (متن به عکس) برمی‌گردد و عکس‌های رفرنس دور ریخته می‌شوند.

### وضعیت پیام

- بک‌اند وضعیت `SUCCESS` و فایل‌های خروجی را **در یک update** ذخیره می‌کند. پس `SUCCESS` همیشه وضعیت نهایی است.
- `SUCCESS` با لیست خالی یعنی سرویس سازنده خروجی نداده است. فرانت آن را مثل خطا نشان می‌دهد، با دکمه‌ی retry و برگرداندن ورودی‌ها به فرم (`producedNothing` در `model/conversation-messages.ts`).

### کیف پول

- تولید فقط وقتی رد می‌شود که موجودی **منفی** باشد (بدهی). با موجودی صفر هنوز می‌شود تولید کرد و هزینه بعداً کم می‌شود.
- پاسخ رد شدن: HTTP **400** با `status_code: 1802` (`AI_GATEWAY_INSUFFICIENT_BALANCE`). فرانت در این حالت پنجره‌ی شارژ کیف پول را با توضیح باز می‌کند.
- خطای کمبود موجودی در لایه‌ی خود کیف پول: HTTP 409 با `status_code: 1106`.
- پلن اشتراک ممکن است هدیه‌ی موجودی داشته باشد (`balance_gift_amount_usdmicro`). پس پیام‌های راهنما بر اساس موجودی واقعی تصمیم می‌گیرند، نه صرفِ داشتن اشتراک.

### شکل پاسخ خطا

```json
{ "detail": "<پیام ترجمه‌شده یا لیست خطاهای فیلد>", "status_code": 1802, "request_id": "…" }
```

`status_code` داخل body کد کاربردی بک‌اند است، نه کد HTTP. منطق تصمیم‌گیری باید روی این کد باشد، نه روی متن `detail`.

### خطای ۴xx در برابر خطای شبکه

| خطای `generate` | معنی | رفتار فرانت |
| --- | --- | --- |
| ۴xx یا نبودِ scope اشتراک | قطعاً چیزی ساخته نشده | کارت موقت حذف می‌شود و فرم دلیل را نشان می‌دهد |
| خطای شبکه یا ۵xx | معلوم نیست ثبت شده یا نه | کارت «معلوم نیست ثبت شده، تاریخچه را چک کن»، **بدون** retry یک‌کلیکی، چون ممکن است دو بار هزینه کم شود |

---

## ۶. چک‌لیست بازبینی هر PR

- [ ] کامپوننت جدید یا تغییرکرده `useQuery`، `useMutation`، `queryClient`، `apiClient` یا `fetch` ندارد.
- [ ] هر قاعده‌ی کسب‌وکار جدید در `model/` است و تست واحد دارد.
- [ ] هیچ هوکی داخل `components/` و هیچ JSX داخل `hooks/` نیست.
- [ ] import بین featureها فقط از `index.ts` است و چرخه‌ی جدیدی نساخته (جدول بخش ۱).
- [ ] `model/` فقط **type** از `@/shared/api` گرفته است.
- [ ] `src/shared/api/api.ts` در diff نیست.
- [ ] تغییرات `fa.json` فقط کلیدهای مورد نظر است و کلید بی‌استفاده‌ای باقی نمانده.
- [ ] `tsc -b` و ESLint روی فایل‌های تغییرکرده بدون خطاست.
- [ ] تست‌های واحد feature و e2eهای مرتبط اجرا شده‌اند و شکست‌ها با baseline مقایسه شده‌اند.
- [ ] رفتاری که به بک‌اند وابسته است با بخش ۵ (یا کد بک‌اند) چک شده است.

---

## ۷. وضعیت بازسازی (۱۰ نوامبر ۲۰۲۶)

### برنچ `fix/generation-failed-request-inputs` (درخت اصلی پروژه)

| کامیت | خلاصه |
| --- | --- |
| `563a975` | حذف پکیج‌های بی‌استفاده (three و وابسته‌ها، universal-cookie)، حذف قابلیت بی‌استفاده‌ی جایگزینی فایل، کلیدهای ترجمه‌ی یتیم |
| `d86d72a` | هماهنگی با بک‌اند: حدس mode مثل `resolve_mode`، حذف `include_cost`، چک بدهی کیف پول و کد 1802، `SUCCESS` نهایی |
| `4dbbea4` | حذف کد مرده: ۲۳ فایل بی‌استفاده، exportها، مسیر بی‌استفاده‌ی «پرامپت اولیه»، ۱۵ کلید ترجمه |
| `94b5a1e` | رفع باگ‌های باقی‌مانده‌ی گفتگو و پخش ویدیو |
| `c294734` | رفع باگ‌های وضعیت گفتگو، فرم و تایم‌لاین (از جمله درخواست‌های بی‌پایان بعد از هر ساخت) |
| `84badaa` | راهنمای شارژ کیف پول بعد از خرید اشتراک |
| `892d814` | حفظ همه‌ی ورودی‌ها (رفرنس، تنظیمات) هنگام retry و بعد از شکست |

### برنچ `refactor/separate-logic-from-ui`

این برنچ در worktree جداگانه‌ی `../perpix-app-refactor` است و از `563a975` جدا شده. هنوز با برنچ بالا ادغام نشده و e2e روی آن اجرا نشده است.

| کامیت | خلاصه | وضعیت |
| --- | --- | --- |
| `22d9450` | providerهای رویداد (`ai-task-events`، `payment`) فقط یک هوک صدا می‌زنند؛ منطق به `model/` و `hooks/` رفت | tsc و lint تمیز |
| `7508fe5` | شکستن `generation/hooks/model.ts` و `generation-page.ts`؛ قواعد گفتگو در `model/conversation-messages.ts` با تست | tsc و lint تمیز، ۱۵ تست واحد پاس |
| `10994c5` | انتقال فایل‌های جابه‌جا: `use-account-widget`، `account-activity`، `file-media`، `neural-network`، `use-video-output` | tsc و lint تمیز |
| `7e3d349` | منطق `file-field.tsx` به `useFileField` | **۱۲ خطای ESLint** (توضیح پایین) |

### مشکلات باز

1. **خطای lint در `7e3d349`:** قاعده‌ی `react-hooks` خطای «Cannot access refs during render» می‌دهد، چون `containerRef` داخل آبجکت برگشتی هوک است و کامپوننت `field.containerRef` و بقیه‌ی فیلدها را در render می‌خواند. راه‌حل پیشنهادی: ref را در خود کامپوننت بساز (`useRef`) و به `useFileField` پاس بده.
2. **۴۰ تست e2e در baseline شکست خورده‌اند** (تا تست ۲۸۳ از ۶۷۲، روی برنچ fix و قبل از هر بازسازی). هنوز بررسی نشده‌اند. بعضی (`generation-history*`، `image-conversation`، `generation-video-prompt-box`، `dynamic-config-schema`) کدی را لمس می‌کنند که در همین دوره عوض شده، پس ممکن است از تغییرات جدید باشند. بقیه احتمالاً قدیمی‌ترند.

   | فایل تست | تعداد شکست |
   | --- | --- |
   | `sidebar-install-accessibility.spec.ts` | ۱۰ |
   | `login-hero-motion.spec.ts` | ۷ |
   | `release-readiness.spec.ts` | ۶ |
   | `media-preview-actions.spec.ts` | ۴ |
   | `generation-history-recovery.spec.ts` | ۴ |
   | `profile-settings.spec.ts` | ۳ |
   | `generation-history.spec.ts` | ۳ |
   | `image-settings.spec.ts` | ۲ |
   | بقیه (هر کدام ۱): `support-chat-provider`، `production-bundle`، `number`، `image-conversation`، `generation-video-prompt-box`، `dynamic-config-schema`، `animation-performance` | ۷ |

3. **ارجاع‌های شکسته در `AGENTS.md`:** به `docs/RESTRUCTURE_PLAN.md` (بخش ۹.۱۰، درباره‌ی CSS Moduleهای مجاز) ارجاع می‌دهد که وجود ندارد.

### کارهای باقی‌مانده به ترتیب اولویت

1. خطای lint در `7e3d349` رفع شود.
2. baseline کامل شود و هر ۴۰ شکست (و هر شکست جدید) دسته‌بندی شود: قدیمی، ناشی از برنچ fix، یا ناپایدار. شکست‌های ناشی از تغییرات این دوره قبل از هر کار دیگری رفع شوند.
3. برنچ refactor روی برنچ fix ادغام شود و e2e کامل روی نتیجه اجرا شود.
4. ادامه‌ی جدا کردن منطق از کامپوننت‌هایی که منطق داده دارند:
   - `app-layout/components/sidebar/history.tsx`
   - `auth/components/login-form.tsx` و `challenge-start-form.tsx`
   - `app/app.tsx`
   - `shared/components/media-preview-item.tsx`
   - `media-uploader/components/video-preview-button.tsx` و `audio-preview-button.tsx`
   - `generation/video/components/reference-board.tsx` و `studio-footer.tsx`
   - `dynamic-config/components/setting-help-popover.tsx`
   - `payment/components/payment-redirect-controls.tsx`

   کامپوننت‌هایی که فقط effect بصری دارند (`editor-ruler-layer`، `image-crop-overlay`، `dashboard-scroll-companion`) طبق بخش ۲ مجازند و دست نمی‌خورند.
5. شکستن فایل‌های بزرگ:
   - `dynamic-config/model/form-schema.ts` (۱۰۰۰ خط) به visibility، sanitize، defaults، resolver و field-meta
   - `auth/services/session-manager.ts` (۳۸۱ خط)
   - `dynamic-config/hooks/use-dynamic-config-form.ts` (۳۲۳ خط)
   - `editor/components/editor-studio-inspector.tsx` (۳۲۰ خط)
6. برداشتن `export` از نمادهایی که فقط داخل فایل خودشان استفاده می‌شوند (به جز API کامپوننت‌های shadcn).
7. `docs/RESTRUCTURE_PLAN.md` نوشته شود، یا ارجاع آن از `AGENTS.md` به این سند منتقل شود.

### ابزار پیدا کردن کد مرده

پروژه ابزاری مثل knip ندارد. در این دوره یک اسکریپت موقت با TypeScript Language Service استفاده شد که دو چیز پیدا می‌کرد: فایل‌هایی که از `src/app/main.tsx` به آن‌ها نمی‌رسیم، و exportهایی که جز در barrelها جایی import نمی‌شوند. هر مورد قبل از حذف با جستجوی متنی هم چک شد، چون اسم فایل‌ها و importها گاهی پویا ساخته می‌شوند (مثلاً عکس‌های `public/images/boot/*` با `` `/images/boot/${scene}.webp` ``). اگر این کار تکرار می‌شود، اضافه کردن knip به‌عنوان devDependency پیشنهاد می‌شود.
