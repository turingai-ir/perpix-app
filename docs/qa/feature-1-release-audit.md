# ارزیابی آمادگی انتشار فیچر ۱ PerPix

> نتیجه آخرین اجرای واقعی فرانت در [گزارش نهایی اجرای فرانت](frontend-verification-result.md) ثبت شده است. بخش‌های «اجرا نشد/Blocked» این سند، سوابق مراحل قبلی‌اند و نباید جای نتایج جدید استفاده شوند. تأیید بک‌اند در مرحله جدید بنا بر اعلام کاربر مبنا قرار گرفت.

## نتیجه اجرایی

**تصمیم: No-Go برای تأیید انتشار در وضعیت فعلی. این ممیزی از نظر اجرای تست ناقص و Blocked است.**

این نتیجه به معنی شکست تمام قابلیت‌ها نیست. چهار ایراد P1 در بررسی اولیه سورس شناسایی شدند و با مجوز مرحله بعد کاربر، اصلاح سورس و تست‌های رگرسیون آن‌ها پیاده‌سازی شد. بازبینی مستقل نهایی، سورس هر چهار اصلاح را پذیرفت. هیچ مسیر حیاتی در مرورگر این مأموریت اجرا نشده است؛ وضعیت این چهار مورد «Source Accepted، در انتظار اعتبارسنجی اجرایی» است، نه Pass رفتاری یا تأیید انتشار.

- تاریخ بررسی: ۲۰۲۶-۱۱-۰۱؛ شروع درخواست در `13:23:53Z` و ادامه در `22:43:55Z`.
- نسخه اعلام‌شده در `package.json`: `0.5.24`؛ شماره نسخه تغییر نکرد.
- HEAD در شروع و پس از ادامه: `fbd6b6302d1e6c1b5c39127ffcd6d85b9036c7bb`.
- worktree از ابتدا dirty بود. این گزارش مربوط به HEAD به‌اضافه تغییرات محلی موجود است، نه یک artifact انتشار immutable.
- نتیجه بررسی سورس: ۱۱ ایراد محصول، شامل ۴ مورد P1 و ۷ مورد P2؛ بدون ادعای بازتولید در مرورگر.
- نتیجه اجرای این مأموریت: صفر اجرای تست، صفر Pass، صفر Fail اجرایی، بدون screenshot یا trace واقعی از UI.
- اعتبار، تولید رسانه، پرداخت، ورود واقعی، پیامک و ایمیل: هیچ‌کدام اجرا نشدند. این نتیجه از عدم اجرای برنامه/سناریوها ناشی می‌شود، نه از اثبات اجرایی محافظ شبکه.
- اطمینان به یافته‌های منطقی سورس بالا است؛ اطمینان به آمادگی واقعی انتشار به علت نبود شواهد اجرایی پایین است.

## تکمیل اصلاح چهار P1

مجوز اصلاح محصول در `2026-11-01T23:01:44Z` دریافت شد. موارد زیر روی همان worktree، بدون تغییر وابستگی‌ها، generated API یا چهار فایل گالری قبلی انجام شدند. بخش یافته‌های اولیه پایین‌تر، سوابق پیش از اصلاح و ارجاع خط همان مرحله را حفظ می‌کند.

| یافته | اصلاح پیاده‌سازی‌شده | رگرسیون آماده‌شده | وضعیت اجرا |
| --- | --- | --- | --- |
| F-01 | error پیش از loading/نبود data بررسی می‌شود؛ Retry محلی‌شده حفظ شد | `__tests__/app-sidebar.spec.ts`: خطای اولین user read، retry معلق، loading و بازیابی اپ | Blocked |
| F-02 | نشست، cache خصوصی و تب‌ها پیش از I/O پاک می‌شوند؛ مهلت ۱۰ ثانیه برای انتظار lock و CSRF/logout؛ لغو تلاش منسوخ و حفاظت چرخه retry | `auth-sign-out.spec.ts` و `auth-sign-out-pending.spec.ts`: تعلیق هر دو endpoint، timeout، lock، تعویض نشست، toast/retry و storage unavailable | Blocked |
| F-03 | aside دسکتاپ بسته `inert` و `aria-hidden` دارد؛ پیش از بستن با focus داخلی، focus به toggle برمی‌گردد | `__tests__/app-sidebar.spec.ts`: حذف از Tab/AT، بازکردن مجدد و بستن با focus داخلی | Blocked |
| F-04 | ویژگی‌های textarea و Slot، `name`، `ref` و `onBlur` فرم به textarea واقعی forward می‌شوند؛ ref اندازه‌گیری حفظ شد | `generation/_tests/prompt-field.spec.ts`: label/id، خطا، invalid، touched، setFocus، native/object ref و حفظ رفتار dialog | Blocked |

در مسیر خروج، `session-started` به کانال موجود و بدون حمل credential اضافه شد. نشست جایگزین، تلاش خروج قبلی و toast قدیمی را منسوخ می‌کند. پیش از retry کاربر anonymous، marker مشترک بررسی می‌شود تا نبودن آن پیش از رسیدن اعلان تب دیگر با teardown مجدد بازنویسی نشود. نبود دسترسی به storage از «نبود marker» تفکیک شده تا fallback قبلی حفظ شود.

۹ فایل محصول و ۵ فایل تست/هارنس در این مرحله تغییر یا ایجاد شدند. ۲۰ سناریوی رگرسیون جدید در کد تعریف شده‌اند؛ این عدد تعداد جمع‌آوری‌شده یا عبورکرده runner نیست. دو تست lock در مرورگری که Web Locks ندارد، محدودیت قابلیت را صریح اعلام می‌کنند. تست‌های جدید جایگزین ماتریس کامل موبایل/تبلت/دسکتاپ یا دستگاه واقعی نیستند.

بازبینی مستقل سورس انجام شد و نکات مربوط به نشست جایگزین، retry قدیمی و انتظار نادرست تست خروج اصلاح شدند. رد/سبز عملی TDD، type-check، lint، build و browser QA اجرا نشده‌اند. اصلاح dangling description ID عمومی FormControl یا P2های دیگر در این مرحله انجام نشده است؛ ارتباط ID خطای visible پرامپت اکنون forward می‌شود.

بررسی whitespace فایل‌های tracked این اصلاح و هر سه فایل تست/هارنس جدید، بدون خطا و فقط با هشدار LF/CRLF انجام شد. ارجاعی به نام قدیمی listener کانال باقی نمانده و caller mutation خروج، cycle را صریح ارسال می‌کند. `graphify update .` پس از اصلاحات نیز بدون LLM کامل شد: ۲۸۶۴ node، ۹۳۱۱ edge و ۱۶۴ community. این بررسی‌ها جای type-check یا اجرای تست را نمی‌گیرند.

لغو fetch صرفاً جلوی ادامه سمت کلاینت را می‌گیرد؛ نمی‌توان از آن نتیجه گرفت درخواست logout که قبلاً به سرور رسیده پردازش نشده است. این کنترل، تضمین idempotency یا صحت بک‌اند نیست.

دستورهای هدفمند زیر فقط برای sandbox تأییدشده با env ساختگی هستند و در این میزبان اجرا نشده‌اند:

```powershell
pnpm exec playwright test "src/features/auth/_tests/auth-sign-out.spec.ts" "src/features/auth/_tests/auth-sign-out-pending.spec.ts" --project=chromium --project=webkit
pnpm exec playwright test "__tests__/app-sidebar.spec.ts" --project=chromium --project=webkit --grep "initial user read failure|collapsed desktop sidebar|collapsing with focus inside"
pnpm exec playwright test "prompt-field.spec.ts" --project=chromium --project=webkit
```

## تأیید با امکانات موجود

در پی درخواست `2026-11-01T23:33:22Z`، یک بازبینی مستقل و محدود روی نسخه نهایی انجام شد. ایراد P1 مشخص دیگری در فایل‌های بررسی‌شده شناسایی نشد؛ این جمله معادل تضمین نبود باگ یا type-check موفق نیست.

| اصلاح | نتیجه بازبینی سورس | نتیجه رفتار در مرورگر |
| --- | --- | --- |
| F-01: خطای اولیه دریافت کاربر و Retry | SOURCE_ACCEPTED | NEEDS_RUNTIME |
| F-02: خروج، timeout و نشست جایگزین | SOURCE_ACCEPTED | NEEDS_RUNTIME |
| F-03: سایدبار بسته و focus | SOURCE_ACCEPTED | NEEDS_RUNTIME |
| F-04: اتصال فرم و textarea پرامپت | SOURCE_ACCEPTED | NEEDS_RUNTIME |

با Node سراسری موجود، نسخه `v24.20.0`، دستور `node --check --experimental-strip-types <file>` برای ۹ فایل `.ts` تغییرکرده اجرا شد و هر ۹ مورد بدون خطای syntax تمام شدند. `NODE_OPTIONS` پیش از هر بررسی خالی شد تا preload احتمالی اعمال نشود. این دستور کد فایل یا importهای پروژه را اجرا نمی‌کند؛ بنابراین اجرای هدف یا تست رفتاری محسوب نمی‌شود. این بررسی فایل‌های `.tsx`، تطابق typeها، ESLint، build و صحت رفتار را تأیید نمی‌کند.

اثر انگشت هر ۱۴ فایل محصول/تست P1 با `git hash-object --no-filters` و بدون نوشتن Git object یا اجرای filter ثبت شد. مسیرها و Git blob hashهای دقیق در `p1Remediation.acceptanceWithExistingTools.sourceSnapshot` در metadata قرار دارند. تأیید سورس مربوط به همین محتواست و با تغییر فایل‌ها باید دوباره بررسی شود.

بررسی دوباره ابزارهای موجود فقط Node و pnpm را نشان داد؛ Docker، Podman، WindowsSandbox، hcsdiag، runhcs، Get-VM و tsc سراسری در PATH در دسترس نبودند. چیزی نصب نشد. هیچ سرور یا مرورگری اجرا نشد و تعداد تست‌های رفتاری اجراشده همچنان صفر است. وضعیت ۴۸۰ خانه ماتریس اجرا تغییر نکرده است.

## تکمیل اصلاح هفت P2

مجوز این مرحله در `2026-11-01T23:46:21Z` دریافت و کار با درخواست `2026-11-02T00:01:26Z` ادامه داده شد. تمام موارد F-05 تا F-11 در سورس اصلاح شدند؛ وضعیت آن‌ها **Source Implemented / Runtime Blocked** است، نه تأیید رفتاری یا انتشار.

| یافته | تغییر محصول | رگرسیون آماده‌شده |
| --- | --- | --- |
| F-05 | تنها یک مالک hook برای اکشن نصب و دیالوگ iOS؛ بازگرداندن focus به دکمه پایدار پروفایل؛ pending و خطای prompt مدیریت می‌شود | `__tests__/sidebar-install-accessibility.spec.ts` |
| F-06 | خطاهای 403، 404 و موقت متمایز؛ retry و گفتگوی جدید؛ composer هنگام خطا با حفظ state پنهان می‌شود و ارسال/بازتولید از وضعیت فعلی cache مجوز می‌گیرد | `__tests__/generation-history-recovery.spec.ts` |
| F-07 | عنوان مخفی ولی دسترس‌پذیر «منو» برای Sheet موبایل | `__tests__/sidebar-install-accessibility.spec.ts` |
| F-08 | بررسی ترجیح motion در زمان اجرای اسکرول عادی، اجباری و رفتن به پیام؛ استفاده از `instant` برای دورزدن smooth در CSS | `__tests__/app-layout-scroll.spec.ts` |
| F-09 | نام اکشن محلی‌شده با نوع و شماره/توضیح کوتاه؛ شماره‌گذاری خروجی‌ها در کل گفتگو با یک پیمایش؛ alt تصویر حفظ شد | `__tests__/media-preview-actions.spec.ts` و اصلاح selectorهای قبلی گفتگو |
| F-10 | حالت خالی پس از تمام فیلترهای پلن، توضیح روشن و بستن؛ فیلترهای eligibility و رفتار خرید دست‌نخورده ماندند | `src/feature/pricing/_tests/pricing-empty.spec.ts` |
| F-11 | دکمه «صفحهٔ اول» برای پاسخ موفق خالی با offset مثبت، همراه حفظ فیلترها و بدون redirect خودکار | `src/pages/profile/_tests/finance-pages.spec.ts` |

دو لبه مرتبط نیز پوشش داده شدند: رویداد native نصب یک‌بارمصرف است و پس از dismiss/reject دوباره استفاده نمی‌شود؛ عرضه تازه مرورگر حفظ می‌شود. همچنین بازیابی تاریخچه با نتیجه موفق تازه نباید پیش‌نویس ارسال‌نشده را پاک کند. نتیجه `false` در قرارداد داخلی submit به معنی شروع‌نشدن درخواست است؛ وضعیت پیش‌نویس را بدون ادعای ارسال حفظ می‌کند. محافظ cache هنگام ادامه عملیات async نیز دوباره بررسی می‌شود تا regenerate قدیمی بعد از خطای تاریخچه ارسال نشود.

۶۷ حالت رگرسیون در کد تعریف شده‌اند: تاریخچه ۴۵، نصب/منو ۱۰، پیش‌نمایش ۴، اسکرول ۱، پلن‌ها ۳ و صفحات مالی ۴. این تعداد از ساختار حلقه‌های تست به دست آمده، **runner هیچ‌کدام را جمع‌آوری یا اجرا نکرده است**. تست‌های تاریخچه و حالت خالی پلن، اندازه‌های 375×812، 768×1024، 1440×900، 320×812 و 667×375 را هدف می‌گیرند؛ این‌ها viewport هستند، نه دستگاه واقعی یا تضمین touch.

بررسی‌های انجام‌شده:
- syntax دوازده فایل `.ts` با Node 24 و `--check --experimental-strip-types` موفق بود؛ برخی فایل‌های تغییرکرده دوباره بررسی شدند. این بررسی type-check نیست و TSX را پوشش نمی‌دهد.
- JSON فارسی با parser استاندارد Node و بدون import کد JavaScript پروژه اعتبارسنجی شد؛ هر ۱۵ رشته لازم P2 موجود و غیرخالی بود.
- whitespace فایل‌های tracked مرتبط و هر هشت فایل جدید این مرحله بدون خطا بود؛ فقط هشدار LF/CRLF وجود داشت.
- ابزار `python` صرفاً alias فروشگاه بود؛ تلاش validator با آن ناموفق شد و هیچ نصب انجام نشد. اعتبارسنجی JSON با Node موجود انجام شد.
- دو بازبینی مستقل P2 به علت سقف مصرف ابزار پیش از ارائه نتیجه متوقف شدند. بازبینی دستی عامل اصلی انجام شد؛ **تأیید مستقل P2 ثبت نشده است**.
- app، مرورگر، تست رفتاری، lint، build و type-check اجرا نشدند. مصرف واقعی اعتبار، تولید، پرداخت، OTP و نصب واقعی انجام نشد.
- `graphify update .` پس از نهایی‌سازی کد و fixtureهای دارای UUID معتبر، بدون LLM انجام شد: ۲۸۸۹ node، ۹۴۱۲ edge و ۱۵۲ community. labeling مبتنی بر LLM اجرا نشد.

snapshot تأیید سورس P1 متعلق به مرحله قبل است. دو فایل `src/pages/(app)/_layout/index.tsx` و `sidebar/index.tsx` پس از آن برای P2 تغییر کردند؛ guard خطای کاربر، `inert` و انتقال focus در بازبینی دستی حفظ شدند، اما hash قبلی آن دو دیگر snapshot فعلی نیست و اجرای مجدد رگرسیون‌های P1 لازم است. کد auth و سیم‌کشی textarea مربوط به P1 دست‌نخورده‌اند.

فهرست دقیق ۲۰ فایل محصول و ۹ فایل تست/هارنس این مرحله در `p2Remediation` رکورد JSON ثبت شده است. تأخیر ورود، سیاست draft ویرایشگر، چهار فایل گالری کاربر، generated API، وابستگی‌ها و شماره نسخه تغییر نکردند.

دستورهای کاندید زیر فقط برای محیط ایزوله تأییدشده‌اند و در این مأموریت اجرا نشده‌اند:

```powershell
pnpm exec playwright test "__tests__/generation-history-recovery.spec.ts" "__tests__/image-conversation.spec.ts" --project=chromium --project=webkit
pnpm exec playwright test "__tests__/sidebar-install-accessibility.spec.ts" "__tests__/media-preview-actions.spec.ts" "__tests__/app-layout-scroll.spec.ts" --project=chromium --project=webkit
pnpm exec playwright test "src/feature/pricing/_tests/pricing-empty.spec.ts" "src/pages/profile/_tests/finance-pages.spec.ts" --project=chromium --project=webkit
```

## رسیدگی به گزارش تکمیلی نشست، لغو و تست‌ها

مجوز اصلاح بخش‌های قابل انجام با قرارداد فعلی در `2026-11-02T01:03:24Z` دریافت شد. درخواست واقعی احراز هویت، OTP، پرداخت یا تولید انجام نشد. اعداد اجرای تست/type-check/lint گزارش ارسالی کاربر در این مرحله دوباره اجرا نشده‌اند و به‌عنوان نتیجه مستقل این اجرا ثبت نمی‌شوند.

| موضوع گزارش تکمیلی | اقدام فرانت | وضعیت باقی‌مانده |
| --- | --- | --- |
| تب authenticated و ورود جایگزین | دریافت `session-started` اکنون cycle و cache را باطل می‌کند؛ بدون نوشتن marker خروج، bootstrap تازه آغاز می‌شود | در صورت گم‌شدن تمام اعلان‌ها، هویت پایدار حساب/نسل نشست باید با بک‌اند مشخص شود |
| پاسخ دیررس عملیات حساب | پیش/پس از انتظار توکن، recovery و پاسخ، cycle بررسی می‌شود؛ logout-all، تغییر/بازیابی رمز و صدور توکن قدیمی اجازه تغییر نشست تازه ندارند | اثر خود سرور و `Set-Cookie` دیررس با کنترل JavaScript قابل تضمین نیست |
| لغو Request | signal خود Request یا override صریح RequestInit با اولویت صحیح منتقل می‌شود؛ backoff لغوپذیر است، abort عمدی feedback خطای شبکه نمی‌سازد | مصرف‌کننده بدنه همچنان signal اصلی را دریافت می‌کند؛ timeout transport تا دریافت Response است، نه وعده کنترل کامل همه streamها |
| bootstrap/refresh بی‌پاسخ | بودجه ۱۰ ثانیه شامل قفل، CSRF، refresh و parse نشست؛ single-flight وابسته به cycle و cleanup وابسته به هویت همان تلاش | قفل متعلق به تب دیگر به‌زور آزاد نمی‌شود؛ انتظار این تب bounded است و retry پس از رفع مانع ممکن می‌شود |
| اعتبار تست‌های حساب/پرداخت | helper فعلی CSRF/refresh، scope معتبر کیف پول، درگاه HTTPS کاملاً ماک، guard شبکه و assertion نتیجه endpoint جای selector منوی قدیمی | اجرای runner و رسیدن واقعی به assertionها هنوز انجام نشده است |
| fixture ده مدل | مسیر مخزن همسایه حذف و ورودی `PERPIX_BACKEND_FIXTURES_DIR` صریح شد؛ بسته ناقص با خطای روشن متوقف می‌شود | بسته واقعی در این محیط موجود نیست؛ قرارداد تست عمداً حذف، ضعیف یا با schema ساختگی سبز نشده است |
| تولید پذیرفته‌شده با پاسخ گم‌شده | فیلد/header فرضی اضافه نشد؛ `task_uuid` به‌عنوان شناسه idempotency جا زده نشد | قرارداد و lookup نتیجه نامعلوم/ledger از بک‌اند لازم است؛ این مورد بسته نشده است |

۲۲ رگرسیون جدید در کد تعریف شد: ۱۰ مورد مرز عملیات حساب و نشست، ۳ مورد deadline و ۹ مورد لغو/timeout transport. این تعداد حاصل تعریف‌های کد است، نه جمع‌آوری یا اجرای runner. فایل‌های اصلی جدید عبارت‌اند از `auth-reliability.spec.ts`، `auth-refresh-timeout.spec.ts`، هارنس مرتبط و `__tests__/custom-fetch-cancellation.spec.ts`.

محدودیت مهم تست‌ها: مدل transport با fetch تزریق‌شده و APIهای ساختگی بررسی می‌شود؛ این تست‌ها قرارداد واقعی cookie، ابطال JWT یا ledger را ثابت نمی‌کنند. type-check، lint، build و تست مرورگر این مرحله هنوز اجرا نشده‌اند. snapshotهای تأیید سورس مراحل قبلی تاریخی‌اند؛ کد auth نیز در این مرحله تغییر کرده و باید دوباره اعتبارسنجی شود.

متن آماده ارسال به بک‌اند: [پرسش‌ها، درخواست artifact و معیارهای پذیرش مشترک](backend-contract-questions.md). مهم‌ترین پاسخ‌های لازم، idempotency/lookup تولید، هویت پایدار نشست، اثر cookie دیررس و بسته نسخه‌دار fixtureها هستند. پس از پاسخ قرارداد، فقط تغییر لازم اعمال و در صورت نیاز API از منبع معتبر generate می‌شود؛ generated API دستی ویرایش نشده است.

بررسی syntax هر ۱۴ فایل TypeScript این مرحله با Node موفق بود؛ whitespace تغییرات tracked و چهار فایل تست/هارنس جدید خطا نداشت و فقط هشدار LF/CRLF داشت. این بررسی جای type-check یا اجرای تست نیست. گراف پس از تغییرات کد با AST و بدون LLM به ۲۹۱۸ node، ۹۴۷۳ edge و ۱۵۸ community به‌روزرسانی شد.

## مانع اجرای ایمن

راهنمای امنیت بارگذاری‌شده، اجرای کد پروژه، build، lint و تست را فقط در محیط ایزوله سیستم‌عامل مجاز می‌داند: منع شبکه خارجی برای تمام فرایندها، شبکه loopback ایزوله، محیط متغیرهای صریح و ساختگی، عدم دسترسی به credentialها و پروفایل میزبان، سورس/toolchain فقط‌خواندنی و نوشتن محدود به scratch، و محدودیت منابع و زمان.

بررسی ابزارهای موجود نشان داد:

| بررسی | نتیجه مشاهده‌شده |
| --- | --- |
| `Get-Command docker, podman, wsl, graphify -ErrorAction SilentlyContinue` | فقط `wsl.exe` و `graphify.exe` یافت شدند؛ Docker/Podman در PATH نبودند |
| `wsl --list --quiet` | سیستم اعلام کرد WSL نصب نیست |
| `Get-Command WindowsSandbox.exe, Sandboxie-Plus.exe, Start-Sandboxed.exe -ErrorAction SilentlyContinue` | ابزار قابل فراخوانی یافت نشد |
| `Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue` | در زمان بررسی اولیه listener گزارش نشد؛ این مشاهده وضعیت آینده پورت را تضمین نمی‌کند |

این بررسی اثبات نمی‌کند هیچ فناوری ایزوله‌سازی دیگری روی میزبان وجود ندارد؛ فقط محیطی با کنترل‌های لازم در دسترس و تأییدشده نبود. هیچ نصب، تغییر فایروال یا تغییر تنظیمات میزبان انجام نشد. متغیر `PERPIX_QA_OS_SANDBOX=confirmed` صرفاً تأیید پیش‌شرط است و **sandbox ایجاد یا اعتبار آن را اثبات نمی‌کند**.

محافظ Playwright به‌تنهایی کافی نیست: `APIRequestContext`، Node، فرایندهای فرزند، مسیرهای overrideشده، مرورگر/context اضافی و پروکسی Vite خارج از تضمین این محافظ‌اند. به همین دلیل محدودیت ایمنی برای اجرای تست دور زده نشد.

## محدوده واقعی محصول

محدوده فیچر ۱ از مسیرها و قابلیت‌های نصب‌شده استخراج شد. سند مستقل و قطعی برای تعریف تجاری فیچر ۱ ارائه نشده است؛ مسئول محصول باید inclusion صفحات عمومی preview و نصب PWA را در انتشار نهایی تأیید کند.

منبع مسیرها: `src/router/router.tsx:22-29,55-197` و `src/router/routes.ts`.

| مسیر | دسترسی | قابلیت |
| --- | --- | --- |
| `/` | نشست معتبر | داشبورد حساب، موجودی، فایل‌ها، مدل‌ها، کارها و تراکنش‌ها |
| `/gallery` | نشست معتبر | گالری شخصی و مشاهده رسانه |
| `/generation/image` و `/generation/image/:chatId` | نشست معتبر | ساخت تصویر و ادامه گفتگو |
| `/generation/video` و `/generation/video/:chatId` | نشست معتبر | ساخت ویدیو و ادامه گفتگو |
| `/profile` | نشست معتبر | redirect به تنظیمات |
| `/profile/settings` | نشست معتبر | مشخصات حساب و امنیت رمز |
| `/profile/payments` | نشست معتبر | تاریخچه پرداخت و جزئیات |
| `/profile/wallet-transactions` | نشست معتبر | گردش کیف پول |
| `/editor` و `/editor/:fileUuid` | نشست معتبر | ویرایش تصویر محلی یا فایل شخصی |
| `/auth/login` | مناسب کاربر ناشناس | ورود، ثبت‌نام، OTP و بازیابی رمز به‌صورت stateهای یک flow |
| `/payment/verify/:paymentUuid` | نشست معتبر | نتیجه و پیگیری پرداخت |
| `/design-preview` | عمومی | preview طراحی/معرفی با لینک ورود به استودیو |
| `*` | redirect به `/` | صفحه 404 مستقل پیاده‌سازی نشده است |

پرسوناهای لازم: ناشناس، bootstrap ناموفق، کاربر پلن پیش‌فرض، کاربر پرداخت‌شده مجاز، کاربر فاقد scope/model مجاز، نشست منقضی و دو حساب/تب برای بررسی جداسازی. نقش‌های admin/staff به‌عنوان رابط کاربری مستقل مشاهده نشدند؛ وجود ثابت‌های scope چنین قابلیتی را ثابت نمی‌کند.

موارد N/A در محدوده فعلی: پنل مدیریت، مسیر مستقل ثبت‌نام/بازیابی، صفحات مستقل pricing/wallet/upload، چت پشتیبانی کامنت‌شده، تولید آفلاین و صف پرداخت آفلاین. قابلیت‌های خرید و آپلود به‌صورت sheet/dialog/composer موجودند و حذف نشده‌اند.

### آفلاین و PWA

توصیف offline-first در راهنمای معماری با اجرای فعلی هم‌خوان نیست. `src/app.tsx:9,31` پاک‌سازی runtime را نصب می‌کند؛ `src/features/runtime/services/cleanup-offline-support.ts:16-34` ثبت‌های Service Worker، CacheStorage و داده‌های legacy را پاک می‌کند. تنظیمات `src/lib/react-query.ts:3-14` و guard در `src/hooks/app/hook.ts:45-54` رفتار آنلاین‌محور را نشان می‌دهند.

manifest و affordance نصب موجود است؛ snapshot برخی اسناد editor در IndexedDB باقی می‌ماند. این موارد به معنی پشتیبانی بارگذاری آفلاین، تولید آفلاین یا بازگردانی تمام draftهای محلی نیستند. پذیرش در این نسخه باید «خطای روشن و بازیابی مناسب هنگام قطع شبکه، بدون موفقیت یا صف‌گذاری ساختگی» باشد.

## یافته‌های محصول

تمام موارد این بخش **ثبت یافته اولیه از سورس، ولی اجرانشده در مرورگر** هستند. اکنون F-01 تا F-11 مطابق بخش‌های تکمیل P1/P2 patch شده‌اند، اما نتیجه رفتاری آن‌ها هنوز ثبت نشده است. قدم‌های بازتولید، دستور اجرای انجام‌شده نیستند؛ سناریوهای پیشنهادی برای محیط ایمن‌اند. به علت نبود baseline اجرایی پیشین، این موارد به تغییرات اخیر یا چهار فایل گالری نسبت داده نمی‌شوند.

### F-01 | P1 | خطای اولیه کاربر پشت loading پنهان می‌شود

- منبع: `src/pages/(app)/_layout/index.tsx:81-94`.
- سناریو: bootstrap موفق باشد؛ اولین `/api/v1/user/get-info` با خطای شبکه یا 500 برگردد و cache خالی باشد.
- انتظار: بعد از پایان retry، خطای فارسی و دکمه تلاش مجدد؛ پس از موفقیت retry، نمایش اپ.
- رفتار مستفاد از کد: شرط `isLoading || !data` پیش از `isError` است؛ خطای بدون data وارد شاخه loading می‌شود و UI بازیابی قابل دسترسی نیست.
- اثر: مسیر اصلی اپ روی هر سه اندازه و هر دو موتور ممکن است روی loading باقی بماند.
- اصلاح حداقلی: رسیدگی به error پیش از fallback نبود data؛ تست بازیابی خطای اولین درخواست.

### F-02 | P1 | خروج محلی به پایان درخواست شبکه وابسته است

- منبع: `src/features/auth/services/session-manager.ts:31-38,70-81,157-165,207-223`، `src/features/auth/services/auth-http.ts:35-44` و `src/lib/private-data.ts:16-21`.
- سناریو: در نشست ماک معتبر، پاسخ CSRF/logout را معلق نگه دار و خروج را بزن؛ تب دوم همان context را نیز بررسی کن.
- انتظار: نشست محلی و اطلاعات خصوصی فوراً غیرفعال شوند؛ تأیید خروج سرور به‌صورت محدود و best-effort ادامه پیدا کند.
- رفتار مستفاد از کد: marker خروج ذخیره می‌شود، ولی `endSession` بعد از انتظار lock/CSRF/logout قرار دارد و fetch timeout/abort ندارد. توکن منقضی‌نشده در این فاصله همچنان قابل دریافت است.
- اثر: خروج، پاک‌سازی cache و اطلاع‌رسانی بین تب‌ها ممکن است تا پایان I/O معلق بمانند. این یافته ادعای bypass مجوز بک‌اند نیست.
- اصلاح حداقلی: invalidate چرخه/نشست و پاک‌سازی محلی پیش از I/O؛ خروج سرور با مهلت محدود و حفظ بازخورد unconfirmed.

### F-03 | P1 | سایدبار بسته دسکتاپ از مسیر focus حذف نمی‌شود

- منبع: `src/pages/(app)/_layout/sidebar/index.tsx:54-72`، `sidebar/navigation.tsx:77-95` و `sidebar/sidebar.module.css:1-23`.
- سناریو: در 1440×900 سایدبار را ببند؛ با Tab حرکت کن و هنگام focus داخل منو نیز بستن را امتحان کن.
- انتظار: لینک‌های پنهان در ترتیب کیبورد یا درخت دسترس‌پذیری نباشند؛ focus به کنترل معنادار منتقل شود.
- رفتار مستفاد از کد: aside mounted می‌ماند و صرفاً translate/opacity تغییر می‌کند؛ `inert`، `hidden` یا معادل حذف focus ندارد.
- اثر: پیمایش کیبورد به کنترل نامرئی؛ ناسازگاری وضعیت collapsed با دسترسی واقعی.
- اصلاح حداقلی: inert/unmount مناسب همراه مدیریت focus؛ `aria-hidden` به‌تنهایی کافی نیست.

### F-04 | P1 | اتصال خطا و focus فرم به پرامپت compact قطع است

- منبع: `src/pages/(app)/generation/_components/prompt-box/prompt-textarea.tsx:33-45`، `expanded-prompt-editor.tsx:16-28,43-54` و `src/components/ui/form.tsx:114-123`.
- سناریو: در composer تصویر، خطای prompt ماک ایجاد کن؛ label، `aria-invalid`، توضیح خطا، blur و `setFocus("prompt")` را بررسی کن.
- انتظار: textarea واقعی id/نام/توضیح خطا و ref/onBlur فرم را دریافت کند و خطا برای فناوری کمکی قابل ارتباط باشد.
- رفتار مستفاد از کد: props افزوده‌شده توسط FormControl به textarea forward نمی‌شوند؛ field ref/name/onBlur نیز ارسال نشده‌اند.
- اثر: اختلال در اعلان خطا، هدف label و تمرکز خودکار فیلد در مسیر اصلی ساخت تصویر.
- اصلاح حداقلی: forward ویژگی‌ها و ref به textarea واقعی و ادغام ref اندازه‌گیری داخلی با ref فرم.

### F-05 | P2 | راهنمای نصب iOS به state دیگری متصل است

- منبع: `src/pages/(app)/_layout/sidebar/user-profile-menu.tsx:29,75-81`، `user-menu.tsx:10,18-20` و `src/feature/pwa/use-pwa-install.ts:67-70`.
- سناریو/انتظار: با شبیه‌سازی iOS غیر standalone، نصب را بزن؛ راهنما باز، بسته و دوباره باز شود.
- رفتار مستفاد از کد: دکمه نصب state نمونه hook فرزند را باز می‌کند؛ دیالوگ، state نمونه مستقل والد را می‌خواند.
- اصلاح حداقلی: یک مالک state برای اکشن و دیالوگ؛ بررسی پنهان‌شدن اکشن در حالت installed.

### F-06 | P2 | خطای بارگذاری تاریخچه گفتگو بازیابی روشن ندارد

- منبع: `src/pages/(app)/generation/_hooks/model.ts:181-190`، `_hooks/generation-page.ts:117,307-318`، `image/page.tsx:82-95,171-190` و `video/page.tsx:57-75,88-102`.
- سناریو: مسیر chatId با پاسخ 403/404/500 یا قطع شبکه باز شود.
- انتظار: خطای متمایز فارسی، Retry و برگشت/گفتگوی جدید، بدون نمایش ضمنی تاریخچه موفق.
- رفتار مستفاد از کد: error/refetch تاریخچه به صفحه ارائه نشده؛ ممکن است timeline خالی و composer بدون توضیح دیده شوند.
- اصلاح حداقلی: آشکارسازی error و recovery در hook و UI هر دو رسانه.

### F-07 | P2 | نام دسترس‌پذیر منوی موبایل خالی است

- منبع: `src/pages/(app)/_layout/sidebar/index.tsx:87-99` و `src/components/ui/sheet.tsx:106-118`.
- سناریو/انتظار: در 375×812 و 768×1024 منو را باز کن؛ dialog با نام محلی‌شده پیدا شود و Escape آن را ببندد.
- رفتار مستفاد از کد: `SheetTitle` خالی است و نام جایگزین روی محتوا وجود ندارد.
- اصلاح حداقلی: عنوان فارسی معنادار، در صورت نیاز visually hidden.

### F-08 | P2 | اسکرول خودکار reduced motion را رعایت نمی‌کند

- منبع: `src/pages/(app)/_layout/index.tsx:52-55,62-69`.
- سناریو/انتظار: با reduced motion، اسکرول عادی و اجباری هنگام گفتگو بدون حرکت نرم اجرا شوند.
- رفتار مستفاد از کد: هر دو مسیر مستقیماً `behavior: "smooth"` دارند.
- اصلاح حداقلی: انتخاب رفتار nonanimated مطابق ترجیح کاربر در هر دو مسیر.

### F-09 | P2 | اکشن‌های پیش‌نمایش رسانه نام قابل تمایز ندارند

- منبع: `src/components/custom/media-preview-item.tsx:111-124` و `src/pages/(app)/generation/image/_components/result-card.tsx:108-114`.
- سناریو/انتظار: چند خروجی متفاوت بساز و کنترل هر خروجی را با نام متمایز انتخاب کن.
- رفتار مستفاد از کد: aria-label عمومی «تصویر/ویدیو» نام توصیفی تصویر فرزند را برای دکمه override می‌کند.
- اصلاح حداقلی: نام اکشن محلی‌شده با شماره/توضیح متمایز؛ حفظ توضیح کامل رسانه در جای مناسب.

### F-10 | P2 | فهرست خالی پلن‌ها بدون توضیح می‌ماند

- منبع: `src/feature/pricing/pricing.tsx:58-68,125-131,204-207`.
- سناریو: API ماک هیچ پلن مناسب scope/model درخواست‌شده برنگرداند یا همه پلن‌ها پس از filter حذف شوند.
- انتظار: توضیح نبود پلن مناسب و خروج/بازیابی واضح.
- رفتار مستفاد از کد: شاخه موفق فقط map می‌کند و zero-results state ندارد.
- اصلاح حداقلی: empty state محلی‌شده برای مجموعه نهایی فیلترشده.

### F-11 | P2 | صفحه خالی مالی راه بازگشت pagination را پنهان می‌کند

- منبع: `src/pages/profile/payments/page.tsx:31-35,138-147` و `src/pages/profile/wallet-transactions/page.tsx:38-42,128-137`.
- سناریو: offset مثبت قدیمی یا خارج از محدوده در URL باشد و پاسخ موفق خالی برگردد.
- انتظار: قبلی/اولین صفحه یا normalize به offset معتبر.
- رفتار مستفاد از کد: footer صفحه‌بندی به وجود رکورد وابسته است و در پاسخ خالی ناپدید می‌شود.
- اثر/اصلاح: تغییر فیلتر ممکن است راه موقت باشد؛ recovery مستقیم pagination باید مستقل از تعداد رکورد ارائه شود.

## ریسک‌ها و تصمیم‌های باز

این موارد به‌عنوان exploit یا باگ اجرایی تأییدشده شمرده نشده‌اند:

| شناسه | مشاهده و شاهد | تصمیم/اعتبارسنجی لازم |
| --- | --- | --- |
| UX-01 | `src/pages/auth/login/page.tsx:8-10` پس از ورود ۵ ثانیه انتظار ثابت ایجاد می‌کند؛ `features/auth/components/login-form.tsx:72-74` منتظر handler می‌ماند | تعیین بودجه تأخیر پس از ورود و رفتار reduced motion؛ ممکن است طراحی عمدی باشد |
| R-01 | snapshotهای editor با documentId ذخیره می‌شوند و در پاک‌سازی معمول نشست حذف نمی‌شوند؛ `features/editor/services/editor-snapshot-store.ts:3-20` و `hooks/use-editor-history.ts:26-44` | تعیین retention/account scope و تست دو حساب؛ دسترسی بین‌حسابی اثبات نشده است |
| R-02 | cleanup آفلاین تمام ثبت‌های SW و نام‌های CacheStorage همان origin را حذف می‌کند | بررسی co-hosting و مالکیت origin؛ اثر بر اپ دیگر بدون دانستن deployment اثبات نشده است |
| R-03 | `utils/safe-external-url.ts:1-8` HTTPS و نبود userinfo را enforce می‌کند، نه allowlist دامنه درگاه | تعیین دامنه‌های مجاز در قرارداد؛ کنترل مهاجم بر مقصد معتبر اثبات نشده است |
| R-04 | dialogهای کنترل‌شده بدون trigger/بازگرداندن focus صریح، height cap بعضی dialogها و hero محدود موبایل | تست focus، 320px، حالت افقی و متن بزرگ؛ بریدگی یا focus loss در مرورگر اثبات نشده است |
| R-05 | سطوح شفاف، گرادیان‌ها و رنگ متن muted | اندازه‌گیری کنتراست composited و focus visibility؛ از روی نام token نمره WCAG صادر نشده است |

در بررسی محدود، پیام chat به‌صورت متن React نمایش داده می‌شود و SVG گالری از طریق `img` نمایش داده می‌شود؛ XSS مشخصی در این مسیرها تأیید نشد. این نتیجه تضمین امنیت تمام sinkها نیست.

نتیجه پرداخت از API احرازشده خوانده می‌شود (`src/feature/payment/api.ts:5-23`) و موفقیت به موفقیت مالی و fulfillment وابسته است (`status.ts:15-30`)، نه صرف query موفقیت در URL. returnTo نیز مسیر محلی را محدود می‌کند (`features/auth/model/auth-navigation.ts:4-23`). مالکیت سفارش، مبلغ، idempotency و مجوزهای بک‌اند با ماک اثبات نمی‌شوند.

## ایمنی و اعتبار زیرساخت تست فعلی

| شناسه | شاهد سورس | پیامد برای انتشار |
| --- | --- | --- |
| QA-01 | `vite.config.ts:20-25,36-60` مسیر `/api/v1/auth` را به upstream محیط forward می‌کند | مجاز کردن localhost معادل ماک یا عدم ارسال پیامک نیست |
| QA-02 | `playwright.config.ts:31-38,74-77` guard عمومی HTTP/WS ندارد و server موجود را reuse می‌کند | suite عمومی برای تضمین صفر عارضه آماده نیست |
| QA-03 | `__tests__/login-hero-motion.spec.ts:3-10` و `src/pages/(app)/gallery/_tests/gallery.spec.ts:25-28` pass-throughهای permissive دارند | page route می‌تواند context guard را دور بزند؛ صرف افزودن config مشکل را حل نمی‌کند |
| QA-04 | `__tests__/release-readiness.spec.ts:153-158` بعد از clearCookies ناشناس‌شدن می‌خواهد ولی `support/auth-session.ts:23-29` همچنان refresh احرازشده برمی‌گرداند | سناریوی ناشناس با fixture جاری هم‌خوان نیست |
| QA-05 | `release-readiness.spec.ts:157` و `login-hero-motion.spec.ts:52` spinbutton با نام قدیمی می‌خواهند؛ `challenge-start-form.tsx:86-98` اکنون `type="tel"` دارد | selector با کنترل فعلی ناسازگار است؛ locator فعلی textbox با نام «شماره موبایل» است |
| QA-06 | `profile-settings.spec.ts:3-55`، `wallet-checkout.spec.ts:16-20` و `finance-pages.spec.ts:6-10` فقط cookie قدیمی را seed می‌کنند | قرارداد فعلی CSRF/refresh bootstrap را برقرار نمی‌کنند |
| QA-07 | `features/file-manager/_tests/file-manager.spec.ts:94` برچسب `Upload result` می‌خواهد ولی `harness.tsx:47` نام `Result` دارد | ناسازگاری selector در تست قدیمی |
| QA-08 | `dynamic-config-schema.spec.ts:286-306` از sibling `perpix-core-api` fixture می‌خواند | استقلال و هم‌نسخه‌بودن suite نیازمند بررسی است؛ sibling خوانده نشد |
| QA-09 | `production.playwright.config.ts:6-14` کل انتخاب base را inherit می‌کند؛ `production-bundle.spec.ts:19` build را اجرا می‌کند | اجرای بدون فیلتر معادل QA صرفاً production نیست؛ تست‌های dev-source نیز انتخاب می‌شوند |
| QA-10 | fixtureهای تصویر unknown readها را abort می‌کنند ولی همه را در teardown شکست نمی‌دهند | پاس‌شدن UI لزوماً به معنی کامل‌بودن ماک‌ها/رسانه نیست |
| QA-11 | screenshotها عمدتاً artifact هستند؛ assertion baseline در specهای بررسی‌شده یافت نشد | پوشش visual regression مبتنی بر baseline تأیید نشد؛ به‌روزرسانی baseline انجام نشد |

بهترین مبنای موجود `__tests__/fixtures/image-settings.ts:118-234` است: auto fixture، context route و بستن WS. `image-conversation.ts:199-335` کنترل تولید ماک دارد ولی fixture آن auto نیست. هیچ‌یک به تست‌هایی با import خام Playwright یا contextهای جدید به‌صورت خودکار اعمال نمی‌شوند.

برخی fixtureهای رسانه فقط SVG خالی برمی‌گردانند، حتی برای URL ویدیو/صوت (`features/file-manager/_tests/gallery-compat.spec.ts:70-74`). این داده برای metadata/layout مفید است، نه اثبات codec یا playback. یکی از تست‌های playback نیز Windows WebKit را skip می‌کند (`__tests__/video-output-controls.spec.ts:521-523`).

## فایل‌های جدید این مأموریت

| فایل | هدف | وضعیت |
| --- | --- | --- |
| `__tests__/release-qa/network-guard.ts` | dispatcher مستقل با URL/method دقیق؛ فقط fulfill/abort؛ مسدودسازی HTTP ناشناخته، 3xx و WS؛ بدون log URL/header/body | بازبینی سورس؛ compile/runtime اجرا نشده |
| `__tests__/release-qa/network-safety.qa.ts` | ۷ canary برای درخواست حساس، تطبیق ماک، redirect، تب دوم، subresource، WS/SSE و تنظیم SW/context خالی | نوشته‌شده؛ هیچ مورد اجرا نشده |
| `__tests__/release-qa.playwright.config.ts` | انتخاب فقط canaryها، ۶ پروژه viewport، retries صفر، SW block، بدون server و بدون reuse | نوشته‌شده؛ هیچ موتور مرورگری launch نشده |
| `docs/qa/feature-1-release-matrix.csv` | ماتریس سناریو، معیار پذیرش، تست موجود، یافته و وضعیت اجرای دستگاه/موتور | برنامه پوشش و ثبت Blocked، نه گزارش Pass |
| `docs/qa/feature-1-release-run.json` | metadata و شواهد دستورات با خروجی خلاصه و بدون داده حساس | رکورد این ممیزی |
| `docs/qa/feature-1-release-audit.md` | همین گزارش فارسی و تصمیم انتشار | ممیزی اجرایی ناقص |

canaryها فقط صفحه HTML ساختگی در حافظه را باز می‌کنند، اپ را mount نمی‌کنند و API محصول را شبیه‌سازی کامل نمی‌کنند. نام endpointهای canary قرارداد تولید/احراز هویت را اثبات نمی‌کند. این helper به suite قدیمی متصل نشده و برای اجرای اپ بدون تکمیل fixtureها کافی نیست. داده‌های آن عمومی و ساختگی‌اند.

نام پروژه‌ها پسوند `viewport` دارد؛ استفاده از Desktop Chrome/Safari با ابعاد متفاوت **شبیه‌سازی touch، کیبورد مجازی یا دستگاه واقعی نیست**. هفت canary در شش پروژه، ۴۲ مورد برنامه‌ریزی‌شده است؛ عدد ۴۲ تعداد تست عبورکرده یا حتی جمع‌آوری‌شده توسط runner نیست.

## ماتریس و شواهد اجرا

در CSV، ۴۸ گروه سناریو با ستون‌های Chromium/WebKit در 375×812، 768×1024، 1440×900، 320×812 و 667×375 ثبت شده است. همه ۴۸۰ خانه اجرای موردنیاز `Blocked` هستند. این ماتریس گروه‌های پذیرش را پوشش می‌دهد، نه ادعای تولید تمام ترکیب‌های اتمی داده و state. ستون `existing_tests` فقط فایل‌های مرتبط موجود یا تازه نوشته‌شده است؛ وجود یک فایل به معنی پوشش همه معیارهای آن سطر نیست. regressionهای P1/P2 و نصب iOS اکنون نوشته شده‌اند ولی اجرا نشده‌اند. پروفایل‌های narrow/landscape در تست‌های P2 تاریخچه و پلن پوشش برنامه‌ریزی‌شده دارند، اما canary مستقل شبکه همچنان فقط سه اندازه اصلی و بدون touch emulation است.

| اعتبارسنجی | وضعیت | شواهد |
| --- | --- | --- |
| مسیرهای کاربر، قراردادهای محلی، UI/state و ریسک‌های امنیتی محدود | بررسی سورس انجام شد | ارجاع فایل/خط در این گزارش؛ بدون درخواست به سرویس |
| اجرای canaryهای شبکه | Blocked | sandbox تأییدشده موجود نبود |
| تست‌های واحد/یکپارچه/E2E موجود | Blocked | suite ایمن عمومی و محیط OS ایزوله تأیید نشد |
| UI مرورگر، RTL رندرشده، کنتراست، overflow، keyboard/focus، touch | Blocked | هیچ screenshot، اندازه‌گیری یا تعامل مرورگر ثبت نشد |
| build و type-check | Blocked | `pnpm build` اجرا نشد |
| lint | Blocked | `pnpm lint` اجرا نشد |
| کارایی production، bundle و playback | Blocked | artifact production یا browser measurement ساخته نشد |
| تست واقعی backend/SMS/پرداخت/تولید | Not Run | عمداً خارج از مجوز این مأموریت |
| تولید قرارداد API | N/A | قرارداد تغییر نکرد؛ `scripts:generate-api` اجرا نشد |

نمره عددی UI/WCAG یا ادعای پوشش کامل ارائه نمی‌شود؛ داده رندرشده لازم موجود نیست. رفتار واقعی flaky/retry نیز قابل اندازه‌گیری نبود؛ canary config فقط retries را صفر تنظیم کرده است.

دستورات انجام‌شده شامل Git read-only، بررسی ابزار/پورت، `graphify query` و context محلی Impeccable با منع دانلود بوده‌اند. هیچ dev/preview server، build، lint، test، browser، deploy یا مولد API اجرا نشده است. `graphify update .` بدون LLM انجام شد: ۲۸۵۳ node، ۹۲۶۲ edge و ۱۴۶ community. پیشنهاد ابزار برای اجرای labeling مبتنی بر LLM اجرا نشد. graph خروجی ابزار تحلیل سورس است، نه شاهد اجرای اپ.

بررسی whitespace سه فایل TypeScript جدید با `git diff --no-index --check -- NUL <file>` خطای whitespace نشان نداد؛ Git فقط هشدار تبدیل LF/CRLF داد. این بررسی معادل lint یا type-check نیست. تلاش شمارش با CLI `rg` به علت نبودن آن در PATH ناموفق بود؛ ابزارهای جست‌وجو/خواندن موجود برای بررسی تعاریف و ماتریس استفاده شدند و چیزی نصب نشد. نتیجه آزمون جدیدی از این بررسی متنی استنتاج نشده است.

## برنامه ادامه ایمن

1. یک sandbox از پیش آماده و مورد تأیید با منع egress برای browser/Node/Vite و child processها فراهم شود؛ credential، `.env` و پروفایل میزبان در اختیار آن نباشد. وابستگی‌ها و مرورگرها باید از قبل موجود باشند.
2. سورس/toolchain read-only باشند؛ اگر build یا reporter کنار سورس می‌نویسد، یک نسخه disposable کامل داخل scratch آماده شود. مسیر `.artifacts/release-qa` در config فعلی داخل همان نسخه disposable قرار گیرد، نه target فقط‌خواندنی.
3. پیش‌شرط sandbox واقعاً بررسی شود؛ صرف تنظیم متغیر `PERPIX_QA_OS_SANDBOX` کنترل امنیتی نیست. آزمون منع Node/APIRequestContext/پروکسی و child process در سطح زیرساخت، مستقل از guard مرورگر، لازم است.
4. داخل همان محیط تأییدشده، ابتدا `pnpm exec playwright test --config=__tests__/release-qa.playwright.config.ts` اجرا شود. این دستور در میزبان فعلی توصیه اجرایی نیست؛ بدون پیش‌شرط config نیز متوقف می‌شود.
5. پس از گذر canaryها، fixture واحد app با ماک‌های منطبق با قرارداد موجود ساخته شود؛ API حساس از طریق رجیستری fulfill/abort شود، GET ناشناخته هم teardown را شکست دهد، document/assets محلی با allowlist دقیق و منع API/proxy جدا شوند. استفاده از route مستقل، fetch/continue، context جدید یا request client کنترل‌نشده ممنوع بماند.
6. driftهای قدیمی باقیمانده احراز هویت و selectorها در تست‌ها اصلاح شوند؛ regressionهای P1/P2 نوشته‌شده در محیط ایمن اجرا و نتیجه ثبت شود. مجوز اصلاح چهار P1 و هفت P2 دریافت و سورس اصلاح شده است؛ موارد خارج از این یازده یافته و رگرسیون‌های مستقیم آن‌ها در این مرحله تغییر نکردند.
7. بعد از تأیید اصلاح محصول، تست‌های هدفمند و ماتریس حیاتی هر دو موتور اجرا شوند؛ viewport، touch و real device از هم تفکیک شوند. 320px، landscape، zoom، متن طولانی، theme و reduced motion برای صفحات حساس بررسی شوند.
8. با env ساختگی و بدون telemetry واقعی، lint/build و تست artifact production اجرا شوند. dev و preview فقط روی `http://localhost:5173/` و هر بار یکی فعال باشند؛ سرور ناشناخته reuse یا متوقف نشود.
9. شواهد هر route/state/project با نام یکتا ذخیره و screenshotها بازبینی شوند؛ baseline صرفاً برای سبزشدن تغییر نکند. بعد از رفع P0/P1 و تکمیل مسیرهای حیاتی، تصمیم انتشار مجدداً صادر شود.

## چک‌لیست staging، خارج از اجرای این مأموریت

این فهرست مجوز انجام عملیات واقعی یا مصرف اعتبار نیست. اجرای آن به تأیید جداگانه، حساب ساختگی و محیط رسمی تست نیاز دارد.

- قرارداد واقعی session/CSRF/cookie/CORS، rate limit و ارسال OTP از طریق سرویس تست تأیید شود.
- مالکیت chat/file/order/transaction، scopeها و جداسازی دو حساب در بک‌اند بررسی شود.
- اتصال به sandbox رسمی درگاه، مبلغ/واحد پول، callback امضاشده، replay و fulfillment/idempotency تأیید شود.
- تولید رسانه فقط با sandbox رسمی بدون کسر اعتبار یا fixture سروری انجام شود؛ در نبود آن Blocked بماند.
- expiry لینک رسانه، MIME/Content-Disposition، codec، دانلود و هدرهای فایل بررسی شود.
- iOS Safari/Android واقعی، کیبورد مجازی، touch، VoiceOver/TalkBack و مرورگر دسکتاپ هدف بررسی شوند.
- سیاست snapshot و پاک‌سازی بین حساب‌ها، استقرار PWA و محدودسازی origin تأیید شود.

## حفظ تغییرات و اختیارها

چهار فایل زیر از قبل تغییر کرده بودند و در این مأموریت ویرایش نشدند:

- `src/pages/(app)/gallery/_components/gallery-file-card.tsx`
- `src/pages/(app)/gallery/_components/gallery-preview.tsx`
- `src/pages/(app)/gallery/_tests/gallery.spec.ts`
- `src/pages/(app)/gallery/gallery.module.css`

در ممیزی اولیه کد محصول تغییر نکرد؛ در مراحل اصلاح مجاز، چهار P1، هفت P2 و محافظت از رگرسیون‌های مستقیم آن‌ها تغییر کردند. generated API، وابستگی‌ها و شماره نسخه تغییر نکردند. هیچ commit، push، PR، deploy یا session/worktree جدید Agent Manager ایجاد نشد. Conditional Go صادر نمی‌شود: اعتبارسنجی رفتاری P1/P2 و مسیرهای حیاتی هنوز اجرا نشده است.
