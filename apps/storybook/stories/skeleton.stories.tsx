import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  SparkleIcon,
  PlayIcon,
  CheckCircleIcon,
  ArrowsClockwiseIcon,
} from "@phosphor-icons/react";
import { Skeleton, SkeletonText } from "@perpix/ui/components/skeleton";
import { Button } from "@perpix/ui/components/button";
import { Badge } from "@perpix/ui/components/badge";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  decorators: [
    (Story) => (
      <div className="flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center gap-6 p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Skeleton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full space-y-4 rounded-card glass p-6">
      <div className="flex items-center gap-3">
        <Skeleton shape="pill" className="size-12" />
        <div className="space-y-2 flex-1">
          <Skeleton shape="text" className="w-2/5 h-4" />
          <Skeleton shape="text" className="w-3/5 h-3" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  ),
};

export const ShimmerAndPulse: Story = {
  render: () => (
    <div className="w-full space-y-6 rounded-card glass p-6">
      <div className="space-y-2">
        <div className="flex justify-between text-caption font-medium text-foreground">
          <span>شیمر شیشه‌ای (Shimmer - پیش‌فرض)</span>
          <span className="text-primary">موج بازتاب نور</span>
        </div>
        <Skeleton shape="card" animation="shimmer" className="h-16 w-full" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-caption font-medium text-foreground">
          <span>پالس نرم (Pulse)</span>
          <span className="text-muted-foreground">تغییر نرم شفافیت</span>
        </div>
        <Skeleton shape="card" animation="pulse" className="h-16 w-full" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-caption font-medium text-foreground">
          <span>بدون انیمیشن (Static)</span>
          <span className="text-muted-foreground">حالت ثابت</span>
        </div>
        <Skeleton shape="card" animation="none" className="h-16 w-full" />
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="w-full space-y-4 rounded-card glass p-6">
      <div className="space-y-1.5">
        <span className="text-caption font-medium text-foreground">
          Glass (پیش‌فرض شیشه‌ای)
        </span>
        <Skeleton variant="glass" className="h-12 w-full" />
      </div>

      <div className="space-y-1.5">
        <span className="text-caption font-medium text-foreground">
          Tinted (تینت برند پرپیکس)
        </span>
        <Skeleton variant="tinted" className="h-12 w-full" />
      </div>

      <div className="space-y-1.5">
        <span className="text-caption font-medium text-foreground">
          Card (سطح کارت مات)
        </span>
        <Skeleton variant="card" className="h-12 w-full" />
      </div>

      <div className="space-y-1.5">
        <span className="text-caption font-medium text-foreground">
          Subtle (بسیار ملایم)
        </span>
        <Skeleton variant="subtle" className="h-12 w-full" />
      </div>
    </div>
  ),
};

export const VideoProjectCardSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-sm rounded-card glass p-4 space-y-3.5">
      {/* Video Preview Skeleton */}
      <div className="relative aspect-video w-full overflow-hidden rounded-control">
        <Skeleton shape="rounded" className="size-full" />
        <div className="absolute top-2.5 end-2.5">
          <Skeleton shape="pill" className="h-6 w-16" />
        </div>
      </div>

      {/* Info & Metadata */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton shape="text" className="w-3/5 h-4" />
          <Skeleton shape="pill" className="size-6" />
        </div>
        <SkeletonText lines={2} gap="gap-1.5" />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1">
        <Skeleton shape="rounded" className="h-9 flex-1" />
        <Skeleton shape="rounded" className="size-9" />
      </div>
    </div>
  ),
};

function LoadingToggleDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-footnote font-medium text-muted-foreground">
          شبیه‌سازی دریافت اطلاعات از سرور
        </span>
        <Button
          variant="tinted"
          size="sm"
          onClick={() => setLoading(!loading)}
        >
          <ArrowsClockwiseIcon className="size-4" />
          {loading ? "نمایش محتوای واقعی" : "مشاهده حالت لودینگ"}
        </Button>
      </div>

      <div className="rounded-card glass p-6 transition-all duration-300">
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <Skeleton shape="pill" className="size-14" />
              <div className="flex-1 space-y-2">
                <Skeleton shape="text" className="w-1/3 h-5" />
                <Skeleton shape="text" className="w-1/2 h-3.5" />
              </div>
            </div>
            <SkeletonText lines={3} />
            <div className="flex gap-2 pt-2">
              <Skeleton shape="rounded" className="h-9 w-28" />
              <Skeleton shape="rounded" className="h-9 w-24" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="size-14 rounded-full bg-gradient-to-tr from-accent-violet to-accent-pink flex items-center justify-center text-white shadow-raised">
                <SparkleIcon size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-headline">
                    پروژه استودیو ویدیو
                  </h3>
                  <Badge variant="brand" size="sm">
                    هوش مصنوعی
                  </Badge>
                </div>
                <p className="text-caption text-muted-foreground">
                  ایجاد شده در ۲۴ نوامبر ۲۰۲۶ • نسخه ۱.۴
                </p>
              </div>
            </div>

            <p className="text-footnote text-foreground/90 leading-relaxed">
              این پروژه شامل تولید خودکار زیرنویس با مدل Gemini 3.5 Transcribe و
              همگام‌سازی کلمه‌ها در میلی‌ثانیه برای شبکه‌های اجتماعی است.
            </p>

            <div className="flex gap-2 pt-1">
              <Button variant="brand" size="sm">
                <PlayIcon className="size-4" />
                اجرای پیش‌نمایش
              </Button>
              <Button variant="outline" size="sm">
                <CheckCircleIcon className="size-4" />
                دانلود زیرنویس
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const InteractiveToggle: Story = {
  render: () => <LoadingToggleDemo />,
};
