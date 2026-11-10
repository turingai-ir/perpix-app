# معماری فرانت PerPix

> وضعیت: ۱۰ نوامبر ۲۰۲۶ · مرجع اصلی معماری که `AGENTS.md` به آن ارجاع می‌دهد.
> قواعد استایل، i18n و محدوده‌ی تغییر در `AGENTS.md` هستند و این‌جا تکرار نمی‌شوند.
> وضعیت جاری بازسازی در `docs/REFACTOR_STATUS.md` است، نه این‌جا.

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

- `shared` هیچ‌وقت از `features` یا `pages` import نمی‌کند. کد جدید نباید این قاعده را بشکند. تخلف‌های موجود در پایین همین بخش آمده‌اند.
- `pages` نازک است: featureها را import می‌کند و کنار هم می‌گذارد. اگر صفحه‌ای به دو feature نیاز دارد که نباید همدیگر را بشناسند، اتصالشان در `pages` انجام می‌شود. مثال: `src/pages/payment/result/page.tsx` گام بعدیِ کیف پول را از `wallet` و وضعیت اشتراک را از `pricing` می‌گیرد و به `PaymentResultPage` می‌دهد، بدون این‌که `payment` آن دو را بشناسد.
- یک feature فقط از API عمومی featureهای دیگر import می‌کند، نه از فایل‌های داخلی آن‌ها. API عمومی یعنی `index.ts`، یا یک entry point فرعی در ریشه‌ی feature که عمداً جدا شده تا وابستگی سنگین نیاورد. تنها نمونه‌ی فعلی `@/features/auth/session` (`auth/session.ts`) است. entry point فرعی جدید فقط با دلیل مشخص اضافه می‌شود.
- زیرقابلیت‌های داخل یک feature (مثل `generation/image` و `generation/video`) می‌توانند از فایل‌های داخلی feature والد import کنند.
- ثابت‌های مسیر (`@/app/router/routes`، بدون هیچ import) تنها چیزی است که featureها از `app` می‌گیرند.

### چرخه‌ی وابستگی بین featureها ممنوع است

جهت‌های فعلی (کد برنامه، بدون `_tests`) که باید حفظ شوند. هیچ featureی نباید چیزی را import کند که به خودش وابسته است:

| این feature                                 | به این‌ها وابسته است                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------- |
| `app-layout`                                | `ai-task-events`, `auth`, `generation`, `payment`, `pricing`, `pwa`, `user`, `wallet` |
| `gallery`                                   | `dashboard`, `file-manager`, `media-uploader`                                         |
| `dashboard`                                 | `file-manager`, `pricing`, `user`, `wallet`                                           |
| `generation`                                | `dynamic-config`, `file-manager`, `media-uploader`, `pricing`, `wallet`               |
| `user`                                      | `auth`, `pricing`, `wallet`                                                           |
| `dynamic-config`                            | `file-manager`, `media-uploader`                                                      |
| `wallet`                                    | `payment`, `pricing`                                                                  |
| `pricing`                                   | `payment`                                                                             |
| `editor`                                    | `file-manager`                                                                        |
| `media-uploader`                            | `file-manager`                                                                        |
| `file-manager`                              | `auth`                                                                                |
| `ai-task-events`                            | `auth`                                                                                |
| `payment`                                   | `auth`                                                                                |
| `app-runtime`, `auth`, `boot-splash`, `pwa` | هیچ feature دیگری                                                                     |

تست‌ها هم نباید چرخه بسازند. تنها استثنا `file-manager/_tests/harness.tsx` است که `file-manager` را از راه UI واقعی `media-uploader` تست می‌کند (تست یکپارچه، نه وابستگی runtime).

### استثنای `shared` → `features`

فقط یک import از این نوع باقی مانده و عمدی است:

- `shared/api/client.ts` از `@/features/auth/session` تابع `createAuthorizedFetch` را می‌گیرد. `apiClient` هنگام بارگذاری ماژول با fetch مجاز ساخته می‌شود؛ تزریق آن بعداً از `app` باعث می‌شد درخواست‌های قبل از راه‌اندازی بدون توکن بروند. `auth/session.ts` به همین دلیل entry point جدا دارد و کامپوننت React بار نمی‌کند.

هر import دیگری از `features` در `shared` ممنوع است. کدی که فقط یک feature از آن استفاده می‌کند در همان feature قرار می‌گیرد (مثل کامپوننت‌های نمایش خروجی در `generation/components/media-output/`)، و کد راه‌اندازی‌ای که چند feature را به هم وصل می‌کند در `app` (مثل `app/private-data.ts`).

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

| پوشه          | مجاز                                                                                                                                                      | ممنوع                                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `components/` | JSX، کلاس‌های Tailwind، `*-styles.ts`، state و effectِ صرفاً بصری (اندازه‌گیری DOM، انیمیشن، focus، باز و بسته بودن یک پنجره)، صدا زدن **یک** هوک feature | `useQuery`، `useMutation`، `queryClient`، `apiClient`، `fetch`، قواعد کسب‌وکار، export کردن هوک یا تابع غیرکامپوننتی |
| `hooks/`      | `useState`، `useEffect`، React Query، Jotai، `navigate`، `toast`، ترکیب model و service                                                                   | JSX؛ قاعده‌ای که بدون React هم قابل بیان است (آن را به `model` ببر)                                                  |
| `model/`      | تابع خالص، ثابت، type، schema (مثل zod)، enum                                                                                                             | React، شبکه، `window`، import **مقدار** runtime از `@/shared/api`                                                    |
| `services/`   | `apiClient`، stream، `localStorage`، IndexedDB، تبدیل فایل                                                                                                | React، JSX                                                                                                           |

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

نشانه‌ی فایلی که باید شکسته شود: چند هوک یا تابع export شده که با هم ربطی ندارند، یا کامپوننت و هوکی که از حد `AGENTS.md` (حدود ۱۰۰ خط منطقی) خیلی بیشتر است. فقط فایلی را که داری عوض می‌کنی بشکن.

الگوی شکستن را در `generation` ببین:

| قبل                                                                                  | بعد                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hooks/model.ts` (۳۷۵ خط: انتخاب مدل، تولید، polling، لیست تاریخچه، helperهای وضعیت) | `use-model.ts`، `use-ai-generate.ts`، `use-ai-task-result-polling.ts`، `use-ai-tasks-list.ts`، `model/task-message-status.ts`، `model/ai-tasks-list-cache.ts`                                                           |
| `hooks/generation-page.ts` (۴۵۳ خط)                                                  | `use-conversation-task.ts`، `use-generation-submission.ts`، `use-generation-retry.ts`، `use-message-hash-scroll.ts`، `model/conversation-messages.ts` (با تست)؛ خود `generation-page.ts` فقط این‌ها را کنار هم می‌گذارد |

---

## ۳. قراردادها

### نام‌گذاری

| نوع                          | قالب                                   | مثال                                        |
| ---------------------------- | -------------------------------------- | ------------------------------------------- |
| فایل                         | kebab-case                             | `use-file-field.ts`، `payment-events.ts`    |
| هوک                          | `use-<کار>.ts`، یک هوک اصلی در هر فایل | `useGenerationSubmission`                   |
| model                        | اسم مفهوم، نه «utils»                  | `conversation-messages.ts`، `file-media.ts` |
| استایل‌های مشترک یک کامپوننت | `<نام>-styles.ts` کنار همان کامپوننت   | `studio-styles.ts`                          |
| تست                          | `_tests/<موضوع>.spec.ts`               | `_tests/retry-config.spec.ts`               |

### API عمومی feature

- هر چیزی که بیرون از feature لازم است، از `index.ts` export می‌شود.
- چیزی را که فقط داخل فایل خودش استفاده می‌شود export نکن. در زمان نوشتن این سند حدود ۱۰۰ export از این نوع وجود دارد (بیشترشان API استاندارد shadcn هستند که می‌مانند).

### فایل‌های تولیدی و حساس

- `src/shared/api/api.ts` تولیدی است. هرگز دستی ویرایش نشود و هرگز Prettier روی کل `src/shared` اجرا نشود، چون این فایل را بازنویسی می‌کند. Prettier را فقط روی فایل‌های تغییرکرده اجرا کن.
- `src/shared/i18n/locales/fa.json` را کامل نخوان. کلید را جستجو کن. اگر با اسکریپت تغییرش دادی، مطمئن شو diff فقط حذف یا افزودن همان کلیدهاست و قالب‌بندی بقیه‌ی فایل تغییر نکرده است.

### استثنای CSS Module: صحنه‌های هنری متحرک

برای UI معمولی فایل CSS جدید ساخته نمی‌شود (`AGENTS.md`). تنها استثنا صحنه‌های تزئینیِ متحرک‌اند که با utilityهای Tailwind قابل نگهداری نیستند (keyframeهای چندمرحله‌ای، سه‌بعدی، GSAP). این فایل‌ها کنار کامپوننت خودشان هستند و خط اول هر کدام یک توضیح `/* Art-scene exception (FRONTEND_ARCHITECTURE_FULL.md §3): <چرا> */` دارد. فایل جدید هم همین توضیح را می‌گیرد.

فهرست فعلی:

- `auth`: `auth-celebration`، `login-artwork`
- `boot-splash`: `boot-office`، `boot-slogan`
- `dashboard`: `dashboard-brand-entrance`، `dashboard-scroll-companion`
- `editor`: `editor-onboarding-art`
- `generation/image`: `image-generation-placeholder`، `result-spec-robot`، `studio-scene`
- `generation/video`: `brand-cinema`، `video-idle-scene`
- `user/settings`: `identity-card`

اضافه کردن فایل جدید به این فهرست باید در PR توجیه شود. رنگ‌های جدید در این فایل‌ها هم ترجیحاً از tokenها (`var(--…)`) می‌آیند؛ ۱۲ فایل از ۱۳ فایل فعلی هنوز رنگ hex دارند.

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
{
  "detail": "<پیام ترجمه‌شده یا لیست خطاهای فیلد>",
  "status_code": 1802,
  "request_id": "…"
}
```

`status_code` داخل body کد کاربردی بک‌اند است، نه کد HTTP. منطق تصمیم‌گیری باید روی این کد باشد، نه روی متن `detail`.

### خطای ۴xx در برابر خطای شبکه

| خطای `generate`           | معنی                     | رفتار فرانت                                                                                            |
| ------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------ |
| ۴xx یا نبودِ scope اشتراک | قطعاً چیزی ساخته نشده    | کارت موقت حذف می‌شود و فرم دلیل را نشان می‌دهد                                                         |
| خطای شبکه یا ۵xx          | معلوم نیست ثبت شده یا نه | کارت «معلوم نیست ثبت شده، تاریخچه را چک کن»، **بدون** retry یک‌کلیکی، چون ممکن است دو بار هزینه کم شود |

---

## ۶. چک‌لیست بازبینی هر PR

- [ ] کامپوننت جدید یا تغییرکرده `useQuery`، `useMutation`، `queryClient`، `apiClient` یا `fetch` ندارد.
- [ ] هر قاعده‌ی کسب‌وکار جدید در `model/` است و تست واحد دارد.
- [ ] هیچ هوکی داخل `components/` و هیچ JSX داخل `hooks/` نیست.
- [ ] import بین featureها فقط از API عمومی است، چرخه‌ی جدیدی نساخته (جدول بخش ۱) و `shared` چیزی از `features` نگرفته.
- [ ] `model/` فقط **type** از `@/shared/api` گرفته است.
- [ ] `src/shared/api/api.ts` در diff نیست.
- [ ] تغییرات `fa.json` فقط کلیدهای مورد نظر است و کلید بی‌استفاده‌ای باقی نمانده.
- [ ] mutation جدید از `useReactQueryApi` است و retry خودکار ندارد؛ کلید query دستی تکرار نشده (بخش ۷).
- [ ] ذخیره‌ی جدید در storage در `services/` است، `try/catch` دارد و هنگام خروج پاک می‌شود (بخش ۷).
- [ ] `tsc -b` و ESLint روی فایل‌های تغییرکرده بدون خطاست.
- [ ] تست‌های واحد feature و e2eهای مرتبط اجرا شده‌اند و شکست‌ها با baseline مقایسه شده‌اند.
- [ ] رفتاری که به بک‌اند وابسته است با بخش ۵ (یا کد بک‌اند) چک شده است.

---

## ۷. state، داده‌ی سرور، ذخیره‌سازی و canvas

### داده‌ی سرور: TanStack Query از طریق `useReactQueryApi`

- همه‌ی درخواست‌های REST از `useReactQueryApi()` در `@/shared/hooks/app` می‌گذرند. این هوک روی `openapi-react-query` و `apiClient` ساخته شده و نوع مسیر، پارامتر و پاسخ را از `api.ts` می‌گیرد.
- هوک‌های query هر feature در `hooks/<feature>-queries.ts` هستند (مثل `wallet-queries.ts`، `user-queries.ts`، `pricing-queries.ts`). یک هوک برای هر endpoint، با اسم دامنه (`useWallet`، `useChargeWallet`). کامپوننت فقط همین هوک‌ها را صدا می‌زند.
- `useMutation` این هوک یک guard دارد: اگر `navigator.onLine` نادرست باشد، toast خطا نشان می‌دهد و `OfflineMutationGuardError` پرتاب می‌کند. mutation را مستقیم با `context.apiHook` یا `apiClient` نساز، چون این guard دور زده می‌شود.
- تنظیمات سراسری در `src/shared/lib/react-query.ts` است: `retry: 1` برای query، **بدون retry** برای mutation، `refetchOnWindowFocus: false`، `networkMode: "always"`. retry خودکار برای mutation اضافه نکن؛ دلیلش در بخش ۵ (خطر دو بار کم شدن هزینه) است.
- **کلید query:** کلید را از `queryOptions(method, path, init)` همان API بساز تا با کلید `useQuery` یکی باشد. اگر کلید در چند جا لازم است، یک بار به‌صورت ثابت تعریف شود (مثل `userFilesKey` در `file-manager/model/contracts.ts`) و همه از آن استفاده کنند. آرایه‌ی کلید را دستی تکرار نکن.
- **به‌روز کردن کش:** بعد از mutation یا رویداد stream، `invalidateQueries` با همان کلید. `setQueryData` فقط وقتی که پاسخ کامل را داری (مثل نتیجه‌ی نهایی یک تسک). منطق خالصِ تصمیم‌گیری درباره‌ی این‌که کدام کلید یا کدام آیتم کش عوض شود در `model/` است و فراخوانی `queryClient` در `hooks/`. نمونه: `generation/model/ai-tasks-list-cache.ts` (کدام لیست و چطور) و `generation/hooks/use-ai-generate.ts` (فراخوانی).

### state سمت کلاینت: Jotai

- atom برای state‌ای است که بین کامپوننت‌های دور از هم مشترک است: وضعیت layout، تنظیمات ادیتور، مدل انتخاب‌شده، پنجره‌ی شارژ کیف پول. state محلی یک کامپوننت `useState` می‌ماند. داده‌ی سرور هرگز در atom کپی نمی‌شود.
- تعریف atom در `model/<موضوع>-state.ts` یا `model/<موضوع>-settings.ts` است (مثل `app-layout/model/app-layout-state.ts`، `editor/model/editor-settings.ts`). هوک خواندن و نوشتن آن (`useWalletChargeDialog`) در `hooks/` است. برای کد جدید، به‌جای atom هوکش از `index.ts` export می‌شود تا featureهای دیگر فقط از راه API مشخص state را عوض کنند. `pendingUploadsGroupedAtom` استثناست چون `app/private-data.ts` آن را بیرون از React (با `jotaiStore`) پاک می‌کند. `appLayoutAtom` هنوز مستقیم export می‌شود.
- **atom ماندگار:** فقط با `atomWithSyncStorage(key, default)` از `@/shared/lib/jotai`. این helper خطای storage را می‌بلعد، مقدار ذخیره‌شده را با مقدار پیش‌فرض shallow merge می‌کند (پس فیلد جدید در پیش‌فرض برای کاربر قدیمی هم اعمال می‌شود)، و مقدار اولیه را یک بار در `bootstrapJotai()` هنگام شروع برنامه می‌خواند. `atomWithStorage` را مستقیم استفاده نکن.
- چون مقدارها هنگام bootstrap خوانده می‌شوند، atom ماندگار باید در سطح ماژول تعریف شود، نه داخل کامپوننت یا تابع.
- اگر شکل مقدار ذخیره‌شده عوض می‌شود به‌طوری که merge کم‌عمق کافی نیست، کلید را عوض کن (مثلاً پسوند `:v2`).

### ذخیره‌سازی در مرورگر

| داده               | محل                                                                   | قاعده                                                                                          |
| ------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| تنظیمات کوچک کاربر | `localStorage` از طریق `atomWithSyncStorage`                          | بالا                                                                                           |
| snapshot ادیتور    | IndexedDB با `idb-keyval`، `editor/services/editor-snapshot-store.ts` | پیشوند کلید ثابت (`editor-snapshot:`)؛ هر خطا `null` یا بی‌اثر است و ادیتور بدون آن کار می‌کند |
| داده‌ی خصوصی کاربر | پاک‌سازی هنگام خروج در `app/private-data.ts`                          | هر ذخیره‌ی جدیدی که داده‌ی کاربر دارد باید این‌جا پاک شود                                      |

- دسترسی به `localStorage` و IndexedDB فقط در `services/` (یا helperهای `shared/lib`). هیچ‌وقت در کامپوننت.
- هر خواندن و نوشتن در `try/catch` است. حالت خصوصی مرورگر، سهمیه‌ی پر یا IndexedDB غیرفعال نباید برنامه را بشکند.
- هر کلید یک پیشوند مخصوص feature دارد تا پاک‌سازی و مهاجرت با فیلتر روی پیشوند ممکن باشد.

### offline و PWA: وضعیت فعلی

برنامه **offline-first نیست** و این عمدی است. پشتیبانی offline قبلی (کش React Query در IndexedDB، صف آپلود offline، service worker با Workbox) حذف شد چون نسخه‌ی کهنه‌ی برنامه را به کاربران نشان می‌داد.

- `app-runtime/services/cleanup-offline-support.ts` هنگام شروع، service workerهای ثبت‌شده، Cache Storage و کلیدهای قدیمی IndexedDB (`REACT_QUERY_OFFLINE_CACHE`، `file-manager:completion:*`) را پاک می‌کند. این کار شروع برنامه را متوقف نمی‌کند و به شبکه وابسته نیست.
- `public/sw.js` یک service worker «kill-switch» است (از ۷ نوامبر ۲۰۲۶). مرورگرهایی که worker قدیمی دارند آن را نصب می‌کنند، همه‌ی کش‌ها را پاک می‌کند، خودش را حذف می‌کند و تب‌ها را دوباره بار می‌کند. چند هفته بعد قابل حذف است.
- feature `pwa` فقط نصب برنامه را مدیریت می‌کند (`use-pwa-install.ts`، راهنمای نصب iOS، `public/manifest.json`). کش یا کار offline ندارد.
- **رفتار مورد انتظار در offline:** queryها خطای شبکه می‌دهند و UI حالت خطا و retry نشان می‌دهد؛ mutationها با guard بالا متوقف می‌شوند. هیچ داده‌ای برای ارسال بعدی صف نمی‌شود.
- **قبل از برگرداندن هر نوع offline:** service worker، persist کردن کش query یا صف offline یک تصمیم معماری است و باید جداگانه تأیید شود. حداقل‌ها: نسخه‌گذاری کش و پاک‌سازی نسخه‌ی قدیمی، `index.html` هرگز از کش بدون revalidate، داده‌ی کاربر در کش هنگام خروج پاک شود، و ارسال مجدد mutationها idempotent باشد (بخش ۵).

### canvas: React Konva

Konva در `editor` و در پس‌زمینه‌ی متحرک `generation/image` (`neural-network-*`) استفاده می‌شود.

- **چیزی که با هر حرکت موس یا فریم عوض می‌شود، React state نیست.** نشانگر خط‌کش، guideها و انیمیشن با `ref` روی node Konva تغییر می‌کنند و بعد `layer.batchDraw()` صدا زده می‌شود (الگو: `editor-ruler-layer.tsx`، `image-crop-overlay.tsx`). `setState` در `mousemove` یا `requestAnimationFrame` ممنوع است.
- لایه‌ها و shapeهایی که رویداد لازم ندارند `listening={false}` می‌گیرند (grid، checkerboard، خط‌کش، guideها).
- رسم پیچیده با `Shape` و یک تابع `sceneFunc` خالص است، نه صدها node جدا (`draw-rulers.ts`).
- state مشترک ادیتور (zoom، pan، نمایش grid و ruler) در atomهای `editor/model/editor-settings.ts` است. zoom و pan ماندگار نیستند؛ فقط `editorSettingsAtom` ذخیره می‌شود.
- رویداد wheel و touch در هوک‌های جدا (`use-canvas-wheel.ts`، `use-canvas-touch-pan.ts`) هستند. هر listener که مستقیم روی DOM ثبت می‌شود (مثل wheel با `passive: false`) در cleanup همان effect حذف می‌شود.
- محاسبه‌ی هندسه (crop، snap، تبدیل مختصات) تابع خالص در `model/` است و تست واحد دارد (نمونه: `crop-area.ts`، `image-alignment.ts`). کامپوننت Konva فقط نتیجه را رسم می‌کند.
- این کامپوننت‌ها طبق بخش ۲ «effect بصری» حساب می‌شوند و مجازند effect و ref داشته باشند.
- تست‌های ادیتور در `editor/_tests/` هستند. هر تغییر در canvas با همان تست‌ها و یک بررسی دستی در مرورگر (zoom، pan، crop روی موبایل و دسکتاپ) تأیید می‌شود.

### قرارداد API: `generate-api`

- `pnpm scripts:generate-api` schema را از بک‌اند محلی (`http://localhost:8000/…`) می‌گیرد، مسیرهای `/api/admin/` را حذف می‌کند، فیلدهای `format: binary` را به `File` تبدیل می‌کند و نتیجه را روی `src/shared/api/api.ts` می‌نویسد. پس بک‌اند باید روی پورت 8000 بالا باشد.
- فقط وقتی اجرا شود که قرارداد API واقعاً عوض شده است. `api.ts` در هیچ حالت دیگری در diff نمی‌آید.
- بعد از اجرا: `tsc -b` روی کل پروژه. هر خطای type نشانه‌ی تغییر قرارداد است و در همان PR، در `model/` یا `hooks/` مربوط رفع می‌شود. اگر رفتار بک‌اند عوض شده، بخش ۵ هم به‌روز می‌شود.
- import از `@/shared/api` در `model/` فقط `import type` است (بخش ۲).

### TDD و مقاوم بودن

- برای منطق جدید یا باگ: اول تست واحد در `_tests/` که شکست می‌خورد، بعد کد. برای باگ UI، اول یک تست e2e که باگ را بازتولید می‌کند.
- هر مسیر شبکه این سه حالت را دارد و هر سه تست می‌شوند: موفق، خطای ۴xx با `status_code` بک‌اند، و خطای شبکه یا ۵xx (بخش ۵).
- هر خواندن از storage مقدار خراب یا خالی را تحمل می‌کند و به پیش‌فرض برمی‌گردد.
- عملیاتی که هزینه دارد (تولید، پرداخت، شارژ) هرگز retry خودکار ندارد.

وضعیت جاری بازسازی و کارهای باقی‌مانده در `docs/REFACTOR_STATUS.md` است.
