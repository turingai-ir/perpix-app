import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@perpix/ui/components/button";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  useToastManager,
} from "@perpix/ui/components/toast";

const meta = {
  title: "Components/Toast",
  component: Toast,
  decorators: [
    (Story) => (
      <ToastProvider>
        <div className="flex min-h-[50vh] w-full max-w-sm flex-col items-center justify-center p-inset-lg">
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof Toast>;
export default meta;

type Story = StoryObj<typeof meta>;

function ToastTriggerDemo() {
  const toastManager = useToastManager();
  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        variant="brand"
        onClick={() => {
          toastManager.add({
            title: "پروژه با موفقیت خروجی گرفته شد",
            description: "فایل ویدیویی با زیرنویس در گالری ذخیره شد.",
          });
        }}
      >
        نمایش پیام Toast
      </Button>

      <ToastPortal>
        <ToastViewport>
          {toastManager.toasts.map((toast) => (
            <Toast key={toast.id} toast={toast}>
              <div className="flex flex-col gap-0.5">
                <ToastTitle>{toast.title}</ToastTitle>
                {toast.description ? (
                  <ToastDescription>{toast.description}</ToastDescription>
                ) : null}
              </div>
              <ToastClose />
            </Toast>
          ))}
        </ToastViewport>
      </ToastPortal>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <ToastTriggerDemo />,
};

export const Standalone: Story = {
  render: () => (
    <div className="w-full">
      <Toast>
        <div className="flex flex-col gap-1">
          <ToastTitle>پروژه ذخیره شد</ToastTitle>
          <ToastDescription>
            تغییرات به صورت خودکار در فضای ابری همگام‌سازی شد.
          </ToastDescription>
        </div>
        <ToastClose />
      </Toast>
    </div>
  ),
};
