import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CheckCircleIcon,
  WarningCircleIcon,
  XCircleIcon,
  InfoIcon,
} from "@phosphor-icons/react";
import { Button } from "@perpix/ui/components/button";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastPortal,
  ToastProgress,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Toaster,
  toast,
  useToastManager,
} from "@perpix/ui/components/toast";

const meta = {
  title: "Components/Toast",
  component: Toast,
  decorators: [
    (Story) => (
      <ToastProvider limit={4}>
        <div className="flex min-h-[50vh] w-full max-w-sm flex-col items-center justify-center p-inset-lg">
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof Toast>;
export default meta;

type Story = StoryObj<typeof meta>;

function StackedToastDemo() {
  const toastManager = useToastManager();

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="w-full text-center">
        <h3 className="text-headline font-semibold text-foreground">
          سیستم نوتیفیکیشن فشرده و کارتی
        </h3>
        <p className="text-footnote text-muted-foreground">
          پیام‌ها به جای اشغال تمام ارتفاع صفحه، در پایین به شکل کارت روی هم
          فشرده (Stack) می‌شوند و با لمس یا هاور باز می‌شوند.
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-2 pt-2">
        <Button
          variant="success"
          size="sm"
          onClick={() => {
            toastManager.add({
              title: "پروژه با موفقیت خروجی گرفته شد",
              description: "فایل ویدیویی ۱۰۸۰p آماده دانلود است.",
              // @ts-expect-error custom metadata
              variant: "success",
            });
          }}
        >
          <CheckCircleIcon size={16} weight="bold" />
          موفقیت
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            toastManager.add({
              title: "خطا در اتصال به هوش مصنوعی",
              description: "پاسخی از مدل زبانی دریافت نشد. مجدداً تلاش کنید.",
              // @ts-expect-error custom metadata
              variant: "destructive",
            });
          }}
        >
          <XCircleIcon size={16} weight="bold" />
          خطا
        </Button>

        <Button
          variant="tinted"
          size="sm"
          onClick={() => {
            toastManager.add({
              title: "هشدار نویز میکروفون",
              description: "صداهای پس‌زمینه بیش از حد استاندارد است.",
              // @ts-expect-error custom metadata
              variant: "warning",
            });
          }}
        >
          <WarningCircleIcon size={16} weight="bold" />
          هشدار
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toastManager.add({
              title: "پروژه در حال رندرینگ ابری",
              description: "تخمین زمان باقی‌مانده: حدود ۲ دقیقه.",
              // @ts-expect-error custom metadata
              variant: "info",
            });
          }}
        >
          <InfoIcon size={16} weight="bold" />
          اطلاعیه
        </Button>
      </div>

      <ToastPortal>
        <ToastViewport stacked>
          {toastManager.toasts.map((toast) => {
            // @ts-expect-error custom metadata
            const variant = toast.variant ?? "default";
            return (
              <Toast key={toast.id} toast={toast} variant={variant} stacked>
                <div className="flex items-start gap-2.5">
                  {variant === "success" ? (
                    <CheckCircleIcon
                      size={20}
                      weight="fill"
                      className="mt-0.5 shrink-0 text-success"
                    />
                  ) : variant === "destructive" ? (
                    <XCircleIcon
                      size={20}
                      weight="fill"
                      className="mt-0.5 shrink-0 text-destructive"
                    />
                  ) : variant === "warning" ? (
                    <WarningCircleIcon
                      size={20}
                      weight="fill"
                      className="mt-0.5 shrink-0 text-warning"
                    />
                  ) : (
                    <InfoIcon
                      size={20}
                      weight="fill"
                      className="mt-0.5 shrink-0 text-primary"
                    />
                  )}

                  <div className="flex flex-col gap-0.5">
                    <ToastTitle>{toast.title}</ToastTitle>
                    {toast.description ? (
                      <ToastDescription>{toast.description}</ToastDescription>
                    ) : null}
                  </div>
                </div>
                <ToastClose />
              </Toast>
            );
          })}
        </ToastViewport>
      </ToastPortal>
    </div>
  );
}

export const StackedNotifications: Story = {
  name: "دسته کارتی فشرده (Stacked Notifications)",
  render: () => <StackedToastDemo />,
};

export const StandaloneVariants: Story = {
  name: "تمام متریال‌ها (All Variants)",
  render: () => (
    <div className="flex w-full flex-col gap-3">
      <Toast variant="default" stacked={false}>
        <div className="flex items-center gap-2">
          <InfoIcon size={18} className="text-primary" />
          <ToastTitle>پیام پیش‌فرض خنثی</ToastTitle>
        </div>
        <ToastClose />
      </Toast>

      <Toast variant="success" stacked={false}>
        <div className="flex items-center gap-2">
          <CheckCircleIcon size={18} weight="fill" className="text-success" />
          <ToastTitle>عملیات با موفقیت انجام شد</ToastTitle>
        </div>
        <ToastClose />
      </Toast>

      <Toast variant="destructive" stacked={false}>
        <div className="flex items-center gap-2">
          <XCircleIcon size={18} weight="fill" className="text-destructive" />
          <ToastTitle>خطای بحرانی در سیستم</ToastTitle>
        </div>
        <ToastClose />
      </Toast>

      <Toast variant="warning" stacked={false}>
        <div className="flex items-center gap-2">
          <WarningCircleIcon size={18} weight="fill" className="text-warning" />
          <ToastTitle>فضای دیسک در حال اتمام است</ToastTitle>
        </div>
        <ToastClose />
      </Toast>
    </div>
  ),
};

export const ImperativeToaster: Story = {
  name: "فراخوانی دستوری (Imperative toast.* API)",
  render: () => (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="w-full text-center">
        <h3 className="text-headline font-semibold text-foreground">
          فراخوانی دستوری بدون نیاز به Boilerplate
        </h3>
        <p className="text-footnote text-muted-foreground">
          با قرار دادن یک‌باره کامپوننت Toaster، در هر بخش از کد با توابع ساده
          مانند toast.success یا toast.promise نوتیفیکیشن صادر کنید. تایمر
          خودکار (Auto-remove) و نوار پیشرفت به صورت پیش‌فرض فعال هستند.
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-2 pt-2">
        <Button
          variant="success"
          size="sm"
          onClick={() => {
            toast.success("پروژه با موفقیت ذخیره شد", {
              description: "تغییرات در سرور ابری همگام‌سازی گردید.",
            });
          }}
        >
          <CheckCircleIcon size={16} weight="bold" />
          toast.success
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            toast.error("خطا در پردازش تصویر", {
              description: "فرمت فایل بارگذاری‌شده نامعتبر است.",
            });
          }}
        >
          <XCircleIcon size={16} weight="bold" />
          toast.error
        </Button>

        <Button
          variant="tinted"
          size="sm"
          onClick={() => {
            toast.promise(
              new Promise((resolve) => setTimeout(resolve, 2000)),
              {
                loading: "در حال بهینه‌سازی تایم‌لاین...",
                success: "بهینه‌سازی با موفقیت انجام شد!",
                error: "خطا در بهینه‌سازی",
              },
            );
          }}
        >
          toast.promise (async)
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toast("اعلان عمومی", {
              description: "نسخه جدید ۲.۴ در دسترس است.",
              action: {
                label: "به‌روزرسانی",
                onClick: () => alert("شروع به‌روزرسانی"),
              },
            });
          }}
        >
          toast + Action
        </Button>
      </div>

      <Toaster />
    </div>
  ),
};
