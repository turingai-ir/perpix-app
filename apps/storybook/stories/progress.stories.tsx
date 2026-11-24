import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  SparkleIcon,
  CheckCircleIcon,
  PlayIcon,
  ArrowClockwiseIcon,
} from "@phosphor-icons/react";
import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
} from "@perpix/ui/components/progress";
import { Button } from "@perpix/ui/components/button";

const meta = {
  title: "Components/Progress",
  component: Progress,
  decorators: [
    (Story) => (
      <div className="flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center gap-6 p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full space-y-4 rounded-card glass p-5">
      <div className="space-y-1.5">
        <span className="text-caption text-muted-foreground">
          پیش‌فرض برند (۶۵٪)
        </span>
        <Progress value={65} />
      </div>
      <div className="space-y-1.5">
        <span className="text-caption text-muted-foreground">شروع کار (۲۰٪)</span>
        <Progress value={20} />
      </div>
      <div className="space-y-1.5">
        <span className="text-caption text-muted-foreground">تکمیل موفق (۱۰۰٪)</span>
        <Progress value={100} variant="success" />
      </div>
    </div>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <div className="w-full space-y-5 rounded-card glass p-6">
      <Progress value={72} variant="tinted">
        <div className="flex items-center justify-between">
          <ProgressLabel className="flex items-center gap-1.5">
            <SparkleIcon className="size-4 text-primary animate-pulse" />
            تولید زیرنویس با هوش مصنوعی
          </ProgressLabel>
          <ProgressValue />
        </div>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>

      <Progress value={45} variant="brand">
        <div className="flex items-center justify-between">
          <ProgressLabel>رندر و پردازش فریم‌های ویدیو</ProgressLabel>
          <ProgressValue />
        </div>
        <ProgressTrack size="lg">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>

      <Progress value={100} variant="success">
        <div className="flex items-center justify-between">
          <ProgressLabel className="flex items-center gap-1.5 text-success">
            <CheckCircleIcon className="size-4" />
            ذخیره‌سازی در فضای ابری
          </ProgressLabel>
          <ProgressValue />
        </div>
        <ProgressTrack size="sm">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <div className="w-full space-y-5 rounded-card glass p-6">
      <Progress value={null} variant="brand">
        <div className="flex items-center justify-between">
          <ProgressLabel className="flex items-center gap-1.5">
            <SparkleIcon className="size-4 text-accent-violet animate-pulse" />
            اتصال به خوشه پردازشی GPU...
          </ProgressLabel>
          <span className="text-caption text-muted-foreground">در حال انتظار</span>
        </div>
        <ProgressTrack size="default">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>

      <Progress value={null} variant="tinted">
        <div className="flex items-center justify-between">
          <ProgressLabel>بررسی و اعتبارسنجی فایل ویدیو</ProgressLabel>
          <span className="text-caption text-muted-foreground">پیوسته</span>
        </div>
        <ProgressTrack size="sm">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="w-full space-y-4 rounded-card glass p-6">
      <div className="space-y-1.5">
        <div className="flex justify-between text-caption font-medium">
          <span className="text-foreground">Brand (گرادیان ماژنتا به آبی نئونی)</span>
          <span className="text-primary font-semibold">۸۰٪</span>
        </div>
        <Progress value={80} variant="brand" />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-caption font-medium">
          <span className="text-foreground">Tinted (بنفش سیگنچر پرپیکس)</span>
          <span className="text-primary font-semibold">۶۵٪</span>
        </div>
        <Progress value={65} variant="tinted" />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-caption font-medium">
          <span className="text-foreground">Success (سبز زمردی روشن)</span>
          <span className="text-success font-semibold">۱۰۰٪</span>
        </div>
        <Progress value={100} variant="success" />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-caption font-medium">
          <span className="text-foreground">Warning (کهربایی طلایی گرم)</span>
          <span className="text-warning font-semibold">۸۵٪</span>
        </div>
        <Progress value={85} variant="warning" />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-caption font-medium">
          <span className="text-foreground">Destructive (قرمز رُز نئونی)</span>
          <span className="text-destructive font-semibold">۹۵٪</span>
        </div>
        <Progress value={95} variant="destructive" />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-caption font-medium">
          <span className="text-foreground">Accent (سایان و آسمانی درخشان)</span>
          <span className="text-accent-sky font-semibold">۵۵٪</span>
        </div>
        <Progress value={55} variant="accent" />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-caption font-medium">
          <span className="text-muted-foreground">Glass (کریستالی نقره‌ای خنثی)</span>
          <span className="text-muted-foreground font-semibold">۴۰٪</span>
        </div>
        <Progress value={40} variant="glass" />
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="w-full space-y-4 rounded-card glass p-6">
      <div className="space-y-1">
        <span className="text-caption text-muted-foreground">باریک (xs - 4px)</span>
        <Progress value={60} size="xs" variant="tinted" />
      </div>
      <div className="space-y-1">
        <span className="text-caption text-muted-foreground">کوچک (sm - 6px)</span>
        <Progress value={60} size="sm" variant="brand" />
      </div>
      <div className="space-y-1">
        <span className="text-caption text-muted-foreground">استاندارد (default - 10px)</span>
        <Progress value={60} size="default" variant="tinted" />
      </div>
      <div className="space-y-1">
        <span className="text-caption text-muted-foreground">بزرگ (lg - 16px)</span>
        <Progress value={60} size="lg" variant="brand" />
      </div>
    </div>
  ),
};

function SimulationDemo() {
  const [val, setVal] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setVal((prev) => {
        if (prev >= 100) {
          setRunning(false);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [running]);

  const handleReset = () => {
    setVal(0);
    setRunning(false);
  };

  const isDone = val === 100;

  return (
    <div className="w-full space-y-5 rounded-card glass p-6">
      <Progress value={val} variant={isDone ? "success" : "brand"}>
        <div className="flex items-center justify-between">
          <ProgressLabel className="flex items-center gap-1.5">
            {isDone ? (
              <CheckCircleIcon className="size-4 text-success" />
            ) : (
              <SparkleIcon className="size-4 text-primary animate-pulse" />
            )}
            {isDone ? "پردازش با موفقیت انجام شد" : "شبیه‌سازی آپلود و پردازش مدیا"}
          </ProgressLabel>
          <ProgressValue />
        </div>
        <ProgressTrack size="lg">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>

      <div className="flex gap-2.5">
        <Button
          variant="tinted"
          size="sm"
          disabled={running || isDone}
          onClick={() => setRunning(true)}
        >
          <PlayIcon className="size-4" />
          شروع پردازش
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <ArrowClockwiseIcon className="size-4" />
          بازنشانی
        </Button>
      </div>
    </div>
  );
}

export const InteractiveSimulation: Story = {
  render: () => <SimulationDemo />,
};
