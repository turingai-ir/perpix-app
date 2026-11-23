import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CursorIcon,
  CropIcon,
  TextTIcon,
  SparkleIcon,
  PlayIcon,
} from "@phosphor-icons/react";
import { GlassSurface } from "@perpix/ui/components/glass-surface";
import { Button } from "@perpix/ui/components/button";

const meta = {
  title: "Components/GlassSurface",
  component: GlassSurface,
  args: { intensity: "soft" },
  argTypes: {
    intensity: { control: "inline-radio", options: ["soft", "flat"] },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-section p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GlassSurface>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Soft: Story = {
  render: (args) => (
    <GlassSurface {...args} className="w-full max-w-sm p-inset-lg">
      <div className="flex flex-col gap-group">
        <div className="flex items-center justify-between">
          <span className="text-title-3 font-semibold">استودیو پرپیکس</span>
          <span className="rounded-control bg-accent/20 px-2 py-0.5 text-caption font-medium text-accent-foreground">
            پروژه جدید
          </span>
        </div>
        <p className="text-body text-muted-foreground">
          سطح شیشه‌ای مایع با بازتاب نور محیطی و شکست رنگ‌های پس‌زمینه.
        </p>
        <div className="mt-2 flex gap-group">
          <Button variant="tinted" size="sm">
            شروع تولید
          </Button>
          <Button variant="glass" size="sm">
            پیش‌نمایش
          </Button>
        </div>
      </div>
    </GlassSurface>
  ),
};

export const Flat: Story = {
  args: { intensity: "flat" },
  render: (args) => (
    <GlassSurface {...args} className="w-full max-w-sm p-inset-lg">
      <div className="flex flex-col gap-group">
        <span className="text-title-3 font-semibold">
          حالت فلت (Flat Glass)
        </span>
        <p className="text-body text-muted-foreground">
          مناسب برای قرارگیری روی ویدیوی در حال پخش یا بوم گرافیکی فعال بدون
          افکت بلور سنگین.
        </p>
      </div>
    </GlassSurface>
  ),
};

export const FloatingToolbar: Story = {
  render: () => (
    <GlassSurface className="flex items-center gap-1 rounded-full p-1.5 shadow-overlay">
      <Button variant="plain" size="icon" aria-label="انتخاب">
        <CursorIcon size={20} />
      </Button>
      <Button variant="plain" size="icon" aria-label="برش">
        <CropIcon size={20} />
      </Button>
      <Button variant="plain" size="icon" aria-label="متن">
        <TextTIcon size={20} />
      </Button>
      <div className="mx-1 h-5 w-px bg-border/60" />
      <Button variant="tinted" size="sm" className="gap-1.5 rounded-full">
        <SparkleIcon size={16} />
        تولید هوشمند
      </Button>
      <Button
        variant="glass"
        size="icon"
        aria-label="پخش"
        className="rounded-full"
      >
        <PlayIcon size={18} />
      </Button>
    </GlassSurface>
  ),
};
