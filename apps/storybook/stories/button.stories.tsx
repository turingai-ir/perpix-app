import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  PlusIcon,
  SparkleIcon,
  TrashIcon,
  ArrowLeftIcon,
  CheckIcon,
  PlayIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react";
import { Button } from "@perpix/ui/components/button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "دکمه شیشه‌ای" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "glass",
        "tinted",
        "brand",
        "success",
        "destructive",
        "outline",
        "subtle",
        "plain",
      ],
    },
    shape: {
      control: "inline-radio",
      options: ["rounded", "pill"],
    },
    size: {
      control: "select",
      options: [
        "xs",
        "sm",
        "default",
        "lg",
        "xl",
        "icon-xs",
        "icon-sm",
        "icon",
        "icon-lg",
        "icon-xl",
      ],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-section p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  name: "تمام متریال‌ها (All Variants)",
  render: () => (
    <div className="flex flex-col items-center gap-section">
      <div className="flex flex-wrap items-center justify-center gap-group">
        <Button variant="brand">
          <SparkleIcon size={18} />
          شروع پروژه (Brand)
        </Button>
        <Button variant="tinted">
          <SparkleIcon size={18} />
          ادامه کار (Tinted)
        </Button>
        <Button variant="glass">ذخیره تغییرات (Glass)</Button>
        <Button variant="outline">کریستالی (Outline)</Button>
        <Button variant="subtle">ابری مات (Subtle)</Button>
        <Button variant="success">
          <CheckIcon size={18} />
          تایید موفق (Success)
        </Button>
        <Button variant="destructive">
          <TrashIcon size={18} />
          حذف (Destructive)
        </Button>
        <Button variant="plain">
          انصراف (Plain)
          <ArrowLeftIcon size={16} />
        </Button>
      </div>
    </div>
  ),
};

export const ShapesAndPills: Story = {
  name: "فرم‌های کپسولی و استاندارد (Shapes & Pills)",
  render: () => (
    <div className="flex flex-col items-center gap-section">
      <div className="flex flex-col items-center gap-group">
        <span className="text-footnote text-muted-foreground">
          فرم استاندارد (Rounded Control)
        </span>
        <div className="flex flex-wrap items-center gap-group">
          <Button variant="brand">دکمه استاندارد</Button>
          <Button variant="tinted">دکمه تینت</Button>
          <Button variant="glass">دکمه شیشه</Button>
          <Button variant="glass" size="icon" aria-label="افزودن">
            <PlusIcon size={18} />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-group">
        <span className="text-footnote text-muted-foreground">
          فرم کپسولی / گرد (Pill / Capsule)
        </span>
        <div className="flex flex-wrap items-center gap-group">
          <Button variant="brand" shape="pill">
            <SparkleIcon size={18} />
            تولید هوشمند
          </Button>
          <Button variant="tinted" shape="pill">
            ادامه ویرایش
          </Button>
          <Button variant="glass" shape="pill">
            پیش‌نمایش
          </Button>
          <Button variant="glass" shape="pill" size="icon" aria-label="پخش">
            <PlayIcon size={18} />
          </Button>
          <Button variant="brand" shape="pill" size="icon" aria-label="تنظیمات">
            <SlidersHorizontalIcon size={18} />
          </Button>
        </div>
      </div>
    </div>
  ),
};

export const SizesScale: Story = {
  name: "مقیاس اندازه‌ها (Sizes xs to xl)",
  render: () => (
    <div className="flex flex-col items-center gap-section">
      <div className="flex flex-wrap items-center justify-center gap-group">
        <Button size="xs" variant="tinted">
          فوق‌کوچک (xs)
        </Button>
        <Button size="sm" variant="glass">
          کوچک (sm)
        </Button>
        <Button size="default" variant="glass">
          پیش‌فرض (default)
        </Button>
        <Button size="lg" variant="glass">
          بزرگ (lg)
        </Button>
        <Button size="xl" variant="brand">
          <SparkleIcon size={22} />
          خیلی بزرگ (xl)
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-group">
        <Button size="icon-xs" variant="glass" aria-label="آیکون xs">
          <PlusIcon size={14} />
        </Button>
        <Button size="icon-sm" variant="glass" aria-label="آیکون sm">
          <PlusIcon size={16} />
        </Button>
        <Button size="icon" variant="glass" aria-label="آیکون default">
          <PlusIcon size={18} />
        </Button>
        <Button size="icon-lg" variant="glass" aria-label="آیکون lg">
          <PlusIcon size={22} />
        </Button>
        <Button
          size="icon-xl"
          variant="brand"
          shape="pill"
          aria-label="آیکون xl"
        >
          <PlayIcon size={24} />
        </Button>
      </div>
    </div>
  ),
};

export const LoadingStates: Story = {
  name: "وضعیت در حال بارگذاری (Loading)",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-group">
      <Button variant="brand" loading>
        در حال تولید ویدیو...
      </Button>
      <Button variant="tinted" loading>
        ذخیره تغییرات
      </Button>
      <Button variant="glass" loading>
        پردازش هوش مصنوعی
      </Button>
      <Button variant="destructive" loading>
        در حال حذف...
      </Button>
      <Button
        variant="glass"
        size="icon"
        loading
        aria-label="در حال بارگذاری"
      />
      <Button
        variant="brand"
        shape="pill"
        size="icon"
        loading
        aria-label="در حال بارگذاری"
      />
    </div>
  ),
};
