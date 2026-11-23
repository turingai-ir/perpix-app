import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowCounterClockwiseIcon,
  CaretLeftIcon,
  CropIcon,
  CursorIcon,
  DownloadSimpleIcon,
  ImageIcon,
  PauseIcon,
  SparkleIcon,
  StackIcon,
  TextTIcon,
  VideoCameraIcon,
  WalletIcon,
} from "@phosphor-icons/react";
import { Button } from "@perpix/ui/components/button";
import { GlassSurface } from "@perpix/ui/components/glass-surface";

/* Static mock-ups comparing three directions; not shipped components. */
const meta = { title: "Design Directions" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const tools = [
  { icon: CursorIcon, label: "انتخاب" },
  { icon: CropIcon, label: "برش" },
  { icon: TextTIcon, label: "متن" },
  { icon: StackIcon, label: "لایه‌ها" },
];

/* A — Studio (Figma UI3 / CapCut): dark-first, floating glass chrome only over the canvas. */
export const A_Studio: Story = {
  name: "A · Studio (Figma / CapCut)",
  render: () => (
    <div className="dark relative mx-auto h-[44rem] max-w-md overflow-hidden rounded-overlay bg-background text-foreground">
      <div className="absolute inset-x-6 top-24 bottom-40 rounded-card bg-(image:--brand-gradient)" />
      <GlassSurface className="absolute inset-x-3 top-3 flex items-center gap-group p-1.5">
        <Button variant="plain" size="icon-sm" aria-label="واگرد">
          <ArrowCounterClockwiseIcon aria-hidden />
        </Button>
        <p className="flex-1 truncate text-body font-semibold">
          پروژهٔ تبلیغ پاییز
        </p>
        <Button variant="tinted" size="sm">
          <DownloadSimpleIcon aria-hidden />
          خروجی
        </Button>
      </GlassSurface>
      <GlassSurface className="absolute end-3 top-24 flex flex-col gap-1 p-1">
        {tools.map(({ icon: Icon, label }) => (
          <Button
            key={label}
            variant="plain"
            size="icon-sm"
            aria-label={label}
            className="text-foreground"
          >
            <Icon aria-hidden />
          </Button>
        ))}
      </GlassSurface>
      <GlassSurface className="absolute inset-x-3 bottom-3 flex flex-col gap-group p-inset">
        <div className="flex items-center gap-group">
          <Button size="icon" aria-label="توقف">
            <PauseIcon aria-hidden />
          </Button>
          <div className="relative h-10 flex-1 rounded-control bg-foreground/10">
            <div className="absolute inset-y-1 start-1 w-2/5 rounded-control bg-primary/40" />
            <div className="absolute inset-y-0 start-1/3 w-0.5 bg-foreground" />
          </div>
        </div>
        <p className="text-footnote text-muted-foreground">۰۰:۱۲ / ۰۰:۳۰</p>
      </GlassSurface>
    </div>
  ),
};

const rows = [
  { icon: ImageIcon, title: "تصویر محصول", meta: "۴ نسخه · دیروز" },
  { icon: VideoCameraIcon, title: "ویدیوی معرفی", meta: "۳۰ ثانیه · امروز" },
  { icon: SparkleIcon, title: "بنر کمپین", meta: "در حال ساخت" },
];

/* B — Minimal (Linear / Vercel): solid surfaces, hairline borders, high contrast. */
export const B_Minimal: Story = {
  name: "B · Minimal (Linear)",
  render: () => (
    <div className="mx-auto flex max-w-md flex-col gap-section p-inset-lg">
      <header className="flex items-center justify-between">
        <h2 className="text-title-3 font-semibold">پروژه‌ها</h2>
        <Button variant="tinted" size="sm">
          پروژهٔ جدید
        </Button>
      </header>
      <ul className="divide-y divide-border overflow-hidden rounded-card border border-border bg-card">
        {rows.map(({ icon: Icon, title, meta: info }) => (
          <li key={title} className="flex items-center gap-3 px-inset py-3">
            <span className="grid size-9 place-items-center rounded-control bg-muted">
              <Icon aria-hidden className="size-4" />
            </span>
            <div className="flex-1">
              <p className="text-body font-medium">{title}</p>
              <p className="text-footnote text-muted-foreground">{info}</p>
            </div>
            <CaretLeftIcon
              aria-hidden
              className="size-4 text-muted-foreground ltr:rotate-180"
            />
          </li>
        ))}
      </ul>
      <section className="flex flex-col gap-block rounded-overlay border border-border bg-card p-inset-lg shadow-raised">
        <h3 className="text-headline font-semibold">پروژه حذف شود؟</h3>
        <p className="text-body text-muted-foreground">
          این کار قابل بازگشت نیست.
        </p>
        <div className="flex justify-end gap-group">
          <Button
            variant="plain"
            className="border border-border bg-card text-foreground"
          >
            انصراف
          </Button>
          <Button variant="destructive">حذف</Button>
        </div>
      </section>
    </div>
  ),
};

const tiles = [
  "bg-(image:--brand-gradient)",
  "bg-accent-orange",
  "bg-accent-sky",
  "bg-accent-pink",
  "bg-accent-emerald",
  "bg-accent-violet",
  "bg-accent-gold",
  "bg-accent-blue",
];
const tabs = [
  { icon: ImageIcon, label: "گالری", active: true },
  { icon: SparkleIcon, label: "ساخت" },
  { icon: VideoCameraIcon, label: "استودیو" },
  { icon: WalletIcon, label: "کیف پول" },
];

/* D — Liquid Glass: content runs edge to edge; every chrome layer floats on it as glass. */
export const D_LiquidGlass: Story = {
  name: "D · Liquid Glass",
  render: () => (
    <div className="relative mx-auto h-[48rem] max-w-md overflow-hidden rounded-overlay bg-background">
      <div className="grid grid-cols-2 gap-2 p-2 pt-20 pb-28">
        {tiles.map((tile, index) => (
          <div
            key={tile}
            className={`${tile} ${index % 3 === 0 ? "aspect-[3/4]" : "aspect-square"} rounded-card`}
          />
        ))}
      </div>
      <GlassSurface className="absolute inset-x-3 top-3 flex items-center gap-group rounded-full p-1.5 ps-4">
        <p className="flex-1 text-headline font-semibold">گالری من</p>
        <Button size="icon-sm" className="rounded-full" aria-label="جستجو">
          <StackIcon aria-hidden />
        </Button>
        <Button variant="tinted" size="sm" className="rounded-full">
          <SparkleIcon aria-hidden />
          ساخت
        </Button>
      </GlassSurface>
      <GlassSurface className="absolute inset-x-6 bottom-24 flex items-center gap-3 p-inset">
        <span className="size-12 shrink-0 rounded-control bg-(image:--brand-gradient)" />
        <div className="flex-1">
          <p className="text-body font-semibold">در حال ساخت ویدیو…</p>
          <p className="text-footnote text-muted-foreground">
            ۶۰٪ · حدود ۲۰ ثانیه
          </p>
        </div>
        <Button size="icon-sm" className="rounded-full" aria-label="توقف">
          <PauseIcon aria-hidden />
        </Button>
      </GlassSurface>
      <GlassSurface className="absolute inset-x-6 bottom-4 flex justify-around rounded-full p-1.5">
        {tabs.map(({ icon: Icon, label, active }) => (
          <span
            key={label}
            className={`flex flex-col items-center gap-0.5 rounded-full px-4 py-1.5 text-caption ${active ? "bg-foreground/10 font-semibold text-primary" : "text-muted-foreground"}`}
          >
            <Icon
              aria-hidden
              weight={active ? "fill" : "regular"}
              className="size-5"
            />
            {label}
          </span>
        ))}
      </GlassSurface>
    </div>
  ),
};

/* C — Bento + Aurora: tiled dashboard, soft brand glow behind, one glass accent tile. */
export const C_Bento: Story = {
  name: "C · Bento + Aurora",
  render: () => (
    <div className="relative mx-auto max-w-md overflow-hidden p-inset-lg">
      <div
        aria-hidden
        className="absolute -start-10 -top-16 size-64 rounded-full bg-accent-violet/40 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -end-16 top-40 size-64 rounded-full bg-accent-pink/30 blur-3xl"
      />
      <div className="relative grid grid-cols-2 gap-3">
        <GlassSurface className="col-span-2 flex items-center justify-between p-inset-lg">
          <div>
            <p className="text-footnote text-muted-foreground">
              اعتبار باقی‌مانده
            </p>
            <p className="text-title-1 font-bold">۱۲۰</p>
          </div>
          <Button variant="tinted" size="sm">
            <WalletIcon aria-hidden />
            شارژ
          </Button>
        </GlassSurface>
        <div className="row-span-2 flex flex-col justify-end gap-1 rounded-card bg-(image:--brand-gradient) p-inset text-night-foreground">
          <SparkleIcon aria-hidden className="size-5" />
          <p className="text-headline font-semibold">ساخت تصویر</p>
          <p className="text-footnote opacity-90">از متن به تصویر</p>
        </div>
        <div className="flex flex-col gap-1 rounded-card border border-border bg-card p-inset">
          <VideoCameraIcon aria-hidden className="size-5 text-primary" />
          <p className="text-body font-semibold">ویدیو</p>
        </div>
        <div className="flex flex-col gap-1 rounded-card border border-border bg-card p-inset">
          <TextTIcon aria-hidden className="size-5 text-primary" />
          <p className="text-body font-semibold">زیرنویس</p>
        </div>
      </div>
    </div>
  ),
};
