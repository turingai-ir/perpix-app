import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Copy, Pause, Play, Plus, Trash2 } from "lucide-react";
import {
  AFTER,
  ALIGNS,
  ANCHORS,
  DECORATION_KINDS,
  DEFAULT_ANIMATOR,
  DEFAULT_DECORATION,
  EASES,
  FROM,
  MAX_ANIMATORS,
  MAX_DECORATIONS,
  MAX_ROLES,
  POSITIONS,
  PROPS,
  REFERENCE_TEMPLATES,
  REVEALS,
  RULE_WHEN,
  SAFE_ZONES,
  SAMPLE_WORDS,
  SCOPES,
  TRIGGERS,
  WORD_STATES,
  normalizeTemplate,
  sampleDurationMs,
  type Animator,
  type CaptionTemplate,
  type Decoration,
  type PropName,
  type RoleStyle,
  type StateStyle,
  type WordStateName,
} from "@perpix/caption-renderer";
import { CaptionPreview } from "@perpix/caption-renderer/react";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";

interface CaptionTemplateEditorProps {
  template: CaptionTemplate;
  onChange: (template: CaptionTemplate) => void;
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

function OptColor({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string;
  value: string | undefined;
  fallback: string;
  onChange: (value: string | undefined) => void;
}) {
  return (
    <Field label={label}>
      <span className="flex items-center gap-2">
        <Check
          value={value !== undefined}
          onChange={(on) => onChange(on ? fallback : undefined)}
        />
        {value !== undefined && <Color value={value} onChange={onChange} />}
      </span>
    </Field>
  );
}

function OptSlider({
  label,
  value,
  fallback,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number | undefined;
  fallback: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number | undefined) => void;
}) {
  return (
    <Field label={label}>
      <span className="flex items-center gap-2">
        <Check
          value={value !== undefined}
          onChange={(on) => onChange(on ? fallback : undefined)}
        />
        {value !== undefined && (
          <Slider
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
          />
        )}
      </span>
    </Field>
  );
}

function Multi<T extends string>({
  options,
  value,
  label,
  onChange,
}: {
  options: readonly T[];
  value: readonly T[];
  label: (option: T) => string;
  onChange: (value: T[]) => void;
}) {
  return (
    <span className="flex flex-wrap justify-end gap-x-3 gap-y-1">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={value.includes(option)}
            onChange={(e) =>
              onChange(
                e.target.checked
                  ? [...value, option]
                  : value.filter((item) => item !== option),
              )
            }
            className="size-3.5 cursor-pointer"
          />
          {label(option)}
        </label>
      ))}
    </span>
  );
}

function NumberBox({
  value,
  step,
  onChange,
}: {
  value: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="number"
      value={value}
      step={step}
      dir="ltr"
      onChange={(e) => {
        const next = Number(e.target.value);
        if (Number.isFinite(next)) onChange(next);
      }}
      className={`${controlClass} w-16`}
    />
  );
}

function Card({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="border-border space-y-2 rounded border p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">{title}</span>
        <span className="flex gap-1">{actions}</span>
      </div>
      {children}
    </div>
  );
}

function IconButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="size-7 cursor-pointer p-0"
    >
      {children}
    </Button>
  );
}

const NAMES = {
  anchor: { top: "بالا", middle: "وسط", bottom: "پایین" },
  align: { center: "وسط", left: "چپ", right: "راست" },
  safeZone: { none: "بدون", reels: "ریلز و تیک‌تاک" },
  state: { upcoming: "هنوز نگفته", active: "در حال گفتن", spoken: "گفته‌شده" },
  scope: { page: "کل نمایش", line: "هر خط", word: "هر کلمه" },
  position: {
    any: "همه",
    first: "اولی",
    last: "آخری",
    odd: "فرد",
    even: "زوج",
  },
  trigger: {
    enter: "ورود",
    exit: "خروج",
    active: "هنگام گفتن کلمه",
    loop: "تکرار",
  },
  from: { page: "از شروع نمایش", word: "از شروع کلمه" },
  after: { revert: "برگردد", keep: "بماند" },
  prop: {
    opacity: "شفافیت",
    scale: "مقیاس",
    x: "افقی",
    y: "عمودی",
    rotate: "چرخش",
  },
  kind: {
    pill: "قرص",
    underline: "زیرخط",
    marker: "ماژیک",
    wipe: "پر شدن (کاراوکه)",
  },
  reveal: { fade: "محو", sweep: "کشیده شدن" },
  when: { number: "عدد", longest: "بلندترین کلمه", last: "آخرین کلمه" },
} as const;

const PROP_DEFAULTS: Record<PropName, [number, number]> = {
  opacity: [0, 1],
  scale: [0.8, 1],
  x: [0.3, 0],
  y: [0.3, 0],
  rotate: [-5, 0],
};

const PROP_STEPS: Record<PropName, number> = {
  opacity: 0.1,
  scale: 0.05,
  x: 0.05,
  y: 0.05,
  rotate: 1,
};

const ROLE_NAMES = ["key", "accent", "soft", "alert", "brand", "dim", "pop"];

/**
 * Builds a caption template with controls and shows it on sample words, drawn
 * by the renderer the user's app exports with, so what is seen here is what
 * users get.
 */
export function CaptionTemplateEditor({
  template,
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

  /** Applies a change to a copy and keeps the result valid. */
  const edit = (change: (draft: CaptionTemplate) => void) => {
    const draft = structuredClone(template);
    change(draft);
    onChange(normalizeTemplate(draft));
  };

  const size = FRAMES[frame];
  const { base, layout, box, states, roles, roleRules, emoji } = template;
  const roleNames = Object.keys(roles);
  const roleOptions = ["normal", ...roleNames];

  const setAnimator = (index: number, change: (a: Animator) => void) =>
    edit((draft) => {
      const target = draft.animators[index];
      if (target) change(target);
    });
  const setDecoration = (index: number, change: (d: Decoration) => void) =>
    edit((draft) => {
      const target = draft.decorations[index];
      if (target) change(target);
    });
  const setRole = (name: string, change: (r: RoleStyle) => void) =>
    edit((draft) => {
      const target = draft.roles[name];
      if (target) change(target);
    });
  const setState = (name: WordStateName, change: (s: StateStyle) => void) =>
    edit((draft) => change(draft.states[name]));

  const setOpt = <T extends object, K extends keyof T>(
    target: T,
    key: K,
    value: T[K] | undefined,
  ) => {
    if (value === undefined) delete target[key];
    else target[key] = value;
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
      <div className="space-y-3 lg:sticky lg:top-0 lg:self-start">
        <div className="mx-auto" style={{ width: size.width }}>
          <CaptionPreview
            template={template}
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
        <Group title={label("starter", "شروع از قالب مرجع")}>
          <Choice
            value=""
            options={["", ...Object.keys(REFERENCE_TEMPLATES)]}
            label={(o) =>
              o === ""
                ? label("starterPick", "یک قالب انتخاب کن…")
                : (REFERENCE_TEMPLATES[o]?.title ?? o)
            }
            onChange={(o) => {
              const reference = REFERENCE_TEMPLATES[o];
              if (reference) onChange(structuredClone(reference.template));
            }}
          />
        </Group>

        <Group title={label("font", "قلم و متن")}>
          <Field label={label("fontFamily", "قلم")}>
            <Choice
              value={base.font.family}
              options={
                FONTS.includes(base.font.family)
                  ? FONTS
                  : [base.font.family, ...FONTS]
              }
              label={(o) => o}
              onChange={(v) => edit((d) => void (d.base.font.family = v))}
            />
          </Field>
          <Field label={label("fontSize", "اندازه")}>
            <Slider
              value={base.font.size}
              min={24}
              max={160}
              step={1}
              onChange={(v) => edit((d) => void (d.base.font.size = v))}
            />
          </Field>
          <Field label={label("fontWeight", "ضخامت")}>
            <Slider
              value={base.font.weight}
              min={300}
              max={900}
              step={100}
              onChange={(v) => edit((d) => void (d.base.font.weight = v))}
            />
          </Field>
          <Field label={label("italic", "کج")}>
            <Check
              value={base.font.italic}
              onChange={(v) => edit((d) => void (d.base.font.italic = v))}
            />
          </Field>
          <Field label={label("uppercase", "حروف بزرگ (لاتین)")}>
            <Check
              value={base.text.uppercase}
              onChange={(v) => edit((d) => void (d.base.text.uppercase = v))}
            />
          </Field>
          <Field label={label("lineHeight", "فاصلهٔ خطوط")}>
            <Slider
              value={base.text.lineHeight}
              min={0.9}
              max={2}
              step={0.05}
              onChange={(v) => edit((d) => void (d.base.text.lineHeight = v))}
            />
          </Field>
          <Field label={label("align", "چینش")}>
            <Choice
              value={base.text.align}
              options={ALIGNS}
              label={(o) => NAMES.align[o]}
              onChange={(v) => edit((d) => void (d.base.text.align = v))}
            />
          </Field>
        </Group>

        <Group title={label("fill", "رنگ، حاشیه و سایه")}>
          <Field label={label("textColor", "رنگ متن")}>
            <Color
              value={base.fill.color}
              onChange={(v) => edit((d) => void (d.base.fill.color = v))}
            />
          </Field>
          <Field label={label("gradientEnabled", "گرادیان روی متن")}>
            <Check
              value={base.fill.gradient.enabled}
              onChange={(v) =>
                edit((d) => void (d.base.fill.gradient.enabled = v))
              }
            />
          </Field>
          {base.fill.gradient.enabled && (
            <>
              <Field label={label("gradientFrom", "رنگ بالا")}>
                <Color
                  value={base.fill.gradient.from}
                  onChange={(v) =>
                    edit((d) => void (d.base.fill.gradient.from = v))
                  }
                />
              </Field>
              <Field label={label("gradientTo", "رنگ پایین")}>
                <Color
                  value={base.fill.gradient.to}
                  onChange={(v) =>
                    edit((d) => void (d.base.fill.gradient.to = v))
                  }
                />
              </Field>
            </>
          )}
          <Field label={label("strokeColor", "رنگ حاشیه")}>
            <Color
              value={base.stroke.color}
              onChange={(v) => edit((d) => void (d.base.stroke.color = v))}
            />
          </Field>
          <Field label={label("strokeWidth", "ضخامت حاشیه")}>
            <Slider
              value={base.stroke.width}
              min={0}
              max={20}
              step={1}
              onChange={(v) => edit((d) => void (d.base.stroke.width = v))}
            />
          </Field>
          <Field label={label("shadowEnabled", "سایه یا درخشش")}>
            <Check
              value={base.shadow.enabled}
              onChange={(v) => edit((d) => void (d.base.shadow.enabled = v))}
            />
          </Field>
          {base.shadow.enabled && (
            <>
              <Field label={label("shadowColor", "رنگ سایه")}>
                <Color
                  value={base.shadow.color}
                  onChange={(v) => edit((d) => void (d.base.shadow.color = v))}
                />
              </Field>
              <Field label={label("shadowBlur", "محو بودن")}>
                <Slider
                  value={base.shadow.blur}
                  min={0}
                  max={40}
                  step={1}
                  onChange={(v) => edit((d) => void (d.base.shadow.blur = v))}
                />
              </Field>
              <Field
                label={label("shadowOffsetY", "جابه‌جایی عمودی (۰ = درخشش)")}
              >
                <Slider
                  value={base.shadow.offsetY}
                  min={-20}
                  max={20}
                  step={1}
                  onChange={(v) =>
                    edit((d) => void (d.base.shadow.offsetY = v))
                  }
                />
              </Field>
              <Field label={label("shadowOpacity", "شفافیت")}>
                <Slider
                  value={base.shadow.opacity}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={(v) =>
                    edit((d) => void (d.base.shadow.opacity = v))
                  }
                />
              </Field>
            </>
          )}
        </Group>

        <Group title={label("position", "چیدمان")}>
          <Field label={label("anchor", "محل")}>
            <Choice
              value={layout.anchor}
              options={ANCHORS}
              label={(o) => NAMES.anchor[o]}
              onChange={(v) => edit((d) => void (d.layout.anchor = v))}
            />
          </Field>
          <Field label={label("offset", "فاصله از لبه")}>
            <Slider
              value={layout.offset}
              min={0}
              max={0.4}
              step={0.01}
              onChange={(v) => edit((d) => void (d.layout.offset = v))}
            />
          </Field>
          <Field label={label("maxWidth", "بیشترین پهنا")}>
            <Slider
              value={layout.maxWidth}
              min={0.4}
              max={1}
              step={0.02}
              onChange={(v) => edit((d) => void (d.layout.maxWidth = v))}
            />
          </Field>
          <Field label={label("wordsPerPage", "تعداد کلمه در هر نمایش")}>
            <Slider
              value={layout.wordsPerPage}
              min={1}
              max={10}
              step={1}
              onChange={(v) => edit((d) => void (d.layout.wordsPerPage = v))}
            />
          </Field>
          <Field
            label={label("pauseMs", "مکثی که نمایش را می‌شکند (میلی‌ثانیه)")}
          >
            <Slider
              value={layout.pauseMs}
              min={200}
              max={2000}
              step={50}
              onChange={(v) => edit((d) => void (d.layout.pauseMs = v))}
            />
          </Field>
          <Field label={label("safeZone", "منطقهٔ امن")}>
            <Choice
              value={layout.safeZone}
              options={SAFE_ZONES}
              label={(o) => NAMES.safeZone[o]}
              onChange={(v) => edit((d) => void (d.layout.safeZone = v))}
            />
          </Field>
          <Field label={label("boxEnabled", "جعبهٔ پشت متن")}>
            <Check
              value={box.enabled}
              onChange={(v) => edit((d) => void (d.box.enabled = v))}
            />
          </Field>
          {box.enabled && (
            <>
              <Field label={label("boxColor", "رنگ جعبه")}>
                <Color
                  value={box.color}
                  onChange={(v) => edit((d) => void (d.box.color = v))}
                />
              </Field>
              <Field label={label("boxOpacity", "شفافیت")}>
                <Slider
                  value={box.opacity}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={(v) => edit((d) => void (d.box.opacity = v))}
                />
              </Field>
              <Field label={label("boxPadding", "فاصلهٔ داخلی")}>
                <Slider
                  value={box.padding}
                  min={0}
                  max={80}
                  step={1}
                  onChange={(v) => edit((d) => void (d.box.padding = v))}
                />
              </Field>
              <Field label={label("boxRadius", "گردی گوشه")}>
                <Slider
                  value={box.radius}
                  min={0}
                  max={80}
                  step={1}
                  onChange={(v) => edit((d) => void (d.box.radius = v))}
                />
              </Field>
            </>
          )}
        </Group>

        <Group title={label("states", "حالت کلمه (نسبت به زمان گفتن)")}>
          {WORD_STATES.map((name) => {
            const state = states[name];
            return (
              <Card key={name} title={NAMES.state[name]}>
                <OptColor
                  label={label("stateColor", "رنگ")}
                  value={state.color}
                  fallback="#ffd400"
                  onChange={(v) => setState(name, (s) => setOpt(s, "color", v))}
                />
                <OptSlider
                  label={label("stateOpacity", "شفافیت")}
                  value={state.opacity}
                  fallback={0.6}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={(v) =>
                    setState(name, (s) => setOpt(s, "opacity", v))
                  }
                />
                <OptSlider
                  label={label("stateScale", "مقیاس")}
                  value={state.scale}
                  fallback={1.1}
                  min={0.6}
                  max={1.6}
                  step={0.05}
                  onChange={(v) => setState(name, (s) => setOpt(s, "scale", v))}
                />
                <OptColor
                  label={label("stateStroke", "رنگ حاشیه")}
                  value={state.strokeColor}
                  fallback="#000000"
                  onChange={(v) =>
                    setState(name, (s) => setOpt(s, "strokeColor", v))
                  }
                />
              </Card>
            );
          })}
        </Group>

        <Group title={label("roles", "نقش‌ها (مثل کلمهٔ کلیدی)")}>
          {roleNames.map((name) => {
            const role = roles[name] ?? {};
            return (
              <Card
                key={name}
                title={name}
                actions={
                  <IconButton
                    label={label("remove", "حذف")}
                    onClick={() =>
                      edit((d) => {
                        delete d.roles[name];
                        d.roleRules = d.roleRules.filter(
                          (r) => r.role !== name,
                        );
                      })
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </IconButton>
                }
              >
                <OptColor
                  label={label("roleColor", "رنگ")}
                  value={role.color}
                  fallback="#ff4d6d"
                  onChange={(v) => setRole(name, (r) => setOpt(r, "color", v))}
                />
                <OptSlider
                  label={label("roleScale", "اندازه نسبت به بقیه")}
                  value={role.scale}
                  fallback={1.3}
                  min={0.6}
                  max={2}
                  step={0.05}
                  onChange={(v) => setRole(name, (r) => setOpt(r, "scale", v))}
                />
                <OptSlider
                  label={label("roleWeight", "ضخامت")}
                  value={role.weight}
                  fallback={900}
                  min={300}
                  max={900}
                  step={100}
                  onChange={(v) => setRole(name, (r) => setOpt(r, "weight", v))}
                />
                <OptSlider
                  label={label("roleStroke", "ضخامت حاشیه")}
                  value={role.strokeWidth}
                  fallback={8}
                  min={0}
                  max={20}
                  step={1}
                  onChange={(v) =>
                    setRole(name, (r) => setOpt(r, "strokeWidth", v))
                  }
                />
                <Field label={label("roleItalic", "کج")}>
                  <Check
                    value={role.italic ?? false}
                    onChange={(v) => setRole(name, (r) => void (r.italic = v))}
                  />
                </Field>
                <Field label={label("roleUppercase", "حروف بزرگ (لاتین)")}>
                  <Check
                    value={role.uppercase ?? false}
                    onChange={(v) =>
                      setRole(name, (r) => void (r.uppercase = v))
                    }
                  />
                </Field>
              </Card>
            );
          })}
          {roleNames.length < MAX_ROLES && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer gap-1"
              onClick={() => {
                const name = ROLE_NAMES.find((n) => !(n in roles));
                if (name)
                  edit(
                    (d) =>
                      void (d.roles[name] = {
                        color: "#ff4d6d",
                        scale: 1.3,
                        weight: 900,
                      }),
                  );
              }}
            >
              <Plus className="size-3.5" />
              {label("addRole", "نقش جدید")}
            </Button>
          )}
          {roleNames.length > 0 && (
            <>
              <p className="text-muted-foreground text-xs">
                {label(
                  "rulesHint",
                  "کلمه‌ها به‌ترتیب قاعده‌ها نقش می‌گیرند؛ کلمه‌ای که دستی علامت خورده نقش خودش را دارد.",
                )}
              </p>
              {roleRules.map((rule, index) => (
                <Card
                  key={index}
                  title={`${label("rule", "قاعده")} ${index + 1}`}
                  actions={
                    <IconButton
                      label={label("remove", "حذف")}
                      onClick={() =>
                        edit((d) => void d.roleRules.splice(index, 1))
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </IconButton>
                  }
                >
                  <Field label={label("ruleRole", "نقش")}>
                    <Choice
                      value={rule.role}
                      options={roleNames}
                      label={(o) => o}
                      onChange={(v) =>
                        edit((d) => {
                          const r = d.roleRules[index];
                          if (r) r.role = v;
                        })
                      }
                    />
                  </Field>
                  <Field label={label("ruleWhen", "وقتی")}>
                    <Choice
                      value={rule.when}
                      options={RULE_WHEN}
                      label={(o) => NAMES.when[o]}
                      onChange={(v) =>
                        edit((d) => {
                          const r = d.roleRules[index];
                          if (r) r.when = v;
                        })
                      }
                    />
                  </Field>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer gap-1"
                onClick={() =>
                  edit(
                    (d) =>
                      void d.roleRules.push({
                        role: roleNames[0] ?? "key",
                        when: "longest",
                      }),
                  )
                }
              >
                <Plus className="size-3.5" />
                {label("addRule", "قاعدهٔ جدید")}
              </Button>
            </>
          )}
          <Field label={label("emoji", "نمایش ایموجی کلمه‌ها")}>
            <Check
              value={emoji.enabled}
              onChange={(v) => edit((d) => void (d.emoji.enabled = v))}
            />
          </Field>
          {emoji.enabled && (
            <Field label={label("emojiSize", "اندازهٔ ایموجی")}>
              <Slider
                value={emoji.size}
                min={0.4}
                max={2}
                step={0.05}
                onChange={(v) => edit((d) => void (d.emoji.size = v))}
              />
            </Field>
          )}
        </Group>

        <Group title={label("animators", "انیماتورها")}>
          {template.animators.map((animator, index) => (
            <Card
              key={index}
              title={`${NAMES.scope[animator.select.scope]} · ${NAMES.trigger[animator.trigger]}`}
              actions={
                <>
                  <IconButton
                    label={label("duplicate", "کپی")}
                    onClick={() =>
                      edit((d) => {
                        const a = d.animators[index];
                        if (a)
                          d.animators.splice(index + 1, 0, structuredClone(a));
                      })
                    }
                  >
                    <Copy className="size-3.5" />
                  </IconButton>
                  <IconButton
                    label={label("remove", "حذف")}
                    onClick={() =>
                      edit((d) => void d.animators.splice(index, 1))
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </IconButton>
                </>
              }
            >
              <Field label={label("scope", "روی چه چیزی")}>
                <Choice
                  value={animator.select.scope}
                  options={SCOPES}
                  label={(o) => NAMES.scope[o]}
                  onChange={(v) =>
                    setAnimator(index, (a) => void (a.select.scope = v))
                  }
                />
              </Field>
              <Field label={label("trigger", "چه وقت")}>
                <Choice
                  value={animator.trigger}
                  options={TRIGGERS}
                  label={(o) => NAMES.trigger[o]}
                  onChange={(v) =>
                    setAnimator(index, (a) => void (a.trigger = v))
                  }
                />
              </Field>
              {animator.trigger === "enter" &&
                animator.select.scope === "word" && (
                  <Field label={label("from", "شروع")}>
                    <Choice
                      value={animator.from}
                      options={FROM}
                      label={(o) => NAMES.from[o]}
                      onChange={(v) =>
                        setAnimator(index, (a) => void (a.from = v))
                      }
                    />
                  </Field>
                )}
              {animator.select.scope === "word" && (
                <>
                  <Field label={label("selRoles", "فقط نقش‌های")}>
                    <Multi
                      options={roleOptions}
                      value={animator.select.roles}
                      label={(o) => o}
                      onChange={(v) =>
                        setAnimator(index, (a) => void (a.select.roles = v))
                      }
                    />
                  </Field>
                  {animator.trigger !== "active" && (
                    <Field label={label("selStates", "فقط حالت‌های")}>
                      <Multi
                        options={WORD_STATES}
                        value={animator.select.states}
                        label={(o) => NAMES.state[o]}
                        onChange={(v) =>
                          setAnimator(index, (a) => void (a.select.states = v))
                        }
                      />
                    </Field>
                  )}
                </>
              )}
              <Field label={label("position", "جایگاه")}>
                <Choice
                  value={animator.select.position}
                  options={POSITIONS}
                  label={(o) => NAMES.position[o]}
                  onChange={(v) =>
                    setAnimator(index, (a) => void (a.select.position = v))
                  }
                />
              </Field>
              {animator.trigger === "loop" ? (
                <Field label={label("period", "دوره (میلی‌ثانیه)")}>
                  <Slider
                    value={animator.periodMs}
                    min={200}
                    max={4000}
                    step={50}
                    onChange={(v) =>
                      setAnimator(index, (a) => void (a.periodMs = v))
                    }
                  />
                </Field>
              ) : (
                <Field label={label("duration", "مدت (میلی‌ثانیه)")}>
                  <Slider
                    value={animator.durationMs}
                    min={0}
                    max={1500}
                    step={10}
                    onChange={(v) =>
                      setAnimator(index, (a) => void (a.durationMs = v))
                    }
                  />
                </Field>
              )}
              <Field label={label("delay", "تأخیر")}>
                <Slider
                  value={animator.delayMs}
                  min={0}
                  max={1500}
                  step={10}
                  onChange={(v) =>
                    setAnimator(index, (a) => void (a.delayMs = v))
                  }
                />
              </Field>
              <Field label={label("stagger", "فاصلهٔ بین واحدها")}>
                <Slider
                  value={animator.staggerMs}
                  min={0}
                  max={500}
                  step={10}
                  onChange={(v) =>
                    setAnimator(index, (a) => void (a.staggerMs = v))
                  }
                />
              </Field>
              <Field label={label("ease", "منحنی")}>
                <Choice
                  value={animator.ease}
                  options={EASES}
                  label={(o) => o}
                  onChange={(v) => setAnimator(index, (a) => void (a.ease = v))}
                />
              </Field>
              {animator.trigger === "active" && (
                <Field label={label("after", "بعد از گفتن کلمه")}>
                  <Choice
                    value={animator.after}
                    options={AFTER}
                    label={(o) => NAMES.after[o]}
                    onChange={(v) =>
                      setAnimator(index, (a) => void (a.after = v))
                    }
                  />
                </Field>
              )}
              {PROPS.map((prop) => {
                const range = animator.props[prop];
                return (
                  <Field key={prop} label={NAMES.prop[prop]}>
                    <span className="flex items-center gap-2" dir="ltr">
                      <Check
                        value={range !== undefined}
                        onChange={(on) =>
                          setAnimator(index, (a) => {
                            if (on) a.props[prop] = [...PROP_DEFAULTS[prop]];
                            else delete a.props[prop];
                          })
                        }
                      />
                      {range && (
                        <>
                          <NumberBox
                            value={range[0]}
                            step={PROP_STEPS[prop]}
                            onChange={(v) =>
                              setAnimator(index, (a) => {
                                const r = a.props[prop];
                                if (r) r[0] = v;
                              })
                            }
                          />
                          <span>→</span>
                          <NumberBox
                            value={range[1]}
                            step={PROP_STEPS[prop]}
                            onChange={(v) =>
                              setAnimator(index, (a) => {
                                const r = a.props[prop];
                                if (r) r[1] = v;
                              })
                            }
                          />
                        </>
                      )}
                    </span>
                  </Field>
                );
              })}
              <Field label={label("jitterRotate", "چرخش تصادفی (درجه)")}>
                <Slider
                  value={animator.jitter.rotate}
                  min={0}
                  max={30}
                  step={1}
                  onChange={(v) =>
                    setAnimator(index, (a) => void (a.jitter.rotate = v))
                  }
                />
              </Field>
              <Field label={label("jitterY", "جابه‌جایی عمودی تصادفی")}>
                <Slider
                  value={animator.jitter.y}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={(v) =>
                    setAnimator(index, (a) => void (a.jitter.y = v))
                  }
                />
              </Field>
              {(animator.jitter.rotate > 0 ||
                animator.jitter.y > 0 ||
                animator.jitter.x > 0 ||
                animator.jitter.scale > 0) && (
                <Field label={label("seed", "seed تصادف")}>
                  <Slider
                    value={animator.seed}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(v) =>
                      setAnimator(index, (a) => void (a.seed = v))
                    }
                  />
                </Field>
              )}
            </Card>
          ))}
          {template.animators.length < MAX_ANIMATORS && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer gap-1"
              onClick={() =>
                edit(
                  (d) =>
                    void d.animators.push(structuredClone(DEFAULT_ANIMATOR)),
                )
              }
            >
              <Plus className="size-3.5" />
              {label("addAnimator", "انیماتور جدید")}
            </Button>
          )}
        </Group>

        <Group
          title={label(
            "decorations",
            "دکوراسیون‌ها (قرص، زیرخط، ماژیک، کاراوکه)",
          )}
        >
          {template.decorations.map((decoration, index) => (
            <Card
              key={index}
              title={NAMES.kind[decoration.kind]}
              actions={
                <IconButton
                  label={label("remove", "حذف")}
                  onClick={() =>
                    edit((d) => void d.decorations.splice(index, 1))
                  }
                >
                  <Trash2 className="size-3.5" />
                </IconButton>
              }
            >
              <Field label={label("kind", "نوع")}>
                <Choice
                  value={decoration.kind}
                  options={DECORATION_KINDS}
                  label={(o) => NAMES.kind[o]}
                  onChange={(v) =>
                    setDecoration(index, (x) => void (x.kind = v))
                  }
                />
              </Field>
              <Field label={label("decoStates", "در حالت‌های")}>
                <Multi
                  options={WORD_STATES}
                  value={decoration.select.states}
                  label={(o) => NAMES.state[o]}
                  onChange={(v) =>
                    setDecoration(index, (x) => void (x.select.states = v))
                  }
                />
              </Field>
              <Field label={label("selRoles", "فقط نقش‌های")}>
                <Multi
                  options={roleOptions}
                  value={decoration.select.roles}
                  label={(o) => o}
                  onChange={(v) =>
                    setDecoration(index, (x) => void (x.select.roles = v))
                  }
                />
              </Field>
              <Field label={label("decoColor", "رنگ")}>
                <Color
                  value={decoration.color}
                  onChange={(v) =>
                    setDecoration(index, (x) => void (x.color = v))
                  }
                />
              </Field>
              <Field label={label("decoSize", "ضخامت یا فاصله")}>
                <Slider
                  value={decoration.size}
                  min={0}
                  max={40}
                  step={1}
                  onChange={(v) =>
                    setDecoration(index, (x) => void (x.size = v))
                  }
                />
              </Field>
              <Field label={label("decoRadius", "گردی")}>
                <Slider
                  value={decoration.radius}
                  min={0}
                  max={40}
                  step={1}
                  onChange={(v) =>
                    setDecoration(index, (x) => void (x.radius = v))
                  }
                />
              </Field>
              {decoration.kind !== "wipe" && (
                <Field label={label("reveal", "ظاهر شدن")}>
                  <Choice
                    value={decoration.reveal}
                    options={REVEALS}
                    label={(o) => NAMES.reveal[o]}
                    onChange={(v) =>
                      setDecoration(index, (x) => void (x.reveal = v))
                    }
                  />
                </Field>
              )}
            </Card>
          ))}
          {template.decorations.length < MAX_DECORATIONS && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer gap-1"
              onClick={() =>
                edit(
                  (d) =>
                    void d.decorations.push(
                      structuredClone(DEFAULT_DECORATION),
                    ),
                )
              }
            >
              <Plus className="size-3.5" />
              {label("addDecoration", "دکوراسیون جدید")}
            </Button>
          )}
        </Group>

        <details className="text-xs">
          <summary className="text-muted-foreground cursor-pointer">
            {label("advanced", "پیشرفته: JSON")}
          </summary>
          <textarea
            className="border-border bg-background mt-2 w-full rounded border p-2 font-mono text-xs"
            rows={12}
            dir="ltr"
            spellCheck={false}
            value={jsonDraft ?? JSON.stringify(template, null, 2)}
            onChange={(e) => {
              setJsonDraft(e.target.value);
              try {
                onChange(normalizeTemplate(JSON.parse(e.target.value)));
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
