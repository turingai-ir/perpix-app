# تحقیق: قالب‌های کپشن مدرن، تکنیک‌ها و امکانات مرورگر

این سند نتیجهٔ تحقیق دربارهٔ رقبا و مرورگر است و پیشنهادی برای نسخهٔ ۲ قالب کپشن دارد.
هر ادعا یکی از سه برچسب را دارد: **[منبع]** یعنی در صفحهٔ آن محصول یا مستندات رسمی دیدم،
**[استنباط]** یعنی از چند نشانه نتیجه گرفتم و کسی تأیید نکرده، **[تأییدنشده]** یعنی باید قبل از تکیه کردن آزمایش شود.

## ۱. رقبا چه می‌دهند

| محصول | آنچه تأیید شده است |
|---|---|
| Submagic | بیش از ۲۰ و حداکثر حدود ۵۰ قالب با نام‌هایی مثل Hormozi 1 تا 5 و Beast؛ دسته‌های Trending، New، Emoji، Premium، Speakers؛ قالب پریمیوم فقط روی پلن بالا؛ B-roll، zoom، اصلاح نگاه |
| Captions.ai | ویرایشگر قالب با کنترل در سطح کلمه (بخش ۲) و گزینهٔ «AI هر خط را متفاوت تیمار کند» |
| Captyne | هر قالب تا ۸ «نقش» برای کلمه دارد: Normal، Emphasis و Style 3 تا 8 |
| Descript | Classic، Clean، Karaoke؛ «Fancy Captions» با کلمهٔ پرنده و ایموجی |
| VEED | هایلایت جعبه‌ای و کاراوکه |
| Kapwing | ادعای بیش از ۱۰۰ قالب؛ حالت کلمه‌به‌کلمه |
| Shotstack | کپشن غنی با JSON؛ انیمیشن‌ها: karaoke، highlight، pop، fade، slide، bounce، typewriter؛ استایل «کلمهٔ فعال» جدا |
| pycaps (متن‌باز) | قالب = CSS + JSON؛ حالت کلمه با selector مثل `.word-being-narrated`؛ «تگ» روی کلمه با regex، فهرست کلمه یا AI؛ افکت‌های typewriter، ایموجی، صدای افکت |
| tscaps | قالب ثابت ندارد و ظاهر CSS قابل‌ویرایش است؛ حالت محلی با Whisper در مرورگر **[منبع: یک فهرست شخص ثالث]** |
| Remotion | `createTikTokStyleCaptions` کلمه‌ها را بر پایهٔ بازهٔ زمانی به صفحه تبدیل می‌کند؛ پکیج جامعه با ۱۴ سبک از جمله bounce، wave، glow، scale |

قالب‌های نام‌دار (طبق Subanimate): Hormozi (متن بزرگ، حروف بزرگ، رنگ سبز و زرد)، MrBeast (کلمهٔ کج با scale و bounce)،
Karaoke (wipe رنگ)، Ali Abdaal (زیرخط روی کلمهٔ فعال)، Two Word Pop (جفت‌کلمه در جعبهٔ زرد).

## ۲. چرا این‌قدر قالب متنوع دارند؟ (استنباط)

هیچ‌کدام معماری داخلی را منتشر نکرده‌اند. از مستندات ویرایشگر Captions.ai و pycaps و Shotstack این الگو بیرون می‌آید:
**قالب‌ها ترکیب لایه‌های مستقل‌اند، نه کد جدا برای هر قالب.** اگر هر محور چند گزینه داشته باشد، ترکیب‌ها صدها قالب می‌دهد.

محورهای مشترک:
1. **سبک پایه:** قلم، وزن، اندازه، رنگ، حاشیه، سایه، glow، پس‌زمینه با گردی و blur و padding.
2. **چینش:** تعداد خط، شکستن در مکث یا نقطه‌گذاری، چینش چپ/وسط/راست/تصادفی، حروف بزرگ/کوچک/عنوان.
3. **حالت کلمه:** فعال، بعدی (هنوز نگفته)، گفته‌شده؛ هرکدام رنگ، وزن، اندازه و پس‌زمینهٔ خودشان.
4. **نقش کلمه:** عادی، کلیدی و حداکثر ۸ نقش، هرکدام با زیرخط، رنگ، glow، supersize و قلم جدا.
5. **انیمیشن در سه سطح:** صفحه، خط، کلمه، با ترنزیشن‌هایی مثل opacity، حرکت و مقیاس خودکار، چرخش تصادفی.
6. **تصادفی بودن:** چینش و چرخش و رنگ با seed ثابت تا «زنده» به‌نظر برسد (Captions.ai «randomize rotation» و «Random alignment» را دارد).
7. **افزودنی‌ها:** ایموجی، تصویر کنار کلمه («pictorial words»)، صدای افکت، B-roll، zoom خودکار.
8. **انتخابگر (selector):** pycaps کلمه‌ها را با «تگ» انتخاب می‌کند و استایل و انیمیشن را به تگ می‌چسباند. این همان فکر `.word-being-narrated` است.

مدل ذهنی که این‌ها را یکی می‌کند، **Text Animator در After Effects** است **[منبع: Adobe]**:
یک animator خاصیت‌هایی را تعریف می‌کند (opacity، مقیاس، مکان، چرخش، رنگ)، یک selector می‌گوید چقدر روی هر واحد (حرف، کلمه، خط) اثر کند،
و با keyframe روی شروع و پایان بازهٔ selector انیمیشن ساخته می‌شود. «Expression selector» هم هر واحد را با `textIndex` جدا اثر می‌دهد (stagger).

## ۳. کلمهٔ کلیدی چطور انتخاب می‌شود

- **Captyne:** سه راهبرد: آخرین کلمهٔ هر عبارت، دستی، «AI Decide». AI Decide نام‌ها، عددها، فعل‌های کلیدی و کلمه‌های متضاد را می‌گیرد؛ الگوریتم مشخص نیست؛ کاربر با کلیک نقش هر کلمه را عوض می‌کند؛ توصیه: یک یا دو کلمه در هر عبارت.
- **Overlap:** وزن بیشتر برای تضاد، نفی، نام‌ها و عددهای قیددار؛ یک کلمه یا عبارت در هر کپشن؛ دستی بر خودکار مقدم است؛ تأکید صدا اندازه‌گیری نمی‌شود.
- **pycaps:** تگ با regex، فهرست کلمه یا AI.
- **Pictory، Bytecap، Filmora:** «تحلیل محتوا» و «فهم زمینه» **[تأییدنشده که LLM باشد]**.
- **فارسی:** پژوهش کلیدواژه‌یابی فارسی کوچک است؛ Hazm برای برچسب‌گذاری اجزای جمله، ParsBERT برای embedding، و پیکرهٔ PerKey وجود دارد. این‌ها را برای متن خبری ساخته‌اند، نه برای گفتار محاوره‌ای، پس **[تأییدنشده]** برای ما.

نتیجه: هیچ راه استانداردی نیست و همه «ویرایشی» (editorial) تصمیم می‌گیرند، نه آماری.

## ۴. امکانات مرورگر

| امکان | وضعیت و کاربرد |
|---|---|
| Canvas 2D: `letterSpacing`، `fontKerning`، `textRendering`، `filter`، `CanvasFilter` | Chrome اضافه کرده؛ `ctx.filter` برای blur و glow کار می‌کند. پشتیبانی Safari و Firefox **[تأییدنشده]**، باید آزمایش شود |
| فونت متغیر (variable) و `FontFace` | وزن و عرض را می‌توان نرم انیمیت کرد (مثلاً وزن از ۴۰۰ به ۹۰۰ روی کلمهٔ فعال). باید فونت فارسی متغیر داشته باشیم، مثل Vazirmatn **[استنباط]** |
| `Intl.Segmenter` | جدا کردن کلمه و grapheme در متن فارسی، برای وقتی که انتقال از ASR کلمه‌ها را درست نمی‌دهد **[تأییدنشده]** |
| WebCodecs (`VideoEncoder`) | صدور فریم‌به‌فریم روی GPU. Firefox دسکتاپ از نسخهٔ ۱۳۰؛ Safari کامل‌تر در نسخهٔ ۲۶؛ AAC در Firefox نیست؛ Firefox اندروید پشتیبانی ندارد. باید `isConfigSupported` را در زمان اجرا پرسید |
| Mediabunny | جانشین mp4-muxer؛ `CanvasSource` بوم را به MP4 تبدیل می‌کند؛ نسخه‌ها زیاد عوض شده، باید مستندات روز را دید |
| `OffscreenCanvas` + Worker + OPFS | رندر و کدگذاری بدون قفل کردن صفحه؛ OPFS برای فایل بزرگ خروجی |
| WebGL / WebGPU | شیدر برای glow، آشوب (distortion)، گرادیان و chromatic aberration. پشتیبانی WebGPU متفاوت است **[تأییدنشده]** |
| HTML-in-Canvas (`drawElementImage`) | قالب‌ها را می‌توان با DOM و CSS واقعی نوشت و در بوم کشید (راه pycaps). فقط Chromium، پشت پرچم `chrome://flags/#canvas-draw-element`؛ Remotion هم آن را اختیاری و با فال‌بک می‌گذارد. **برای محصول هنوز آماده نیست** |
| جداسازی سوژه روی دستگاه | RMBG و MODNet با Transformers.js روی WebGPU با فال‌بک WASM؛ سرعت روی ویدیو **[تأییدنشده]**. پایهٔ «متن پشت سوژه» (tscaps دارد). روی کل ویدیو در مرورگر سنگین است |
| Whisper در مرورگر | tscaps دارد. برای ما بی‌ربط است چون رونویسی را سمت سرور و با Gemini می‌گیریم |

## ۵. فارسی، جدی‌ترین ریسک

انیمیشن حرف‌به‌حرف (per-letter) در فارسی **حروف را از هم جدا می‌کند** و شکل «چسبیده» حروف از بین می‌رود **[منبع: Framer Shape-Safe، مایکروسافت، Lottie]**.
راه‌های امن:
- **سطح کلمه:** هر کلمه کامل کشیده می‌شود (الان همین است).
- **ماسک روی متن دست‌نخورده:** مثل wipe فعلی. متن یک‌بار شکل می‌گیرد و ماسک روی آن حرکت می‌کند. برای همهٔ جلوه‌های «آشکار شدن» (reveal)، برای «تایپ‌شدن» و «پر شدن» همین را داریم.
- **per-letter فقط برای لاتین:** تشخیص با `isRtl`.
- موتور شکل‌دهی کامل (HarfBuzz یا CanvasKit از Skia) راه سنگین‌تری است که فقط در صورت نیاز به حرکت واقعی حروف فارسی لازم می‌شود.

## ۶. ریسک‌های دیگر

- Safari: `ctx.filter` و بعضی قابلیت‌های Canvas را باید آزمایش کنیم. اگر نبود، glow را با چند بار کشیدن سایه می‌سازیم.
- نگه‌داشتن «فقط تابع زمان» (فریم دلخواه = تصویر یکسان): هر جلوهٔ تصادفی با **seed** ثابت، نه `Math.random()`.
- امنیت: قالب‌ها داده‌اند، نه کد. اگر CSS یا JS دلخواه بپذیریم (راه pycaps و tscaps) باید sandbox کنیم. ما قالب را اعلانی نگه می‌داریم.

## ۷. پیشنهاد: قالب نسخهٔ ۲ مبتنی بر «نقش + انیماتور + selector»

```jsonc
{
  "base":   { "font": {...}, "stroke": {...}, "shadow": {...}, "glow": {...}, "box": {...} },
  "layout": { "anchor": "bottom", "safeZone": "reels", "lines": 2, "breakOn": "pause", "align": "center" },
  "states": { "upcoming": {...}, "active": {...}, "spoken": {...} },
  "roles":  { "normal": {...}, "key": {...}, "style3": {...}, "...": "تا ۸ نقش" },
  "animators": [
    { "select": { "scope": "word", "role": "key" },
      "trigger": "enter",             // enter | active | exit | loop
      "props": { "scale": [0.6, 1], "rotate": [-6, 0], "opacity": [0, 1] },
      "ease": "back.out", "stagger": 60, "seed": 7 }
  ],
  "decorations": [
    { "select": { "state": "active" }, "kind": "pill|underline|glow|marker", "...": "..." }
  ]
}
```

**انتخابگر** (selector): `scope` (page، line، word)، `role`، `state` (upcoming، active، spoken)،
`position` (اولین، آخرین)، `tag` (عدد، نام، ایموجی)، زوج یا فرد.

چرا این‌طور:
1. تنوع از ترکیب می‌آید، نه از کد جدا برای هر قالب. ۱۵ خاصیت × ۴ سطح × ۴ زمان‌بندی × چند easing.
2. قالب داده است، پس بک‌اند فقط نگه می‌دارد (مثل الان) و رندرر مشترک می‌ماند.
3. نقش‌ها همان چیزی هستند که Captyne می‌دهد و کلمهٔ کلیدی را از «یک نوع» به «چندین نوع» می‌رساند.
4. هر انیماتور تابع زمان است، پس صدور فریم‌به‌فریم با پیش‌نمایش یکی می‌ماند.
5. قالب نسخهٔ ۱ فعلی با `normalizeCaptionConfig` به ۲ ارتقا می‌یابد و خراب نمی‌شود.

**رندر:** Konva روی Canvas 2D را نگه می‌داریم. HTML-in-Canvas و CanvasKit را وقتی در نظر می‌گیریم که واقعاً به آن‌ها نیاز شد.
glow و blur با `ctx.filter` یا چند لایه سایه؛ ماسک و clip برای reveal؛ فونت متغیر برای تغییر وزن نرم.

## ۸. انتخاب کلمهٔ کلیدی برای ما (پیشنهاد)

1. مدل زبانی روی کل متن رونویسی؛ خروجی JSON ساختاریافته: برای هر صفحه حداکثر ۱ تا ۲ اندیس کلمه، نقش (عدد، نام، تضاد، فعل)، و در صورت نیاز یک ایموجی.
2. قانون ساده به‌عنوان فال‌بک: عدد، بلندترین کلمه، آخرین کلمه.
3. کاربر هر انتخاب را با کلیک عوض می‌کند و در `document` پروژه ذخیره می‌شود.
4. **باید با نمونهٔ واقعی فارسی (گفتار محاوره‌ای) آزمایش شود** و کیفیت و هزینه‌اش اندازه‌گیری شود.

## ۹. مراحل پیشنهادی

1. **قرارداد v2** (نقش + حالت + انیماتور + selector) و مهاجرت از v1؛ رندرر بر پایهٔ آن.
2. **جلوه‌ها:** glow، زیرخط، ماژیک (marker)، تغییر وزن با فونت متغیر، ماسک reveal، seed برای تصادفی.
3. **ویرایشگر ادمین:** ویرایش نقش‌ها و انیماتورها با کنترل بصری و ۱۵ تا ۲۰ قالب اولیه.
4. **منطقهٔ امن** شبکه‌های اجتماعی و شکستن خط در مکث.
5. **انتخاب کلمه با مدل** (بعد از آزمایش فارسی).
6. **صدور ویدیو** با WebCodecs و Mediabunny در Worker، با بررسی `isConfigSupported`.
7. **بعداً:** متن پشت سوژه، B-roll، صدای افکت.

## منابع

- [Adobe: Animating text](https://helpx.adobe.com/after-effects/using/animating-text.html)
- [Captions.ai: customizing a template](https://captions.ai/help/web/captions/customizing-a-template)
- [Captyne: highlight key words](https://captyne.com/help/editing-captions/highlight-key-words-in-captions)
- [Overlap: captions on clips](https://overlap.ai/blogs/how-to-add-captions-to-clips)
- [Shotstack: rich captions](https://shotstack.io/docs/guide/architecting-an-application/rich-captions/)
- [pycaps](https://github.com/francozanardi/pycaps)
- [Subanimate: templates](https://subanimate.com/subtitle-templates/)
- [Remotion: TikTok-style captions](https://www.remotion.dev/docs/captions/create-tiktok-style-captions)
- [Remotion: HTML-in-canvas](https://www.remotion.dev/docs/client-side-rendering/html-in-canvas)
- [WICG: html-in-canvas](https://github.com/WICG/html-in-canvas)
- [Mediabunny](https://mediabunny.dev/)
- [Chrome: Canvas2D text attributes](https://developer.chrome.com/blog/canvas2d)
- [MDN: ctx.filter](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter)
- [AlternativeTo: tscaps](https://alternativeto.net/software/tscaps/about/)
- [Submagic](https://www.submagic.co/ai-caption)
- [Verbit: مقایسهٔ ابزارها](https://verbit.ai/resources/10-best-ai-video-captioning-tools-for-2026-2027-top-picks-for-media-business-video-creators/)
- [ParsBERT](https://arxiv.org/pdf/2005.12515)
- [Persian EmbedRank (Hazm)](https://github.com/E-Ghafour/Persian_Embedrank_Keyword_Extraction)
