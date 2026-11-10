# وضعیت بازسازی فرانت PerPix

> به‌روزرسانی: ۱۰ نوامبر ۲۰۲۶ · قواعد پایدار معماری در `docs/agent-guides/FRONTEND_ARCHITECTURE_FULL.md` هستند. این فایل فقط وضعیت کار جاری است و با پیشرفت کار به‌روز یا حذف می‌شود.

## کارهای ادغام‌شده در `main`

این کامیت‌ها از برنچ `fix/generation-failed-request-inputs` با fast-forward وارد `main` شده‌اند. آن برنچ دیگر جداگانه وجود ندارد.

| کامیت     | خلاصه                                                                                                                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------- |
| `563a975` | حذف پکیج‌های بی‌استفاده (three و وابسته‌ها، universal-cookie)، حذف قابلیت بی‌استفاده‌ی جایگزینی فایل، کلیدهای ترجمه‌ی یتیم |
| `d86d72a` | هماهنگی با بک‌اند: حدس mode مثل `resolve_mode`، حذف `include_cost`، چک بدهی کیف پول و کد 1802، `SUCCESS` نهایی             |
| `4dbbea4` | حذف کد مرده: ۲۳ فایل بی‌استفاده، exportها، مسیر بی‌استفاده‌ی «پرامپت اولیه»، ۱۵ کلید ترجمه                                 |
| `94b5a1e` | رفع باگ‌های باقی‌مانده‌ی گفتگو و پخش ویدیو                                                                                 |
| `c294734` | رفع باگ‌های وضعیت گفتگو، فرم و تایم‌لاین (از جمله درخواست‌های بی‌پایان بعد از هر ساخت)                                     |
| `84badaa` | راهنمای شارژ کیف پول بعد از خرید اشتراک                                                                                    |
| `892d814` | حفظ همه‌ی ورودی‌ها (رفرنس، تنظیمات) هنگام retry و بعد از شکست                                                              |

## کار refactor که در این ریپو پیدا نمی‌شود

برنچ `refactor/separate-logic-from-ui` در worktree `../perpix-app-refactor` ساخته شده بود. نه برنچ، نه worktree و نه کامیت‌های زیر در این ریپو (محلی یا remote) وجود ندارند. اگر روی سیستم دیگری است باید push شود، وگرنه کار از نو انجام می‌شود.

| کامیت     | خلاصه                                                                                                                 | وضعیت گزارش‌شده                  |
| --------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `22d9450` | providerهای رویداد (`ai-task-events`، `payment`) فقط یک هوک صدا می‌زنند؛ منطق به `model/` و `hooks/` رفت              | tsc و lint تمیز                  |
| `7508fe5` | شکستن `generation/hooks/model.ts` و `generation-page.ts`؛ قواعد گفتگو در `model/conversation-messages.ts` با تست      | tsc و lint تمیز، ۱۵ تست واحد پاس |
| `10994c5` | انتقال فایل‌های جابه‌جا: `use-account-widget`، `account-activity`، `file-media`، `neural-network`، `use-video-output` | tsc و lint تمیز                  |
| `7e3d349` | منطق `file-field.tsx` به `useFileField`                                                                               | ۱۲ خطای ESLint                   |

درس `7e3d349` برای انجام دوباره: قاعده‌ی `react-hooks` خطای «Cannot access refs during render» می‌دهد اگر `containerRef` داخل آبجکت برگشتی هوک باشد و کامپوننت آن را در render بخواند. ref را در خود کامپوننت بساز (`useRef`) و به `useFileField` پاس بده.

## مشکلات باز

1. **۴۰ تست e2e در baseline شکست خورده‌اند** (تا تست ۲۸۳ از ۶۷۲، قبل از ادغام در `main`). هنوز بررسی نشده‌اند. بعضی (`generation-history*`، `image-conversation`، `generation-video-prompt-box`، `dynamic-config-schema`) کدی را لمس می‌کنند که در همین دوره عوض شده، پس ممکن است از تغییرات جدید باشند.

   | فایل تست                                                                                                                                                                        | تعداد شکست |
   | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
   | `sidebar-install-accessibility.spec.ts`                                                                                                                                         | ۱۰         |
   | `login-hero-motion.spec.ts`                                                                                                                                                     | ۷          |
   | `release-readiness.spec.ts`                                                                                                                                                     | ۶          |
   | `media-preview-actions.spec.ts`                                                                                                                                                 | ۴          |
   | `generation-history-recovery.spec.ts`                                                                                                                                           | ۴          |
   | `profile-settings.spec.ts`                                                                                                                                                      | ۳          |
   | `generation-history.spec.ts`                                                                                                                                                    | ۳          |
   | `image-settings.spec.ts`                                                                                                                                                        | ۲          |
   | بقیه (هر کدام ۱): `support-chat-provider`، `production-bundle`، `number`، `image-conversation`، `generation-video-prompt-box`، `dynamic-config-schema`، `animation-performance` | ۷          |

2. **`shared` از `features` import می‌کند** در پنج فایل. فهرست و جهت اصلاح در بخش ۱ سند معماری است.
3. **چرخه در تست‌ها:** `file-manager/_tests/harness.tsx` از `media-uploader` import می‌کند.

## کارهای باقی‌مانده به ترتیب اولویت

1. پیدا کردن و push کردن برنچ refactor، یا تصمیم به انجام دوباره‌ی آن.
2. baseline کامل روی `main` و دسته‌بندی هر ۴۰ شکست (و هر شکست جدید): قدیمی، ناشی از تغییرات این دوره، یا ناپایدار. شکست‌های ناشی از تغییرات این دوره قبل از هر کار دیگری رفع شوند.
3. جدا کردن منطق از کامپوننت‌هایی که منطق داده دارند:
   - `ai-task-events/components/ai-task-events-provider.tsx` و provider رویداد `payment`
   - `app-layout/components/sidebar/history.tsx`
   - `auth/components/login-form.tsx` و `challenge-start-form.tsx`
   - `app/app.tsx`
   - `shared/components/media-preview-item.tsx`
   - `media-uploader/components/video-preview-button.tsx` و `audio-preview-button.tsx`
   - `generation/video/components/reference-board.tsx` و `studio-footer.tsx`
   - `dynamic-config/components/setting-help-popover.tsx`
   - `payment/components/payment-redirect-controls.tsx`

   کامپوننت‌هایی که فقط effect بصری دارند (`editor-ruler-layer`، `image-crop-overlay`، `dashboard-scroll-companion`) مجازند و دست نمی‌خورند.

4. شکستن فایل‌های بزرگ:
   - `generation/hooks/model.ts` (۳۷۵ خط) و `generation/hooks/generation-page.ts` (۴۵۳ خط) طبق نقشه‌ی بخش ۲ سند معماری
   - `dynamic-config/model/form-schema.ts` (۱۰۰۰ خط) به visibility، sanitize، defaults، resolver و field-meta
   - `auth/services/session-manager.ts` (۳۸۱ خط)
   - `dynamic-config/hooks/use-dynamic-config-form.ts` (۳۲۳ خط)
   - `editor/components/editor-studio-inspector.tsx` (۳۲۰ خط)
5. رفع تخلف‌های `shared` → `features`.
6. برداشتن `export` از نمادهایی که فقط داخل فایل خودشان استفاده می‌شوند (به جز API کامپوننت‌های shadcn).
7. کارهای کوچکی که بخش ۳ و ۷ سند معماری مشخص کرده‌اند:
   - جایگزینی رنگ‌های hex در CSS Moduleهای صحنه‌های هنری با token (۱۲ فایل). نیاز به بررسی بصری دارد.
   - انتقال منطق snap از `editor/hooks/use-image-alignment-snap.ts` به `editor/model/image-alignment.ts` با تست واحد.
   - export هوک به‌جای atom برای `appLayoutAtom` و `pendingUploadsGroupedAtom`.
   - حذف `public/sw.js` (kill-switch) بعد از چند هفته از ۷ نوامبر ۲۰۲۶.
   - رفع چرخه‌ی تست `file-manager/_tests/harness.tsx` → `media-uploader`.

## ابزار پیدا کردن کد مرده

پروژه ابزاری مثل knip ندارد. در این دوره یک اسکریپت موقت با TypeScript Language Service استفاده شد که دو چیز پیدا می‌کرد: فایل‌هایی که از `src/app/main.tsx` به آن‌ها نمی‌رسیم، و exportهایی که جز در barrelها جایی import نمی‌شوند. هر مورد قبل از حذف با جستجوی متنی هم چک شد، چون اسم فایل‌ها و importها گاهی پویا ساخته می‌شوند (مثلاً عکس‌های `public/images/boot/*` با `` `/images/boot/${scene}.webp` ``). اگر این کار تکرار می‌شود، اضافه کردن knip به‌عنوان devDependency پیشنهاد می‌شود.
