import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SparkleIcon, CheckIcon, TrashIcon } from "@phosphor-icons/react";
import { Badge } from "@perpix/ui/components/badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  decorators: [
    (Story) => (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Badge>;
export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <Badge variant="brand">
        <SparkleIcon size={14} />
        نسل جدید AI
      </Badge>
      <Badge variant="tinted">در حال پردازش</Badge>
      <Badge variant="glass">نسخه پیش‌نمایش</Badge>
      <Badge variant="success">
        <CheckIcon size={14} />
        تکمیل شد
      </Badge>
      <Badge variant="destructive">
        <TrashIcon size={14} />
        رد شده
      </Badge>
      <Badge variant="outline">پیش‌نویس</Badge>
      <Badge variant="subtle">غیرفعال</Badge>
    </div>
  ),
};

export const StatusDots: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge variant="glass" dot dotVariant="success">
        سیستم آنلاین (GPU Active)
      </Badge>
      <Badge variant="tinted" dot dotVariant="brand">
        در حال تولید خروجی
      </Badge>
      <Badge variant="glass" dot dotVariant="warning">
        در انتظار تایید کاربر
      </Badge>
      <Badge variant="glass" dot dotVariant="destructive">
        خطای سرور ابری
      </Badge>
      <Badge variant="subtle" dot dotVariant="default">
        حالت آفلاین
      </Badge>
    </div>
  ),
};

export const RemovableChips: Story = {
  render: () => {
    function FilterChips() {
      const [chips, setChips] = useState([
        "زیرنویس فارسی",
        "کیفیت 4K",
        "انیمیشن تیک‌تاک",
        "قالب وزیرمتن",
      ]);

      return (
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {chips.map((chip) => (
              <Badge
                key={chip}
                variant="tinted"
                shape="pill"
                removable
                onRemove={() => setChips((prev) => prev.filter((c) => c !== chip))}
              >
                {chip}
              </Badge>
            ))}
          </div>
          {chips.length === 0 && (
            <button
              onClick={() =>
                setChips([
                  "زیرنویس فارسی",
                  "کیفیت 4K",
                  "انیمیشن تیک‌تاک",
                  "قالب وزیرمتن",
                ])
              }
              className="text-caption text-primary underline"
            >
              بازنشانی فیلترها
            </button>
          )}
        </div>
      );
    }

    return <FilterChips />;
  },
};

export const InteractiveChips: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge variant="brand" interactive shape="pill">
        + افزودن فیلتر جدید
      </Badge>
      <Badge variant="glass" interactive shape="rounded">
        ذخیره به عنوان الگو
      </Badge>
    </div>
  ),
};

export const ShapesAndSizes: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Badge shape="pill" size="sm">
          کوچک کپسولی
        </Badge>
        <Badge shape="pill" size="default">
          متوسط کپسولی
        </Badge>
        <Badge shape="pill" size="lg">
          بزرگ کپسولی
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge shape="rounded" size="sm">
          کوچک استاندارد
        </Badge>
        <Badge shape="rounded" size="default">
          متوسط استاندارد
        </Badge>
        <Badge shape="rounded" size="lg">
          بزرگ استاندارد
        </Badge>
      </div>
    </div>
  ),
};

export const CountBadges: Story = {
  name: "شمارنده عددی و سرریز (Numeric Counts & Overflow)",
  render: () => (
    <div className="flex items-center gap-3">
      <Badge variant="tinted" count={5}>
        پیام‌های جدید
      </Badge>
      <Badge variant="destructive" count={42} shape="pill" />
      <Badge variant="destructive" count={120} overflowCount={99} shape="pill" />
      <Badge variant="glass" count={1500} overflowCount={999}>
        دیدگاه‌ها
      </Badge>
    </div>
  ),
};
