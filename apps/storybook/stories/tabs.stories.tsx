import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@perpix/ui/components/tabs";
import { GlassSurface } from "@perpix/ui/components/glass-surface";
import { Slider } from "@perpix/ui/components/slider";
import { Switch } from "@perpix/ui/components/switch";
import { Badge } from "@perpix/ui/components/badge";
import { Button } from "@perpix/ui/components/button";
import {
  SparkleIcon,
  FilmSlateIcon,
  CheckIcon,
  DownloadSimpleIcon,
  FolderSimpleIcon,
} from "@phosphor-icons/react";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  decorators: [
    (Story) => (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <GlassSurface className="w-full space-y-4 rounded-overlay border border-glass-edge-light p-5 shadow-overlay sm:p-6">
      <div className="flex items-center justify-between border-b border-glass-edge-light pb-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full glass text-primary shadow-xs">
            <FilmSlateIcon className="size-4.5" weight="duotone" />
          </div>
          <div>
            <h3 className="text-headline font-semibold text-foreground">
              استودیو تولید و ویرایش
            </h3>
            <p className="text-footnote text-muted-foreground">
              پیکربندی هوشمند هوش مصنوعی
            </p>
          </div>
        </div>
        <Badge variant="brand" shape="pill" size="sm">
          <SparkleIcon className="me-1 size-3" weight="fill" />
          نسخه ۲.۰
        </Badge>
      </div>

      <Tabs defaultValue="captions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="captions">زیرنویس</TabsTrigger>
          <TabsTrigger value="audio">تنظیمات صدا</TabsTrigger>
          <TabsTrigger value="export">خروجی</TabsTrigger>
        </TabsList>

        <TabsContent value="captions" className="min-h-[240px] space-y-4 pt-1">
          <div className="relative overflow-hidden rounded-control border border-glass-edge-light bg-night/85 p-4 text-center shadow-raised">
            <p className="text-headline font-bold tracking-wide text-white">
              «ساخت و تدوین خودکار ویدیو با پرپیکس»
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-caption text-emerald-400">
              <CheckIcon className="size-3" weight="bold" /> تایم‌لاین کلمه به
              کلمه همگام شد
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-body">
              <span className="font-medium text-foreground">
                اندازه قلم زیرنویس
              </span>
              <span className="font-mono text-footnote text-muted-foreground">
                ۲۴px
              </span>
            </div>
            <Slider defaultValue={[24]} min={14} max={42} step={1} />
            <div className="flex items-center justify-between pt-1">
              <div className="space-y-0.5">
                <span className="block text-body font-medium text-foreground">
                  انیمیشن کلمات
                </span>
                <span className="block text-footnote text-muted-foreground">
                  هایلایت رنگی هنگام تلفظ
                </span>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audio" className="min-h-[240px] space-y-4 pt-1">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="block text-body font-medium text-foreground">
                  حذف نویز محیطی
                </span>
                <span className="block text-footnote text-muted-foreground">
                  فیلتر هوشمند صداهای اضافه پس‌زمینه
                </span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-body">
                <span className="font-medium text-foreground">
                  تقویت وضوح گفتار
                </span>
                <span className="font-mono text-footnote text-muted-foreground">
                  +۶ dB
                </span>
              </div>
              <Slider defaultValue={[60]} min={0} max={100} />
            </div>
            <div className="flex items-center justify-between rounded-control border border-glass-edge-light bg-muted/40 p-3">
              <span className="text-footnote text-muted-foreground">
                استاندارد خروجی صوتی:
              </span>
              <Badge variant="subtle" shape="pill" size="sm">
                استریو ۴۸kHz / 24-bit
              </Badge>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="export" className="min-h-[240px] space-y-4 pt-1">
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <span className="block text-body font-medium text-foreground">
                کیفیت و رزولوشن ویدیو
              </span>
              <div className="grid grid-cols-3 gap-2">
                <Badge
                  variant="brand"
                  shape="rounded"
                  className="cursor-pointer justify-center py-2"
                >
                  4K Ultra
                </Badge>
                <Badge
                  variant="glass"
                  shape="rounded"
                  className="cursor-pointer justify-center py-2"
                >
                  1080p FHD
                </Badge>
                <Badge
                  variant="glass"
                  shape="rounded"
                  className="cursor-pointer justify-center py-2"
                >
                  720p HD
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-control border border-glass-edge-light bg-muted/40 p-3 text-footnote text-muted-foreground">
              <span>کدک و بیت‌ریت:</span>
              <span className="font-mono text-foreground">H.264 / 28 Mbps</span>
            </div>
            <Button variant="tinted" className="mt-2 w-full">
              <DownloadSimpleIcon className="size-4" weight="bold" />
              شروع رندر و دریافت ویدیو
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </GlassSurface>
  ),
};

export const WithSlidingIndicator: Story = {
  name: "با نشانگر متحرک (With Sliding Indicator)",
  render: () => (
    <GlassSurface className="w-full space-y-4 rounded-overlay border border-glass-edge-light p-5 shadow-overlay sm:p-6">
      <div className="flex items-center justify-between border-b border-glass-edge-light pb-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full glass text-primary shadow-xs">
            <FolderSimpleIcon className="size-4.5" weight="duotone" />
          </div>
          <div>
            <h3 className="text-headline font-semibold text-foreground">
              مدیریت پروژه‌های ویدیویی
            </h3>
            <p className="text-footnote text-muted-foreground">
              دسته‌بندی و وضعیت رندرها
            </p>
          </div>
        </div>
        <Badge variant="glass" shape="pill" size="sm">
          ۱۲ پروژه
        </Badge>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">همه پروژه‌ها</TabsTrigger>
          <TabsTrigger value="processing">در حال پردازش</TabsTrigger>
          <TabsTrigger value="completed">تکمیل شده</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="min-h-[140px] space-y-3 pt-2">
          <div className="flex items-center justify-between rounded-control border border-glass-edge-light bg-card/40 p-3.5 shadow-raised">
            <div className="space-y-1">
              <span className="block text-body font-semibold text-foreground">
                پروژه تبلیغاتی نوروز ۱۴۰۵
              </span>
              <span className="block text-footnote text-muted-foreground">
                زیرنویس دوزبانه فارسی / انگلیسی
              </span>
            </div>
            <Badge variant="brand" shape="pill" size="sm">
              آماده دانلود
            </Badge>
          </div>
          <div className="flex items-center justify-between rounded-control border border-glass-edge-light bg-card/40 p-3.5 shadow-raised">
            <div className="space-y-1">
              <span className="block text-body font-semibold text-foreground">
                پادکست گفت‌وگو قسمت ۱۲
              </span>
              <span className="block text-footnote text-muted-foreground">
                حذف اکو و افزایش داینامیک صدا
              </span>
            </div>
            <Badge variant="tinted" shape="pill" size="sm">
              در حال رندر
            </Badge>
          </div>
        </TabsContent>
        <TabsContent
          value="processing"
          className="min-h-[140px] space-y-3 pt-2"
        >
          <div className="flex items-center justify-between rounded-control border border-glass-edge-light bg-card/40 p-3.5 shadow-raised">
            <div className="space-y-1">
              <span className="block text-body font-semibold text-foreground">
                پادکست گفت‌وگو قسمت ۱۲
              </span>
              <span className="block text-footnote text-muted-foreground">
                رندرینگ ۵۸٪ تکمیل شده است...
              </span>
            </div>
            <Badge variant="tinted" shape="pill" size="sm">
              ۵۸٪
            </Badge>
          </div>
        </TabsContent>
        <TabsContent value="completed" className="min-h-[140px] space-y-3 pt-2">
          <div className="flex items-center justify-between rounded-control border border-glass-edge-light bg-card/40 p-3.5 shadow-raised">
            <div className="space-y-1">
              <span className="block text-body font-semibold text-foreground">
                پروژه تبلیغاتی نوروز ۱۴۰۵
              </span>
              <span className="block text-footnote text-muted-foreground">
                مدت زمان: ۰۱:۴۵ · حجم: ۱۲۰ مگابایت
              </span>
            </div>
            <Button variant="subtle" size="sm">
              <DownloadSimpleIcon className="size-3.5" weight="bold" />
              دانلود
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </GlassSurface>
  ),
};
