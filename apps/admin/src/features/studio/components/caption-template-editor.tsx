import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import {
  ALIGNS,
  ANCHORS,
  ENTRANCES,
  EXITS,
  SAMPLE_WORDS,
  STARTER_TEMPLATES,
  WORD_EFFECTS,
  normalizeCaptionConfig,
  sampleDurationMs,
  type CaptionConfig,
} from "@perpix/caption-renderer";
import { CaptionPreview } from "@perpix/caption-renderer/react";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";

interface CaptionTemplateEditorProps {
  config: CaptionConfig;
  onChange: (config: CaptionConfig) => void;
}

const FRAMES = {
  portrait: { width: 270, height: 480 },
  landscape: { width: 480, height: 270 },
} as const;
type Frame = keyof typeof FRAMES;

const FONTS = ["Vazirmatn", "Inter", "Arial", "Georgia", "Impact"];

const controlClass =
  "border-border bg-background text-foreground h-8 rounded border px-2 text-xs";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex items-center justify-between gap-3 text-xs">
      <span className="text-foreground font-medium">{label}</span>
      {children}
    </label>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-border space-y-2 rounded border p-3">
      <legend className="text-muted-foreground px-1 text-xs font-semibold">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Slider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <span className="flex items-center gap-2" dir="ltr">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-28"
      />
      <span className="text-muted-foreground w-10 text-end tabular-nums">
        {value}
      </span>
    </span>
  );
}

function Choice<T extends string>({
  value,
  options,
  label,
  onChange,
}: {
  value: T;
  options: readonly T[];
  label: (option: T) => string;
  onChange: (value: T) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={controlClass}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {label(option)}
        </option>
      ))}
    </select>
  );
}

function Color({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  // A colour input only takes six-digit hex, which is what the config keeps.
  const full = /^#[0-9a-f]{6}$/i.test(value)
    ? value
    : `#${value
        .slice(1)
        .split("")
        .map((c) => c + c)
        .join("")}`;
  return (
    <input
      type="color"
      value={full}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-12 cursor-pointer rounded border"
    />
  );
}

function Check({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <input
      type="checkbox"
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
      className="size-4 cursor-pointer rounded"
    />
  );
}

/**
 * Builds a caption look with controls and shows it on sample words, drawn by
 * the renderer the user's app exports with, so what is seen here is what users get.
 */
export function CaptionTemplateEditor({
  config,
  onChange,
}: CaptionTemplateEditorProps) {
  const { t } = useAppTranslate();
  const label = (key: string, fallback: string) =>
    t(`features.studio.captionEditor.${key}`, { defaultValue: fallback });

  const [language, setLanguage] = useState<"fa" | "en">("fa");
  const [frame, setFrame] = useState<Frame>("portrait");
  const [dark, setDark] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [timeMs, setTimeMs] = useState(0);
  const [jsonDraft, setJsonDraft] = useState<string | null>(null);

  const words = SAMPLE_WORDS[language];
  const duration = useMemo(() => sampleDurationMs(words), [words]);
  const last = useRef(0);

  useEffect(() => {
    if (!playing) return;
    let handle = 0;
    last.current = performance.now();
    const tick = (now: number) => {
      const delta = now - last.current;
      last.current = now;
      setTimeMs((current) => (current + delta) % duration);
      handle = requestAnimationFrame(tick);
    };
    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [playing, duration]);

  const patch = <K extends keyof CaptionConfig>(
    key: K,
    value: Partial<CaptionConfig[K]>,
  ) =>
    onChange({
      ...config,
      [key]:
        typeof config[key] === "object"
          ? { ...(config[key] as object), ...value }
          : value,
    });

  const names = {
    entrance: {
      none: "بدون",
      fade: "محو شدن",
      pop: "بالا آمدن (pop)",
      zoom: "زوم",
      "slide-up": "لغزیدن از پایین",
      bounce: "جهش",
      words: "کلمه به کلمه",
    },
    exit: { none: "بدون", fade: "محو شدن" },
    wordEffect: {
      none: "بدون",
      color: "تغییر رنگ",
      pop: "بزرگ شدن",
      wipe: "پر شدن (کاراوکه)",
    },
    anchor: { top: "بالا", middle: "وسط", bottom: "پایین" },
    align: { center: "وسط", left: "چپ", right: "راست" },
    starter: {
      karaoke: "کاراوکه",
      pop: "پاپ",
      boxed: "جعبه‌ای",
      word_by_word: "کلمه به کلمه",
    },
  } as const;

  const size = FRAMES[frame];
  const { font, text, layout, colors, box, shadow, animation } = config;

  return (
    <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
      <div className="space-y-3 lg:sticky lg:top-0 lg:self-start">
        <div className="mx-auto" style={{ width: size.width }}>
          <CaptionPreview
            config={config}
            words={words}
            timeMs={timeMs}
            width={size.width}
            height={size.height}
            background={dark ? "#1f2937" : "#e5e7eb"}
            className="overflow-hidden rounded-lg border"
          />
        </div>
        <div className="flex items-center gap-2" dir="ltr">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="size-8 cursor-pointer p-0"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "pause" : "play"}
          >
            {playing ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
          </Button>
          <input
            type="range"
            min={0}
            max={duration}
            value={Math.round(timeMs)}
            onChange={(e) => {
              setPlaying(false);
              setTimeMs(Number(e.target.value));
            }}
            className="flex-1"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Choice
            value={frame}
            options={["portrait", "landscape"] as const}
            label={(o) => (o === "portrait" ? "9:16" : "16:9")}
            onChange={setFrame}
          />
          <Choice
            value={language}
            options={["fa", "en"] as const}
            label={(o) => (o === "fa" ? "فارسی" : "English")}
            onChange={setLanguage}
          />
          <Choice
            value={dark ? "dark" : "light"}
            options={["dark", "light"] as const}
            label={(o) => (o === "dark" ? "پس‌زمینه تیره" : "پس‌زمینه روشن")}
            onChange={(o) => setDark(o === "dark")}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Group title={label("starter", "شروع از نمونه")}>
          <Choice
            value={"" as keyof typeof STARTER_TEMPLATES | ""}
            options={
              ["", ...Object.keys(STARTER_TEMPLATES)] as Array<
                keyof typeof STARTER_TEMPLATES | ""
              >
            }
            label={(o) =>
              o === ""
                ? label("starterPick", "یک نمونه انتخاب کن…")
                : (names.starter[o as keyof typeof names.starter] ?? o)
            }
            onChange={(o) => {
              const starter = o ? STARTER_TEMPLATES[o] : undefined;
              if (starter) onChange(normalizeCaptionConfig(starter));
            }}
          />
        </Group>

        <Group title={label("font", "قلم و متن")}>
          <Field label={label("fontFamily", "قلم")}>
            <Choice
              value={font.family}
              options={
                FONTS.includes(font.family) ? FONTS : [font.family, ...FONTS]
              }
              label={(o) => o}
              onChange={(family) => patch("font", { family })}
            />
          </Field>
          <Field label={label("fontSize", "اندازه")}>
            <Slider value={font.size} min={24} max={160} step={1} onChange={(size) => patch("font", { size })} />
          </Field>
          <Field label={label("fontWeight", "ضخامت")}>
            <Slider value={font.weight} min={300} max={900} step={100} onChange={(weight) => patch("font", { weight })} />
          </Field>
          <Field label={label("italic", "کج")}>
            <Check value={font.italic} onChange={(italic) => patch("font", { italic })} />
          </Field>
          <Field label={label("uppercase", "حروف بزرگ (لاتین)")}>
            <Check value={text.uppercase} onChange={(uppercase) => patch("text", { uppercase })} />
          </Field>
          <Field label={label("wordsPerPage", "تعداد کلمه در هر نمایش")}>
            <Slider value={text.wordsPerPage} min={1} max={10} step={1} onChange={(wordsPerPage) => patch("text", { wordsPerPage })} />
          </Field>
          <Field label={label("lineHeight", "فاصلهٔ خطوط")}>
            <Slider value={text.lineHeight} min={0.9} max={2} step={0.05} onChange={(lineHeight) => patch("text", { lineHeight })} />
          </Field>
          <Field label={label("align", "چینش")}>
            <Choice value={text.align} options={ALIGNS} label={(o) => names.align[o]} onChange={(align) => patch("text", { align })} />
          </Field>
        </Group>

        <Group title={label("position", "جایگاه")}>
          <Field label={label("anchor", "محل")}>
            <Choice value={layout.anchor} options={ANCHORS} label={(o) => names.anchor[o]} onChange={(anchor) => patch("layout", { anchor })} />
          </Field>
          <Field label={label("offset", "فاصله از لبه")}>
            <Slider value={layout.offset} min={0} max={0.4} step={0.01} onChange={(offset) => patch("layout", { offset })} />
          </Field>
          <Field label={label("maxWidth", "بیشترین پهنا")}>
            <Slider value={layout.maxWidth} min={0.4} max={1} step={0.02} onChange={(maxWidth) => patch("layout", { maxWidth })} />
          </Field>
        </Group>

        <Group title={label("colors", "رنگ و حاشیه")}>
          <Field label={label("textColor", "رنگ متن")}>
            <Color value={colors.text} onChange={(value) => patch("colors", { text: value })} />
          </Field>
          <Field label={label("activeColor", "رنگ کلمهٔ در حال گفتن")}>
            <Color value={colors.active} onChange={(value) => patch("colors", { active: value })} />
          </Field>
          <Field label={label("strokeColor", "رنگ حاشیه")}>
            <Color value={colors.stroke} onChange={(value) => patch("colors", { stroke: value })} />
          </Field>
          <Field label={label("strokeWidth", "ضخامت حاشیه")}>
            <Slider value={config.strokeWidth} min={0} max={20} step={1} onChange={(strokeWidth) => onChange({ ...config, strokeWidth })} />
          </Field>
        </Group>

        <Group title={label("box", "پس‌زمینهٔ متن")}>
          <Field label={label("boxEnabled", "نمایش جعبه")}>
            <Check value={box.enabled} onChange={(enabled) => patch("box", { enabled })} />
          </Field>
          {box.enabled && (
            <>
              <Field label={label("boxColor", "رنگ")}>
                <Color value={box.color} onChange={(value) => patch("box", { color: value })} />
              </Field>
              <Field label={label("boxOpacity", "شفافیت")}>
                <Slider value={box.opacity} min={0} max={1} step={0.05} onChange={(opacity) => patch("box", { opacity })} />
              </Field>
              <Field label={label("boxPadding", "فاصلهٔ داخلی")}>
                <Slider value={box.padding} min={0} max={80} step={1} onChange={(padding) => patch("box", { padding })} />
              </Field>
              <Field label={label("boxRadius", "گردی گوشه")}>
                <Slider value={box.radius} min={0} max={80} step={1} onChange={(radius) => patch("box", { radius })} />
              </Field>
            </>
          )}
        </Group>

        <Group title={label("shadow", "سایه")}>
          <Field label={label("shadowEnabled", "نمایش سایه")}>
            <Check value={shadow.enabled} onChange={(enabled) => patch("shadow", { enabled })} />
          </Field>
          {shadow.enabled && (
            <>
              <Field label={label("shadowColor", "رنگ")}>
                <Color value={shadow.color} onChange={(value) => patch("shadow", { color: value })} />
              </Field>
              <Field label={label("shadowBlur", "محو بودن")}>
                <Slider value={shadow.blur} min={0} max={40} step={1} onChange={(blur) => patch("shadow", { blur })} />
              </Field>
              <Field label={label("shadowOffsetY", "جابه‌جایی عمودی")}>
                <Slider value={shadow.offsetY} min={-20} max={20} step={1} onChange={(offsetY) => patch("shadow", { offsetY })} />
              </Field>
              <Field label={label("shadowOpacity", "شفافیت")}>
                <Slider value={shadow.opacity} min={0} max={1} step={0.05} onChange={(opacity) => patch("shadow", { opacity })} />
              </Field>
            </>
          )}
        </Group>

        <Group title={label("animation", "انیمیشن")}>
          <Field label={label("entrance", "ورود")}>
            <Choice value={animation.entrance} options={ENTRANCES} label={(o) => names.entrance[o]} onChange={(entrance) => patch("animation", { entrance })} />
          </Field>
          <Field label={label("entranceMs", "مدت ورود (میلی‌ثانیه)")}>
            <Slider value={animation.entranceMs} min={0} max={800} step={10} onChange={(entranceMs) => patch("animation", { entranceMs })} />
          </Field>
          <Field label={label("exit", "خروج")}>
            <Choice value={animation.exit} options={EXITS} label={(o) => names.exit[o]} onChange={(exit) => patch("animation", { exit })} />
          </Field>
          <Field label={label("wordEffect", "اثر روی کلمهٔ در حال گفتن")}>
            <Choice value={animation.wordEffect} options={WORD_EFFECTS} label={(o) => names.wordEffect[o]} onChange={(wordEffect) => patch("animation", { wordEffect })} />
          </Field>
          {animation.wordEffect === "pop" && (
            <Field label={label("wordScale", "اندازهٔ بزرگ شدن")}>
              <Slider value={animation.wordScale} min={1} max={1.6} step={0.05} onChange={(wordScale) => patch("animation", { wordScale })} />
            </Field>
          )}
          {animation.wordEffect !== "none" && (
            <Field label={label("spokenStays", "کلمهٔ گفته‌شده رنگی بماند")}>
              <Check value={animation.spokenStays} onChange={(spokenStays) => patch("animation", { spokenStays })} />
            </Field>
          )}
        </Group>

        <details className="text-xs">
          <summary className="text-muted-foreground cursor-pointer">
            {label("advanced", "پیشرفته: JSON")}
          </summary>
          <textarea
            className="border-border bg-background mt-2 w-full rounded border p-2 font-mono text-xs"
            rows={10}
            dir="ltr"
            spellCheck={false}
            value={jsonDraft ?? JSON.stringify(config, null, 2)}
            onChange={(e) => {
              setJsonDraft(e.target.value);
              try {
                onChange(normalizeCaptionConfig(JSON.parse(e.target.value)));
              } catch {
                // Half-typed JSON: keep the last good look until it parses.
              }
            }}
            onBlur={() => setJsonDraft(null)}
          />
        </details>
      </div>
    </div>
  );
}
