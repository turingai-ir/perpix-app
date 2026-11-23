import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@perpix/ui/components/tabs";
import { GlassSurface } from "@perpix/ui/components/glass-surface";

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
    <Tabs defaultValue="captions" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="captions">زیرنویس</TabsTrigger>
        <TabsTrigger value="audio">تنظیمات صدا</TabsTrigger>
        <TabsTrigger value="export">خروجی</TabsTrigger>
      </TabsList>
      <TabsContent value="captions">
        <GlassSurface className="space-y-2 p-4 shadow-raised">
          <h4 className="text-headline font-semibold">ویرایشگر زیرنویس</h4>
          <p className="text-body leading-relaxed text-muted-foreground">
            تایم‌لاین کلمات را به صورت دستی یا با هوش مصنوعی اصلاح کنید. نشانگر تب
            فعال با جلوه شیشه‌ای هایلایت برجسته شده است.
          </p>
        </GlassSurface>
      </TabsContent>
      <TabsContent value="audio">
        <GlassSurface className="space-y-2 p-4 shadow-raised">
          <h4 className="text-headline font-semibold">حذف نویز پس‌زمینه</h4>
          <p className="text-body leading-relaxed text-muted-foreground">
            کیفیت صدا با استاندارد استودیویی افزایش می‌یابد.
          </p>
        </GlassSurface>
      </TabsContent>
      <TabsContent value="export">
        <GlassSurface className="space-y-2 p-4 shadow-raised">
          <h4 className="text-headline font-semibold">رزولوشن و بیت‌ریت</h4>
          <p className="text-body leading-relaxed text-muted-foreground">
            انتخاب فرمت MP4 با کدک H.264 یا ProRes.
          </p>
        </GlassSurface>
      </TabsContent>
    </Tabs>
  ),
};

export const WithSlidingIndicator: Story = {
  name: "با نشانگر متحرک (With Sliding Indicator)",
  render: () => (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsIndicator />
        <TabsTrigger value="all">همه پروژه‌ها</TabsTrigger>
        <TabsTrigger value="processing">در حال پردازش</TabsTrigger>
        <TabsTrigger value="completed">تکمیل شده</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <GlassSurface className="p-4 text-body text-muted-foreground shadow-raised">
          نمایش تمام پروژه‌های استودیو پرپیکس با انیمیشن روان نشانگر.
        </GlassSurface>
      </TabsContent>
      <TabsContent value="processing">
        <GlassSurface className="p-4 text-body text-muted-foreground shadow-raised">
          پروژه‌هایی که هوش مصنوعی در حال رندر زیرنویس و فیلتر صدای آن‌هاست.
        </GlassSurface>
      </TabsContent>
      <TabsContent value="completed">
        <GlassSurface className="p-4 text-body text-muted-foreground shadow-raised">
          ویدیوهای خروجی آماده دانلود و اشتراک‌گذاری در شبکه‌های اجتماعی.
        </GlassSurface>
      </TabsContent>
    </Tabs>
  ),
};
