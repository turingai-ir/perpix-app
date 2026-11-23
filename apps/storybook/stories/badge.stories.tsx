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
